import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { user } from "../../src/pages/dashboard/users";
import { Error } from "../../types/types";
import ErrorMessage from "../extras/error";
import Success from "../extras/success";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Radio from "../utils/radio";
import Select from "../utils/select";

type Props = {
  user: user | null;
  token: string | null;
};

export default function EditUser({ user, token }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  const initialState = {
    role: user?.role,
    firstName: user?.name?.split(" ")[0],
    secondName: user?.name?.split(" ")[1],
    nationalId: user?.nationalId,
    dateOfBirth: user?.dob,
    email: user?.email,
    phoneNumber: user?.phone,
    gender: user?.gender,
  };

  const router = useRouter();

  const addUser = (values: any) => {
    setLoading(true);
    axios
      .put(
        `/api/users/edit-user?user_id=${user?.id}`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setErrors([]);
        if (!response.data.data) {
          setErrors([...response.data.errors]);
        } else {
          setSuccess(true);
          setTimeout(() => {
            router.reload();
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        error.response.data.errors && error.response.data.errors.length > 0
          ? setErrors([...error.response.data.errors])
          : setErrors([
              {
                message: "something unexpected happened try again later",
              },
            ]);
      });
  };

  const { values, handleChange, handleSubmit } = useForm(initialState, addUser);
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
        <TextInput
          handleChange={handleChange}
          value={values.firstName}
          name="firstName"
          type="text"
          label="first name"
        />
        <TextInput
          handleChange={handleChange}
          value={values.secondName}
          name="secondName"
          type="text"
          label="second name"
        />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-1 gap-y-5">
        <TextInput
          handleChange={handleChange}
          value={values.dateOfBirth}
          name="dateOfBirth"
          type="date"
          label="date of birth "
          className="col-span-2"
        />
        <TextInput
          handleChange={handleChange}
          value={values.nationalId}
          name="nationalId"
          type="text"
          label="national id"
        />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-1 gap-y-5">
        <TextInput
          handleChange={handleChange}
          value={values.phoneNumber}
          name="phoneNumber"
          type="tel"
          label="mobile number"
        />
        <TextInput
          handleChange={handleChange}
          value={values.email}
          name="email"
          type="email"
          label="email "
          className=" col-span-1 md:col-span-2"
        />
      </div>
      <div className="flex flex-col py-1 gap-y-2 ">
        <p className="text-gray-700 font-bold text-sm">gender</p>
        <div className="flex gap-x-2 ">
          <Radio
            handleChange={handleChange}
            checked={values.gender === "male"}
            value="male"
            label="male"
            name="gender"
          />
          <Radio
            handleChange={handleChange}
            checked={values.gender === "female"}
            value="female"
            label="female"
            name="gender"
          />
          <Radio
            handleChange={handleChange}
            checked={values.gender === "other"}
            value="other"
            label="other"
            name="gender"
          />
        </div>
      </div>

      <Select
        handleChange={handleChange}
        label="user's role"
        name="role"
        value={values.role}
        options={["judge", "lawyer", "police", "admin", "citizen"]}
      />
      <Button text="edit user" type="submit" loading={loading} />
      <ErrorMessage errors={errors} />
      <Success message="succesfully added user" success={success} />
    </form>
  );
}
