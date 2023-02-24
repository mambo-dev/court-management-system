import { UserPlusIcon } from "@heroicons/react/24/outline";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import NewCase from "../../../components/cases/new-case";
import DashboardLayout from "../../../components/layout/dashboard";
import Button from "../../../components/utils/button";
import SidePanel from "../../../components/utils/side-panel";
import prisma from "../../../lib/prisma";
import { DecodedToken } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Case({ data }: Props) {
  const [openPanel, setOpenPanel] = useState(false);
  const { user, token } = data;
  return (
    <div className="w-full h-full flex flex-col gap-y-4 px-2 py-4">
      {user?.login_role === "judge" ||
        (user?.login_role === "admin" && (
          <div className="w-full flex items-center justify-end ">
            <div className="w-32">
              <Button
                onClick={() => setOpenPanel(true)}
                text="new case"
                type="button"
                icon={
                  <UserPlusIcon className="w-4 h-4 font-medium " fill="white" />
                }
              />
              <SidePanel
                span
                span_range="max-w-4xl"
                open={openPanel}
                setOpen={setOpenPanel}
                title="new user"
              >
                <NewCase token={token} />
              </SidePanel>
            </div>
          </div>
        ))}
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

  if (user?.login_role !== "judge" && user?.login_role !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {
      data: {
        token: access_token,
        user,
      },
    },
  };
};

Case.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
