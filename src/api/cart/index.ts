import { API } from "../config";
import { type ICourse } from "../course";

export interface ICartItem {
  id: number;
  user_id: number;
  course_id: number;
  course: ICourse;
  created_at: string;
}

export interface IResponse {
  err: number;
  mes: string;
  data: any;
}

export const addToCartAPI = async (courseId: number): Promise<IResponse> => {
  try {
    const { data } = await API.post("/cart", { courseId });
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mes: error?.response?.data?.mess || "Lỗi khi thêm vào giỏ hàng",
      data: null,
    };
  }
};

export const getCartAPI = async (): Promise<IResponse> => {
  try {
    const { data } = await API.get("/cart");
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mes: error?.response?.data?.mess || "Lỗi khi lấy giỏ hàng",
      data: [],
    };
  }
};

export const removeFromCartAPI = async (courseId: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/cart/${courseId}`);
    return data;
  } catch (error: any) {
    return {
      err: 1,
      mes: error?.response?.data?.mess || "Lỗi khi xóa khỏi giỏ hàng",
      data: null,
    };
  }
};
