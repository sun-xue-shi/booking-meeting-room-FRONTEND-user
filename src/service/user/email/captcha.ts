import { axiosInstance } from "@/service";

export function registerCaptcha(email: string) {
  return axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

export function loginCaptcha(email: string) {
  return axiosInstance.get("/user/login-captcha", {
    params: {
      address: email,
    },
  });
}

export function updatePasswordCaptcha(email: string) {
  return axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

export function updateInfoCaptcha() {
  return axiosInstance.get("/user/update/captcha");
}
