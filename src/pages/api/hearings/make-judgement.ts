// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";

import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
import { Hearing } from "@prisma/client";
import { handleBodyNotEmpty } from "../../../../utils/validation";
type Response = {
  data: Hearing | null;
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
    });

    const canCreate = user?.login_role === "judge";

    if (!canCreate) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message: "you do not have the permission to complete this action",
          },
        ],
      });
    }

    const {
      hearing_case_id,
      hearing_date,
      hearing_location,
      hearing_outcome,
      hearing_status,
    } = req.body;

    const noEmptyValues = handleBodyNotEmpty(req.body);

    if (noEmptyValues.length > 0) {
      return res.status(200).json({
        data: null,
        errors: [...noEmptyValues],
      });
    }
    console.log(hearing_case_id);
    const findCase = await prisma.case.findUnique({
      where: {
        case_id: hearing_case_id,
      },
    });

    if (!findCase) {
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "case to attach not found, try adding case again",
          },
        ],
      });
    }

    const new_hearing = await prisma.hearing.create({
      data: {
        hearing_date,
        hearing_location,
        hearing_outcome,
        hearing_status,
        hearing_case: {
          connect: {
            case_id: Number(hearing_case_id),
          },
        },
      },
    });

    return res.status(200).json({
      data: new_hearing,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
