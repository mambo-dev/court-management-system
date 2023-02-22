// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Login } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Error } from "../../../../types/types";
import { checkUserExists } from "../../../../utils/user";
import { handleLoginValidation } from "../../../../utils/validation";
import * as argon2 from "argon2";

type Response = {
  data: Login | null;
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

    const { valid, errors } = handleLoginValidation(req.body);

    if (!valid) {
      return res.status(200).json({
        data: null,
        errors: errors,
      });
    }

    const { username, password } = req.body;

    if (!(await checkUserExists(username))) {
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "user does not exist",
          },
        ],
      });
    }

    const login = await prisma.login.findUnique({
      where: {
        login_username: username,
      },
    });

    if (!(await argon2.verify(`${login?.login_password}`, password))) {
      return res.status(200).json({
        data: null,
        errors: [
          {
            message: "username or password is incorrect",
          },
        ],
      });
    }

    return res.status(200).json({
      data: login,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
