import {
  ArrowUturnLeftIcon,
  ChevronUpDownIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ErrorMessage from "../../../components/extras/error";
import Success from "../../../components/extras/success";
import useForm from "../../../components/hooks/form";
import DashboardLayout from "../../../components/layout/dashboard";
import Button from "../../../components/utils/button";
import TextInput from "../../../components/utils/input";
import Radio from "../../../components/utils/radio";
import SearchCase from "../../../components/utils/search-case";
import Select from "../../../components/utils/select";
import prisma from "../../../lib/prisma";
import { DecodedToken, Error } from "../../../types/types";

type Props = {
  data: Data;
};

export default function Hearings({ data }: Props) {
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
    case_id: 0,
    hearing_date: "",
    hearing_location: "",
    hearing_outcome: "",
    hearing_status: "continuing",
  };
  const submitHearing = async (values: any) => {
    setLoading(true);
    setErrors([]);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/hearings/make-judgement`,

        {
          ...values,
          hearing_date: new Date(values.hearing_date),
          hearing_case_id: selectedCase.case_id,
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
        data: {
          url: string | string[];
        } | null;
        errors: Error[] | [];
      } = await res.data;

      if (serverErrors || !data) {
        setLoading(false);
        setErrors([...serverErrors]);
        return;
      }
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
  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    submitHearing
  );

  const canCreate = user?.login_role === "judge";

  if (!canCreate) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <div className="w-fit h-fit py-2 px-1 flex items-center justify-center flex-col gap-y-2">
          <NoSymbolIcon className="w-10 h-10 text-red-600 font-bold" />
          <p className="text-slate-900 font-semibold ">forbidden</p>
          <p className="text-slate-800 font-medium text-sm">
            You have insufficient permissions to view this module
          </p>
          <div className="w-fit">
            <Link href="/dashboard">
              <Button
                type="button"
                text="dashboard"
                icon={<ArrowUturnLeftIcon className="w-5 h-5" />}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Make Judgement
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                you can view the hearings in the cases module case{" "}
                <Link href="/dashboard/cases">
                  <strong className="text-blue-400 hover:underline ">
                    details
                  </strong>
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 relative gap-y-2 flex flex-col">
                      <label className="mr-auto text-sm text-slate-900 font-bold">
                        case
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

                    <div className="col-span-6 sm:col-span-3">
                      <Select
                        value={values.hearing_status}
                        handleChange={handleChange}
                        label="hearing_status"
                        name="hearing_status"
                        options={["continuing", "final"]}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6">
                      <TextInput
                        handleChange={handleChange}
                        value={values.hearing_outcome}
                        label="hearing outcome"
                        name="hearing_outcome"
                        textArea
                        type=""
                        placehodler="the court decided..."
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <TextInput
                        handleChange={handleChange}
                        value={values.hearing_date}
                        label="hearing date"
                        name="hearing_date"
                        type="date"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="flex flex-col py-1 gap-y-2 ">
                        <p className="text-gray-700 font-bold text-sm">
                          location
                        </p>
                        <div className="flex gap-x-2 mt-auto mb-auto">
                          <Radio
                            handleChange={handleChange}
                            checked={values.hearing_location === "virtual"}
                            value="virtual"
                            label="virtual"
                            name="hearing_location"
                          />
                          <Radio
                            handleChange={handleChange}
                            checked={values.hearing_location === "physical"}
                            value="physical"
                            label="physical"
                            name="hearing_location"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-2">
                  {" "}
                  <Success message="created hearings" success={success} />
                  <ErrorMessage errors={errors} />
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6  w-full ">
                  <div className="w-fit mr-auto">
                    <Button
                      text="save hearing"
                      loading={loading}
                      type="submit"
                    />
                  </div>
                </div>
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

Hearings.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
