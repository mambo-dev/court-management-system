import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import Fileupload from "../utils/file-upload";
import TextInput from "../utils/input";
import Radio from "../utils/radio";
import SearchUser from "../utils/search-box";

type Props = {
  token: string;
  setOpenPanel: any;
};

export default function NewCase({ token, setOpenPanel }: Props) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [plaintiff, setPlaintiff] = useState<any>({
    full_name: "select plaintiff",
  });
  const [defendant, setDefendant] = useState<any>({
    full_name: "select defendant",
  });
  const [judge, setJudge] = useState<any>({
    full_name: "select judge",
  });
  const [lawyer, setLawyer] = useState<any>({
    full_name: "select lawyer",
  });
  const [openPlaintMenu, setOpenPlaintMenu] = useState(false);
  const [openDefMenu, setOpenDefMenu] = useState(false);
  const [openJudMenu, setOpenJudMenu] = useState(false);
  const [openLawMenu, setOpenLawMenu] = useState(false);
  const router = useRouter();
  const [values, setValues] = useState<any>({
    case_name: "",
    case_desc: "",
    case_hearing_date: "",
    case_status: "open",
  });

  const handleUploadToServer = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    //@ts-ignore
    if (files?.length <= 0) {
      setErrors([
        {
          message: "no file chosen",
        },
      ]);
      return;
    }
    try {
      let formData = new FormData();
      Object.keys(values).forEach((value) => {
        console.log(value, values[value]);
        formData.append(value, values[value]);
      });

      formData.append("case_judge_id", judge.id);
      formData.append("case_lawyer_id", lawyer.id);
      formData.append("case_plaint_id", plaintiff.id);
      formData.append("case_defend_id", defendant.id);

      files?.forEach((file) => {
        formData.append("media", file);
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/cases/new-case`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const {
        data,
        error,
      }: {
        data: {
          url: string | string[];
        } | null;
        error: string | null;
      } = await res.data;

      if (error || !data) {
        setErrors([
          {
            message: error || "Sorry! something went wrong.",
          },
        ]);
        return;
      }
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setOpenPanel(false);
      }, 1000);
      setTimeout(() => {
        setOpenPanel(false);
        router.reload();
      }, 2000);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrors([
        {
          message: "we are sorry unexpected error occured",
        },
      ]);
    }
  };

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full flex flex-col gap-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TextInput
          handleChange={handleChange}
          label="case name"
          name="case_name"
          placehodler="e.g the people v henry"
          type="text"
          value={values.case_name}
        />

        <TextInput
          handleChange={handleChange}
          label="case start date"
          name="case_hearing_date"
          type="date"
          value={values.case_hearing_date}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="relative">
          <label className="ml-auto text-sm text-slate-900 font-bold">
            {" "}
            plaintiff{" "}
          </label>
          <button
            className="w-full bg-gray relative  inline-flex items-center justify-between  border py-2 px-2 font-medium text-slate-800 border-slate-300 rounded outline-none"
            type="button"
            onClick={() => setOpenPlaintMenu(!openPlaintMenu)}
          >
            {plaintiff?.full_name}
            <ChevronUpDownIcon className="w-5 h-5" />
          </button>
          {openPlaintMenu && (
            <SearchUser
              token={token}
              selectedUser={plaintiff}
              setSelectedUser={setPlaintiff}
              setOpenMenu={setOpenPlaintMenu}
            />
          )}
        </div>
        <div className="relative">
          <label className="ml-auto text-sm text-slate-900 font-bold">
            {" "}
            defendant{" "}
          </label>
          <button
            className="w-full bg-gray relative  inline-flex items-center justify-between  border py-2 px-2 font-medium text-slate-800 border-slate-300 rounded outline-none"
            type="button"
            onClick={() => setOpenDefMenu(!openDefMenu)}
          >
            {defendant?.full_name}
            <ChevronUpDownIcon className="w-5 h-5" />
          </button>
          {openDefMenu && (
            <SearchUser
              token={token}
              selectedUser={defendant}
              setSelectedUser={setDefendant}
              setOpenMenu={setOpenDefMenu}
            />
          )}
        </div>
        <div className="relative">
          <label className="ml-auto text-sm text-slate-900 font-bold">
            {" "}
            lawyer{" "}
          </label>
          <button
            className="w-full bg-gray relative  inline-flex items-center justify-between  border py-2 px-2 font-medium text-slate-800 border-slate-300 rounded outline-none"
            type="button"
            onClick={() => setOpenLawMenu(!openLawMenu)}
          >
            {lawyer?.full_name}
            <ChevronUpDownIcon className="w-5 h-5" />
          </button>
          {openLawMenu && (
            <SearchUser
              token={token}
              selectedUser={lawyer}
              setSelectedUser={setLawyer}
              setOpenMenu={setOpenLawMenu}
            />
          )}
        </div>
        <div className="relative">
          <label className="ml-auto text-sm text-slate-900 font-bold">
            {" "}
            judge{" "}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TextInput
          handleChange={handleChange}
          label="case description"
          name="case_desc"
          type="text"
          textArea
          value={values.case_desc}
        />

        <div className="flex flex-col py-1 gap-y-2 ">
          <p className="text-gray-700 font-bold text-sm">
            status (open by default when creating new case)
          </p>
          <div className="flex gap-x-2 mt-auto mb-auto">
            <Radio
              handleChange={handleChange}
              checked
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
              disabled
            />
          </div>
        </div>
      </div>
      <Fileupload files={files} setFiles={setFiles} />
      <div className="flex item-center justify-end">
        <div className="w-36">
          <Button
            type="button"
            text="save"
            loading={loading}
            onClick={handleUploadToServer}
          />
        </div>
      </div>
      <Success message="succesfully created case" success={success} />
      <ErrorMessage errors={errors} />
    </form>
  );
}
