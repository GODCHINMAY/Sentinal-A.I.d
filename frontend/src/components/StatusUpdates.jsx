import React, { useState, useEffect } from 'react';
import './StatusUpdates.css';

function StatusUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from your backend
    setTimeout(() => {
      setUpdates([
        {
          id: 1,
          message: "Hurricane warning has been issued for coastal regions. Please prepare for potential evacuation.",
          timestamp: "10 minutes ago",
          severity: "high"
        },
        {
          id: 2,
          message: "Relief supplies are being distributed at Central Park. Volunteers are needed to help with distribution.",
          timestamp: "1 hour ago",
          severity: "medium"
        },
        {
          id: 3,
          message: "Road closures reported on Highway 101 due to flooding. Please use alternate routes.",
          timestamp: "2 hours ago",
          severity: "medium"
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="status-updates">
      <h3>Latest Updates</h3>
      {loading ? (
        <p>Loading updates...</p>
      ) : (
        <div className="updates-list">
          {updates.map(update => (
            <div key={update.id} className={`update-item severity-${update.severity}`}>
              <p className="update-message">{update.message}</p>
              <span className="update-time">{update.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusUpdates; 