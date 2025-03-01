import React from 'react'

function Analyze({ 
  handleFileChange, 
  handleUpload, 
  handleProcess, 
  videoURL, 
  loading, 
  analysis 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <h1 className="text-4xl font-bold mb-6" style={{color: 'white'}}>Analyze Footage</h1>
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto 40px',
        padding: '20px',
        borderRadius: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#ff9999',
          marginBottom: '20px'
        }}>How It Works</h2>
        <p style={{
          color: 'white',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          Our AI-powered system analyzes disaster footage frame by frame to provide critical insights across five key metrics:
        </p>
        <ul style={{
          color: 'white',
          listStyle: 'none',
          padding: '0',
          marginBottom: '20px'
        }}>
          <li style={{margin: '10px 0'}}>🔍 Damage Severity (Severe, Moderate, Minor)</li>
          <li style={{margin: '10px 0'}}>⚠️ Critical Response Level (Scale 1-5)</li>
          <li style={{margin: '10px 0'}}>🏗️ Infrastructure Affected</li>
          <li style={{margin: '10px 0'}}>🏥 Health Hazards</li>
          <li style={{margin: '10px 0'}}>🚨 Civilian Rescue Needed</li>
        </ul>
        <p style={{color: 'white', lineHeight: '1.6'}}>
          Upload your footage below to receive a detailed analysis that can help emergency responders make informed decisions.
        </p>
      </div>

      <div className="upload-section" style={{textAlign: 'center', width: '100%'}}>
        <div className="action-buttons" style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
          <button 
            className="primary-button" 
            style={{
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
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
          <button className="primary-button" onClick={handleUpload}>Upload</button>
          <button className="secondary-button" onClick={handleProcess}>Process</button>
        </div>
      </div>

      {videoURL && (
        <div className="video-container" style={{textAlign: 'center', width: '100%', maxWidth: '600px'}}>
          <video className="uploaded-video" controls>
            <source src={videoURL} type="video/mp4" />
          </video>
        </div>
      )}

      {loading && (
        <div className="loading-container" style={{textAlign: 'center', width: '100%'}}>
          <div className="loading-spinner"></div>
          <p>Analyzing video footage...</p>
        </div>
      )}

      {analysis && (
        <div className="frames-container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {analysis.map((frame, index) => (
            <div key={index} className="frame-card">
              <div className="frame-header">
                <h2>Frame {index + 1}</h2>
                <span className={`severity-badge ${frame.damage_severity.toLowerCase()}`}>
                  {frame.damage_severity}
                </span>
              </div>
              <div className="frame-info">
                <div className="info-row">
                  <span className="info-label">Critical Response Level:</span>
                  <span className="info-value">{frame.critical_response_level}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Infrastructure Affected:</span>
                  <span className="info-value">{frame.infrastructure_affected}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Health Hazards:</span>
                  <span className="info-value">{frame.health_hazards}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Civilian Rescue Needed:</span>
                  <span className="info-value">{frame.civilian_rescue_needed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Analyze 