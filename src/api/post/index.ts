import { API } from "../config";

export interface IPost {
  id?: number;
  title: string;
  desc?: string;
  content: string;
  image?: string;
  category: string;
  author?: string; // Only for display if populated
  author_id?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface IResponse {
  mes: string;
  data: any;
  err: number;
}

export const getAllPostsAPI = async (params?: any): Promise<IResponse> => {
  try {
    const { data } = await API.get("/post-new/all", { params });
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi tải danh sách bài viết", data: [], err: 1 };
  }
};

export const getPostDetailAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/post-new/${id}`);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi tải chi tiết bài viết", data: null, err: 1 };
  }
};

export const createPostAPI = async (payload: IPost): Promise<IResponse> => {
  try {
    const { data } = await API.post("/post-new", payload);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi tạo bài viết", data: null, err: 1 };
  }
};

export const updatePostAPI = async (
  id: number,
  payload: IPost
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/post-new/${id}`, payload);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi cập nhật bài viết", data: null, err: 1 };
  }
};

export const deletePostAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/post-new/${id}`);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi xóa bài viết", data: null, err: 1 };
  }
};
