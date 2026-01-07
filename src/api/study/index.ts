import { API } from "../config";
import { type IResponse } from "../interview";

export interface IStudy {
  id?: number;
  section_id: number;
  type: "multiple-choice" | "essay" | "case-study";
  content: string;
  options?: any;
  media?: any;
  correct_answer?: string;
  explanation?: string;
  related_question_ids?: any;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllStudiesAPI = async (
  sectionId?: number
): Promise<IResponse> => {
  try {
    const { data } = await API.get("/study", {
      params: { sectionId },
    });
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tải danh sách bài tập", data: [] };
  }
};

export const getStudyByIdAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/study/${id}`);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tải bài tập", data: null };
  }
};

export const createStudyAPI = async (payload: IStudy): Promise<IResponse> => {
  try {
    const { data } = await API.post("/study", payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tạo bài tập" };
  }
};

export const updateStudyAPI = async (
  id: number,
  payload: IStudy
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/study/${id}`, payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi cập nhật bài tập" };
  }
};

export const deleteStudyAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/study/${id}`);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi xóa bài tập" };
  }
};
