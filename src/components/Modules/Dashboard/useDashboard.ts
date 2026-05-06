import { useCallback, useEffect, useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiShoppingBag,
  FiPackage,
  FiInbox,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import React from "react";
import DashboardApi, {
  ActivityAction,
  ActivityLog,
  ActivityLogPagination,
  DashboardStats,
} from "../../../service/apis/Dashboard.api";

export interface StatCard {
  label: string;
  key: keyof DashboardStats;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

export const CARDS: StatCard[] = [
  { label: "Total Users",          key: "totalUsers",             icon: React.createElement(FiUsers, { size: 30 }),       accent: "#64bfa4", bg: "#d7e7d0" },
  { label: "Total Jobs",           key: "totalJobs",              icon: React.createElement(FiBriefcase, { size: 30 }),   accent: "#3d9e84", bg: "#edf7f3" },
  { label: "Total Shops",          key: "totalShops",             icon: React.createElement(FiShoppingBag, { size: 30 }), accent: "#64bfa4", bg: "#d7e7d0" },
  { label: "Listed Products",      key: "totalListedProducts",    icon: React.createElement(FiPackage, { size: 30 }),     accent: "#84c9af", bg: "#e8f5f0" },
  { label: "Requested Products",   key: "totalRequestedProducts", icon: React.createElement(FiInbox, { size: 30 }),       accent: "#3d9e84", bg: "#edf7f3" },
  { label: "Total Logins",         key: "totalLogins",            icon: React.createElement(FiLogIn, { size: 30 }),       accent: "#64bfa4", bg: "#d7e7d0" },
  { label: "Total Logouts",        key: "totalLogouts",           icon: React.createElement(FiLogOut, { size: 30 }),      accent: "#84c9af", bg: "#e8f5f0" },
];

export interface ActivityLogsState {
  logs: ActivityLog[];
  pagination: ActivityLogPagination;
  loading: boolean;
  page: number;
  actionFilter: ActivityAction | "";
}

const DEFAULT_PAGINATION: ActivityLogPagination = { total: 0, page: 1, limit: 10, pages: 0 };

const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [logsState, setLogsState] = useState<ActivityLogsState>({
    logs: [],
    pagination: DEFAULT_PAGINATION,
    loading: true,
    page: 1,
    actionFilter: "",
  });

  // ── Fetch stats ──────────────────────────────────────────────────────────
  useEffect(() => {
    DashboardApi.getStats()
      .then((res) => { if (res.success) setStats(res.data); })
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch activity logs ──────────────────────────────────────────────────
  const fetchLogs = useCallback((page: number, action: ActivityAction | "") => {
    setLogsState((prev) => ({ ...prev, loading: true }));
    DashboardApi.getActivityLogs({
      page,
      limit: 10,
      ...(action ? { action } : {}),
    })
      .then((res) => {
        if (res.success) {
          setLogsState((prev) => ({
            ...prev,
            logs: res.data.logs,
            pagination: res.data.pagination,
            loading: false,
          }));
        } else {
          setLogsState((prev) => ({ ...prev, loading: false }));
        }
      })
      .catch(() => setLogsState((prev) => ({ ...prev, loading: false })));
  }, []);

  useEffect(() => {
    fetchLogs(logsState.page, logsState.actionFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logsState.page, logsState.actionFilter]);

  const handleLogsPageChange = (page: number) => {
    setLogsState((prev) => ({ ...prev, page }));
  };

  const handleActionFilter = (action: ActivityAction | "") => {
    setLogsState((prev) => ({ ...prev, page: 1, actionFilter: action }));
  };

  return {
    stats,
    loading: statsLoading,
    logsState,
    handleLogsPageChange,
    handleActionFilter,
  };
};

export default useDashboard;
