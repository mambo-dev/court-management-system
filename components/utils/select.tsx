import React, { ChangeEvent } from "react";

type Select = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  value: string | number;
  label: string;
  name: string;
  options: string[];
};

export default function Select({
  handleChange,
  value,
  label,
  name,
  options,
}: Select) {
  return (
    <div className="flex flex-col w-full gap-y-2">
      <label className="text-sm text-teal-900 font-bold">{label}</label>
      <select
        id={name}
        name={name}
        onChange={handleChange}
        value={value}
        autoComplete="country-name"
        className=" py-2 px-1 rounded bg-white  border border-gray-300 focus:outline-none focus:ring-2 focus:border-teal-200 focus:shadow-sm focus:shadow-teal-200  focus:ring-teal-100 "
      >
        {options.map((country: string, index: number) => (
          <option key={index}> {country} </option>
        ))}
      </select>
    </div>
  );
}
