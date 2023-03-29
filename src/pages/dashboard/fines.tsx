import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";

import { useRouter } from "next/router";
import React, { useState } from "react";
import ErrorMessage from "../../../components/extras/error";
import Success from "../../../components/extras/success";
import useForm from "../../../components/hooks/form";
import DashboardLayout from "../../../components/layout/dashboard";
import Button from "../../../components/utils/button";
import TextInput from "../../../components/utils/input";
import SearchCase from "../../../components/utils/search-case";
import prisma from "../../../lib/prisma";
import { DecodedToken, Error } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Fines({ data }: Props) {
  const { token, user } = data;
  const [openCaseMenu, setOpenCaseMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();
  const [selectedCase, setSelectedCase] = useState({
    case_id: 0,
    case_name: "select related case",
  });
  const initialState = {
    payment_amount: 0,
  };
  const submitAxios = async (values: any) => {
    setLoading(true);
    setErrors([]);
    try {
      const res = await axios.post(
        `/api/payments/payment`,

        {
          ...values,
          payment_case_id: selectedCase.case_id,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const {
        data,
        errors: serverErrors,
      }: {
        data: boolean | null;
        errors: Error[] | [];
      } = await res.data;

      if (serverErrors.length > 0 || !data) {
        setLoading(false);
        setErrors([...serverErrors]);
        return;
      }
      console.log(success);
      setSuccess(true);
      setErrors([]);
      setTimeout(() => {
        setSuccess(false);
      }, 1000);
      setTimeout(() => {
        router.reload();
      }, 2000);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      error.response?.data.errors && error.response.data.errors.length > 0
        ? setErrors([...error.response.data.errors])
        : setErrors([
            {
              message: "something unexpected happened try again later",
            },
          ]);
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 2000);
    }
  };
  const { handleSubmit, handleChange, values } = useForm(
    initialState,
    submitAxios
  );
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
            <form
              onSubmit={handleSubmit}
              className="bg-white w-full h-full py-4 px-4 gap-y-2 rounded border border-slate-300 shadow"
            >
              <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-3 ">
                <div className="md:col-span-2 relative gap-y-2 flex flex-col">
                  <label className="mr-auto text-sm text-slate-900 font-bold">
                    fine for case
                  </label>
                  <button
                    className="w-full bg-gray relative  inline-flex items-center justify-between  border py-2 px-2 font-medium text-slate-800 border-slate-300 rounded outline-none"
                    type="button"
                    onClick={() => setOpenCaseMenu(!openCaseMenu)}
                  >
                    {selectedCase?.case_name}
                    <ChevronUpDownIcon className="w-5 h-5" />
                  </button>
                  {openCaseMenu && (
                    <SearchCase
                      token={token}
                      selectedCase={selectedCase}
                      setSelectedCase={setSelectedCase}
                      setOpenMenu={setOpenCaseMenu}
                    />
                  )}
                </div>
                <div className="w-full">
                  <TextInput
                    handleChange={handleChange}
                    value={values.payment_amount}
                    label="payment amount"
                    name="payment_amount"
                    type="number"
                  />
                </div>
              </div>
              <div className="w-full mt-2">
                <Success message="payment done succesfully" success={success} />
                <ErrorMessage errors={errors} />
              </div>
              <div className="w-fit ml-auto mt-2">
                <Button text="submit payment" loading={loading} type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
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

  return {
    props: {
      data: {
        token: access_token,
        user,
      },
    },
  };
};

Fines.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
