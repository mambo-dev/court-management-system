// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Case } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Error } from "../../../../types/types";

import { handleAuthorization } from "../../../../utils/authorization";

type Response = {
  data: Case[] | null;
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
            message: "unauthorized access please login",
          },
        ],
      });
    }

    const { query } = req.query;

    const getCases = await prisma.case.findMany({
      where: {
        case_name: {
          search: String(query),
        },
      },
    });

    return res.status(200).json({
      data: getCases,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
