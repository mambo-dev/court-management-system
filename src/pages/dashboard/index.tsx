import React from "react";
import DashboardLayout from "../../../components/layout/dashboard";

type Props = {};

export default function Home({}: Props) {
  return <div>Home</div>;
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
