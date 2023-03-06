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
  data: any[] | null;
  errors: Error[] | null;
};

type UserType = {};

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
    const { reg_login_role } = req.body;
    const getAllUsers = reg_login_role === "all";

    if (getAllUsers) {
      const citizens = await prisma.citizen.findMany({});
      const judges = await prisma.judge.findMany({});
      const lawyers = await prisma.lawyer.findMany({});
      const admin = await prisma.admin.findMany({});
      const users = [...citizens, ...judges, ...lawyers, ...admin];

      return res.status(200).json({
        data: users,
        errors: null,
      });
    }

    switch (reg_login_role) {
      case "admin":
        const admins = await prisma.admin.findMany({});
        return res.status(200).json({
          data: admins,
          errors: null,
        });
      case "judge":
        const judges = await prisma.judge.findMany({});
        return res.status(200).json({
          data: judges,
          errors: null,
        });
      case "lawyer":
        const lawyers = await prisma.lawyer.findMany({});
        return res.status(200).json({
          data: lawyers,
          errors: null,
        });
      case "citizen":
        const citizens = await prisma.citizen.findMany({});
        return res.status(200).json({
          data: citizens,
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
