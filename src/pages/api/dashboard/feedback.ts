// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { FeedBack } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Error } from "../../../../types/types";

import { handleAuthorization } from "../../../../utils/authorization";

type Response = {
  data: FeedBack | null;
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
            message: "unauthorized access please login",
          },
        ],
      });
    }

    const { feedback_login_id, feedback_type, feedback_details } = req.body;

    const createFeedback = await prisma.feedBack.create({
      data: {
        feedback_details: feedback_details,
        feedback_type: feedback_type,
        feedback_login: {
          connect: {
            login_id: Number(feedback_login_id),
          },
        },
      },
    });

    return res.status(200).json({
      data: createFeedback,
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
