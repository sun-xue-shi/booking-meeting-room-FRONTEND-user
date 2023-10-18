import { axiosInstance } from "@/service";

export function login(username: string, password: string) {
  return axiosInstance.post("/user/login", {
    username,
    password,
  });
}
