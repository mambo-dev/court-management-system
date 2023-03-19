import { XMarkIcon } from "@heroicons/react/24/outline";
import { Case } from "@prisma/client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { HearingWithCaseAndUsers } from "../../src/pages/dashboard/proceeds";
import Cookies from "js-cookie";
import "react-quill/dist/quill.snow.css";

import dynamic from "next/dynamic";
import Button from "../utils/button";
import { Error } from "../../types/types";
import { useRouter } from "next/router";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  setOpenNotesModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentHearing: HearingWithCaseAndUsers | null;
};

export default function CaseNotes({
  setOpenNotesModal,
  currentHearing,
}: Props) {
  const [warning, setWarning] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedNote = Cookies.get("notes");

    if (savedNote) {
      setNotes(savedNote);
    }
  }, []);

  useEffect(() => {
    function saveNoteToCookies() {
      Cookies.set("notes", notes, {
        expires: 1,
        secure: process.env.NODE_ENV !== "development",
        domain: "localhost",
        sameSite: "Strict",
      });
    }

    const timeoutId = setTimeout(() => {
      saveNoteToCookies();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notes]);

  const handleChange = (value: string) => {
    setNotes(value);
  };

  async function saveNoteToServer() {
    setLoading(true);
    setErrors([]);
    try {
      const response = await axios.post("/api/cases/notes", {
        notes,
        hearing_id: currentHearing?.hearing_id,
      });
      const {
        data,
        errors: serverErrors,
      }: {
        data: boolean;
        errors: Error[] | [];
      } = await response.data;

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
  }
  return (
    <div className="w-full h-screen px-2 py-2">
      <div className="w-full flex items-center justify-end">
        <button
          onClick={() =>
            setWarning(
              "make sure changes are saved before exiting!! double click the close button to close"
            )
          }
          onDoubleClick={() => setOpenNotesModal(false)}
          className="outline-none focus:ring-1 ring-gray-300 ml-auto bg-gradient-to-tr from-black  to-gray-500  w-10 h-10 inline-flex items-center justify-center text-white rounded-full"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
      </div>
      {warning.length > 0 && (
        <div className="w-fit mx-auto">
          <span className="text-red-500 font-bold text-sm">{warning}</span>
        </div>
      )}
      <div className="w-full">
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex flex-col  px-2">
            <span className="font-bold text-slate-800">Presiding judge</span>{" "}
            <span className="text-sm font-light">
              {currentHearing?.hearing_case.case_judge.judge_full_name}{" "}
            </span>
          </div>
          <div className="flex flex-col  px-2">
            <span className="font-bold text-slate-800">Case name</span>{" "}
            <span className="text-sm font-light">
              {currentHearing?.hearing_case.case_name}{" "}
            </span>
          </div>
          <div className="flex flex-col  px-2">
            <span className="font-bold text-slate-800">case status</span>{" "}
            <span>{currentHearing?.hearing_case.case_status} </span>
          </div>
          <div className="flex flex-col  px-2">
            <span className="font-bold text-slate-800">lawyer in charge</span>{" "}
            <span className="text-sm font-light">
              {currentHearing?.hearing_case.case_lawyer.lawyer_full_name}
            </span>
          </div>
        </div>
        <div className="w-full mt-3">
          <ReactQuill
            value={notes}
            onChange={handleChange}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],

                ["clean"],
              ],
            }}
            className="h-full flex-1  rounded-md shadow w-full"
          />
        </div>
        <div className="w-fit ml-auto mt-3">
          <Button
            onClick={() => saveNoteToServer()}
            type="button"
            loading={loading}
            text="save notes"
          />
        </div>
      </div>
      <div className="w-fit mx-auto">
        <ErrorMessage errors={errors} />
        <Success message="notes have been saved" success={success} />
      </div>
    </div>
  );
}
