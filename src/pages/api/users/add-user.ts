// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "../../../../types/types";

type Data = {
  username: string;
  role: string;
};

type Response = {
  data: Data | null;
  errors: Error[] | null;
};

export default function handler(
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

    //admins only access

    res.status(200).json({
      data: {
        username: "",
        role: "",
      },
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}
