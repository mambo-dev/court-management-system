import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";
import Loading from "../extras/loading";

type Props = {
  default?: boolean;
  error?: boolean;
  text: string;
  type: "button" | "submit" | undefined | "reset";
  positive?: boolean;
  dark?: boolean;
  icon?: any;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
}: Props) {
  if (error) {
    return (
      <button
        className="p-2 w-full shadow rounded-md inline-flex items-center justify-center "
        type={type}
      >
        {text}
      </button>
    );
  }

  if (positive) {
    return (
      <button
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
