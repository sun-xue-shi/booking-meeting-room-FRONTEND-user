import { axiosInstance } from "@/service";

export function registerCaptcha(email: string) {
  return axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}
