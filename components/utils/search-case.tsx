import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/debounce";
import TextInput from "./input";

type Props = {
  token: string;
  selectedCase: any;
  setSelectedCase: any;
  setOpenMenu: any;
};

export default function SearchCase({
  token,
  selectedCase,
  setSelectedCase,
  setOpenMenu,
}: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);

  const debouncedSearch = useDebounce(query, 500);
  useEffect(() => {
    if (debouncedSearch) {
      setLoading(true);
      axios
        .get(`/api/cases/get-cases?query=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setCases(response.data.data);
          console.log(response.data.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [debouncedSearch, query, token]);
  return (
    <div className="absolute top-full  z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
      <div className="w-full px-2">
        <input
          className="border-b-2 py-2 px-2 border-gray-700 focus:border-green-700 outline-none w-full placeholder:font-medium "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search case"
        />
      </div>
      {query.length > 0 &&
        (loading ? (
          <ul className="px-4 mt-3 w-full text-gray-800 font-medium flex items-center justify-center">
            loading...
          </ul>
        ) : (
          <ul className="w-full mt-3 ">
            {cases.length > 0 ? (
              cases?.map((singleCase: any) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedCase(singleCase);
                      setOpenMenu(false);
                    }}
                    className="outline-none px-4 w-full inline-flex items-center justify-center gap-x-4 py-2 hover:bg-cyan-100 hover:text-cyan-900 font-medium"
                    key={singleCase?.case_id}
                  >
                    {singleCase?.case_name}{" "}
                    <span className="text-green-600 text-sm">
                      started on{" "}
                      {format(
                        new Date(`${singleCase?.case_hearing_date}`),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </button>
                );
              })
            ) : (
              <button
                onClick={() => {
                  setOpenMenu(false);
                }}
                className="outline-none px-4 w-full inline-flex items-center justify-center gap-x-4 py-2 hover:bg-cyan-100 hover:text-cyan-900 font-medium"
              >
                sorry no cases was found
              </button>
            )}
          </ul>
        ))}
    </div>
  );
}
