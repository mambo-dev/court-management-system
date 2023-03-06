import React from "react";

type Props = {
  percentage: number;
  title: string;
  totals: number;
  secondaryTitle: string;
};

export default function DataDisp({
  percentage,
  title,
  secondaryTitle,
  totals,
}: Props) {
  return (
    <div className="w-full h-full bg-white rounded shadow border border-slate-300 flex items-center justify-center px-2 py-4">
      <div className="flex-1 flex flex-col gap-y-2">
        <span className="text-lg font-semibold text-slate-800">{title}</span>
        <span className="font-bold text-slate-700"> {totals}</span>
        <span className="font-medium text-sm text-slate-500">
          {secondaryTitle}
        </span>
      </div>
      <div className="flex items-center justify-center gap-y-2">
        <div
          className={`w-24 h-24 shadow-md  rounded-full border-[10px] ${
            percentage >= 70
              ? "border-green-500 bg-green-200 shadow-green-200"
              : percentage >= 50
              ? "border-yellow-500 bg-yellow-200 shadow-yellow-200"
              : "border-red-500 bg-red-200 shadow-red-200"
          } text-xl flex items-center justify-center font-bold text-slate-700`}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
}
