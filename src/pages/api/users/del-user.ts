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

    if (user?.login_role !== "admin") {
      return res.status(401).json({
        data: false,
        errors: [
          {
            message: "cannot complete this action",
          },
        ],
      });
    }

    const noEmptyValues = handleBodyNotEmpty(req.body);

    if (noEmptyValues.length > 0) {
      return res.status(200).json({
        data: false,
        errors: [...noEmptyValues],
      });
    }

    const { user_id } = req.query;

    if (user?.login_id === Number(user_id)) {
      return res.status(401).json({
        data: false,
        errors: [
          {
            message: "cannot delete your own account ",
          },
        ],
      });
    }

    const user_being_del = await prisma.login.findUnique({
      where: {
        login_id: Number(user_id),
      },
    });

    if (!user_being_del) {
      throw new Error("no such user");
    }

    await prisma.login.delete({
      where: {
        login_id: Number(user_id),
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
