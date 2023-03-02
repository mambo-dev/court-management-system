// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  Admin,
  Citizen,
  Judge,
  Lawyer,
  Login,
  Police,
  Role,
} from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleBodyNotEmpty } from "../../../../utils/validation";
import * as argon2 from "argon2";
import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
type Response = {
  data:
    | {
        id: number;
        full_name: string | undefined;
        role: Role;
      }[]
    | null;
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

    const queryUsers = await prisma.login.findMany({
      where: {
        OR: {
          Citizen: {
            citizen_full_name: {
              search: `${query}`,
            },
          },
          Judge: {
            judge_full_name: {
              search: `${query}`,
            },
          },
          Lawyer: {
            lawyer_full_name: {
              search: `${query}`,
            },
          },
        },
      },
      select: {
        Judge: true,
        Citizen: true,
        Lawyer: true,
        login_password: false,
        login_role: true,
        login_id: true,
      },
    });

    const returnUsers = queryUsers.map((user) => {
      return {
        id: user.login_id,
        full_name:
          user.Citizen?.citizen_full_name ||
          user.Judge?.judge_full_name ||
          user.Lawyer?.lawyer_full_name,
        role: user.login_role,
      };
    });

    return res.status(200).json({
      data: returnUsers,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
