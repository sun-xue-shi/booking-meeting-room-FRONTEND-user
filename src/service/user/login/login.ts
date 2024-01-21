import { axiosInstance } from "@/service";

export function passLogin(username: string, password: string) {
  return axiosInstance.post("/user/passlogin", {
    username,
    password,
  });
}

export function emailLogin(username: string, email: string, captcha: string) {
  return axiosInstance.post("/user/emaillogin", {
    username,
    email,
    captcha,
  });
}
