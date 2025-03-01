import React from 'react'
import './Analyze.css'
import '../components/AnalysisCharts.css'
import EnhancedCharts from '../components/EnhancedCharts'
import InfrastructureHeatmap from '../components/InfrastructureHeatmap'

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
              
              {/* Add the infrastructure heatmap */}
              {analysis && analysis.length > 0 && (
                <div className="infrastructure-heatmap-container">
                  <h3 className="heatmap-title">Infrastructure Impact Analysis</h3>
                  <InfrastructureHeatmap analysis={analysis} />
                </div>
              )}
            </div>

            {/* Charts Section */}
            {analysis && (
              <div className="charts-section">
                <EnhancedCharts analysis={analysis} />
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