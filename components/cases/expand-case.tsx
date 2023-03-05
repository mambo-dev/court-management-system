import {
  PaperClipIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { SingleCase } from "../../src/pages/dashboard/cases";

type Props = {
  setOpenDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCase: SingleCase | null;
};

export default function ExpandCase({
  selectedCase,
  setOpenDetailsModal,
}: Props) {
  return (
    <div className="overflow-auto w-full ">
      <div className="flex items-center justify-between ">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Case Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            full case details
          </p>
        </div>
        <button
          onClick={() => setOpenDetailsModal(false)}
          className="outline-none mr-3 group "
        >
          <XMarkIcon className="w-6 h-6 group-hover:w-7 group-hover:h-7 group-hover:text-red-400" />
        </button>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">case name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {selectedCase?.case_name}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">case status</dt>
            <dd
              className={`mt-1 text-sm ${
                selectedCase?.case_status === "open"
                  ? "text-green-900"
                  : "text-red-700"
              } sm:col-span-2 sm:mt-0`}
            >
              {selectedCase?.case_status}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              case starts on
            </dt>
            <dd className={`mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0`}>
              {format(
                new Date(`${selectedCase?.case_hearing_date}`),
                "dd/MM/yyyy"
              )}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              presiding judge
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {selectedCase?.case_judge.judge_full_name}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              attached lawyer
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {selectedCase?.case_lawyer.lawyer_full_name}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">defendants</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-200 rounded-md border border-gray-200"
              >
                {selectedCase?.defendant.map((def) => {
                  return (
                    <li
                      key={def.defendant_id}
                      className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <UserIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 w-0 flex-1 truncate first-letter:uppercase">
                          {def.defendant_citizen.citizen_full_name}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="font-medium text-green-600 hover:text-green-500">
                          citizen
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">plaintiffss</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-200 rounded-md border border-gray-200"
              >
                {selectedCase?.plaintiff.map((plaint) => {
                  return (
                    <li
                      key={plaint.plaintiff_id}
                      className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <UserIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 w-0 flex-1 truncate first-letter:uppercase">
                          {plaint.plaintiff_citizen.citizen_full_name}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="font-medium text-green-600 hover:text-green-500">
                          citizen
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              case description
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {selectedCase?.case_description}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Attachments</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-200 rounded-md border border-gray-200"
              >
                {selectedCase?.case_evidence.map((evidence, index) => {
                  const display = evidence.split("uploads")[1].split("\\")[2];
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 w-0 flex-1 truncate">
                          {display}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={evidence}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
