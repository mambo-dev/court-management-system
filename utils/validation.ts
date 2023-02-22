import { Error } from "../types/types";

type SignUpValidationValues = {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
};

type LoginValidationValues = {
  username: string;
  password: string;
};

export function handleSignUpValidation(values: SignUpValidationValues) {
  const errors = [];

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (values.username.trim() === "") {
    errors.push({
      message: `username must not be empty`,
    });
  }
  if (values.password.trim() === "") {
    errors.push({
      message: `password must not be empty`,
    });
  }
  if (values.confirmPassword.trim() === "") {
    errors.push({
      message: `confirm password must not be empty`,
    });
  }
  if (values.role.trim() === "") {
    errors.push({
      message: `role must not be empty`,
    });
  }

  if (values.password !== values.confirmPassword) {
    errors.push({
      message: `passwords must match`,
    });
  }

  return {
    errors,
    valid: errors.length <= 0,
  };
}

export function handleLoginValidation(values: LoginValidationValues) {
  const errors: Error[] | null = [];

  if (values.username.trim() === "") {
    errors.push({
      message: `username must not be empty`,
    });
  }
  if (values.password.trim() === "") {
    errors.push({
      message: `password must not be empty`,
    });
  }

  return {
    errors,
    valid: errors.length <= 0,
  };
}
