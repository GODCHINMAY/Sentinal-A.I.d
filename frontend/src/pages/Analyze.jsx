import React from 'react'
import './Analyze.css'
import '../components/AnalysisCharts.css'
import AnalysisCharts from '../components/AnalysisCharts'

function Analyze({ 
  handleFileChange, 
  handleUpload, 
  handleProcess, 
  videoURL, 
  loading, 
  analysis,
  frameImages
}) {
  return (
    <div className="analyze-container">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="header-title">Analyze Disaster Footage</h1>
        <p className="header-description">
          Upload your footage to receive AI-powered analysis of damage severity, critical response needs, and potential hazards.
        </p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="button-container">
          <button className="action-button choose-button">
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
            Choose Video
          </button>
          <button className="action-button upload-button" onClick={handleUpload}>
            Upload
          </button>
          <button className="action-button process-button" onClick={handleProcess}>
            Process
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      {videoURL && (
        <div className="content-container-new">
          {/* Top Row: Video Preview and Charts */}
          <div className="top-row">
            {/* Video Preview */}
            <div className="video-preview-section">
              <h2 className="section-title">Video Preview</h2>
              <div className="video-container">
                <video 
                  controls
                  className="video-player"
                >
                  <source src={videoURL} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Charts Section */}
            {analysis && (
              <div className="charts-section">
                <div className="chart-box">
                  <h3>Damage Severity Distribution</h3>
                  <div className="pie-chart-container">
                    <div className="pie-legend">
                      {/* Calculate severity counts */}
                      {(() => {
                        const severityCounts = analysis.reduce((acc, frame) => {
                          acc[frame.damage_severity] = (acc[frame.damage_severity] || 0) + 1;
                          return acc;
                        }, {});
                        
                        const total = analysis.length;
                        const severeCount = severityCounts['Severe'] || 0;
                        const moderateCount = severityCounts['Moderate'] || 0;
                        const minorCount = severityCounts['Minor'] || 0;
                        
                        return (
                          <>
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
                          </>
                        );
                      })()}
                    </div>
                    <div className="pie-visualization">
                      <div className="pie-chart">
                        {/* Render pie slices */}
                        {(() => {
                          const severityCounts = analysis.reduce((acc, frame) => {
                            acc[frame.damage_severity] = (acc[frame.damage_severity] || 0) + 1;
                            return acc;
                          }, {});
                          
                          const total = analysis.length;
                          const severeCount = severityCounts['Severe'] || 0;
                          const moderateCount = severityCounts['Moderate'] || 0;
                          const minorCount = severityCounts['Minor'] || 0;
                          
                          return (
                            <>
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
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chart-box">
                  <h3>Critical Response Levels</h3>
                  <div className="bar-chart-container">
                    {/* Render bar chart */}
                    {(() => {
                      // Process data for critical response levels
                      const levelCounts = {};
                      analysis.forEach(frame => {
                        const level = frame.critical_response_level;
                        levelCounts[level] = (levelCounts[level] || 0) + 1;
                      });
                      
                      const levels = Object.keys(levelCounts).sort((a, b) => a - b);
                      const maxCount = Math.max(...Object.values(levelCounts));
                      
                      return levels.map(level => (
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
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Frames Grid */}
          {analysis && (
            <div className="frames-grid-section">
              <h2 className="section-title">Analysis Results</h2>
              <div className="frames-grid">
                {analysis.map((frame, index) => (
                  <div key={index} className="frame-card">
                    <h3 className="frame-title">Frame {index + 1}</h3>
                    
                    {/* Frame image */}
                    {frameImages && frameImages[index] && (
                      <div className="frame-image-container">
                        <img 
                          src={frameImages[index].dataURL} 
                          alt={`Frame ${index + 1}`} 
                          className="frame-image"
                        />
                        <div className="frame-timestamp">
                          Time: {Math.round(frameImages[index].time * 100) / 100}s
                        </div>
                      </div>
                    )}
                    
                    <div className="metrics-container">
                      <div className="metric-box">
                        <div className="metric-label">Damage Severity:</div>
                        <div className={`metric-value ${
                          frame.damage_severity === 'Severe' ? 'severity-severe' :
                          frame.damage_severity === 'Moderate' ? 'severity-moderate' : 'severity-minor'
                        }`}>
                          {frame.damage_severity === 'Severe' ? '⭕ Severe' :
                           frame.damage_severity === 'Moderate' ? '🟠 Moderate' : '🟢 Minor'}
                        </div>
                      </div>

                      <div className="metric-box">
                        <div className="metric-label">Critical Response Level:</div>
                        <div className="metric-value">
                          <span style={{color: '#FFD700'}}>⚠️</span>
                          <span style={{color: '#ff4d4d', marginLeft: '8px'}}>Level {frame.critical_response_level}</span>
                        </div>
                      </div>

                      <div className="metric-box">
                        <div className="metric-label">Infrastructure:</div>
                        <div className="metric-value">
                          {frame.infrastructure_affected === 'Roads' ? '🛣️ Roads' :
                           frame.infrastructure_affected === 'Schools' ? '🏫 Schools' :
                           frame.infrastructure_affected === 'Hospitals' ? '🏥 Hospitals' :
                           frame.infrastructure_affected === 'Bridges' ? '🌉 Bridges' :
                           frame.infrastructure_affected === 'Utilities' ? '⚡ Utilities' :
                           '🏗️ ' + frame.infrastructure_affected}
                        </div>
                      </div>

                      <div className="metric-box">
                        <div className="metric-label">Health Hazards:</div>
                        <div className="metric-value">
                          {frame.health_hazards === 'None' ? '✅ None' : '⚕️ ' + frame.health_hazards}
                        </div>
                      </div>

                      <div className="metric-box">
                        <div className="metric-label">Civilian Rescue:</div>
                        <div className="metric-value">
                          {frame.civilian_rescue_needed === 'Affirmative' ? '🚨 Required' : '✅ Not Required'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Analyzing video footage...</p>
        </div>
      )}
    </div>
  )
}

export default Analyze 