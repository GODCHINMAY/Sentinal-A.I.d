import React, { useState } from "react";
import "./App.css";
import favicon from "./favicon.ico";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Information from './pages/Information'
import About from './pages/About'
import Analyze from './pages/Analyze'

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

// Create a Layout component to wrap all pages
function Layout({ children }) {
  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '150px'  // Increased padding to lower content
    }}>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '800px',
        maxWidth: '800px',
        margin: '30px auto',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: '#333333',
        borderRadius: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',  // Added shadow
        ...fadeInAnimation
      }}>
        <div style={{
          display: 'flex',
          gap: '60px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Link  // Home link
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              fontSize: '1.8rem',
              fontWeight: '700',  // Made bolder
              letterSpacing: '0.5px',
              transition: 'opacity 0.3s',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Home
          </Link>
          {/* Style for other links */}
          {['analyze', 'information', 'about'].map(path => (
            <Link 
              key={path}
              to={`/${path}`} 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontSize: '1.8rem',
                fontWeight: '400',  // Made lighter
                letterSpacing: '0.5px',
                transition: 'opacity 0.3s',
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
              <div className="hero-section" style={{
                textAlign: 'center', 
                width: '100%',
                backgroundColor: 'transparent'  // Added to remove background
              }}>
                <h1>Sentinel AI</h1>
                <h2>Revolutionizing Disaster Response Through AI-Powered Analysis</h2>
              </div>

              <div className="info-section" style={{
                textAlign: 'center',
                width: '100%',
                marginBottom: '40px',
                fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
              }}>
                <h2 style={{
                  color: '#ffffff',
                  fontSize: '2.5rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  backgroundColor: 'transparent'  // Added to ensure no background
                }}>
                  Make Better Informed Decisions When in Emergency Situations
                </h2>
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
      </Routes>
    </Router>
  );
}

export default App;
