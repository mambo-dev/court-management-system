import { XMarkIcon } from "@heroicons/react/24/outline";
import { Case } from "@prisma/client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { HearingWithCaseAndUsers } from "../../src/pages/dashboard/proceeds";
import Cookies from "js-cookie";
import "react-quill/dist/quill.snow.css";

import dynamic from "next/dynamic";

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
    try {
      const response = await axios.post("/api/cases/notes", {
        notes,
        hearing_id: currentHearing?.hearing_id,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
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
          className="outline-none focus:ring-1 ring-emerald-300 ml-auto bg-gradient-to-tr from-emerald-500 to-emerald-600 w-10 h-10 inline-flex items-center justify-center text-white rounded-full"
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
      </div>
    </div>
  );
}
