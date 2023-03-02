// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Admin, Citizen, Judge, Lawyer, Login, Police } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleBodyNotEmpty } from "../../../../utils/validation";
import * as argon2 from "argon2";
import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
type Response = {
  data: any | null;
  errors: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "GET") {
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
            message: "action cannot be allowed",
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

    const noEmptyValues = handleBodyNotEmpty(req.body);

    if (noEmptyValues.length > 0) {
      return res.status(200).json({
        data: null,
        errors: [...noEmptyValues],
      });
    }

    //username sent by query
    const { query } = req.query;

    if (`${query}`.length <= 0) {
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "query must be provided",
          },
        ],
      });
    }
    const queryUser = await prisma.login.findUnique({
      where: {
        login_username: `${query}`,
      },
    });

    switch (queryUser?.login_role) {
      case "judge":
        const judge = await prisma.judge.findUnique({
          where: {
            judge_login_id: queryUser.login_id,
          },
        });

        return res.status(200).json({
          data: {
            id: queryUser?.login_id,
            full_name: judge?.judge_full_name,
            role: queryUser.login_role,
          },
          errors: null,
        });
      case "citizen":
        const citizen = await prisma.citizen.findUnique({
          where: {
            citizen_login_id: queryUser.login_id,
          },
        });

        return res.status(200).json({
          data: {
            id: queryUser?.login_id,
            full_name: citizen?.citizen_full_name,
            role: queryUser.login_role,
          },
          errors: null,
        });

      case "lawyer":
        const lawyer = await prisma.lawyer.findUnique({
          where: {
            lawyer_login_id: queryUser.login_id,
          },
        });

        return res.status(200).json({
          data: {
            id: queryUser?.login_id,
            full_name: lawyer?.lawyer_full_name,
            role: queryUser.login_role,
          },
          errors: null,
        });

      default:
        return res.status(200).json({
          data: null,
          errors: [
            {
              message: "invalid role",
            },
          ],
        });
    }
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
