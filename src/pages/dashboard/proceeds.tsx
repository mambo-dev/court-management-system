import { Dialog } from "@headlessui/react";
import { Case, Hearing, Judge, Lawyer } from "@prisma/client";
import { format, formatRelative } from "date-fns";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CaseNotes from "../../../components/hearings/case-notes";
import DashboardLayout from "../../../components/layout/dashboard";
import DisclosureComp from "../../../components/utils/disclosure";
import Modal from "../../../components/utils/modal";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Proceeds({ data }: Props) {
  const { token, user, hearings } = data;
  const router = useRouter();
  const [openNotesModal, setOpenNotesModal] = useState(
    router.query.notes_modal === "true"
  );
  const findRouterHearing = hearings.filter(
    (hearing) => hearing.hearing_id === Number(router.query.notes_hearing)
  );

  const [currentHearing, setCurrentHearing] =
    useState<HearingWithCaseAndUsers | null>(
      findRouterHearing.length > 0 ? findRouterHearing[0] : null
    );

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
                  <div className="flex gap-x-3">
                    <span>{hearing.hearing_case.case_name}</span>
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
                    <Link
                      className="ml-auto"
                      href={`/dashboard/proceeds?notes_modal=true&&notes_hearing=${hearing.hearing_id}`}
                    >
                      <button
                        onClick={() => {
                          setOpenNotesModal(true);
                          setCurrentHearing(hearing);
                        }}
                        className=" py-3 bg-gradient-to-tr from-black  to-gray-700 px-3 rounded text-white font-medium"
                      >
                        take case notes
                      </button>
                    </Link>
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
      <Modal
        className="max-w-screen w-screen"
        isOpen={openNotesModal}
        setIsOpen={setOpenNotesModal}
      >
        <CaseNotes
          setOpenNotesModal={setOpenNotesModal}
          currentHearing={currentHearing}
        />
      </Modal>
    </div>
  );
}

export type HearingWithCaseAndUsers = Hearing & {
  hearing_case: Case & {
    plaintiff: {
      plaintiff_citizen: {
        citizen_full_name: string;
      };
    }[];
    defendant: {
      defendant_citizen: {
        citizen_full_name: string;
      };
    }[];
    case_lawyer: Lawyer;
    case_judge: Judge;
  };
};

type Data = {
  user: any;
  token: string;
  hearings: HearingWithCaseAndUsers[];
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
      hearing_case: {
        include: {
          case_judge: true,
          case_lawyer: true,
          defendant: {
            select: {
              defendant_citizen: {
                select: {
                  citizen_full_name: true,
                  citizen_email: false,
                },
              },
              defendant_case: false,
            },
          },
          plaintiff: {
            select: {
              plaintiff_citizen: {
                select: {
                  citizen_full_name: true,
                  citizen_email: false,
                },
              },
              plaintiff_case: false,
            },
          },
        },
      },
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
