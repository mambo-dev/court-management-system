import React from "react";
import useForm from "../../../components/hooks/form";
import DashboardLayout from "../../../components/layout/dashboard";

type Props = {};

export default function Fines({}: Props) {
  const initialState = {};
  const submitAxios = async () => {};
  const { handleSubmit } = useForm(initialState, submitAxios);
  return (
    <div className="w-full h-full p-4">
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Make Payment
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                you can make payments for fines through mpesa
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}></form>
          </div>
        </div>
      </div>
    </div>
  );
}

Fines.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
