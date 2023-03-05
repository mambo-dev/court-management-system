import React from "react";
import DashboardLayout from "../../../components/layout/dashboard";

type Props = {};

export default function Hearings({}: Props) {
  return <div>Hearings</div>;
}

Hearings.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
