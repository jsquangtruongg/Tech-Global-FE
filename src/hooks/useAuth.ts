import { useMutation } from "@tanstack/react-query";
import { apiLogin, apiRegister } from "../services/auth";
import { getUserAPI } from "../api/user";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: apiLogin,
    onSuccess: async (response) => {
      const data = response.data;

      console.log("Login Response:", data);

      if (data.err === 0) {
        // Save token first
        localStorage.setItem("profile", JSON.stringify(data));

        try {
          // Fetch user profile
          const userRes = await getUserAPI();
          if (userRes.err === 0) {
            const fullProfile = { ...data, userData: userRes.userData };
            localStorage.setItem("profile", JSON.stringify(fullProfile));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }

        message.success("Đăng nhập thành công!");
        navigate("/home");
      } else {
        message.error(data.mes || "Đăng nhập thất bại");
      }
    },
    onError: (error: any) => {
      console.log("Login Error:", error);
      message.error(error?.response?.data?.mes || "Đã có lỗi xảy ra");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: apiRegister,
    onSuccess: (data: any) => {
      if (data?.data?.err === 0) {
        message.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        message.error(data?.data?.mes || "Đăng ký thất bại");
      }
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.mes || "Đã có lỗi xảy ra");
    },
  });
};
