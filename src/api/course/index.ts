import { API } from "../config";

export interface ILesson {
  id?: number;
  title: string;
  duration: string;
  preview: boolean;
  video_url?: string;
}

export interface ISection {
  id?: number;
  title: string;
  lessons: ILesson[];
}

export interface ICourse {
  id?: number;
  title: string;
  desc: string;
  image: string;
  category: string;
  level: string;
  lessons_count: number;
  duration: string;
  rating: number;
  students: number;
  price: number;
  discount?: number;
  slug?: string;
  status?: "draft" | "published" | "archived";
  video_demo?: string;
  instructor_id?: number;
  instructor?: {
    id: number;
    name: string;
    avatar: string;
  };
  sections: ISection[];
}

export interface IResponse {
  mes: string;
  data: any;
  err: number;
}

export const getAllCoursesAPI = async (params?: any): Promise<IResponse> => {
  try {
    const { data } = await API.get("/course/all", { params });
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi tải danh sách khóa học", data: [], err: 1 };
  }
};

export const getCourseDetailAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.get(`/course/${id}`);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi tải chi tiết khóa học", data: null, err: 1 };
  }
};

export const createCourseAPI = async (payload: ICourse): Promise<IResponse> => {
  try {
    const { data } = await API.post("/course", payload);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi tạo khóa học", data: null, err: 1 };
  }
};

export const updateCourseAPI = async (
  id: number,
  payload: ICourse
): Promise<IResponse> => {
  try {
    const { data } = await API.put(`/course/${id}`, payload);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi cập nhật khóa học", data: null, err: 1 };
  }
};

export const deleteCourseAPI = async (id: number): Promise<IResponse> => {
  try {
    const { data } = await API.delete(`/course/${id}`);
    return { mes: data.mes, data: data.data, err: data.err };
  } catch (error) {
    return { mes: "Lỗi khi xóa khóa học", data: null, err: 1 };
  }
};
