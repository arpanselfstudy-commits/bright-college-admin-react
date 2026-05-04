import { useEffect, useState } from "react";
import {
  FiUsers, FiUserPlus, FiBriefcase, FiShoppingBag,
  FiPackage, FiInbox,
} from "react-icons/fi";
import React from "react";
import DashboardApi, { DashboardStats } from "../../../service/apis/Dashboard.api";

export interface StatCard {
  label: string;
  key: keyof DashboardStats;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

export const CARDS: StatCard[] = [
  { label: "Total Users",          key: "totalUsers",             icon: React.createElement(FiUsers, { size: 30 }),       accent: "#64bfa4", bg: "#d7e7d0" },
  { label: "New Users This Month", key: "newUsersThisMonth",      icon: React.createElement(FiUserPlus, { size: 30 }),    accent: "#84c9af", bg: "#e8f5f0" },
  { label: "Total Jobs",           key: "totalJobs",              icon: React.createElement(FiBriefcase, { size: 30 }),   accent: "#3d9e84", bg: "#edf7f3" },
  { label: "Total Shops",          key: "totalShops",             icon: React.createElement(FiShoppingBag, { size: 30 }), accent: "#64bfa4", bg: "#d7e7d0" },
  { label: "Listed Products",      key: "totalListedProducts",    icon: React.createElement(FiPackage, { size: 30 }),     accent: "#84c9af", bg: "#e8f5f0" },
  { label: "Requested Products",   key: "totalRequestedProducts", icon: React.createElement(FiInbox, { size: 30 }),       accent: "#3d9e84", bg: "#edf7f3" },
];

const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardApi.getStats()
      .then((res) => { if (res.success) setStats(res.data); })
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};

export default useDashboard;
