import React from "react";
import { Error } from "../../types/types";

type ErrorProps = {
  errors: Error[];
};

export default function ErrorMessage({ errors }: ErrorProps) {
  return (
    <ul
      className={`${
        errors.length < 0 && "hidden"
      }  w-fit px-1 m-auto h-fit flex flex-col items-start justify-start list-disc gap-y-2  `}
    >
      {errors.map((error: Error, index: number) => {
        return (
          <li key={index} className={`font-bold text-sm text-red-500  `}>
            {error.message}
          </li>
        );
      })}
    </ul>
  );
}
