import React, { ChangeEvent } from "react";

type Input = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  value: string | number;
  label: string;
  type: string;
  textArea?: boolean;
  name: string;
  className?: string;
  disabled?: boolean;
  placehodler?: string;
};

export default function TextInput({
  handleChange,
  value,
  label,
  type,
  textArea,
  name,
  className,
  disabled,
  placehodler,
}: Input) {
  if (textArea) {
    return (
      <div className="flex flex-col w-full gap-y-2">
        <label className="text-sm text-teal-900 font-bold">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          className="py-2 px-1 rounded  border border-gray-300 focus:outline-none focus:ring-2 focus:border-cyan-200 focus:shadow-sm focus:shadow-cyan-200  focus:ring-cyan-100 "
        />
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col w-full  gap-y-2`}>
      <label className="text-sm text-slate-900 font-bold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        placeholder={placehodler}
        className="py-2 disabled:bg-slate-300 placeholder:font-medium placeholder:text-slate-700 px-1 rounded  border border-gray-300 focus:outline-none focus:ring-2 focus:border-cyan-200 focus:shadow-sm focus:shadow-cyan-200  focus:ring-cyan-100 "
      />
    </div>
  );
}
