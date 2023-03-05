import React from "react";
import DashboardLayout from "../../../components/layout/dashboard";

type Props = {};

export default function Hearings({}: Props) {
  return (
    <div className="w-full h-full flex flex-col gap-y-4 px-2 py-4">
      <div className="w-full flex items-center justify-end "></div>
    </div>
  );
}

Hearings.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
