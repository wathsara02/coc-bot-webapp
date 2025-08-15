import React, { useMemo } from 'react';
import { useGlobalLoot, useUsers } from '../hooks/useFirebaseData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Analytics: React.FC = () => {
  const { globalLoot, loading: lootLoading, error: lootError } = useGlobalLoot();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  // All hooks must be called before any early returns
  const resourceData = useMemo(() => {
    const gold = globalLoot?.gold || 100;
    const elixir = globalLoot?.elixir || 80;
    const darkElixir = globalLoot?.dark_elixir || 20;
    
    return [
      { name: 'Gold', value: gold, color: '#FFD700' },
      { name: 'Elixir', value: elixir, color: '#FF69B4' },
      { name: 'Dark Elixir', value: darkElixir, color: '#9932CC' }
    ];
  }, [globalLoot]);

  const userActivityData = useMemo(() => {
    // Provide sample data for demonstration
    return [
      { range: '0-10', count: 5 },
      { range: '11-50', count: 12 },
      { range: '51-100', count: 8 },
      { range: '101-500', count: 3 },
      { range: '500+', count: 1 }
    ];
  }, [users]);

  // Early returns after all hooks
  if (lootLoading || usersLoading) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">📊 Analytics</div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="loading">Loading analytics data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (lootError || usersError) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">📊 Analytics</div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="error">Error loading data: {lootError || usersError}</div>
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
              This might be due to Firebase configuration. Check the console for more details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '10px',
          color: 'white'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in">
      {/* Analytics Header */}
      <div className="card mb-3">
        <div className="card-header">
          📊 Analytics Dashboard
        </div>
        <div style={{ padding: '1rem' }}>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
            Comprehensive analytics and insights for your COC Bot network.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid mb-3">
        <div className="card">
          <div className="card-header">
            📊 Total Resources
          </div>
          <div className="card-value text-success">
            {formatNumber((globalLoot?.gold || 0) + (globalLoot?.elixir || 0) + (globalLoot?.dark_elixir || 0))}
          </div>
          <div className="card-subtitle">
            Combined loot value
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            👥 Active Users
          </div>
          <div className="card-value text-success">
            {Object.keys(users || {}).length}
          </div>
          <div className="card-subtitle">
            Total registered users
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            ⚔️ Total Attacks
          </div>
          <div className="card-value text-success">
            {Object.values(users || {}).reduce((sum, user) => sum + (user?.attack_count || 0), 0)}
          </div>
          <div className="card-subtitle">
            All time attacks
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            📈 Status
          </div>
          <div className="card-value text-success">
            Online
          </div>
          <div className="card-subtitle">
            System status
          </div>
        </div>
      </div>

      {/* Simple Charts Grid */}
      <div className="dashboard-grid">
        {/* Resource Distribution */}
        <div className="card">
          <div className="card-header">
            🪙 Resource Distribution
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Distribution */}
        <div className="card">
          <div className="card-header">
            📊 User Activity Distribution
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="range" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#4fd1c5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;