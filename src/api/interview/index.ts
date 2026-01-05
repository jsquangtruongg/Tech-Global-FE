import { API } from "../config";

export type IMarket = "crypto" | "gold";
export type ILevel = "Entry" | "Junior" | "Middle" | "Senior" | "Expert";

export interface ITopic {
  id?: number;
  name: string;
  market: IMarket;
  sections?: ISection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ISection {
  id?: number;
  topic_id: number;
  name: string;
  questions?: IQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuestion {
  id?: number;
  section_id: number;
  question: string;
  answer: string;
  level: ILevel;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse {
  err: number;
  mess: string;
  data?: any;
}

export const getInterviewTreeAPI = async (
  market?: string
): Promise<IResponse> => {
  try {
    const { data } = await API.get("/interview/tree", {
      params: { market },
    });
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tải cây câu hỏi", data: [] };
  }
};

export const getTopicsAPI = async (): Promise<IResponse> => {
  try {
    const { data } = await API.get("/interview/topics");
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tải danh sách mục", data: [] };
  }
};

export const createTopicAPI = async (payload: ITopic): Promise<IResponse> => {
  try {
    const { data } = await API.post("/interview/topic", payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tạo mục" };
  }
};

export const updateTopicAPI = async (
  id: number,
  payload: ITopic
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/interview/topic/${id}`, payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi cập nhật mục" };
  }
};

export const deleteTopicAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/interview/topic/${id}`);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi xóa mục" };
  }
};

export const getSectionsByTopicAPI = async (
  topicId: number
): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/interview/sections`, {
      params: { topicId },
    });
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tải danh sách phần", data: [] };
  }
};

export const createSectionAPI = async (
  payload: Omit<ISection, "id">
): Promise<IResponse> => {
  try {
    const { data } = await API.post("/interview/section", payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tạo phần" };
  }
};

export const updateSectionAPI = async (
  id: number,
  payload: Omit<ISection, "id">
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/interview/section/${id}`, payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi cập nhật phần" };
  }
};

export const deleteSectionAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/interview/section/${id}`);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi xóa phần" };
  }
};

export const getQuestionsBySectionAPI = async (
  sectionId: number
): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/interview/questions`, {
      params: { sectionId },
    });
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tải danh sách câu hỏi", data: [] };
  }
};

export const createQuestionAPI = async (
  payload: Omit<IQuestion, "id">
): Promise<IResponse> => {
  try {
    const { data } = await API.post("/interview/question", payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi tạo câu hỏi" };
  }
};

export const updateQuestionAPI = async (
  id: number,
  payload: Omit<IQuestion, "id">
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/interview/question/${id}`, payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi cập nhật câu hỏi" };
  }
};

export const deleteQuestionAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/interview/question/${id}`);
    return data;
  } catch (error) {
    return { err: 1, mess: "Lỗi khi xóa câu hỏi" };
  }
};
