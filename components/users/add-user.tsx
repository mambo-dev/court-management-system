import React from "react";
import useForm from "../hooks/form";
import Button from "../utils/button";
import TextInput from "../utils/input";
import Radio from "../utils/radio";

type Props = {};

export default function AddUser({}: Props) {
  const initialState = {
    username: "",
    password: "",
    role: "",
    firstName: "",
    secondName: "",
    nationalId: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    gender: "",
  };

  const addUser = (values: any) => {};

  const { values, handleChange, handleSubmit } = useForm(initialState, addUser);
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-6">
      <div className="w-full grid grid-cols-2 gap-x-2">
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
      <TextInput
        handleChange={handleChange}
        value={values.username}
        name="username"
        type="text"
        label="user name"
      />
      <TextInput
        handleChange={handleChange}
        value={values.password}
        name="password"
        type="text"
        label="password"
      />
      <div className="w-full grid grid-cols-3 gap-x-2">
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
      <div className="w-full grid grid-cols-3 gap-x-2">
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
          className="col-span-2"
        />
      </div>
      <div className="flex flex-col py-1 gap-y-2 ">
        <p className="text-gray-700 font-bold">user&apos;s role</p>
        <div className="flex gap-x-2 ">
          <Radio
            handleChange={handleChange}
            checked={values.role === "judge"}
            value="judge"
            label="judge"
            name="role"
          />
          <Radio
            handleChange={handleChange}
            checked={values.role === "lawyer"}
            value="lawyer"
            label="lawyer"
            name="role"
          />
          <Radio
            handleChange={handleChange}
            checked={values.role === "citizen"}
            value="citizen"
            label="citizen"
            name="role"
          />
          <Radio
            handleChange={handleChange}
            checked={values.role === "police"}
            value="police"
            label="police"
            name="role"
          />
        </div>
      </div>
      <Button text="add user" type="button" />
    </form>
  );
}
