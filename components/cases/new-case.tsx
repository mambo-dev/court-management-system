import axios from "axios";
import React, { useEffect, useState } from "react";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import Fileupload from "../utils/file-upload";
import TextInput from "../utils/input";
import Radio from "../utils/radio";

type Props = {
  token: string;
};

export default function NewCase({ token }: Props) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const submitCase = async (values: any) => {
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
      Object.keys(values).map((value) => {
        formData.append(value, values[value]);
      });

      files?.map((file) => {
        formData.append("media", file);
      });

      console.log(formData);

      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/cases/new-case`,

        {
          formData,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data) {
        setSuccess(true);
        setErrors([]);
      }
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
  const initialState = {
    case_name: "",
    case_desc: "",
    case_hearing_date: "",
    case_status: "open",
  };
  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    submitCase
  );

  useEffect(() => {}, []);

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-5">
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
          <Button type="submit" text="save" loading={loading} />
        </div>
      </div>
      <Success message="succesfully created case" success={success} />
      <ErrorMessage errors={errors} />
    </form>
  );
}
