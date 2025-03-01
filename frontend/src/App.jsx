import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  // 1) Select file from local
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVideoURL(URL.createObjectURL(selectedFile));
    }
  };

  // 2) Upload file to backend
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a video first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-video/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Upload failed!");
        return;
      }

      const data = await response.json();
      alert("Video uploaded successfully!");
      setUploadedFileName(data.file_name);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred!");
    }
  };

  // 3) Process the uploaded video
  const handleProcess = async () => {
    if (!uploadedFileName) {
      alert("No video uploaded yet!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/process-video/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: uploadedFileName }),
      });

      if (!response.ok) {
        alert("Processing failed!");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.frames) {
        setAnalysis(data.frames.frames);
      } else {
        alert("No frames returned!");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      alert("An error occurred!");
    }
    setLoading(false);
  };

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      padding: '20px'
    }}>
      <div className="hero-section" style={{textAlign: 'center', width: '100%'}}>
        <h1>Sentinel AI</h1>
        <h2>Revolutionizing Disaster Response Through AI-Powered Analysis</h2>
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
  );
}

export default App;
