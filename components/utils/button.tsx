import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";
import Loading from "../extras/loading";

type Props = {
  default?: boolean;
  error?: boolean;
  edit?: boolean;
  text?: string;
  type: "button" | "submit" | undefined | "reset";
  positive?: boolean;
  dark?: boolean;
  icon?: any;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  expand?: boolean;
  exportBtn?: boolean;
};

export default function Button({
  type,
  error,
  text,
  positive,
  dark,
  icon,
  loading,
  onClick,
  edit,
  expand,
  exportBtn,
}: Props) {
  if (exportBtn) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="  py-2 px-3 rounded-md shadow font-bold bg-green-300 text-green-900 inline-flex outline-none items-center justify-center gap-x-2 hover:ring-1 focus:ring-2  ring-green-400 ring-opacity-50 focus:border focus:border-green-500 ring-offset-1  "
      >
        {loading ? (
          <Loading borderColor="border-green-900" />
        ) : (
          <DocumentArrowDownIcon className="w-5 h-5 font-bold" />
        )}
        {loading ? "exporting..." : "export"}
      </button>
    );
  }

  if (error) {
    return (
      <button
        onClick={onClick}
        className="py-2 px-1 w-full shadow rounded-md inline-flex items-center justify-center gap-x-2 bg-red-100 text-red-600 hover:bg-red-200 focus:bg-red-200  font-medium hover:ring-1 focus:ring-2  ring-red-400 ring-opacity-50 focus:border focus:border-red-500  "
        type={type}
      >
        {icon}
        {text}
      </button>
    );
  }
  if (expand) {
    return (
      <button
        onClick={onClick}
        className="py-2 px-1 w-full shadow rounded-md inline-flex items-center justify-center gap-x-2 bg-gray-100 text-slate-600 hover:bg-gray-200 focus:bg-gray-200  font-medium hover:ring-1 focus:ring-2  ring-gray-400 ring-opacity-50 focus:border focus:border-gray-500  "
        type={type}
      >
        {icon}
        {text}
      </button>
    );
  }

  if (edit) {
    return (
      <button
        onClick={onClick}
        className="py-2 px-1 w-full shadow rounded-md inline-flex items-center justify-center gap-x-2 bg-blue-100 text-blue-600 hover:bg-blue-200 focus:bg-blue-200  font-medium hover:ring-1 focus:ring-2  ring-blue-400 ring-opacity-50 focus:border focus:border-blue-500  "
        type={type}
      >
        {icon}
        {text}
      </button>
    );
  }

  if (positive) {
    return (
      <button
        onClick={onClick}
        className="p-2 w-full shadow rounded-md inline-flex items-center justify-center "
        type={type}
      >
        {text}
      </button>
    );
  }

  if (dark) {
    return (
      <button
        onClick={onClick}
        className="p-2 w-full shadow rounded-md inline-flex items-center justify-center "
        type={type}
      >
        {text}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="py-2 px-3 hover:bg-opacity-70 focus:bg-black/80  w-full shadow rounded-md inline-flex items-center justify-center gap-x-2 bg-black text-white font-medium"
      type={type}
    >
      {loading ? <Loading /> : icon}
      {loading ? "loading..." : text}
    </button>
  );
}
