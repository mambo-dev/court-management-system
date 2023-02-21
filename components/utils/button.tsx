import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Props = {
  default?: boolean;
  error?: boolean;
  text: string;
  type: "button" | "submit" | undefined | "reset";
  positive?: boolean;
  dark?: boolean;
  icon?: any;
};

export default function Button({
  type,
  error,
  text,
  positive,
  dark,
  icon,
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
      className="p-2 w-full shadow rounded-md inline-flex items-center justify-center "
      type={type}
    >
      {icon}
      {text}
    </button>
  );
}
