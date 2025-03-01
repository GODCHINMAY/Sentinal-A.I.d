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
      padding: '20px',
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '3.5rem',
          marginBottom: '30px',
          fontWeight: '700'
        }}>
          Analyze Disaster Footage
        </h1>
        <p style={{
          color: '#B0B0B0',
          fontSize: '1.8rem',
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Upload your footage to receive AI-powered analysis of damage severity, critical response needs, and potential hazards.
        </p>
      </div>

      {/* Upload Section */}
      <div style={{
        backgroundColor: '#2A2A2A',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <button 
            className="primary-button" 
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.6rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
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
          <button 
            onClick={handleUpload}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.6rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Upload
          </button>
          <button 
            onClick={handleProcess}
            style={{
              backgroundColor: '#FF5722',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.6rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Process
          </button>
        </div>
      </div>

      {/* Video Preview */}
      {videoURL && (
        <div style={{
          backgroundColor: '#2A2A2A',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '2.4rem',
            marginBottom: '30px',
            textAlign: 'center'
          }}>Video Preview</h2>
          <video 
            controls
            style={{
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              display: 'block',
              borderRadius: '10px'
            }}
          >
            <source src={videoURL} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px'
        }}>
          <div className="loading-spinner"></div>
          <p style={{
            color: '#B0B0B0',
            fontSize: '1.8rem',
            marginTop: '20px'
          }}>Analyzing video footage...</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div style={{
          backgroundColor: '#2A2A2A',
          borderRadius: '20px',
          padding: '40px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '2.4rem',
            marginBottom: '30px',
            textAlign: 'center'
          }}>Analysis Results</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {analysis.map((frame, index) => (
              <div key={index} style={{
                backgroundColor: '#333333',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  borderBottom: '1px solid #444',
                  paddingBottom: '10px'
                }}>Frame {index + 1}</h3>
                
                <div style={{color: '#B0B0B0', fontSize: '1.4rem'}}>
                  <div style={{marginBottom: '15px'}}>
                    <strong>Damage Severity:</strong> {frame.damage_severity}
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <strong>Critical Response Level:</strong> {frame.critical_response_level}
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <strong>Infrastructure:</strong> {frame.infrastructure_affected}
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <strong>Health Hazards:</strong> {frame.health_hazards}
                  </div>
                  <div>
                    <strong>Civilian Rescue:</strong> {frame.civilian_rescue_needed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Analyze 