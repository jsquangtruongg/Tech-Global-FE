import { API } from "../config";

export interface IRole {
  code: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResponse {
  err: number;
  mess: string;
  roleData?: IRole | IRole[];
}

export const getAllRolesAPI = async (): Promise<IResponse> => {
  const { data } = await API.get("/role");
  return { err: data.err, mess: data.mess, roleData: data.roleData };
};

export const createRoleAPI = async (payload: IRole): Promise<IResponse> => {
  const { data } = await API.post("/role", payload);
  return { err: data.err, mess: data.mess, roleData: data.roleData };
};

export const updateRoleAPI = async (payload: IRole): Promise<IResponse> => {
  const { data } = await API.put("/role", payload);
  return { err: data.err, mess: data.mess };
};

export const deleteRoleAPI = async (code: string): Promise<IResponse> => {
  const { data } = await API.delete("/role", { params: { code } });
  return { err: data.err, mess: data.mess };
};
