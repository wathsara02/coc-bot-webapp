import React from 'react';
import { useUsers } from '../hooks/useFirebaseData';

const ActivityStats: React.FC = () => {
  const { users, loading, error } = useUsers();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getActivityStats = () => {
    if (!users || Object.keys(users).length === 0) {
      return {
        lastDay: 0,
        last7Days: 0,
        lastMonth: 0,
        totalUsers: 0
      };
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let lastDayCount = 0;
    let last7DaysCount = 0;
    let lastMonthCount = 0;

    Object.values(users).forEach((user) => {
      if (user.last_online) {
        const lastOnlineDate = new Date(user.last_online);
        
        if (lastOnlineDate >= oneDayAgo) {
          lastDayCount++;
        }
        if (lastOnlineDate >= sevenDaysAgo) {
          last7DaysCount++;
        }
        if (lastOnlineDate >= thirtyDaysAgo) {
          lastMonthCount++;
        }
      }
    });

    return {
      lastDay: lastDayCount,
      last7Days: last7DaysCount,
      lastMonth: lastMonthCount,
      totalUsers: Object.keys(users).length
    };
  };

  const getActivityPercentage = (active: number, total: number): number => {
    return total > 0 ? Math.round((active / total) * 100) : 0;
  };

  if (loading) {
    return <div className="loading">Loading activity statistics...</div>;
  }

  if (error) {
    return <div className="error">Failed to load activity data: {error}</div>;
  }

  const stats = getActivityStats();

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>📊 Member Activity Statistics</h1>
        <p>Track member engagement and activity over different time periods</p>
      </div>

      {/* Activity Statistics Grid */}
      <div className="stats-grid">
        <div className="card pulse">
          <div className="card-header">
            🟢 Active Last 24 Hours
          </div>
          <div className="card-value text-success">
            {formatNumber(stats.lastDay)}
          </div>
          <div className="card-subtitle">
            {getActivityPercentage(stats.lastDay, stats.totalUsers)}% of total users
          </div>
        </div>

        <div className="card pulse">
          <div className="card-header">
            📅 Active Last 7 Days
          </div>
          <div className="card-value text-info">
            {formatNumber(stats.last7Days)}
          </div>
          <div className="card-subtitle">
            {getActivityPercentage(stats.last7Days, stats.totalUsers)}% of total users
          </div>
        </div>

        <div className="card pulse">
          <div className="card-header">
            📆 Active Last 30 Days
          </div>
          <div className="card-value text-warning">
            {formatNumber(stats.lastMonth)}
          </div>
          <div className="card-subtitle">
            {getActivityPercentage(stats.lastMonth, stats.totalUsers)}% of total users
          </div>
        </div>

        <div className="card pulse">
          <div className="card-header">
            👥 Total Registered Users
          </div>
          <div className="card-value text-primary">
            {formatNumber(stats.totalUsers)}
          </div>
          <div className="card-subtitle">
            All time registrations
          </div>
        </div>
      </div>

      {/* Activity Insights */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            📈 Activity Insights
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            <p><strong>Daily Active Rate:</strong> {getActivityPercentage(stats.lastDay, stats.totalUsers)}%</p>
            <p><strong>Weekly Active Rate:</strong> {getActivityPercentage(stats.last7Days, stats.totalUsers)}%</p>
            <p><strong>Monthly Active Rate:</strong> {getActivityPercentage(stats.lastMonth, stats.totalUsers)}%</p>
            <p><strong>Engagement Level:</strong> {
              getActivityPercentage(stats.last7Days, stats.totalUsers) > 70 ? 
                <span className="text-success">High</span> : 
                getActivityPercentage(stats.last7Days, stats.totalUsers) > 40 ? 
                  <span className="text-warning">Medium</span> : 
                  <span className="text-danger">Low</span>
            }</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            🎯 Activity Trends
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            <p><strong>Recent Activity:</strong> {stats.lastDay} users active today</p>
            <p><strong>Weekly Growth:</strong> {stats.last7Days - stats.lastDay} additional active users this week</p>
            <p><strong>Monthly Growth:</strong> {stats.lastMonth - stats.last7Days} additional active users this month</p>
            <p><strong>Retention Rate:</strong> {
              stats.lastMonth > 0 ? 
                <span className="text-success">{Math.round((stats.last7Days / stats.lastMonth) * 100)}%</span> : 
                <span className="text-muted">N/A</span>
            }</p>
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="card">
        <div className="card-header">
          📊 Activity Timeline
        </div>
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.6)',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
          <p>Activity timeline visualization would go here</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            This could show daily/weekly activity patterns over time
          </p>
        </div>
      </div>

      {/* Live Update Indicator */}
      <div className="text-center mt-3">
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: 'rgba(79, 209, 197, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid rgba(79, 209, 197, 0.3)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4fd1c5',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{ fontSize: '0.9rem', color: '#4fd1c5' }}>
            Live Activity Data - Updates automatically
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;
