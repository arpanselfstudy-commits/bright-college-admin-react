import api from "../httpsCall";

export interface DashboardStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalJobs: number;
  totalShops: number;
  totalListedProducts: number;
  totalRequestedProducts: number;
}

export interface DashboardResponse {
  code: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

const DashboardApi = {
  getStats: (): Promise<DashboardResponse> => api.get("/admin/dashboard"),
};

export default DashboardApi;
