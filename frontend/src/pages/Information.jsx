import React, { useState, useEffect } from 'react'
import './Information.css';
import EarthDroneAnimation from "./Globe";

function Information() {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Show all content after a 1-second delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const metrics = [
    {
      title: "Damage Severity Analysis",
      icon: "🔍",
      description: "Our AI evaluates the extent of damage in disaster areas, categorizing it into three levels: Severe, Moderate, and Minor. This helps prioritize response efforts.",
    },
    {
      title: "Critical Response Level",
      icon: "⚠️",
      description: "A scale from 1-5 indicating the urgency of response needed, considering multiple factors like population density and infrastructure impact.",
    },
    {
      title: "Infrastructure Assessment",
      icon: "🏗️",
      description: "Detailed analysis of affected infrastructure components, helping response teams understand which critical systems need immediate attention.",
    },
    {
      title: "Health Hazard Detection",
      icon: "🏥",
      description: "Identification of potential health risks in disaster zones, enabling medical teams to prepare appropriate responses.",
    },
    {
      title: "Civilian Rescue Priorities",
      icon: "🚨",
      description: "Binary assessment (Affirmative/Negative) of immediate civilian rescue needs, helping coordinate evacuation and rescue operations.",
    }
  ]

  // Fade-in animation style
  const fadeInStyle = {
    opacity: showContent ? 1 : 0,
    transition: 'opacity 0.5s ease-in',
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      {/* Add Globe component at the top */}
      <div className="globe-container" style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '30px 0 60px 0',
        height: '400px'
      }}>
        <EarthDroneAnimation />
      </div>
      
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
          AI Analysis Metrics
        </h1>
        <p style={{
          color: '#B0B0B0',
          fontSize: '1.8rem',
          maxWidth: '1000px',
          margin: '0 auto',
          lineHeight: '1.6',
          ...fadeInStyle
        }}>
          Our advanced AI system analyzes disaster footage through five key metrics, providing emergency responders with critical insights for immediate action and resource allocation.
        </p>
      </div>
      
      {/* First row - 3 cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {metrics.slice(0, 3).map((metric, index) => (
          <div key={index} style={{
            backgroundColor: '#2A2A2A',
            borderRadius: '20px',
            padding: '35px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{fontSize: '60px', marginBottom: '25px'}}>{metric.icon}</div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '2.4rem',
              marginBottom: '25px',
              fontWeight: '600'
            }}>{metric.title}</h3>
            <p style={{
              color: '#B0B0B0',
              fontSize: '1.6rem',
              lineHeight: '1.6',
              flex: 1,
              ...fadeInStyle
            }}>
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* Second row - 2 centered cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px'
      }}>
        {metrics.slice(3).map((metric, index) => (
          <div key={index} style={{
            backgroundColor: '#2A2A2A',
            borderRadius: '20px',
            padding: '35px',
            minHeight: '300px',
            width: '500px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{fontSize: '60px', marginBottom: '25px'}}>{metric.icon}</div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '2.4rem',
              marginBottom: '25px',
              fontWeight: '600'
            }}>{metric.title}</h3>
            <p style={{
              color: '#B0B0B0',
              fontSize: '1.6rem',
              lineHeight: '1.6',
              flex: 1,
              ...fadeInStyle
            }}>
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Information 