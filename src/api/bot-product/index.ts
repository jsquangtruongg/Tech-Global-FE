import { API } from "../config";

export interface IBotProduct {
  id?: number;
  code: string;
  name: string;
  subtitle?: string;
  image?: string;
  is_popular?: boolean;
  rating?: number;
  profit_display?: string;
  drawdown_display?: string;
  asset_type?: string;
  highlights?: string | string[]; // Can be string in DB, parsed in FE if needed
  monthly_usd: number;
  yearly_usd: number;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse {
  err: number;
  mess: string;
  data: any;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const getAllBotProductsAPI = async (params: any): Promise<IResponse> => {
  const { data } = await API.get("/bot-products", { params });
  return data;
};

export const getActiveBotProductsAPI = async (): Promise<IResponse> => {
  const { data } = await API.get("/bot-products/all");
  return data;
};

export const createBotProductAPI = async (
  payload: IBotProduct
): Promise<IResponse> => {
  const { data } = await API.post("/bot-products", payload);
  return data;
};

export const updateBotProductAPI = async (
  payload: IBotProduct
): Promise<IResponse> => {
  const { id, ...rest } = payload;
  const { data } = await API.put(`/bot-products/${id}`, rest);
  return data;
};

export const deleteBotProductAPI = async (id: number): Promise<IResponse> => {
  const { data } = await API.delete(`/bot-products/${id}`);
  return data;
};

export const uploadBotProductImageAPI = async (
  file: File
): Promise<IResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await API.post("/bot-products/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    const anyError: any = error;
    const backendMessage =
      anyError?.response?.data?.mess ||
      anyError?.response?.data?.mes ||
      anyError?.message;
    return {
      err: 1,
      mess: backendMessage || "Lỗi khi upload ảnh bot",
      data: null,
    };
  }
};
