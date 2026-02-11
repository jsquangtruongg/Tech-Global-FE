import { API as axiosInstance } from "../api/config";

export const apiRegister = (payload: any) =>
  axiosInstance({
    url: "/auth/register",
    method: "post",
    data: payload,
  });

export const apiLogin = (payload: any) =>
  axiosInstance({
    url: "/auth/login",
    method: "post",
    data: payload,
  });

export const apiLoginGoogle = (token: string) =>
  axiosInstance({
    url: "/auth/login-google",
    method: "post",
    data: { token },
  });
