import { useQuery } from "@tanstack/react-query";
import { getAllUsersAPI, getUserAPI } from "../api/user";

export const useGetAllUsers = (params?: any) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsersAPI(params),
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getUserAPI(),
  });
};
