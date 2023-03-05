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
  data: boolean;
  errors: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "DELETE") {
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

    const token = req.headers.authorization?.split(" ")[1];

    const decodedToken: DecodedToken = await jwtDecode(`${token}`);

    const user = await prisma.login.findUnique({
      where: {
        login_id: decodedToken.user_id,
      },
    });

    const canDelete =
      user?.login_role === "admin" || user?.login_role === "judge";

    if (!canDelete) {
      return res.status(401).json({
        data: false,
        errors: [
          {
            message: "you do not have the permission to complete this action",
          },
        ],
      });
    }

    const { case_id } = req.query;

    const case_being_del = await prisma.case.findUnique({
      where: {
        case_id: Number(case_id),
      },
    });

    if (!case_being_del) {
      throw new Error("no such case");
    }

    await prisma.case.delete({
      where: {
        case_id: Number(case_id),
      },
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
