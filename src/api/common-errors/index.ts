import { API } from "../config";

export type Severity = "low" | "medium" | "high";
export type Category = "PSYCHOLOGY" | "TECHNICAL" | "RISK" | "PROCESS";

export interface ICommonError {
  id?: string;
  category: Category;
  name: string;
  content: string;
  tags: string[];
  severity: Severity;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse {
  err: number;
  mess: string;
  data: any;
}

export const getAllCommonErrorsAPI = async (
  params: any = {},
): Promise<IResponse> => {
  try {
    const { data } = await API.get("/common-errors", { params });
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mess: error?.response?.data?.mess || "Lỗi khi tải danh sách lỗi",
      data: [],
    };
  }
};

export const getCommonErrorDetailAPI = async (
  id: string,
): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/common-errors/${id}`);
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mess: error?.response?.data?.mess || "Lỗi khi tải chi tiết lỗi",
      data: null,
    };
  }
};

export const createCommonErrorAPI = async (
  payload: ICommonError,
): Promise<IResponse> => {
  try {
    const { data } = await API.post("/common-errors", payload);
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mess: error?.response?.data?.mess || "Lỗi khi tạo lỗi mới",
      data: null,
    };
  }
};

export const updateCommonErrorAPI = async (
  id: string,
  payload: Partial<ICommonError>,
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/common-errors/${id}`, payload);
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mess: error?.response?.data?.mess || "Lỗi khi cập nhật lỗi",
      data: null,
    };
  }
};

export const deleteCommonErrorAPI = async (id: string): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/common-errors/${id}`);
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mess: error?.response?.data?.mess || "Lỗi khi xóa lỗi",
      data: null,
    };
  }
};
