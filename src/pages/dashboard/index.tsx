import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React from "react";
import DashboardLayout from "../../../components/layout/dashboard";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";
import { IoDocumentsOutline } from "react-icons/io5";
import DataDisp from "../../../components/utils/data-disp";
import { subMonths, format } from "date-fns";
import GraphDisplay from "../../../components/dashboard/graph-display";
import Feedback from "../../../components/dashboard/feedback";

const today = new Date();
const lastMonth = subMonths(today, 1);

type Props = {
  data: Data;
};

export default function Home({ data }: Props) {
  const {
    cases,
    loggedInUser,
    token,
    users,
    casesPercentageIncrease,
    caseStatus,
  } = data;
  console.log(cases);
  return (
    <div className="w-full h-full flex flex-col px-2 py-4 gap-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <DataDisp
          percentage={casesPercentageIncrease}
          secondaryTitle="since last month"
          title="Total cases"
          totals={cases.length}
        />
        <DataDisp
          percentage={100}
          secondaryTitle="since start of the system"
          title="Total users"
          totals={users._count._all}
        />
        <DataDisp
          percentage={caseStatus.openPercentageIncrease}
          secondaryTitle="compared to last month"
          title="Total open cases"
          totals={caseStatus.totalOpenCases}
        />
        <DataDisp
          percentage={caseStatus.closedPercentageIncrease}
          secondaryTitle="compared to last month"
          title="Total closed cases"
          totals={caseStatus.totalClosedCases}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <GraphDisplay
          totalCases={cases.length}
          totalClosedCases={caseStatus.totalClosedCases}
          totalOpenCases={caseStatus.totalOpenCases}
        />
        <Feedback user={loggedInUser} token={token} />
      </div>
    </div>
  );
}

type Data = {
  cases: any[];
  users: any;
  token: string;
  loggedInUser: any;
  casesPercentageIncrease: number;
  caseStatus: {
    totalOpenCases: number;
    totalClosedCases: number;
    openPercentageIncrease: number;
    closedPercentageIncrease: number;
  };
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const { req } = context;

  const access_token = req.cookies.access_token;
  if (!access_token || access_token.trim() === "") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const decodedToken: DecodedToken = jwtDecode(access_token);

  if (decodedToken.exp < Date.now() / 1000) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const [user, totalUsers, openCases] = await Promise.all([
    prisma.login.findUnique({
      where: {
        login_id: decodedToken.user_id,
      },
      select: {
        login_username: true,
        login_role: true,
        login_id: true,
        login_password: false,
      },
    }),
    prisma.login.aggregate({
      _count: {
        _all: true,
      },
    }),
    prisma.case.findMany({
      where: {
        case_status: { in: ["open", "closed"] },
      },
      select: {
        case_id: true,
        case_status: true,
        case_hearing_date: true,
      },
    }),
  ]);

  const casesThisMonth = openCases.filter(
    (c) => c.case_hearing_date >= lastMonth
  );
  const casesBeforeOneMonth = openCases.filter(
    (c) => c.case_hearing_date < lastMonth
  );

  const casesAfterThreeMonths = openCases.length - casesBeforeOneMonth.length;
  // casesThisMonth.length + casesBeforeOneMonth.length - openCases.length;

  const casesPercentageIncrease = casesBeforeOneMonth.length
    ? ((casesAfterThreeMonths - casesBeforeOneMonth.length) /
        casesBeforeOneMonth.length) *
      100
    : 100;

  const openCasesLastMonth = casesBeforeOneMonth.filter(
    (c) => c.case_status === "open"
  ).length;
  const openCasesThisMonth = casesThisMonth.filter(
    (c) => c.case_status === "open"
  ).length;
  const openPercentageIncrease = openCasesLastMonth
    ? ((openCasesThisMonth - openCasesLastMonth) / openCasesLastMonth) * 100
    : 100;

  const closedCases = await prisma.case.findMany({
    where: {
      case_status: "closed",
    },
  });

  const closedCasesThisMonth = await prisma.case.findMany({
    where: {
      case_hearing_date: {
        gte: new Date(lastMonth),
        lte: new Date(lastMonth),
      },
      case_status: "closed",
    },
  });

  const closedCasesLastMonth = closedCases.length - closedCasesThisMonth.length;

  const closedPercentageIncrease =
    closedCasesLastMonth <= 0
      ? 100
      : ((closedCasesThisMonth.length - closedCasesLastMonth) /
          closedCasesLastMonth) *
        100;

  const caseStatus = {
    totalOpenCases: openCases.filter((c) => c.case_status === "open").length,
    totalClosedCases: openCases.filter((c) => c.case_status === "closed")
      .length,
    openPercentageIncrease,
    closedPercentageIncrease,
  };

  return {
    props: {
      data: {
        token: access_token,
        loggedInUser: user,
        casesPercentageIncrease,
        cases: JSON.parse(JSON.stringify(openCases)),
        users: totalUsers,
        caseStatus,
      },
    },
  };
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
