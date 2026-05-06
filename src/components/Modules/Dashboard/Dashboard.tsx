import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  FiUsers,
  FiBriefcase,
  FiShoppingBag,
  FiPackage,
  FiInbox,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import useDashboard from "./useDashboard";
import DataTable, { ColumnDef } from "../../Common/DataTable/DataTable";
import { ActivityLog } from "../../../service/apis/Dashboard.api";

// ── Stat card config ─────────────────────────────────────────────────────────
const CARDS = [
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: <FiUsers size={22} />,
    accent: "#3d9e84",
    bg: "linear-gradient(135deg, #3d9e84 0%, #64bfa4 100%)",
    lightBg: "#edf7f3",
    lightColor: "#3d9e84",
  },
  {
    key: "totalJobs" as const,
    label: "Total Jobs",
    icon: <FiBriefcase size={22} />,
    accent: "#0ea5e9",
    bg: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
    lightBg: "#e0f2fe",
    lightColor: "#0284c7",
  },
  {
    key: "totalShops" as const,
    label: "Total Shops",
    icon: <FiShoppingBag size={22} />,
    accent: "#8b5cf6",
    bg: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    lightBg: "#ede9fe",
    lightColor: "#7c3aed",
  },
  {
    key: "totalListedProducts" as const,
    label: "Listed Products",
    icon: <FiPackage size={22} />,
    accent: "#f59e0b",
    bg: "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)",
    lightBg: "#fef3c7",
    lightColor: "#d97706",
  },
  {
    key: "totalRequestedProducts" as const,
    label: "Requested Products",
    icon: <FiInbox size={22} />,
    accent: "#ec4899",
    bg: "linear-gradient(135deg, #db2777 0%, #f472b6 100%)",
    lightBg: "#fce7f3",
    lightColor: "#db2777",
  },
  {
    key: "totalLogins" as const,
    label: "Total Logins",
    icon: <FiLogIn size={22} />,
    accent: "#10b981",
    bg: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
    lightBg: "#d1fae5",
    lightColor: "#059669",
  },
  {
    key: "totalLogouts" as const,
    label: "Total Logouts",
    icon: <FiLogOut size={22} />,
    accent: "#f97316",
    bg: "linear-gradient(135deg, #ea580c 0%, #fb923c 100%)",
    lightBg: "#ffedd5",
    lightColor: "#ea580c",
  },
];

