import { API } from "../config";

export interface IKnowledgeArticle {
  id?: string;
  topic?: string;
  title: string;
  summary: string;
  content?: string;
  level?: "BASIC" | "ADVANCED";
  tags?: string[];
  updatedAt?: string;
}

export interface IResponse {
  err: number;
  mess: string;
  data: any;
}

export const getAllKnowledgeAPI = async (params: any = {}): Promise<IResponse> => {
  try {
    const { data } = await API.get("/knowledge", { params });
    return data;
  } catch (error: any) {
    return { err: 1, mess: error?.response?.data?.mess || "Lỗi khi tải kiến thức", data: [] };
  }
};

export const getKnowledgeDetailAPI = async (id: string): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/knowledge/${id}`);
    return data;
  } catch (error: any) {
    return { err: 1, mess: error?.response?.data?.mess || "Lỗi khi tải chi tiết kiến thức", data: null };
  }
};

export const createKnowledgeAPI = async (payload: IKnowledgeArticle): Promise<IResponse> => {
  try {
    const { data } = await API.post("/knowledge", payload);
    return data;
  } catch (error: any) {
    return { err: 1, mess: error?.response?.data?.mess || "Lỗi khi tạo kiến thức", data: null };
  }
};

export const updateKnowledgeAPI = async (
  id: string,
  payload: Partial<IKnowledgeArticle>,
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/knowledge/${id}`, payload);
    return data;
  } catch (error: any) {
    return { err: 1, mess: error?.response?.data?.mess || "Lỗi khi cập nhật kiến thức", data: null };
  }
};

export const deleteKnowledgeAPI = async (id: string): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/knowledge/${id}`);
    return data;
  } catch (error: any) {
    return { err: 1, mess: error?.response?.data?.mess || "Lỗi khi xóa kiến thức", data: null };
  }
};

export const uploadKnowledgeImageAPI = async (file: File): Promise<IResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await API.post("/knowledge/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mess:
        error?.response?.data?.mess ||
        error?.response?.data?.mes ||
        "Lỗi khi upload ảnh kiến thức",
      data: null,
    };
  }
};
