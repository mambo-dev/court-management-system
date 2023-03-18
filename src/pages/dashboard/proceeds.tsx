import { Case, Hearing } from "@prisma/client";
import { format, formatRelative } from "date-fns";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React from "react";
import DashboardLayout from "../../../components/layout/dashboard";
import DisclosureComp from "../../../components/utils/disclosure";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Proceeds({ data }: Props) {
  const { token, user, hearings } = data;
  return (
    <div className="w-full h-full flex flex-col gap-y-4 px-2 py-4">
      {hearings.length > 0 ? (
        hearings.map((hearing) => (
          <div key={hearing.hearing_id}>
            <ul
              role="list"
              className="divide-y divide-gray-200 rounded-md border border-gray-200"
            >
              <DisclosureComp
                button={
                  <div className="">
                    <span>{hearing.hearing_case.case_description}</span>
                    <span>
                      {formatRelative(
                        new Date(hearing.hearing_date),
                        new Date()
                      )}{" "}
                    </span>
                  </div>
                }
                panel={
                  <div className="flex flex-col gap-y-2 ">
                    <span> {hearing.hearing_case.case_description}</span>
                    <button className="ml-auto py-3 bg-gradient-to-tr from-emerald-500  to-emerald-600 px-3 rounded text-white font-medium">
                      take case notes
                    </button>
                  </div>
                }
              />
            </ul>
          </div>
        ))
      ) : (
        <div className="mx-auto py-32">
          <div className="flex flex-col gap-y-2 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-slate-700 font-light"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>
            <h1 className="text-xl font-semibold">No hearings</h1>
            <p className="text-slate-700 font-medium">
              we currently have no hearings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
type HearingWithCase = Hearing & {
  hearing_case: Case;
};

type Data = {
  user: any;
  token: string;
  hearings: HearingWithCase[];
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

  const hearings = await prisma.hearing.findMany({
    include: {
      hearing_case: true,
    },
  });

  return {
    props: {
      data: {
        token: access_token,
        user,
        hearings: JSON.parse(JSON.stringify(hearings)),
      },
    },
  };
};

Proceeds.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
