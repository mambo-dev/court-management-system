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
  data: Judge | Police | Lawyer | Citizen | Admin | null;
  errors: Error[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "PUT") {
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

    if (user?.login_role !== "admin") {
      return res.status(401).json({
        data: null,
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
        data: null,
        errors: [...noEmptyValues],
      });
    }

    const {
      username,
      password: unhashedPassword,
      role,
      firstName,
      secondName,
      nationalId,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
    } = req.body;

    const { user_id } = req.query;

    const user_being_updated = await prisma.login.findUnique({
      where: {
        login_id: Number(user_id),
      },
    });

    if (!user_being_updated) {
      throw new Error("no such user");
    }

    switch (user_being_updated.login_role) {
      case "judge":
        const updateJudge = await prisma.judge.update({
          where: {
            judge_login_id: user_being_updated.login_id,
          },
          data: {
            judge_dob: dateOfBirth,
            judge_email: email,
            judge_full_name: `${firstName} ${secondName}`,
            judge_gender: gender,
            judge_national_id: nationalId,
            judge_phone_number: phoneNumber,
          },
        });

        return res.status(200).json({
          data: updateJudge,
          errors: null,
        });
      case "admin":
        const updateAdmin = await prisma.admin.update({
          where: {
            admin_login_id: user_being_updated.login_id,
          },
          data: {
            admin_dob: dateOfBirth,
            admin_email: email,
            admin_full_name: `${firstName} ${secondName}`,
            admin_gender: gender,
            admin_national_id: nationalId,
            admin_phone_number: phoneNumber,
          },
        });

        return res.status(200).json({
          data: updateAdmin,
          errors: null,
        });

      case "citizen":
        const updateCitizen = await prisma.citizen.update({
          where: {
            citizen_login_id: user_being_updated.login_id,
          },
          data: {
            citizen_dob: dateOfBirth,
            citizen_email: email,
            citizen_full_name: `${firstName} ${secondName}`,
            citizen_gender: gender,
            citizen_national_id: nationalId,
            citizen_phone_number: phoneNumber,
          },
        });

        return res.status(200).json({
          data: updateCitizen,
          errors: null,
        });
      case "lawyer":
        const updateLawyer = await prisma.lawyer.update({
          where: {
            lawyer_login_id: user_being_updated.login_id,
          },
          data: {
            lawyer_dob: dateOfBirth,
            lawyer_email: email,
            lawyer_full_name: `${firstName} ${secondName}`,
            lawyer_gender: gender,
            lawyer_national_id: nationalId,
            lawyer_phone_number: phoneNumber,
          },
        });

        return res.status(200).json({
          data: updateLawyer,
          errors: null,
        });
      case "police":
        const updatePolice = await prisma.police.update({
          where: {
            police_login_id: user_being_updated.login_id,
          },
          data: {
            police_dob: dateOfBirth,
            police_email: email,
            police_full_name: `${firstName} ${secondName}`,
            police_gender: gender,
            police_national_id: nationalId,
            police_phone_number: phoneNumber,
          },
        });

        return res.status(200).json({
          data: updatePolice,
          errors: null,
        });

      default:
        return res.status(403).json({
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
