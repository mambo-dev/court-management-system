import { useRouter } from "next/router";
import axios from "axios";

export const useAuth = () => {
  const router = useRouter();

  const logout = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/api/auth/logout`, {})
      .then((response) => {
        console.log(response);
        router.replace("/auth/login");
      });
  };

  return { logout };
};
