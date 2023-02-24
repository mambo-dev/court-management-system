import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Admin, Citizen, Judge, Lawyer, Login, Police } from "@prisma/client";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Table from "../../../components/extras/table";
import DashboardLayout from "../../../components/layout/dashboard";
import AddUser from "../../../components/users/add-user";
import Button from "../../../components/utils/button";
import SidePanel from "../../../components/utils/side-panel";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Users({ data }: Props) {
  const { token, user, users } = data;

  const headers = [
    "name",
    "email",
    "phone",
    "national id",
    "role",
    "gender",
    "edit",
    "delete",
  ];
  const [openPanel, setOpenPanel] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-y-4 px-2 py-4">
      {user?.login_role === "admin" && (
        <div className="w-full flex items-center justify-end ">
          <div className="w-32">
            <Button
              onClick={() => setOpenPanel(true)}
              text="add user"
              type="button"
              icon={
                <UserPlusIcon className="w-4 h-4 font-medium " fill="white" />
              }
            />
            <SidePanel
              span
              open={openPanel}
              setOpen={setOpenPanel}
              title="new user"
            >
              <AddUser token={token} />
            </SidePanel>
          </div>
        </div>
      )}

      <div className="">
        <Table headers={headers}>
          {users?.map((user, index) => {
            return (
              <tr key={user.id} className="border-b">
                <th
                  scope="row"
                  className="px-2 text-left py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.name}
                </th>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.phone}</td>
                <td className="py-4">{user.nationalId}</td>
                <td className="py-4 text-green-400 font-medium">{user.role}</td>
                <td className="py-4">{user.gender}</td>
                <td className="py-4  pr-2">
                  <Button
                    edit
                    type="button"
                    icon={
                      <PencilSquareIcon className="w-5 h-5 font-medium  " />
                    }
                  />
                </td>
                <td className="py-4 pr-2">
                  <Button
                    error
                    type="button"
                    icon={<TrashIcon className="w-5 h-5 font-medium  " />}
                  />
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
    </div>
  );
}

type Data = {
  user: Login | null;
  users: user[] | null;
  token: string | null;
};
type user = {
  id: number;
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  nationalId: string | undefined;
  role: string | undefined;
  gender: string | undefined;
};

//@ts-ignore
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

  console.log(user?.login_role);
  if (user?.login_role !== "judge" && user?.login_role !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }

  await prisma.login.findMany({
    include: {
      Admin: true,
      Citizen: true,
      Judge: true,
      Lawyer: true,
      Police: true,
    },
  });

  const users = transform(
    await prisma.login.findMany({
      include: {
        Admin: true,
        Citizen: true,
        Judge: true,
        Lawyer: true,
        Police: true,
      },
    })
  );

  return {
    props: {
      data: {
        token: access_token,
        users,
        user,
      },
    },
  };
};

function transform(
  users: (Login & {
    Judge: Judge | null;
    Citizen: Citizen | null;
    Police: Police | null;
    Lawyer: Lawyer | null;
    Admin: Admin | null;
  })[]
) {
  const data = users.map(
    (
      user: Login & {
        Judge: Judge | null;
        Citizen: Citizen | null;
        Police: Police | null;
        Lawyer: Lawyer | null;
        Admin: Admin | null;
      }
    ) => {
      switch (user.login_role) {
        case "judge":
          return {
            id: user.login_id,
            name: user.Judge?.judge_full_name,
            email: user.Judge?.judge_email,
            phone: user.Judge?.judge_phone_number,
            nationalId: user.Judge?.judge_national_id,
            role: user.login_role,
            gender: user.Judge?.judge_gender,
          };
        case "admin":
          return {
            id: user.login_id,
            name: user.Admin?.admin_full_name,
            email: user.Admin?.admin_email,
            phone: user.Admin?.admin_phone_number,
            nationalId: user.Admin?.admin_national_id,
            role: user.login_role,
            gender: user.Admin?.admin_gender,
          };
        case "lawyer":
          return {
            id: user.login_id,
            name: user.Lawyer?.lawyer_full_name,
            email: user.Lawyer?.lawyer_email,
            phone: user.Lawyer?.lawyer_phone_number,
            nationalId: user.Lawyer?.lawyer_national_id,
            role: user.login_role,
            gender: user.Lawyer?.lawyer_gender,
          };
        case "police":
          return {
            id: user.login_id,
            name: user.Police?.police_full_name,
            email: user.Police?.police_email,
            phone: user.Police?.police_phone_number,
            nationalId: user.Police?.police_national_id,
            role: user.login_role,
            gender: user.Police?.police_gender,
          };
        case "citizen":
          return {
            id: user.login_id,
            name: user.Citizen?.citizen_full_name,
            email: user.Citizen?.citizen_email,
            phone: user.Citizen?.citizen_phone_number,
            nationalId: user.Citizen?.citizen_national_id,
            role: user.login_role,
            gender: user.Citizen?.citizen_gender,
          };

        default:
          return {
            id: 0,
            name: "",
            email: "",
            phone: "",
            nationalId: "",
            role: "",
            gender: "",
          };
      }
    }
  );

  return data;
}

Users.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
