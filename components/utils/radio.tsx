import React, { ChangeEvent } from "react";

type Radio = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  checked: boolean;
  value: any;
  label: string;
  name: string;
};

export default function Radio({
  label,
  handleChange,
  checked,
  value,
  name,
}: Radio) {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <input
        value={value}
        onChange={handleChange}
        checked={checked}
        name={name}
        type="radio"
        className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-200 "
      />
      <label
        htmlFor="push-everything"
        className=" text-sm font-bold  text-gray-700"
      >
        {label}
      </label>
    </div>
  );
}
