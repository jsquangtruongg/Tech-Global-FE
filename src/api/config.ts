import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8888/api/v1",
});

const authInterceptorRequest = (
  req: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const profile = localStorage.getItem("profile");
  if (profile) {
    try {
      const accessToken = JSON.parse(profile)?.accessToken;
      if (accessToken) {
        req.headers.Authorization = accessToken;
      }
    } catch (error) {
      console.error("Error parsing profile from localStorage", error);
    }
  }

  return req;
};

const authInterceptorResponse = async (
  response: AxiosResponse
): Promise<AxiosResponse> => {
  return response;
};

const authInterceptorResponseError = async (
  error: AxiosError
): Promise<any> => {
  if (error.response?.status === 401) {
    localStorage.removeItem("profile");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

export { authInterceptorResponse, authInterceptorResponseError };
API.interceptors.request.use(authInterceptorRequest);
API.interceptors.response.use(
  authInterceptorResponse,
  authInterceptorResponseError
);
