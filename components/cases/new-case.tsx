import axios from "axios";
import React, { useEffect, useState } from "react";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Radio from "../utils/radio";

type Props = {
  token: string;
};

export default function NewCase({ token }: Props) {
  const submitCase = () => {};
  const initialState = {
    case_name: "",
    case_desc: "",
    case_hearing_date: "",
    case_status: "open",
    case_evidence: [],
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
      <div className="grid grid-cols-1  gap-2">
        <label className="block text-sm font-medium text-gray-700">
          evidence files
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">pdf, word, excel up to 20MB</p>
          </div>
        </div>
      </div>
      <div className="flex item-center justify-end">
        <div className="w-24">
          <Button type="submit" text="save" />
        </div>
      </div>
    </form>
  );
}
