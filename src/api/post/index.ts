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

export const uploadPostImageAPI = async (file: File): Promise<IResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await API.post("/post-new/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      mes: data.mes || data.mess,
      data: data.data,
      err: data.err,
    };
  } catch (error) {
    // Lấy message chi tiết từ backend nếu có
    const anyError: any = error;
    const backendMessage =
      anyError?.response?.data?.mes ||
      anyError?.response?.data?.mess ||
      anyError?.message;
    return {
      mes: backendMessage || "Lỗi khi upload ảnh",
      data: null,
      err: 1,
    };
  }
};

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
