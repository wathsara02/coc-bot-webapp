import React from 'react';
import { useGlobalLoot, useUsers, useNews } from '../hooks/useFirebaseData';

const Dashboard: React.FC = () => {
  const { globalLoot, loading: lootLoading, error: lootError } = useGlobalLoot();
  const { userCount, loading: usersLoading, error: usersError } = useUsers();
  const { news, loading: newsLoading } = useNews();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (lootLoading || usersLoading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="fade-in">
      {/* News Banner */}
      {!newsLoading && news && (
        <div className="card mb-3">
          <div className="card-header">
            📢 Latest News
          </div>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
            {news}
          </p>
        </div>
      )}

      {/* Global Statistics */}
      <div className="stats-grid">
        <div className="card pulse">
          <div className="card-header">
            🪙 Total Gold Farmed
          </div>
          {lootError ? (
            <div className="error">Failed to load gold data</div>
          ) : (
            <>
              <div className="card-value text-gold">
                {formatNumber(globalLoot.gold)}
              </div>
              <div className="card-subtitle">
                Collected by all bots
              </div>
            </>
          )}
        </div>

        <div className="card pulse">
          <div className="card-header">
            <img src="https://cdn3.emoji.gg/emojis/91000-elixir.png" width="20px" height="20px" alt="Elixir" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Total Elixir Farmed
          </div>
          {lootError ? (
            <div className="error">Failed to load elixir data</div>
          ) : (
            <>
              <div className="card-value text-elixir">
                {formatNumber(globalLoot.elixir)}
              </div>
              <div className="card-subtitle">
                Collected by all bots
              </div>
            </>
          )}
        </div>

        <div className="card pulse">
          <div className="card-header">
            <img src="https://cdn3.emoji.gg/emojis/90110-darkelixir.png" width="20px" height="20px" alt="Dark Elixir" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Total Dark Elixir Farmed
          </div>
          {lootError ? (
            <div className="error">Failed to load dark elixir data</div>
          ) : (
            <>
              <div className="card-value text-dark-elixir">
                {formatNumber(globalLoot.dark_elixir)}
              </div>
              <div className="card-subtitle">
                Collected by all bots
              </div>
            </>
          )}
        </div>

        <div className="card pulse">
          <div className="card-header">
            👥 Active Users
          </div>
          {usersError ? (
            <div className="error">Failed to load user data</div>
          ) : (
            <>
              <div className="card-value text-success">
                {userCount}
              </div>
              <div className="card-subtitle">
                Registered bot users
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            📊 Bot Performance
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            <p><strong>Total Resources:</strong> {formatNumber(globalLoot.gold + globalLoot.elixir + globalLoot.dark_elixir)}</p>
            <p><strong>Average per User:</strong> {userCount > 0 ? formatNumber(Math.floor((globalLoot.gold + globalLoot.elixir) / userCount)) : '0'}</p>
            <p><strong>Status:</strong> <span className="text-success">All systems operational</span></p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            🎯 Quick Stats
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            <p><strong>Most Valuable Resource:</strong> {
              globalLoot.gold > globalLoot.elixir && globalLoot.gold > globalLoot.dark_elixir
                ? '🪙 Gold'
                : globalLoot.elixir > globalLoot.dark_elixir
                  ? <span><img src="https://cdn3.emoji.gg/emojis/91000-elixir.png" width="16px" height="16px" alt="Elixir" style={{ marginRight: '4px', verticalAlign: 'middle' }} />Elixir</span>
                  : <span><img src="https://cdn3.emoji.gg/emojis/90110-darkelixir.png" width="16px" height="16px" alt="Dark Elixir" style={{ marginRight: '4px', verticalAlign: 'middle' }} />Dark Elixir</span>
            }</p>
            <p><strong>Bot Network:</strong> <span className="text-success">Active</span></p>
            <p><strong>Data Updates:</strong> <span className="text-success">Real-time</span></p>
          </div>
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
            Live Data - Updates automatically
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;