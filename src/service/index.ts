import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error.response;
  }
);

// axiosInstance.interceptors.request.use(
//   (req) => {
//     return req;
//   },
//   (error) => {
//     return error.request;
//   }
// );
