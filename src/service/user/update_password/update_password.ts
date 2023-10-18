import { axiosInstance } from "@/service";

interface UpdatePassword {
  username: string;
  password: string;
  email: string;
  captcha: string;
}

export function updatePassword(updatePassword: UpdatePassword) {
  return axiosInstance.post("/user/update_password", updatePassword);
}
