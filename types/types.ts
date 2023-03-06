import { Admin, Citizen, Judge, Lawyer } from "@prisma/client";

export type Error = {
  message: string;
};

export type DecodedToken = {
  username: string;
  user_id: number;
  iat: number;
  exp: number;
};

export type Users = (Citizen | Judge | Lawyer | Admin)[] | null;
