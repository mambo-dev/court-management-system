import { UserPlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/dashboard";
import AddUser from "../../../components/users/add-user";
import Button from "../../../components/utils/button";
import SidePanel from "../../../components/utils/side-panel";

type Props = {};

export default function Users({}: Props) {
  const [openPanel, setOpenPanel] = useState(false);
  return (
    <div className="w-full h-full flex flex-col px-2 py-4">
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
            <AddUser />
          </SidePanel>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}

Users.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
