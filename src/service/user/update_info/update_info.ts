import { axiosInstance } from "@/service";

interface UpdateInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

export function updateInfo(updateInfo: UpdateInfo) {
  return axiosInstance.post("/user/update", updateInfo);
}

export function getUserInfo() {
  return axiosInstance.get("/user/info");
}
