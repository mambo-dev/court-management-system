import {
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  FolderPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  Case as CaseType,
  Citizen,
  defendant,
  Judge,
  Lawyer,
  plaintiff,
  Role,
} from "@prisma/client";
import { format } from "date-fns";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import DelCase from "../../../components/cases/del-case";
import EditCase from "../../../components/cases/edit-case";
import ExpandCase from "../../../components/cases/expand-case";
import NewCase from "../../../components/cases/new-case";
import Table from "../../../components/extras/table";
import DashboardLayout from "../../../components/layout/dashboard";
import Button from "../../../components/utils/button";
import { truncate } from "../../../components/utils/file-upload";
import Modal from "../../../components/utils/modal";
import SidePanel from "../../../components/utils/side-panel";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};
export type SingleCase = CaseType & {
  plaintiff: (plaintiff & {
    plaintiff_citizen: Citizen & {
      citizen_login: {
        login_role: Role;
        login_id: number;
      };
    };
  })[];
  defendant: (defendant & {
    defendant_citizen: Citizen & {
      citizen_login: {
        login_role: Role;
        login_id: number;
      };
    };
  })[];
  case_lawyer: Lawyer;
  case_judge: Judge;
};

export default function Case({ data }: Props) {
  const [openPanel, setOpenPanel] = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const { user, token, cases } = data;
  const canEdit = user?.login_role === "admin" || user?.login_role === "judge";

  let headers;
  canEdit
    ? (headers = [
        "name",
        "description",
        "starting date",
        "presiding judge",
        "lawyer",
        "total defendants",
        "total plaintifs",
        "case status",
        "details",
        "edit",
        "delete",
      ])
    : (headers = [
        "name",
        "description",
        "starting date",
        "presiding judge",
        "lawyer",
        "total defendants",
        "total plaintifs",
        "case status",
        "details",
      ]);

  return (
    <div className="w-full h-full flex flex-col gap-y-4 px-2 py-4">
      {(user?.login_role === "judge" || user?.login_role === "admin") && (
        <div className="w-full flex items-center justify-end ">
          <div className="w-32">
            <Button
              onClick={() => setOpenPanel(true)}
              text="new case"
              type="button"
              icon={
                <FolderPlusIcon className="w-5 h-5 font-medium text-white " />
              }
            />
            <SidePanel
              span
              span_range="max-w-5xl"
              open={openPanel}
              setOpen={setOpenPanel}
              title="new case"
            >
              <NewCase token={token} setOpenPanel={setOpenPanel} />
            </SidePanel>
          </div>
        </div>
      )}

      <Table headers={headers}>
        {cases.map((cases) => {
          return (
            <tr key={cases.case_id} className="border-b">
              <th
                scope="row"
                className="px-2 text-left py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {cases.case_name}
              </th>
              <td className="py-4">{truncate(cases.case_description, 20)}</td>
              <td className="py-4">
                {format(new Date(cases.case_hearing_date), "dd/MM/yyyy")}
              </td>
              <td className="py-4"> {cases.case_judge.judge_full_name} </td>
              <td className="py-4"> {cases.case_lawyer.lawyer_full_name} </td>
              <td className="py-4">{cases.defendant.length}</td>
              <td className="py-4">{cases.plaintiff.length}</td>
              <td
                className={`py-4 font-semibold  ${
                  cases.case_status === "open"
                    ? "text-green-700 "
                    : "text-red-700"
                }`}
              >
                {cases.case_status}
              </td>
              <td className="py-4  pr-2">
                <Button
                  expand
                  onClick={() => {
                    setOpenDetailsModal(true);
                    setSelectedCase(cases);
                  }}
                  type="button"
                  icon={
                    <EllipsisVerticalIcon className="w-5 h-5 font-medium  " />
                  }
                />
              </td>
              {canEdit && (
                <td className="py-4  pr-2">
                  <Button
                    edit
                    onClick={() => {
                      setOpenEditPanel(true);
                      setSelectedCase(cases);
                    }}
                    type="button"
                    icon={
                      <PencilSquareIcon className="w-5 h-5 font-medium  " />
                    }
                  />
                </td>
              )}
              {canEdit && (
                <td className="py-4 pr-2">
                  <Button
                    error
                    onClick={() => {
                      setOpenDeleteModal(true);
                      setSelectedCase(cases);
                    }}
                    type="button"
                    icon={<TrashIcon className="w-5 h-5 font-medium  " />}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </Table>
      <SidePanel
        open={openEditPanel}
        setOpen={setOpenEditPanel}
        title="edit case"
        span
        span_range="max-w-5xl"
      >
        <EditCase
          selectedCase={selectedCase}
          setOpenPanel={setOpenEditPanel}
          token={token}
        />
      </SidePanel>
      <Modal isOpen={openDeleteModal} setIsOpen={setOpenDeleteModal}>
        <DelCase
          selectedCase={selectedCase}
          setIsOpen={setOpenDeleteModal}
          token={token}
        />
      </Modal>
      <Modal isOpen={openDetailsModal} setIsOpen={setOpenDetailsModal} span>
        <ExpandCase
          selectedCase={selectedCase}
          setOpenDetailsModal={setOpenDetailsModal}
        />
      </Modal>
    </div>
  );
}

type Data = {
  user: any;
  token: string;
  cases: (CaseType & {
    plaintiff: (plaintiff & {
      plaintiff_citizen: Citizen & {
        citizen_login: {
          login_role: Role;
          login_id: number;
        };
      };
    })[];
    defendant: (defendant & {
      defendant_citizen: Citizen & {
        citizen_login: {
          login_role: Role;
          login_id: number;
        };
      };
    })[];
    case_lawyer: Lawyer;
    case_judge: Judge;
  })[];
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

  const cases = await prisma.case.findMany({
    take: 10,
    include: {
      case_lawyer: true,
      case_judge: true,
      defendant: {
        include: {
          defendant_citizen: {
            include: {
              citizen_login: {
                select: {
                  login_password: false,
                  login_role: true,
                  login_id: true,
                },
              },
            },
          },
        },
      },
      plaintiff: {
        include: {
          plaintiff_citizen: {
            include: {
              citizen_login: {
                select: {
                  login_password: false,
                  login_role: true,
                  login_id: true,
                },
              },
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
        cases: JSON.parse(JSON.stringify(cases)),
      },
    },
  };
};

Case.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
