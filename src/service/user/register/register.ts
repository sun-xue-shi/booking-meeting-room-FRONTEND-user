import { axiosInstance } from "@/service";

interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  email: string;
  captcha: string;
}

export function register(registerUser: RegisterUser) {
  return axiosInstance.post("/user/register", registerUser);
}
