import React, { useState } from "react";
import "./App.css";
import favicon from "./favicon.ico";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import About from './pages/About'
import Analyze from './pages/Analyze'
import SOS from './pages/SOS';
import Aid from './pages/Aid';
import backgroundVideo from './assets/dronefootage.mp4';

// Add favicon link tag
const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);

// Fade-in animation
const fadeInAnimation = {
  opacity: 0,
  animation: 'fadeIn 1s ease-in forwards'
};

// SOS Button style
const sosButtonStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: '#ff3333',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '1.4rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  zIndex: 2000,
  boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
  animation: 'pulse-light 2s infinite'
};

// Layout Component
function Layout({ children, isHomePage = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSOSClick = () => {
    navigate('/sos');
  };
  
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '0',
      position: 'relative',
    }}>
      {/* Background Video for Home Page */}
      {isHomePage && (
        <div className="video-background">
          <video autoPlay loop muted playsInline className="background-video">
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* 
            Lighten the overlay to ensure drone is more visible.
            Adjust the opacity as needed. Example: 0.2 or 0.3 
          */}
          <div className="video-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 1
          }}></div>
        </div>
      )}
      
      {/* SOS Button */}
      <button 
        style={sosButtonStyle}
        onClick={handleSOSClick}
      >
        SOS
      </button>
      
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '560px',
        maxWidth: '560px',
        margin: '30px auto',
        padding: '10px 28px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: '#333333',
        borderRadius: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        ...fadeInAnimation,
      }}>
        <div style={{
          display: 'flex',
          gap: '42px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Link
            to="/" 
            style={{
              color: location.pathname === "/" ? 'white' : '#B0B0B0',
              textDecoration: 'none',
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              fontSize: '1.26rem',
              fontWeight: location.pathname === "/" ? '700' : '400',
              letterSpacing: '0.35px',
              transition: 'all 0.3s ease',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Home
          </Link>
          {['analyze', 'aid', 'about'].map(path => (
            <Link 
              key={path}
              to={`/${path}`} 
              style={{
                color: location.pathname === `/${path}` ? 'white' : '#B0B0B0',
                textDecoration: 'none',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontSize: '1.26rem',
                fontWeight: location.pathname === `/${path}` ? '700' : '400',
                letterSpacing: '0.35px',
                transition: 'all 0.3s ease',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          ))}
        </div>
      </nav>

      <div style={{
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '1400px',
        margin: '20px auto',
        minHeight: 'calc(100vh - 200px)',
        ...fadeInAnimation,
        animationDelay: '0.3s',
        position: 'relative',
        zIndex: 2
      }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [frameImages, setFrameImages] = useState([]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVideoURL(URL.createObjectURL(selectedFile));
      
      try {
        const extractedFrames = await extractFramesFromVideo(selectedFile);
        setFrameImages(extractedFrames);
      } catch (error) {
        console.error("Error extracting frames:", error);
      }
    }
  };

  const extractFramesFromVideo = (videoFile, numFrames = 5) => {
    return new Promise((resolve) => {
      const frames = [];
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const interval = duration / (numFrames + 1);
        let framesProcessed = 0;
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        video.width = 640;
        video.height = 360;
        canvas.width = 640;
        canvas.height = 360;
        
        const captureFrame = (time) => {
          video.currentTime = time;
          video.onseeked = () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/jpeg');
            frames.push({ time, dataURL });
            framesProcessed++;
            if (framesProcessed === numFrames) {
              resolve(frames);
            } else {
              captureFrame(interval * (framesProcessed + 1));
            }
          };
        };
        
        captureFrame(interval);
      };
    });
  };

  // Upload file to backend
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

  // Process the uploaded video
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
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout isHomePage={true}>
              {/* 
                Main Hero Section 
                Removed the "Make Better Informed..." text entirely.
              */}
              <div className="app-container" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}>
                <h1 style={{ 
                  margin: '4% 0 0 0', 
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
                  color: 'red',
                  fontSize: '3rem'
                }}>
                  Sentinal-A.I.d
                </h1>
                <h2 style={{ 
                  margin: '10px 0 30px 0', 
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', 
                  color: '#ffffff',
                  fontSize: '1.8rem'
                }}>
                  Revolutionizing Disaster Response Through{" "}
                  <span style={{ textDecoration: 'underline' }}>
                    <em>AI-Powered Analysis</em>
                  </span>
                </h2>
              </div>
              
              {/* 
                Platform Info 
                Shifted down slightly so the drone background is more visible
              */}
              <div 
                className="platform-info" 
                style={{
                  marginTop: '100px',
                  padding: '20px',
                  maxWidth: '1200px',
                  width: '100%',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '10px'
                }}
              >
                <p style={{
                  fontSize: '1.3rem',
                  textAlign: 'center',
                  marginBottom: '30px',
                  fontWeight: '500'
                }}>
                  Sentinel-A.I.d is at the forefront of modern disaster response. By merging 
                  state-of-the-art drone technology with AI-driven analysis and a dynamic 
                  community support network, we deliver real-time insights, rapid aid 
                  coordination, and emergency intervention designed to save lives and 
                  restore communities.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div style={{
                    flex: '1',
                    margin: '0 10px',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '10px'
                  }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Analyze</h3>
                    <ul>
                      <li>Real-time analysis of drone footage</li>
                      <li>Assessment of infrastructure damage</li>
                      <li>Identification of hazards and risks</li>
                      <li>Actionable insights for emergency response</li>
                    </ul>
                  </div>
                  <div style={{
                    flex: '1',
                    margin: '0 10px',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '10px'
                  }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Aid</h3>
                    <ul>
                      <li>Community-driven supply network</li>
                      <li>Request and offer essential supplies</li>
                      <li>Drone-enabled delivery system</li>
                      <li>Efficient coordination of relief efforts</li>
                    </ul>
                  </div>
                  <div style={{
                    flex: '1',
                    margin: '0 10px',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '10px'
                  }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>SOS</h3>
                    <ul>
                      <li>Immediate emergency request form</li>
                      <li>Rapid dispatch of drones for live footage</li>
                      <li>On-demand delivery of critical supplies</li>
                      <li>Swift action to stabilize crises</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Layout>
          } 
        />
        
        <Route 
          path="/analyze" 
          element={
            <Layout>
              <Analyze 
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
                handleProcess={handleProcess}
                videoURL={videoURL}
                loading={loading}
                analysis={analysis}
                frameImages={frameImages}
              />
            </Layout>
          } 
        />
        
        <Route 
          path="/about" 
          element={
            <Layout>
              <About />
            </Layout>
          } 
        />
        
        <Route path="/sos" element={<SOS />} />
        
        <Route 
          path="/aid" 
          element={
            <Layout>
              <Aid />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
