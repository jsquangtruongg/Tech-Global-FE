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

export interface IGoldNewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  titleVi?: string;
}

export interface IGoldNewsResponse {
  err: number;
  mess: string;
  data: IGoldNewsItem[];
}

export interface IEconomicEvent {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: "Low" | "Medium" | "High";
  forecast: string;
  previous: string;
}

export interface IEconomicCalendarResponse {
  err: number;
  mess: string;
  data: IEconomicEvent[];
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

export const getGoldNewsAPI = async (): Promise<IGoldNewsResponse> => {
  try {
    const { data } = await API.get("/analytics/gold-news");
    return data;
  } catch (error) {
    return {
      err: 1,
      mess: "Lỗi khi tải tin tức vàng",
      data: [],
    };
  }
};

export const getEconomicCalendarAPI =
  async (): Promise<IEconomicCalendarResponse> => {
    try {
      const { data } = await API.get("/analytics/economic-calendar");
      return data;
    } catch (error) {
      return {
        err: 1,
        mess: "Lỗi khi tải lịch kinh tế",
        data: [],
      };
    }
  };

export const postUserActivityAPI = async (payload: {
  userId?: string | number;
  timestamp: string;
  device: string;
  os?: string;
  browser?: string;
}): Promise<{ err: number; mess: string }> => {
  try {
    const { data } = await API.post("/user/activity", payload);
    return data;
  } catch (error) {
    return { err: 1, mess: "Không thể gửi hoạt động người dùng" };
  }
};

export const getUserActivityStatsAPI = async (): Promise<{
  err: number;
  mess: string;
  data: {
    byHour: { hour: string; count: number }[];
    byDevice: { Desktop: number; Mobile: number; Tablet: number };
  };
}> => {
  try {
    const { data } = await API.get("/user/activity/stats");
    return data;
  } catch (error) {
    return {
      err: 1,
      mess: "Không thể tải thống kê hoạt động",
      data: { byHour: [], byDevice: { Desktop: 0, Mobile: 0, Tablet: 0 } },
    };
  }
};
