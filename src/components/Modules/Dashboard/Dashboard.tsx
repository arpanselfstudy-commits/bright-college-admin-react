import useDashboard, { CARDS } from "./useDashboard";

const Dashboard = () => {
  const { stats, loading } = useDashboard();

  return (
    <div className="dashboardholder db-dashboard-wrap">
      <div className="db-cards-grid">
        {CARDS.map((card) => (
          <div className="db-stat-card" key={card.key}>
            <div className="db-stat-top">
              <div className="db-stat-icon" style={{ background: card.bg, color: card.accent }}>
                {card.icon}
              </div>
            </div>
            <div className="db-stat-bottom">
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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
