import { API } from "../config";

export interface IPsychology {
  id?: number;
  title: string;
  type: "positive" | "negative" | "neutral";
  impact: "low" | "medium" | "high";
  frequency: "common" | "rare";
  description?: string;
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

export const getPsychologiesAPI = async (
  params: any = {},
): Promise<IResponse> => {
  const { data } = await API.get("/psychology", { params });
  return data;
};

export const getPsychologyDetailAPI = async (
  id: number,
): Promise<IResponse> => {
  const { data } = await API.get(`/psychology/${id}`);
  return data;
};

export const createPsychologyAPI = async (
  payload: IPsychology,
): Promise<IResponse> => {
  const { data } = await API.post("/psychology", payload);
  return data;
};

export const updatePsychologyAPI = async (
  id: number,
  payload: Partial<IPsychology>,
): Promise<IResponse> => {
  const { data } = await API.put(`/psychology/${id}`, payload);
  return data;
};

export const deletePsychologyAPI = async (id: number): Promise<IResponse> => {
  const { data } = await API.delete(`/psychology/${id}`);
  return data;
};
