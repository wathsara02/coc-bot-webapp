import React, { useMemo } from 'react';
import { useUsers } from '../hooks/useFirebaseData';

const Leaderboard: React.FC = () => {
  const { users, loading, error } = useUsers();

  const topUsersByAttacks = useMemo(() => {
    if (!users) return [];
    
    return Object.entries(users)
      .map(([deviceId, userData]) => ({
        deviceId,
        ...userData
      }))
      .sort((a, b) => (b.attack_count || 0) - (a.attack_count || 0))
      .slice(0, 10);
  }, [users]);

  const topUsersByLoot = useMemo(() => {
    if (!users) return [];
    
    return Object.entries(users)
      .map(([deviceId, userData]) => ({
        deviceId,
        ...userData,
        totalLoot: (userData.loot?.gold || 0) + (userData.loot?.elixir || 0) + (userData.loot?.dark_elixir || 0)
      }))
      .sort((a, b) => b.totalLoot - a.totalLoot)
      .slice(0, 10);
  }, [users]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getRankEmoji = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (loading) {
    return <div className="loading">Loading leaderboard data...</div>;
  }

  if (error) {
    return <div className="error">Failed to load leaderboard: {error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="dashboard-grid">
        {/* Top Users by Attacks */}
        <div className="card">
          <div className="card-header">
            ⚔️ Top Users by Attacks
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {topUsersByAttacks.length === 0 ? (
              <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.6)', padding: '2rem' }}>
                No attack data available
              </div>
            ) : (
              topUsersByAttacks.map((user, index) => (
                <div key={user.deviceId} className="leaderboard-item">
                  <div className="leaderboard-rank">
                    {getRankEmoji(index + 1)}
                  </div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">
                      {user.name || 'Unknown User'}
                    </div>
                    <div className="leaderboard-stats">
                      Registered: {user.registered_time || 'Unknown'}
                      {user.last_online && (
                        <> • Last online: {user.last_online}</>
                      )}
                    </div>
                  </div>
                  <div className="leaderboard-value">
                    {user.attack_count || 0} attacks
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Users by Loot */}
        <div className="card">
          <div className="card-header">
            🪙 Top Users by Total Loot
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {topUsersByLoot.length === 0 ? (
              <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.6)', padding: '2rem' }}>
                No loot data available
              </div>
            ) : (
              topUsersByLoot.map((user, index) => (
                <div key={user.deviceId} className="leaderboard-item">
                  <div className="leaderboard-rank">
                    {getRankEmoji(index + 1)}
                  </div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">
                      {user.name || 'Unknown User'}
                    </div>
                    <div className="leaderboard-stats">
                      <span className="text-gold">🪙 {formatNumber(user.loot?.gold || 0)}</span>
                      {' • '}
                      <span className="text-elixir">
                        <img src="https://cdn3.emoji.gg/emojis/91000-elixir.png" width="16px" height="16px" alt="Elixir" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {formatNumber(user.loot?.elixir || 0)}
                      </span>
                      {' • '}
                      <span className="text-dark-elixir">
                        <img src="https://cdn3.emoji.gg/emojis/90110-darkelixir.png" width="16px" height="16px" alt="Dark Elixir" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {formatNumber(user.loot?.dark_elixir || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="leaderboard-value">
                    {formatNumber(user.totalLoot)} total
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid mt-3">
        <div className="card">
          <div className="card-header">
            📊 Attack Leaders Summary
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            {topUsersByAttacks.length > 0 && (
              <>
                <p><strong>Top Attacker:</strong> {topUsersByAttacks[0]?.name || 'Unknown'}</p>
                <p><strong>Most Attacks:</strong> {topUsersByAttacks[0]?.attack_count || 0}</p>
                <p><strong>Average Attacks:</strong> {Math.round(topUsersByAttacks.reduce((sum, user) => sum + (user.attack_count || 0), 0) / topUsersByAttacks.length)}</p>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <img src="https://cdn3.emoji.gg/emojis/90110-darkelixir.png" width="20px" height="20px" alt="Dark Elixir" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Loot Leaders Summary
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            {topUsersByLoot.length > 0 && (
              <>
                <p><strong>Top Farmer:</strong> {topUsersByLoot[0]?.name || 'Unknown'}</p>
                <p><strong>Highest Loot:</strong> {formatNumber(topUsersByLoot[0]?.totalLoot || 0)}</p>
                <p><strong>Average Loot:</strong> {formatNumber(Math.round(topUsersByLoot.reduce((sum, user) => sum + user.totalLoot, 0) / topUsersByLoot.length))}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;