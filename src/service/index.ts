import { message } from "ant-design-vue";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }

  return config;
});

interface PendingTask {
  config: AxiosRequestConfig;
  // eslint-disable-next-line @typescript-eslint/ban-types
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  // 请求没有发送成功时没有response属性
  async (error) => {
    const { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });
        return axiosInstance(config);
      } else {
        message.error(res.data);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });

  localStorage.setItem("access_token", res.data.data.access_token);
  localStorage.setItem("refresh_token", res.data.data.refresh_token);

  return res;
}
