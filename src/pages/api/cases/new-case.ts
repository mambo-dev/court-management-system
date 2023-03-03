//Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Login } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleBodyNotEmpty } from "../../../../utils/validation";
import * as argon2 from "argon2";
import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
import { parseForm } from "../../../../lib/parse-form";
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

    const isJudge = user?.login_role !== "judge";
    const isAdmin = user?.login_role !== "admin";

    if (!isJudge && !isAdmin) {
      return res.status(401).json({
        data: null,
        errors: [
          {
            message: "cannot complete this action",
          },
        ],
      });
    }
    const { fields, files } = await parseForm(req);
    const noEmptyValues = handleBodyNotEmpty(fields);

    if (noEmptyValues.length > 0) {
      return res.status(200).json({
        data: null,
        errors: [...noEmptyValues],
      });
    }

    const file = files.media;
    let url = Array.isArray(file) ? file.map((f) => f.filepath) : file.filepath;
    console.log(url);
    const {
      case_name,
      case_desc,
      case_hearing_date,
      case_status,
      case_plaint_id,
      case_defend_id,
      case_lawyer_id,
      case_judge_id,
    } = fields;
    const newCase = prisma.case.create({
      data: {
        case_defendant: "",
        case_description: String(case_desc),
        case_hearing_date: String(case_hearing_date),
        case_name: String(case_hearing_date),
        case_plaintiff: "",

        case_judge: {
          connect: {
            judge_login_id: Number(case_judge_id),
          },
        },
        case_lawyer: {
          connect: {
            lawyer_login_id: Number(case_lawyer_id),
          },
        },
        //@ts-ignore
        case_status: `${String(case_status)}`,
      },
    });

    return res.status(200).json({
      data: null,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
