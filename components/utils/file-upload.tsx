import Image from "next/image";
import React, { useState } from "react";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import { AiFillFileWord, AiFillFileExcel, AiFillFilePdf } from "react-icons/ai";

type Props = {
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
};

export type ErrorMessage = {
  message: string;
};

export default function Fileupload({ files, setFiles }: Props) {
  const [error, setError] = useState<Error[]>([]);
  const [success, setSuccess] = useState(false);
  function handleFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target;
    if (!selectedFile.files) {
      setError([
        {
          message: "no files chosen",
        },
      ]);
      return;
    }

    if (selectedFile.files.length === 0) {
      setError([
        {
          message: "file list is empty",
        },
      ]);
      return;
    }

    const files = selectedFile.files;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      validFiles.push(file);
    }

    if (!validFiles.length) {
      setError([{ message: `No valid files were chosen"` }]);

      return;
    }

    setFiles(validFiles);
    setError([]);
    //reset file input
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";
  }
  return (
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
                onChange={handleFileUploadChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">pdf, word, excel up to 20MB</p>
        </div>
      </div>
      <div className="w-full grid grid-cols-5 gap-x-2 text-green-800 font-medium text-xs">
        {files?.map((file, index) => {
          let type = !file.type.split("ml.")[1]
            ? file.type.split("/")[1]
            : file.type.split("ml.")[1];

          return (
            <span
              key={index}
              className="w-full  flex items-center justify-center mt-2"
            >
              {type === "document" && (
                <span className=" flex items-center justify-center gap-x-2  text-blue-500">
                  <AiFillFileWord className="w-5 h-5" />
                  <p className="truncate">{truncate(file.name, 15)} </p>
                </span>
              )}
              {type === "pdf" && (
                <span className="flex items-center justify-center  gap-x-3   text-red-900 ">
                  <AiFillFilePdf />
                  <p className="truncate">{truncate(file.name, 15)} </p>
                </span>
              )}
              {type === "sheet" && (
                <span className="flex items-center justify-center  gap-x-3  text-green-500">
                  <AiFillFileExcel className="w-5 h-5" />
                  <p className="truncate">{truncate(file.name, 15)} </p>
                </span>
              )}
            </span>
          );
        })}
      </div>
      <ErrorMessage errors={error} />
    </div>
  );
}

export function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}
