import React from "react";
import TextInput from "./input";

type Props = {
  query: string;
  setQuery: any;
  users: any[];
  handleChange: any;
  value: any;
  name: string;
  placeholder: string;
  label: string;
  setUser: any;
};

export default function SearchUser({
  query,
  setQuery,
  users,
  handleChange,
  name,
  placeholder,
  label,
  value,
  setUser,
}: Props) {
  return (
    <div className="relative  w-full">
      <div className="w-full">
        <TextInput
          handleChange={(e) => setQuery(e.target.value)}
          name={name}
          label={label}
          type="text"
          value={value}
        />
      </div>
      <div className="w-full absolute z-10 bg-white rounded py-2 ">
        {query.length > 0 &&
          users?.map((user: any) => {
            return (
              <button
                key={user.id}
                onClick={() => {
                  setUser(user.id);
                  setQuery("");
                }}
                className="w-ful flex items-center justify-between px-2 py-2"
              >
                {user.full_name} {user.role}
              </button>
            );
          })}
      </div>
    </div>
  );
}
