// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";

import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
import { Hearing } from "@prisma/client";
import { handleBodyNotEmpty } from "../../../../utils/validation";
type Response = {
  data: boolean;
  errors: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "POST") {
      return res.status(403).json({
        data: false,
        errors: [
          {
            message: "invalid method",
          },
        ],
      });
    }

    if (!(await handleAuthorization(req))) {
      return res.status(401).json({
        data: false,
        errors: [
          {
            message: "unauthorized access please login",
          },
        ],
      });
    }

    const { case_notes, hearing_id } = req.body;

    const noEmptyValues = handleBodyNotEmpty(req.body);

    if (noEmptyValues.length > 0) {
      return res.status(200).json({
        data: false,
        errors: [...noEmptyValues],
      });
    }

    const findHearing = await prisma.hearing.findUnique({
      where: {
        hearing_id: Number(hearing_id),
      },
    });

    if (!findHearing) {
      return res.status(200).json({
        data: false,
        errors: [
          {
            message: "the hearing you are trying to make notes does note exist",
          },
        ],
      });
    }

    await prisma.hearing.update({
      where: {
        hearing_id: findHearing.hearing_id,
      },
      data: {},
    });

    return res.status(200).json({
      data: true,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: false,
      errors: [{ message: error.message }],
    });
  }
}
