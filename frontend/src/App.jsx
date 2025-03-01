import React, { useState } from "react";
import "./App.css";
import favicon from "./favicon.ico";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Information from './pages/Information'
import About from './pages/About'
import Analyze from './pages/Analyze'
import Rebuild from './pages/Rebuild'
import EarthDroneAnimation from "./pages/Globe";
import SOS from './pages/SOS';

// Add favicon link tag
const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);

// Add animation styles at the top of the file
const fadeInAnimation = {
  opacity: 0,
  animation: 'fadeIn 1s ease-in forwards'
};

// Add this CSS to your App.css or inline styles
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

// Move Layout outside of App and use useLocation here
function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSOSClick = () => {
    navigate('/sos');
  };
  
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '0',
      paddingTop: '0',
    }}>
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
          <Link  // Home link
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
          {['analyze', 'information', 'rebuild', 'about'].map(path => (
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
        animationDelay: '0.3s'
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
  const [showInfo, setShowInfo] = useState(false);
  const [frameImages, setFrameImages] = useState([]);

  // Update the handleFileChange function to extract frames
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVideoURL(URL.createObjectURL(selectedFile));
      
      // Extract frames when a video is selected
      try {
        // Call the extractFrames function from Analyze component
        const extractedFrames = await extractFramesFromVideo(selectedFile);
        setFrameImages(extractedFrames);
      } catch (error) {
        console.error("Error extracting frames:", error);
      }
    }
  };

  // Add this helper function to extract frames
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
        
        // Create canvas for frame extraction
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set dimensions
        video.width = 640;
        video.height = 360;
        canvas.width = 640;
        canvas.height = 360;
        
        // Function to capture a frame at a specific time
        const captureFrame = (time) => {
          video.currentTime = time;
          
          video.onseeked = () => {
            // Draw the video frame to the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL('image/jpeg');
            frames.push({
              time: time,
              dataURL: dataURL
            });
            
            framesProcessed++;
            
            // If we've processed all frames, resolve the promise
            if (framesProcessed === numFrames) {
              resolve(frames);
            } else {
              // Capture the next frame
              captureFrame(interval * (framesProcessed + 1));
            }
          };
        };
        
        // Start capturing frames
        captureFrame(interval);
      };
    });
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
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <div className="app-container" style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}>
              <h1 style={{ margin: '4% 0 0 0', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', color: 'red' }}>Sentinal-A.I.d</h1>
              <h2 style={{ margin: '0', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
                Revolutionizing Disaster Response Through <span style={{ textDecoration: 'underline' }}><em>AI-Powered Analysis</em></span>
              </h2>
              <div style={{margin: '0', display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                <div style={{ flex: 1, display: 'flex' , justifyContent: 'center' }}>
                  <EarthDroneAnimation />
                </div>
                <div style={{ flex: 1, textAlign: 'left', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="info-section" style={{
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: '0',
                    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
                  }}>
                    <h2 style={{
                      color: 'white',
                      fontSize: '2.5rem',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      backgroundColor: 'transparent'
                    }}>
                      Make Better Informed Decisions When in Emergency Situations
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        } />
        <Route path="/analyze" element={
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
        } />
        <Route path="/information" element={
          <Layout>
            <Information />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/rebuild" element={
          <Layout>
            <Rebuild />
          </Layout>
        } />
        <Route path="/sos" element={<SOS />} />
      </Routes>
    </Router>
  );
}

export default App;
