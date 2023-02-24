import React from "react";
import DashboardLayout from "../../../components/layout/dashboard";

type Props = {};

export default function Home({}: Props) {
  return <div className="w-full h-full flex flex-col px-2 py-4">Home</div>;
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
