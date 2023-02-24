// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Login } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleBodyNotEmpty } from "../../../../utils/validation";
import * as argon2 from "argon2";
import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
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

    let password = await argon2.hash(unhashedPassword, {
      hashLength: 10,
    });

    switch (role) {
      case "judge":
        const createJudge = await prisma.login.create({
          data: {
            login_password: password,
            login_role: "judge",
            login_username: username,

            Judge: {
              create: {
                judge_dob: dateOfBirth,
                judge_email: email,
                judge_full_name: `${firstName} ${secondName}`,
                judge_gender: gender,
                judge_national_id: nationalId,
                judge_phone_number: phoneNumber,
              },
            },
          },
        });

        return res.status(200).json({
          data: createJudge,
          errors: null,
        });
      case "admin":
        const createAdmin = await prisma.login.create({
          data: {
            login_password: password,
            login_role: "admin",
            login_username: username,
            Admin: {
              create: {
                admin_dob: dateOfBirth,
                admin_email: email,
                admin_full_name: `${firstName} ${secondName}`,
                admin_gender: gender,
                admin_national_id: nationalId,
                admin_phone_number: phoneNumber,
              },
            },
          },
        });

        return res.status(200).json({
          data: createAdmin,
          errors: null,
        });

      case "citizen":
        const createCitizen = await prisma.login.create({
          data: {
            login_password: password,
            login_role: "citizen",
            login_username: username,

            Citizen: {
              create: {
                citizen_dob: dateOfBirth,
                citizen_email: email,
                citizen_full_name: `${firstName} ${secondName}`,
                citizen_gender: gender,
                citizen_national_id: nationalId,
                citizen_phone_number: phoneNumber,
              },
            },
          },
        });

        return res.status(200).json({
          data: createCitizen,
          errors: null,
        });
      case "lawyer":
        const createLawyer = await prisma.login.create({
          data: {
            login_password: password,
            login_role: "lawyer",
            login_username: username,

            Lawyer: {
              create: {
                lawyer_dob: dateOfBirth,
                lawyer_email: email,
                lawyer_full_name: `${firstName} ${secondName}`,
                lawyer_gender: gender,
                lawyer_national_id: nationalId,
                lawyer_phone_number: phoneNumber,
              },
            },
          },
        });

        return res.status(200).json({
          data: createLawyer,
          errors: null,
        });
      case "police":
        const createPolice = await prisma.login.create({
          data: {
            login_password: password,
            login_role: "police",
            login_username: username,

            Police: {
              create: {
                police_dob: dateOfBirth,
                police_email: email,
                police_full_name: `${firstName} ${secondName}`,
                police_gender: gender,
                police_national_id: nationalId,
                police_phone_number: phoneNumber,
              },
            },
          },
        });

        return res.status(200).json({
          data: createPolice,
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