// ── Activity log table columns ───────────────────────────────────────────────
const LOG_COLUMNS: ColumnDef<ActivityLog>[] = [
  {
    key: "user",
    label: "User",
    render: (row) => (
      <div className="db-log-user-cell">
        <div className="db-log-avatar">
          {row.userId?.photo ? (
            <img src={row.userId.photo} alt={row.userId.name} className="db-log-avatar-img" />
          ) : (
            <span className="db-log-avatar-initials">
              {(row.userId?.name ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="db-log-name">{row.userId?.name ?? "—"}</p>
          <p className="db-log-email">{row.userId?.email ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    key: "action",
    label: "Action",
    render: (row) => (
      <span className={`db-log-badge db-log-badge--${row.action.toLowerCase()}`}>
        {row.action === "LOGIN" ? <FiLogIn size={11} /> : <FiLogOut size={11} />}
        {row.action}
      </span>
    ),
  },
  {
    key: "ip",
    label: "IP Address",
    render: (row) => <span className="db-log-mono">{row.ip || "—"}</span>,
  },
  {
    key: "deviceName",
    label: "Device",
    render: (row) => <span className="db-log-device">{row.deviceName || "—"}</span>,
  },
  {
    key: "createdAt",
    label: "Time",
    render: (row) => (
      <span className="db-log-time">
        {new Date(row.createdAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </span>
    ),
  },
];

// ── Component ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { stats, loading, logsState, handleLogsPageChange, handleActionFilter } = useDashboard();

  const logins = stats?.totalLogins ?? 0;
  const logouts = stats?.totalLogouts ?? 0;
  const total = logins + logouts;
  const loginPct = total > 0 ? Math.round((logins / total) * 100) : 0;
  const logoutPct = total > 0 ? 100 - loginPct : 0;

  return (
    <div className="dashboardholder db-dashboard-wrap">

      {/* ── Stat cards ── */}
      <div className="db-cards-grid">
        {CARDS.map((card) => (
          <div className="db-stat-card" key={card.key}>
            {/* gradient top strip */}
            <div className="db-stat-strip" style={{ background: card.bg }} />
            <div className="db-stat-body">
              <div className="db-stat-icon-wrap" style={{ background: card.lightBg, color: card.lightColor }}>
                {card.icon}
              </div>
              <div className="db-stat-info">
                <span className="db-stat-label">{card.label}</span>
                {loading ? (
                  <span className="db-stat-skeleton" />
                ) : (
                  <span className="db-stat-value" style={{ color: card.accent }}>
                    {(stats?.[card.key] ?? 0).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="db-charts-row">

        {/* Donut chart — Login vs Logout */}
        <div className="db-chart-card">
          <div className="db-chart-header">
            <div>
              <h4 className="db-chart-title">Login vs Logout</h4>
              <p className="db-chart-subtitle">All-time activity breakdown</p>
            </div>
          </div>
          <div className="db-chart-body db-chart-body--donut">
            {loading ? (
              <div className="db-chart-skeleton" />
            ) : total === 0 ? (
              <div className="db-chart-empty">No activity data yet</div>
            ) : (
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: logins,  label: "Logins",  color: "#10b981" },
                      { id: 1, value: logouts, label: "Logouts", color: "#f97316" },
                    ],
                    innerRadius: 55,
                    outerRadius: 90,
                    paddingAngle: 3,
                    cornerRadius: 6,
                    highlightScope: { fade: "global", highlight: "item" },
                  },
                ]}
                width={280}
                height={200}
                slotProps={{ legend: { hidden: true } }}
              />
            )}
            {/* custom legend */}
            <div className="db-donut-legend">
              <div className="db-donut-legend-item">
                <span className="db-donut-dot" style={{ background: "#10b981" }} />
                <span className="db-donut-legend-label">Logins</span>
                <span className="db-donut-legend-val">{logins.toLocaleString()}</span>
                <span className="db-donut-legend-pct">{loginPct}%</span>
              </div>
              <div className="db-donut-legend-item">
                <span className="db-donut-dot" style={{ background: "#f97316" }} />
                <span className="db-donut-legend-label">Logouts</span>
                <span className="db-donut-legend-val">{logouts.toLocaleString()}</span>
                <span className="db-donut-legend-pct">{logoutPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats summary card */}
        <div className="db-chart-card db-summary-card">
          <div className="db-chart-header">
            <div>
              <h4 className="db-chart-title">Platform Summary</h4>
              <p className="db-chart-subtitle">Key metrics at a glance</p>
            </div>
          </div>
          <div className="db-summary-list">
            {[
              { label: "Users",              value: stats?.totalUsers ?? 0,             color: "#3d9e84",  pct: 100 },
              { label: "Jobs Posted",        value: stats?.totalJobs ?? 0,              color: "#0284c7",  pct: stats && stats.totalUsers ? Math.min(100, Math.round((stats.totalJobs / Math.max(stats.totalUsers, 1)) * 100)) : 0 },
              { label: "Shops",              value: stats?.totalShops ?? 0,             color: "#7c3aed",  pct: stats && stats.totalUsers ? Math.min(100, Math.round((stats.totalShops / Math.max(stats.totalUsers, 1)) * 100)) : 0 },
              { label: "Listed Products",    value: stats?.totalListedProducts ?? 0,    color: "#d97706",  pct: stats && stats.totalListedProducts && stats.totalRequestedProducts ? Math.round((stats.totalListedProducts / Math.max(stats.totalListedProducts + stats.totalRequestedProducts, 1)) * 100) : 0 },
              { label: "Requested Products", value: stats?.totalRequestedProducts ?? 0, color: "#db2777",  pct: stats && stats.totalListedProducts && stats.totalRequestedProducts ? Math.round((stats.totalRequestedProducts / Math.max(stats.totalListedProducts + stats.totalRequestedProducts, 1)) * 100) : 0 },
            ].map((item) => (
              <div className="db-summary-row" key={item.label}>
                <div className="db-summary-row-top">
                  <span className="db-summary-label">{item.label}</span>
                  <span className="db-summary-value" style={{ color: item.color }}>
                    {loading ? "—" : item.value.toLocaleString()}
                  </span>
                </div>
                <div className="db-summary-bar-track">
                  <div
                    className="db-summary-bar-fill"
                    style={{ width: loading ? "0%" : `${item.pct}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity logs ── */}
      <div className="db-logs-section">
        <div className="db-logs-header">
          <div>
            <h3 className="db-logs-title">Activity Logs</h3>
            <p className="db-logs-subtitle">Recent login and logout events</p>
          </div>
          <div className="db-logs-filters">
            {(["", "LOGIN", "LOGOUT"] as const).map((f) => (
              <button
                key={f}
                className={`db-logs-filter-btn${logsState.actionFilter === f ? " active" : ""}`}
                onClick={() => handleActionFilter(f)}
              >
                {f === "" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <DataTable<ActivityLog>
          columns={LOG_COLUMNS}
          rows={logsState.logs}
          loading={logsState.loading}
          skeletonRows={10}
          pagination={logsState.pagination}
          onPageChange={handleLogsPageChange}
          emptyMessage="No activity logs found."
        />
      </div>
    </div>
  );
};

export default Dashboard;
