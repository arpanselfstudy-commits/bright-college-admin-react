import api from "../httpsCall";

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalShops: number;
  totalListedProducts: number;
  totalRequestedProducts: number;
  totalLogins: number;
  totalLogouts: number;
}

export interface DashboardResponse {
  code: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

export type ActivityAction = "LOGIN" | "LOGOUT";

export interface ActivityLogUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  userId: ActivityLogUser;
  action: ActivityAction;
  ip: string;
  deviceName: string;
  createdAt: string;
}

export interface ActivityLogPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ActivityLogsData {
  logs: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  pagination: ActivityLogPagination;
}

export interface ActivityLogsResponse {
  code: number;
  success: boolean;
  message: string;
  data: ActivityLogsData;
}

export interface ActivityLogsParams {
  page?: number;
  limit?: number;
  action?: ActivityAction;
}

const DashboardApi = {
  getStats: (): Promise<DashboardResponse> =>
    api.get("/admin/dashboard"),

  getActivityLogs: (params?: ActivityLogsParams): Promise<ActivityLogsResponse> =>
    api.get("/admin/activity-logs", { params }),
};

export default DashboardApi;
