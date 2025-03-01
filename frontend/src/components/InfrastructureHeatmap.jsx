import React, { useEffect, useState } from 'react';
import './InfrastructureHeatmap.css';

function InfrastructureHeatmap({ analysis }) {
  const [infrastructureData, setInfrastructureData] = useState([]);
  
  useEffect(() => {
    if (!analysis || analysis.length === 0) return;
    
    // Count infrastructure occurrences
    const infrastructureCounts = analysis.reduce((acc, frame) => {
      const type = frame.infrastructure_affected;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array and sort by count (descending)
    const sortedData = Object.entries(infrastructureCounts)
      .map(([type, count]) => ({ 
        type, 
        count, 
        percentage: Math.round((count / analysis.length) * 100) 
      }))
      .sort((a, b) => b.count - a.count);
    
    setInfrastructureData(sortedData);
  }, [analysis]);
  
  // Get icon for infrastructure type
  const getInfrastructureIcon = (type) => {
    switch(type) {
      case 'Roads': return '🛣️';
      case 'Schools': return '🏫';
      case 'Hospitals': return '🏥';
      case 'Bridges': return '🌉';
      case 'Utilities': return '⚡';
      case 'Residential': return '🏘️';
      case 'Commercial': return '🏢';
      case 'Government': return '🏛️';
      case 'Water Systems': return '💧';
      default: return '🏗️';
    }
  };
  
  // Calculate intensity color based on percentage
  const getIntensityColor = (percentage) => {
    // Color gradient focused on violet shades
    if (percentage >= 80) return '#4a148c'; // Very high - deep violet
    if (percentage >= 60) return '#6a1b9a'; // High - dark violet
    if (percentage >= 40) return '#8e24aa'; // Medium-high - medium violet
    if (percentage >= 20) return '#ab47bc'; // Medium - lighter violet
    return '#ce93d8'; // Low - light violet
  };
  
  return (
    <div className="infrastructure-heatmap">
      {infrastructureData.length === 0 ? (
        <p className="no-data">No infrastructure data available</p>
      ) : (
        <>
          <div className="heatmap-description">
            <p>This heatmap shows the frequency of different infrastructure types affected in the analyzed footage.</p>
          </div>
          
          <div className="heatmap-grid">
            {infrastructureData.map((item, index) => (
              <div 
                key={index} 
                className="heatmap-cell"
                style={{ backgroundColor: getIntensityColor(item.percentage) }}
              >
                <div className="cell-icon">{getInfrastructureIcon(item.type)}</div>
                <div className="cell-type">{item.type}</div>
                <div className="cell-stats">
                  <div className="cell-count">{item.count} frames</div>
                  <div className="cell-percentage">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default InfrastructureHeatmap; 