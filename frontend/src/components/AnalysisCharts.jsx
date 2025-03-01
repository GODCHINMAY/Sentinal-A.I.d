import React from 'react';

function AnalysisCharts({ analysis }) {
  // Process data for damage severity
  const severityCounts = analysis.reduce((acc, frame) => {
    acc[frame.damage_severity] = (acc[frame.damage_severity] || 0) + 1;
    return acc;
  }, {});
  
  const total = analysis.length;
  const severeCount = severityCounts['Severe'] || 0;
  const moderateCount = severityCounts['Moderate'] || 0;
  const minorCount = severityCounts['Minor'] || 0;
  
  // Process data for critical response levels
  const levelCounts = {};
  analysis.forEach(frame => {
    const level = frame.critical_response_level;
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  });
  
  const levels = Object.keys(levelCounts).sort((a, b) => a - b);
  const maxCount = Math.max(...Object.values(levelCounts));

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Damage Severity Distribution</h3>
        <div className="pie-chart-container">
          <div className="pie-legend">
            {severeCount > 0 && (
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#ff4d4d' }}></span>
                <span>Severe: {severeCount} ({Math.round(severeCount/total*100)}%)</span>
              </div>
            )}
            {moderateCount > 0 && (
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#ffa500' }}></span>
                <span>Moderate: {moderateCount} ({Math.round(moderateCount/total*100)}%)</span>
              </div>
            )}
            {minorCount > 0 && (
              <div className="legend-item">
                <span className="color-box" style={{ backgroundColor: '#4CAF50' }}></span>
                <span>Minor: {minorCount} ({Math.round(minorCount/total*100)}%)</span>
              </div>
            )}
          </div>
          <div className="pie-visualization">
            <div className="pie-chart">
              {severeCount > 0 && (
                <div 
                  className="pie-slice severe" 
                  style={{ 
                    transform: `rotate(0deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * severeCount / total)}% ${50 - 50 * Math.sin(2 * Math.PI * severeCount / total)}%, 50% 50%)`
                  }}
                ></div>
              )}
              {moderateCount > 0 && (
                <div 
                  className="pie-slice moderate" 
                  style={{ 
                    transform: `rotate(${360 * severeCount / total}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * moderateCount / total)}% ${50 - 50 * Math.sin(2 * Math.PI * moderateCount / total)}%, 50% 50%)`
                  }}
                ></div>
              )}
              {minorCount > 0 && (
                <div 
                  className="pie-slice minor" 
                  style={{ 
                    transform: `rotate(${360 * (severeCount + moderateCount) / total}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * minorCount / total)}% ${50 - 50 * Math.sin(2 * Math.PI * minorCount / total)}%, 50% 50%)`
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-box">
        <h3>Critical Response Levels</h3>
        <div className="bar-chart-container">
          {levels.map(level => (
            <div key={level} className="bar-group">
              <div className="bar-label">Level {level}</div>
              <div className="bar-wrapper">
                <div 
                  className="bar" 
                  style={{ 
                    width: `${(levelCounts[level] / maxCount) * 100}%`,
                    backgroundColor: level >= 4 ? '#ff4d4d' : level >= 2 ? '#ffa500' : '#4CAF50'
                  }}
                ></div>
                <span className="bar-value">{levelCounts[level]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalysisCharts; 