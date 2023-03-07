import axios from "axios";
import React, { useState } from "react";
import { Error, Users as UsersType } from "../../types/types";
import { exportToExcel } from "../../utils/excel";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Radio from "../utils/radio";
import Cases from "./cases";

type Props = {
  token: string;
  user: any;
};

export default function Users({ token, user }: Props) {
  const [loading, setLoading] = useState(false);
  const [download, setDownLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showExportBtn, setShowExportBtn] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [users, setUsers] = useState<any[] | null>([]);
  const generateReport = async () => {
    setLoading(true);
    setShowExportBtn(false);
    setErrors([]);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/reports/users`,
        {
          ...values,
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

      setUsers(data);
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
    reg_login_role: "all",
  };
  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    generateReport
  );
  let id = 0;

  return (
    <div className="w-full flex flex-col px-2 py-4">
      <div className="w-full flex items-center justify-start text-slate-800 text-xl font-medium">
        <span className=" first-letter:uppercase">users</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 relative">
          <div className="flex flex-col py-1 gap-y-2 ">
            <p className="text-gray-700 font-bold text-sm">user role</p>
            <div className="flex gap-x-2 mt-auto mb-auto flex-wrap gap-y-2">
              <Radio
                handleChange={handleChange}
                checked={
                  values.reg_login_role !== "all"
                    ? false
                    : values.reg_login_role === "all"
                }
                value="all"
                label="all users"
                name="reg_login_role"
              />
              <Radio
                handleChange={handleChange}
                checked={values.reg_login_role === "judge"}
                value="judge"
                label="judges"
                name="reg_login_role"
              />
              <Radio
                handleChange={handleChange}
                checked={values.reg_login_role === "lawyer"}
                value="lawyer"
                label="lawyers"
                name="reg_login_role"
              />
              <Radio
                handleChange={handleChange}
                checked={values.reg_login_role === "citizen"}
                value="citizen"
                label="citizens"
                name="reg_login_role"
              />
              <Radio
                handleChange={handleChange}
                checked={values.reg_login_role === "admin"}
                value="admin"
                label="admins"
                name="reg_login_role"
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
                disabled={!users ? false : users?.length <= 0}
                onClick={() => {
                  exportToExcel({
                    //@ts-ignore
                    Dbdata: users,
                    filename: `${user?.login_username}-${
                      user?.login_role
                    }${(id += 1)}-users`,
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
