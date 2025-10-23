import React, { useState, useMemo } from 'react';
import { useUsers } from '../hooks/useFirebaseData';

const UserData: React.FC = () => {
  const { users, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'registered_time' | 'attack_count' | 'last_online'>('registered_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatDate = (dateString: string): string => {
    try {
      // Handle empty or null dates
      if (!dateString || dateString.trim() === '') {
        return 'Never';
      }

      // Try to parse the date
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getTimeAgo = (dateString: string): string => {
    try {
      // Handle empty or null dates
      if (!dateString || dateString.trim() === '') {
        return 'Never';
      }

      // Try to parse the date
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      // Handle future dates
      if (diffInSeconds < 0) {
        return 'Future date';
      }
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    } catch {
      return 'Unknown';
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];

    let userList = Object.entries(users).map(([deviceId, userData]) => ({
      deviceId,
      ...userData
    }));

    // Filter by search term
    if (searchTerm) {
      userList = userList.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.used_key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort users
    userList.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'registered_time' || sortBy === 'last_online') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        
        // Handle invalid dates by putting them at the end
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        aValue = dateA.getTime();
        bValue = dateB.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return userList;
  }, [users, searchTerm, sortBy, sortOrder]);

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (error) {
    return <div className="error">Failed to load user data: {error}</div>;
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>👥 User Data Management</h1>
        <p>View and manage all registered bot users and their statistics</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="card mb-3">
        <div className="card-header">
          🔍 Search & Filter
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search by name, device ID, or key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="registered_time">Registration Date</option>
              <option value="name">Name</option>
              <option value="attack_count">Attack Count</option>
              <option value="last_online">Last Online</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* User Statistics Summary */}
      <div className="stats-grid mb-3">
        <div className="card">
          <div className="card-header">Total Users</div>
          <div className="card-value text-primary">{formatNumber(Object.keys(users || {}).length)}</div>
        </div>
        <div className="card">
          <div className="card-header">Filtered Results</div>
          <div className="card-value text-info">{formatNumber(filteredAndSortedUsers.length)}</div>
        </div>
        <div className="card">
          <div className="card-header">Total Attacks</div>
          <div className="card-value text-success">
            {formatNumber(filteredAndSortedUsers.reduce((sum, user) => sum + user.attack_count, 0))}
          </div>
        </div>
        <div className="card">
          <div className="card-header">Total Resources</div>
          <div className="card-value text-warning">
            {formatNumber(filteredAndSortedUsers.reduce((sum, user) => 
              sum + user.loot.gold + user.loot.elixir + user.loot.dark_elixir, 0
            ))}
          </div>
        </div>
      </div>

      {/* User Data Table */}
      <div className="card">
        <div className="card-header">
          📋 User Details ({filteredAndSortedUsers.length} users)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            <thead>
              <tr style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>User</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>Device ID</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>Key Used</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>Attacks</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>Resources</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>Registered</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>Last Online</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user, index) => (
                <tr 
                  key={user.deviceId}
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{user.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {user.device_id}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {user.used_key}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <span className="text-success">{formatNumber(user.attack_count)}</span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div>🪙 {formatNumber(user.loot.gold)}</div>
                      <div>💧 {formatNumber(user.loot.elixir)}</div>
                      <div>⚫ {formatNumber(user.loot.dark_elixir)}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>
                    {formatDate(user.registered_time)}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>
                    {user.last_online ? (
                      <div>
                        <div>{formatDate(user.last_online)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {getTimeAgo(user.last_online)}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Never</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedUsers.length === 0 && (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.6)' 
          }}>
            {searchTerm ? 'No users found matching your search criteria' : 'No users found'}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="card-header">
          📤 Export Options
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <button
            onClick={() => {
              const csvData = filteredAndSortedUsers.map(user => ({
                name: user.name,
                device_id: user.device_id,
                used_key: user.used_key,
                attack_count: user.attack_count,
                gold: user.loot.gold,
                elixir: user.loot.elixir,
                dark_elixir: user.loot.dark_elixir,
                registered_time: user.registered_time,
                last_online: user.last_online || 'Never'
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `user-data-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              border: '1px solid rgba(79, 209, 197, 0.3)',
              background: 'rgba(79, 209, 197, 0.1)',
              color: '#4fd1c5',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            📊 Export as CSV
          </button>
          
          <button
            onClick={() => {
              const jsonData = filteredAndSortedUsers;
              const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              border: '1px solid rgba(79, 209, 197, 0.3)',
              background: 'rgba(79, 209, 197, 0.1)',
              color: '#4fd1c5',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            📄 Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserData;
