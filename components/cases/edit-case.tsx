import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SingleCase } from "../../src/pages/dashboard/cases";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import Fileupload from "../utils/file-upload";
import TextInput from "../utils/input";
import Radio from "../utils/radio";
import SearchUser from "../utils/search-user";

type Props = {
  token: string;
  setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCase: SingleCase;
};

export default function NewCase({ token, setOpenPanel, selectedCase }: Props) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const router = useRouter();
  const [values, setValues] = useState<any>({
    case_name: selectedCase.case_name,
    case_desc: selectedCase.case_description,
    case_hearing_date: selectedCase.case_hearing_date,
    case_status: selectedCase.case_status,
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

      files?.forEach((file) => {
        formData.append("media", file);
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/cases/edit-case?case_id=${selectedCase.case_id}`,

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
      <Fileupload files={files} setFiles={setFiles} />
      <div className="flex item-center justify-end">
        <div className="w-36">
          <Button
            type="button"
            text="update"
            loading={loading}
            onClick={handleUploadToServer}
          />
        </div>
      </div>
      <Success message="succesfully updated case" success={success} />
      <ErrorMessage errors={errors} />
    </form>
  );
}
