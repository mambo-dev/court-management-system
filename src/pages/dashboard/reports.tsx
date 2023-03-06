import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/dashboard";
import Cases from "../../../components/reports/cases";
import Users from "../../../components/reports/users";
import Box from "../../../components/utils/box";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Reports({ data }: Props) {
  const { user, token } = data;
  const ReportNav = ["cases", "users"];
  const [pages, setPages] = useState("cases");

  return (
    <div className="w-full h-full grid grid-cols-10 grid-rows-6 md:gap-2 py-10  px-1 ">
      <ul className="w-full md:h-fit py-2 row-span-1 h-fit rounded-md bg-white border border-slate-300 col-span-10 gap-x-2 px-2  md:col-span-2  flex flex-row md:flex-col  gap-y-2">
        {ReportNav.map((report, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                setPages(report);
              }}
              className="py-2 w-1/2 md:w-full rounded-md hover:cursor-pointer  px-2 hover:bg-cyan-200 bg-slate-50 hover:text-cyan-900 font-medium text-sm"
            >
              {report}
            </li>
          );
        })}
      </ul>

      <div className="w-full row-span-5  h-full md:h-full col-span-10 md:col-span-8 bg-white border border-slate-300 rounded-md">
        {pages === "cases" ? (
          <Cases token={token} user={user} />
        ) : (
          <Users token={token} user={user} />
        )}
      </div>
    </div>
  );
}

type Data = {
  user: any;
  token: string;
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

  const user = await prisma.login.findUnique({
    where: {
      login_id: decodedToken.user_id,
    },
    select: {
      login_username: true,
      login_password: false,
      login_role: true,
    },
  });

  return {
    props: {
      data: {
        token: access_token,
        user,
      },
    },
  };
};

Reports.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};