import { API } from "../config";

export interface IMyDiary {
  id?: number;
  user_id?: number;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  emotion?: "positive" | "negative" | "neutral";
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse {
  err: number;
  mess: string;
  data?: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const getMyDiariesAPI = async (params: any = {}): Promise<IResponse> => {
  const { data } = await API.get("/my-diary", { params });
  return data;
};

export const getMyDiaryDetailAPI = async (id: number): Promise<IResponse> => {
  const { data } = await API.get(`/my-diary/${id}`);
  return data;
};

export const createMyDiaryAPI = async (
  payload: Partial<IMyDiary>,
): Promise<IResponse> => {
  const { data } = await API.post("/my-diary", payload);
  return data;
};

export const updateMyDiaryAPI = async (
  id: number,
  payload: Partial<IMyDiary>,
): Promise<IResponse> => {
  const { data } = await API.put(`/my-diary/${id}`, payload);
  return data;
};

export const deleteMyDiaryAPI = async (id: number): Promise<IResponse> => {
  const { data } = await API.delete(`/my-diary/${id}`);
  return data;
};

export const getAdminDiariesAPI = async (
  params: any = {},
): Promise<IResponse> => {
  const { data } = await API.get("/my-diary/admin", { params });
  return data;
};

export const getAdminDiaryDetailAPI = async (
  id: number,
): Promise<IResponse> => {
  const { data } = await API.get(`/my-diary/admin/${id}`);
  return data;
};

export const createAdminDiaryAPI = async (
  payload: Partial<IMyDiary>,
): Promise<IResponse> => {
  const { data } = await API.post("/my-diary/admin", payload);
  return data;
};

export const updateAdminDiaryAPI = async (
  id: number,
  payload: Partial<IMyDiary>,
): Promise<IResponse> => {
  const { data } = await API.put(`/my-diary/admin/${id}`, payload);
  return data;
};

export const deleteAdminDiaryAPI = async (id: number): Promise<IResponse> => {
  const { data } = await API.delete(`/my-diary/admin/${id}`);
  return data;
};
