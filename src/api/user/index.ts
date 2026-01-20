import { API } from "../config";

export interface IUser {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "staff" | "customer";
  phone?: string;
  status?: "active" | "inactive" | "banned";
  avatar?: string;
  createdAt?: string;
}

export interface IResponse {
  mes: string;
  userData: any;
  err: number;
}

export const getUserAPI = async (): Promise<IResponse> => {
  const { data } = await API.get("/user");
  return { mes: data.mes, userData: data.userData, err: data.err };
};

export const updateUserAPI = async (payload: any): Promise<IResponse> => {
  const { data } = await API.put("/user", payload);
  return { mes: data.mes, userData: data.userData, err: data.err };
};

export const getAllUsersAPI = async (params: any): Promise<IResponse> => {
  const { data } = await API.get("/user/all", { params });
  return { mes: data.mes, userData: data.userData, err: data.err };
};

export const deleteUserAPI = async (userId: number): Promise<IResponse> => {
  const { data } = await API.delete("/user", { params: { id: userId } });
  return { mes: data.mes, userData: data.userData, err: data.err };
};

export const updateUserByAdminAPI = async (
  userId: number,
  payload: any
): Promise<IResponse> => {
  const { data } = await API.put(`/user/${userId}`, payload);
  return { mes: data.mes, userData: data.userData, err: data.err };
};

export const createUserAPI = async (payload: IUser): Promise<IResponse> => {
  const { data } = await API.post("/user", payload);
  return { mes: data.mes, userData: data.userData, err: data.err };
};
