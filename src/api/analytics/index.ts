import { API } from "../config";

export interface IDashboardResponse {
  err: number;
  mess: string;
  data: {
    summary: {
      totalUsers: number;
      totalOrders: number;
      totalPosts: number;
      totalRevenue: number;
    };
    charts: {
      userGrowth: { month: string; count: number }[];
      revenueGrowth: { month: string; revenue: number; orders: number }[];
      postCategories: { name: string; value: number }[];
    };
  };
}

export const getDashboardDataAPI = async (): Promise<IDashboardResponse> => {
  try {
    const { data } = await API.get("/analytics/dashboard");
    return data;
  } catch (error) {
    return {
      err: 1,
      mess: "Lỗi khi tải dữ liệu dashboard",
      data: {
        summary: {
          totalUsers: 0,
          totalOrders: 0,
          totalPosts: 0,
          totalRevenue: 0,
        },
        charts: {
          userGrowth: [],
          revenueGrowth: [],
          postCategories: [],
        },
      },
    };
  }
};
