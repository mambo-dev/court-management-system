import {
  ChevronUpDownIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Case as CaseType } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { Error } from "../../types/types";
import { exportToExcel } from "../../utils/excel";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Radio from "../utils/radio";
import SearchUser from "../utils/search-user";
import Select from "../utils/select";

type Props = {
  token: string;
  user: any;
};

export default function Cases({ token, user }: Props) {
  const [openJudMenu, setOpenJudMenu] = useState(false);
  const [judge, setJudge] = useState<any>({
    full_name: "select judge",
  });
  const [loading, setLoading] = useState(false);
  const [download, setDownLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showExportBtn, setShowExportBtn] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [cases, setCases] = useState<CaseType[] | null>([]);
  const generateReport = async () => {
    setLoading(true);
    setShowExportBtn(false);
    setErrors([]);
    try {
      const res = await axios.post(
        `/api/reports/cases`,
        {
          ...values,
          case_judge_name: judge.full_name,
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
        data: any[] | null;

        errors: Error[] | [];
      } = await res.data;

      if (serverErrors || !data) {
        setLoading(false);
        setErrors([...serverErrors]);
        return;
      }
      console.log(data);
      setCases(data);
      setSuccess(true);
      setShowExportBtn(true);
      setErrors([]);
      setTimeout(() => {
        setSuccess(false);
      }, 1000);

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
  const initialState = {
    case_from: "",
    case_to: "",
    case_judge_name: "",
    case_status: "all",
  };
  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    generateReport
  );
  let id = 0;
  console.log(user);
  return (
    <div className="w-full flex flex-col px-2 py-4">
      <div className="w-full flex items-center justify-start text-slate-800 text-xl font-medium">
        <span className=" first-letter:uppercase">cases</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2  md:gap-5">
          <TextInput
            value={values.case_from}
            handleChange={handleChange}
            label="cases from"
            name="case_from"
            type="date"
          />
          <TextInput
            value={values.case_to}
            handleChange={handleChange}
            label="cases to"
            name="case_to"
            type="date"
          />
        </div>
        <div className="grid grid-cols-1 relative">
          <label className="mr-auto text-sm text-slate-900 font-bold">
            presiding judge (if none chosen system returns all)
          </label>
          <button
            className="w-full bg-gray relative  inline-flex items-center justify-between  border py-2 px-2 font-medium text-slate-800 border-slate-300 rounded outline-none"
            type="button"
            onClick={() => setOpenJudMenu(!openJudMenu)}
          >
            {judge?.full_name}
            <ChevronUpDownIcon className="w-5 h-5" />
          </button>
          {openJudMenu && (
            <SearchUser
              token={token}
              selectedUser={judge}
              setSelectedUser={setJudge}
              setOpenMenu={setOpenJudMenu}
            />
          )}
        </div>
        <div className="grid grid-cols-1 relative">
          <div className="flex flex-col py-1 gap-y-2 ">
            <p className="text-gray-700 font-bold text-sm">status</p>
            <div className="flex gap-x-2 mt-auto mb-auto">
              <Radio
                handleChange={handleChange}
                checked={values.case_status === "open"}
                value="open"
                label="open"
                name="case_status"
              />
              <Radio
                handleChange={handleChange}
                checked={values.case_status === "closed"}
                value="closed"
                label="closed"
                name="case_status"
              />
            </div>
          </div>
        </div>
        <div
          className={`flex items-center ${
            showExportBtn ? "justify-between" : "justify-end"
          }  relative`}
        >
          {showExportBtn && (
            <div className="w-fit flex flex-col items">
              <Button
                exportBtn
                type="button"
                loading={download}
                onClick={() => {
                  exportToExcel({
                    //@ts-ignore
                    Dbdata: cases,
                    filename: `${user?.login_username}-${
                      user?.login_role
                    }${(id += 1)}-cases`,
                    filetype:
                      "application/vnd.openxmlfromats-officedocument.spreadsheetml.sheet;charset=UTF-8",
                    fileExtension: ".xlsx",
                  });
                  setDownLoad(true);
                  setTimeout(() => {
                    setDownLoad(false);
                  }, 3000);
                }}
              />
            </div>
          )}
          <div className="flex flex-col py-1 gap-y-2 w-fit ">
            <Button type="submit" text="generate" loading={loading} />
          </div>
        </div>
      </form>
      <Success message="succesfully processed reports" success={success} />
      <ErrorMessage errors={errors} />
    </div>
  );
}
