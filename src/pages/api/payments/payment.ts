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
  data: Payment | null;
  errors: Error[] | null;
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

    const { payment_amount, payment_citizen_id, payment_case_id } = req.body;

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

    //insert payment from mpesa

    const response = await axios.post(
      `${process.env.SAFARICOM_API_ENDPOINT}`,
      {
        BusinessShortCode: 247247,
        Password:
          "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMwMzI5MTIwNDU1",
        Timestamp: "20230329120455",
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: 254741882041,
        PartyB: 247247,
        PhoneNumber: 254741882041,
        CallBackURL: "http://localhost:3000",
        AccountReference: "JudicialSystem",
        TransactionDesc: `Payment of fine for ${findCase?.case_name} `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SAFARICOM_API_ENDPOINT}`,
        },
      }
    );

    if (response.data) {
      console.log(response.data);
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "we succesfully sent a request",
          },
        ],
      });
    }

    const new_payment = await prisma.payment.create({
      data: {
        payment_amount,

        defendant_citizen: {
          connect: {
            citizen_id: payment_citizen_id,
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
      data: new_payment,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
