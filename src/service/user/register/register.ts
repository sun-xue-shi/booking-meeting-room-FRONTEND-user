import { axiosInstance } from "@/service";

interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  email: string;
  captcha: string;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error.response;
  }
);

export function register(registerUser: RegisterUser) {
  return axiosInstance.post("/user/register", registerUser);
}
