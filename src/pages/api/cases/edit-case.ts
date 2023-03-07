//Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Case } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";
import { handleBodyNotEmpty } from "../../../../utils/validation";

import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
import { parseForm } from "../../../../lib/parse-form";
type Response = {
  data: Case | null;
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
    let url = Array.isArray(files) && files.map((f) => f.url);
    console.log(url);

    const { case_name, case_desc, case_hearing_date, case_status } = fields;

    const { case_id } = req.query;

    const updateCase = await prisma.case.update({
      where: {
        case_id: Number(case_id),
      },
      data: {
        case_description: String(case_desc),
        case_hearing_date: new Date(String(case_hearing_date)),
        case_name: String(case_name),

        case_evidence: !url ? [] : [...url],
        //@ts-ignore
        case_status: `${case_status}`,
      },
    });

    return res.status(200).json({
      data: updateCase,
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
