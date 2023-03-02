import axios from "axios";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/debounce";
import TextInput from "./input";

type Props = {
  handleChange: any;
  value: any;
  name: string;
  placeholder: string;
  label: string;
  setUser: any;
  token: string;
};

export default function SearchUser({
  handleChange,
  name,
  placeholder,
  label,
  value,
  setUser,
  token,
}: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const debouncedSearch = useDebounce(query, 500);
  useEffect(() => {
    if (debouncedSearch) {
      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_URL}/api/users/get-users?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          setUsers(response.data.data);
          console.log(response.data.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [debouncedSearch, query, token]);
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
      {loading ? (
        <div className="w-full absolute z-10 bg-white rounded py-2 flex items-center justify-center text-sm text-slate-600">
          <span>loading...</span>
        </div>
      ) : (
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
      )}
    </div>
  );
}
