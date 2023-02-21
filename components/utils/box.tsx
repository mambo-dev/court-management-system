import React from "react";

type Props = {
  children: any;
};

export default function Box({ children }: Props) {
  return (
    <div
      className={`w-full flex flex-col items-center border border-slate-300 rounded shadow`}
    >
      {children}
    </div>
  );
}
