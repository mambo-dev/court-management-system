// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";

import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
import { Hearing, Payment } from "@prisma/client";
import { handleBodyNotEmpty } from "../../../../utils/validation";
import axios from "axios";
type Response = {
  data: boolean | null;
  errors: Error[] | [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "POST") {
      return res.status(403).json({
        data: null,
        errors: [
          {
            message: "invalid method",
          },
        ],
      });
    }

    if (!(await handleAuthorization(req))) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message: "unauthorized access please login",
          },
        ],
      });
    }

    const token = req.headers.authorization?.split(" ")[1];

    const decodedToken: DecodedToken = await jwtDecode(`${token}`);

    const user = await prisma.login.findUnique({
      where: {
        login_id: decodedToken.user_id,
      },
      include: {
        Citizen: true,
      },
    });

    if (user?.login_role !== "citizen") {
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "only citizens pay fines",
          },
        ],
      });
    }

    const { payment_amount, payment_case_id } = req.body;

    const noEmptyValues = handleBodyNotEmpty(req.body);

    if (noEmptyValues.length > 0) {
      return res.status(200).json({
        data: null,
        errors: [...noEmptyValues],
      });
    }

    const findCase = await prisma.case.findUnique({
      where: {
        case_id: Number(payment_case_id),
      },
    });

    if (!findCase) {
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "did not find case",
          },
        ],
      });
    }

    //insert payment from mpesa

    const data = JSON.stringify({
      BusinessShortCode: 174379,
      Password:
        "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMwMzI5MTUzNzI4",
      Timestamp: "20230329153728",
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(payment_amount),
      PartyA: Number(process.env.TEST_NUMBER),
      PartyB: 174379,
      PhoneNumber: Number(process.env.TEST_NUMBER),
      CallBackURL: process.env.NEXT_CALLBACK_URL,
      AccountReference: "judicial",
      TransactionDesc: "Payment of X",
    });
    const response = await axios.post(
      `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SAFARICOM_BEARER_TOKEN}`,
        },
      }
    );

    await prisma.payment.create({
      data: {
        payment_amount: Number(payment_amount),

        defendant_citizen: {
          connect: {
            citizen_id: user?.Citizen?.citizen_id,
          },
        },
        payment_case: {
          connect: {
            case_id: findCase?.case_id,
          },
        },
      },
    });

    return res.status(200).json({
      data: true,
      errors: [],
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
