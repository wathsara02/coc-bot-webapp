import React, { useMemo } from 'react';
import { useFeedback } from '../hooks/useFirebaseData';

const Feedback: React.FC = () => {
  const { feedback, loading, error } = useFeedback();

  const sortedFeedback = useMemo(() => {
    if (!feedback) return [];
    
    return Object.entries(feedback)
      .map(([id, feedbackData]) => ({
        id,
        ...feedbackData
      }))
      .sort((a, b) => {
        // Sort by timestamp (newest first)
        const dateA = new Date(a.timestamp.split(' ').reverse().join('-'));
        const dateB = new Date(b.timestamp.split(' ').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
  }, [feedback]);

  const feedbackStats = useMemo(() => {
    if (!sortedFeedback.length) return { total: 0, recent: 0, users: 0 };
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recent = sortedFeedback.filter(item => {
      const feedbackDate = new Date(item.timestamp.split(' ').reverse().join('-'));
      return feedbackDate >= oneDayAgo;
    }).length;
    
    const uniqueUsers = new Set(sortedFeedback.map(item => item.user_name)).size;
    
    return {
      total: sortedFeedback.length,
      recent,
      users: uniqueUsers
    };
  }, [sortedFeedback]);

  const formatTimestamp = (timestamp: string): string => {
    try {
      // Convert DD/MM/YYYY HH:MM to a proper date
      const [datePart, timePart] = timestamp.split(' ');
      const [day, month, year] = datePart.split('/');
      const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);
      
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return timestamp;
      }
    } catch {
      return timestamp;
    }
  };

  const getSentimentColor = (feedback: string): string => {
    const lowerFeedback = feedback.toLowerCase();
    if (lowerFeedback.includes('great') || lowerFeedback.includes('excellent') || lowerFeedback.includes('amazing') || lowerFeedback.includes('love')) {
      return '#4fd1c5'; // Positive - teal
    } else if (lowerFeedback.includes('bug') || lowerFeedback.includes('error') || lowerFeedback.includes('problem') || lowerFeedback.includes('issue')) {
      return '#f56565'; // Negative - red
    } else if (lowerFeedback.includes('suggest') || lowerFeedback.includes('feature') || lowerFeedback.includes('improve')) {
      return '#ed8936'; // Suggestion - orange
    }
    return '#4fd1c5'; // Default - teal
  };

  if (loading) {
    return <div className="loading">Loading feedback data...</div>;
  }

  if (error) {
    return <div className="error">Failed to load feedback: {error}</div>;
  }

  return (
    <div className="fade-in">
      {/* Feedback Statistics */}
      <div className="stats-grid mb-3">
        <div className="card">
          <div className="card-header">
            💬 Total Feedback
          </div>
          <div className="card-value text-success">
            {feedbackStats.total}
          </div>
          <div className="card-subtitle">
            All time feedback received
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            🕒 Recent Feedback
          </div>
          <div className="card-value text-success">
            {feedbackStats.recent}
          </div>
          <div className="card-subtitle">
            In the last 24 hours
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            👥 Active Users
          </div>
          <div className="card-value text-success">
            {feedbackStats.users}
          </div>
          <div className="card-subtitle">
            Users who provided feedback
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            📊 Engagement Rate
          </div>
          <div className="card-value text-success">
            {feedbackStats.users > 0 ? Math.round((feedbackStats.users / feedbackStats.total) * 100) : 0}%
          </div>
          <div className="card-subtitle">
            User participation rate
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="card">
        <div className="card-header">
          📝 User Feedback
        </div>
        
        {sortedFeedback.length === 0 ? (
          <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.6)', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No feedback yet</h3>
            <p>User feedback will appear here when submitted through the bot.</p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {sortedFeedback.map((item) => (
              <div 
                key={item.id} 
                className="feedback-item"
                style={{ borderLeftColor: getSentimentColor(item.feedback) }}
              >
                <div className="feedback-header">
                  <div className="feedback-user">
                    👤 {item.user_name || 'Anonymous'}
                  </div>
                  <div className="feedback-time">
                    {formatTimestamp(item.timestamp)}
                  </div>
                </div>
                <div className="feedback-content">
                  {item.feedback}
                </div>
                {item.device_id && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(255, 255, 255, 0.4)', 
                    marginTop: '0.5rem',
                    fontFamily: 'monospace'
                  }}>
                    Device: {item.device_id.substring(0, 20)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Insights */}
      {sortedFeedback.length > 0 && (
        <div className="dashboard-grid mt-3">
          <div className="card">
            <div className="card-header">
              🔍 Feedback Insights
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
              <p><strong>Most Active User:</strong> {
                Object.entries(
                  sortedFeedback.reduce((acc, item) => {
                    acc[item.user_name] = (acc[item.user_name] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
              }</p>
              <p><strong>Average Length:</strong> {Math.round(
                sortedFeedback.reduce((sum, item) => sum + item.feedback.length, 0) / sortedFeedback.length
              )} characters</p>
              <p><strong>Latest Feedback:</strong> {formatTimestamp(sortedFeedback[0]?.timestamp || '')}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              📈 Feedback Trends
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
              <p><strong>Positive Keywords:</strong> {
                sortedFeedback.filter(item => 
                  /great|excellent|amazing|love|good|perfect/i.test(item.feedback)
                ).length
              } mentions</p>
              <p><strong>Issues Reported:</strong> {
                sortedFeedback.filter(item => 
                  /bug|error|problem|issue|crash|fail/i.test(item.feedback)
                ).length
              } reports</p>
              <p><strong>Feature Requests:</strong> {
                sortedFeedback.filter(item => 
                  /suggest|feature|improve|add|request/i.test(item.feedback)
                ).length
              } suggestions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;