import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useState } from "react";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Select from "../utils/select";

type Props = {
  user: any;
  token: string;
};

export default function Feedback({ user, token }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const initialState = {
    feedback_login_id: user?.login_id,
    feedback_type: "Bug",
    feedback_details: "",
  };

  const provideFeedBack = async (values: any) => {
    setLoading(true);

    setErrors([]);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/dashboard/feedback`,
        {
          ...values,
          feedback_login_id: user?.login_id,
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

      setSuccess(true);

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

  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    provideFeedBack
  );

  return (
    <div className="h-fit mb-auto w-full flex-col col-span-3 md:col-span-1 bg-white rounded shadow border border-slate-300 flex items-center gap-y-2 px-2 py-4">
      <div className="w-full flex items-center justify-center flex-col text-slate-800 ">
        <span className="text-lg font-semibold">Feedback</span>
        <p className="text-sm font-medium">
          In case of any problem feel free to leave feedback
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full py-5 flex flex-col gap-y-4  mb-auto"
      >
        <Select
          handleChange={handleChange}
          label="type"
          name="feedback_type"
          value={values.feedback_type}
          options={["Bug", "suggestion", "compliment", "complaint"]}
        />
        <TextInput
          handleChange={handleChange}
          value={values.feedback_details}
          label="details"
          type="text"
          name="feedback_details"
        />
        <Button
          text="submit feedback"
          type="submit"
          icon={<DocumentPlusIcon className="w-5 h-5" />}
          loading={loading}
        />
      </form>
      <Success
        success={success}
        message="feedback received the admin will reach out  in case its a bug report"
      />
      <ErrorMessage errors={errors} />
    </div>
  );
}
