// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { DecodedToken, Error } from "../../../../types/types";

import { handleAuthorization } from "../../../../utils/authorization";
import jwtDecode from "jwt-decode";
import {
  Case,
  Citizen,
  defendant,
  Hearing,
  Judge,
  Lawyer,
  plaintiff,
  Status,
} from "@prisma/client";
import { format } from "date-fns";
type Response = {
  data: any[] | null;
  errors: Error[] | null;
};
type CaseReport = {
  case_judge: Judge;
  case_lawyer: Lawyer;
  case_description: string;
  case_name: string;
  case_hearing_date: Date;
  Hearing: Hearing[];
  case_status: Status;
  case_id: number;
  defendant: (defendant & {
    defendant_citizen: Citizen;
  })[];
  plaintiff: (plaintiff & {
    plaintiff_citizen: Citizen;
  })[];
}[];

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

    const { case_from, case_to, case_judge_name, case_status } = req.body;
    console.log(case_judge_name);
    const noDateFilter = case_from.trim() === "" || case_from.trim === "";
    const noJudgeFilter = case_judge_name.trim() === "select judge";
    const noStatusFilter = case_status === "all";
    console.log(
      "no date",
      noDateFilter,
      "no judge",
      noJudgeFilter,
      "no status",
      noStatusFilter
    );

    //no filters applied
    if (noDateFilter && noStatusFilter && noJudgeFilter) {
      const cases = await prisma.case.findMany({
        select: {
          defendant: {
            include: {
              defendant_citizen: true,
            },
          },
          plaintiff: {
            include: {
              plaintiff_citizen: true,
            },
          },
          case_judge: true,
          case_lawyer: true,
          case_description: true,
          case_name: true,
          case_evidence: false,
          case_hearing_date: true,
          Hearing: true,
          case_status: true,
          case_id: true,
        },
      });
      return res.status(200).json({
        data: mapCases(cases),
        errors: null,
      });
    }

    //only case status set
    if (case_status !== "all" && noDateFilter && noJudgeFilter) {
      const cases = await prisma.case.findMany({
        where: {
          case_status,
        },
        select: {
          defendant: {
            include: {
              defendant_citizen: true,
            },
          },
          plaintiff: {
            include: {
              plaintiff_citizen: true,
            },
          },
          case_judge: true,
          case_lawyer: true,
          case_description: true,
          case_name: true,
          case_evidence: false,
          case_hearing_date: true,
          Hearing: true,
          case_status: true,
          case_id: true,
        },
      });
      return res.status(200).json({
        data: mapCases(cases),
        errors: null,
      });
    }
    //only judge name set
    if (noDateFilter && noStatusFilter) {
      const cases = await prisma.case.findMany({
        where: {
          case_judge: {
            judge_full_name: case_judge_name,
          },
        },
        select: {
          defendant: {
            include: {
              defendant_citizen: true,
            },
          },
          plaintiff: {
            include: {
              plaintiff_citizen: true,
            },
          },
          case_judge: true,
          case_lawyer: true,
          case_description: true,
          case_name: true,
          case_evidence: false,
          case_hearing_date: true,
          Hearing: true,
          case_status: true,
          case_id: true,
        },
      });
      return res.status(200).json({
        data: mapCases(cases),
        errors: null,
      });
    }

    //only dates set
    if (noJudgeFilter && noStatusFilter) {
      if (case_from.trim() === "" || case_to.trim() === "") {
        return res.status(200).json({
          data: null,
          errors: [
            {
              message:
                case_from.trim() === ""
                  ? "case from is required"
                  : "case to is required",
            },
          ],
        });
      }

      const cases = await prisma.case.findMany({
        where: {
          case_hearing_date: {
            gte: new Date(case_from),
            lte: new Date(case_to),
          },
        },
        select: {
          defendant: {
            include: {
              defendant_citizen: true,
            },
          },
          plaintiff: {
            include: {
              plaintiff_citizen: true,
            },
          },
          case_judge: true,
          case_lawyer: true,
          case_description: true,
          case_name: true,
          case_evidence: false,
          case_hearing_date: true,
          Hearing: true,
          case_status: true,
          case_id: true,
        },
      });
      return res.status(200).json({
        data: mapCases(cases),
        errors: null,
      });
    }

    //all filters applied
    if (!noDateFilter && !noStatusFilter && !noJudgeFilter) {
      const cases = await prisma.case.findMany({
        where: {
          case_hearing_date: {
            gte: new Date(case_from),
            lte: new Date(case_to),
          },
          case_judge: {
            judge_full_name: case_judge_name,
          },
          case_status,
        },
        select: {
          defendant: {
            include: {
              defendant_citizen: true,
            },
          },
          plaintiff: {
            include: {
              plaintiff_citizen: true,
            },
          },
          case_judge: true,
          case_lawyer: true,
          case_description: true,
          case_name: true,
          case_evidence: false,
          case_hearing_date: true,
          Hearing: true,
          case_status: true,
          case_id: true,
        },
      });
      return res.status(200).json({
        data: mapCases(cases),
        errors: null,
      });
    }

    const cases = await prisma.case.findMany({
      select: {
        defendant: {
          include: {
            defendant_citizen: true,
          },
        },
        plaintiff: {
          include: {
            plaintiff_citizen: true,
          },
        },
        case_judge: true,
        case_lawyer: true,
        case_description: true,
        case_name: true,
        case_evidence: false,
        case_hearing_date: true,
        Hearing: true,
        case_status: true,
        case_id: true,
      },
    });

    return res.status(200).json({
      data: mapCases(cases),
      errors: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      data: null,
      errors: [{ message: error.message }],
    });
  }
}

function mapCases(cases: CaseReport) {
  return cases.map((cases) => {
    return {
      case_id: cases.case_id,
      case_name: cases.case_name,
      case_description: cases.case_description,
      case_hearing_date: format(
        new Date(cases.case_hearing_date),
        "dd/MM/yyyy"
      ),
      case_status: cases.case_status,
      case_lawyer_id: cases.case_lawyer.lawyer_id,
      case_lawyer_name: cases.case_lawyer.lawyer_full_name,
      case_judge_id: cases.case_judge.judge_id,
      case_judge_name: cases.case_judge.judge_full_name,
      ...cases.defendant.reduce((acc, defendant, index) => {
        return {
          ...acc,
          [`defendant${index + 1}_id`]: defendant.defendant_id,
          [`defendant${index + 1}_name`]:
            defendant.defendant_citizen.citizen_full_name,
        };
      }, {}),
      ...cases.plaintiff.reduce((acc, plaintiff, index) => {
        return {
          ...acc,
          [`defendant${index + 1}_id`]: plaintiff.plaintiff_id,
          [`defendant${index + 1}_name`]:
            plaintiff.plaintiff_citizen.citizen_full_name,
        };
      }, {}),
      ...cases.Hearing.reduce((acc, hearing, index) => {
        return {
          ...acc,
          [`hearing${index + 1}_id`]: hearing.hearing_id,
          [`hearing${index + 1}_location`]: hearing.hearing_location,
          [`hearing${index + 1}_outcome`]: hearing.hearing_outcome,
          [`hearing${index + 1}_status`]: hearing.hearing_status,
          [`hearing${index + 1}_on`]: format(
            new Date(hearing.hearing_date),
            "dd/MM/yyyy"
          ),
        };
      }, {}),
    };
  });
}
