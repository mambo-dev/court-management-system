import axios from "axios";
import React, { useState } from "react";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Radio from "../utils/radio";
import Select from "../utils/select";

type Props = {
  token: string;
};

export default function NewCase({ token }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [fetchUser, setFetchUser] = useState(false);
  const submitCase = () => {};
  const initialState = {
    case_name: "",
    case_desc: "",
    case_hearing_date: "",
    case_status: "open",
    case_plaintiff: "",
    case_defendant: "",
    case_judge: "",
    case_lawyer: "",
  };
  const { handleChange, handleSubmit, values } = useForm(
    initialState,
    submitCase
  );
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TextInput
          handleChange={handleChange}
          label="case name"
          name="case_name"
          placehodler="e.g the people v henry"
          type="text"
          value={values.case_name}
        />

        <TextInput
          handleChange={handleChange}
          label="case start date"
          name="case_hearing_date"
          type="date"
          value={values.case_hearing_date}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Select
          handleChange={handleChange}
          label="plaintiff"
          name="case_plaintiff"
          onClick={() => {
            setFetchUser(true);
            setTimeout(() => {
              setFetchUser(false);
            }, 3000);
            setUsers(fetchUsers("citizen", token));
          }}
          value={values.case_plaintiff}
          options={[
            `${fetchUser ? "loading..." : "select plaintiff"}`,
            ...users,
          ]}
        />
        <Select
          handleChange={handleChange}
          label="defendant"
          name="case_defendant"
          onClick={() => {
            setFetchUser(true);
            setTimeout(() => {
              setFetchUser(false);
            }, 3000);
            setUsers(fetchUsers("citizen", token));
          }}
          value={values.case_defendant}
          options={[
            `${fetchUser ? "loading..." : "select defendant"}`,
            ...users,
          ]}
        />

        <Select
          handleChange={handleChange}
          label="judge"
          name="case_judge"
          onClick={() => {
            setFetchUser(true);
            setTimeout(() => {
              setFetchUser(false);
            }, 3000);
            setUsers(fetchUsers("judge", token));
          }}
          value={values.case_judge}
          options={[`${fetchUser ? "loading..." : "select judge"}`, ...users]}
        />
        <Select
          handleChange={handleChange}
          label="lawyer"
          name="case_lawyer"
          onClick={() => {
            setFetchUser(true);
            setTimeout(() => {
              setFetchUser(false);
            }, 3000);
            setUsers(fetchUsers("lawyer", token));
          }}
          value={values.case_lawyer}
          options={[`${fetchUser ? "loading..." : "select lawyer"}`, ...users]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TextInput
          handleChange={handleChange}
          label="case description"
          name="case_desc"
          type="text"
          textArea
          value={values.case_desc}
        />

        <div className="flex flex-col py-1 gap-y-2 ">
          <p className="text-gray-700 font-bold text-sm">
            status (open by default when creating new case)
          </p>
          <div className="flex gap-x-2 mt-auto mb-auto">
            <Radio
              handleChange={handleChange}
              checked
              value="open"
              label="open"
              name="case_status"
            />
            <Radio
              handleChange={handleChange}
              checked={values.case_status === "closed"}
              value="closed"
              label="closed"
              name="case_status"
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex item-center justify-end">
        <div className="w-24">
          <Button type="submit" text="save" />
        </div>
      </div>
    </form>
  );
}

const fetchUsers = (user_type: string, token: string) => {
  let users: any[] = [];
  axios
    .get(
      `${process.env.NEXT_PUBLIC_URL}/api/users/get-users?user_type=${user_type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      if (!response.data.data) {
        return [];
      }
      const getUsers = response.data.data?.map((user: any) => {
        switch (user.login_role) {
          case "citizen":
            return {
              id: user.login_id,
              name: user?.Citizen.citizen_full_name,
            };
          case "judge":
            return {
              id: user.login_id,
              name: user?.Judge.judge_full_name,
            };
          case "lawyer":
            return {
              id: user.login_id,
              name: user?.Lawyer.lawyer_full_name,
            };

          default:
            return {};
        }
      });

      users.push(getUsers);
    })
    .catch((error) => {
      console.log(error);
    });

  return [...users[0]];
};
