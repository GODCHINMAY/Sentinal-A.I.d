import React, { useState, useEffect } from 'react';
import earthImage from '../assets/earth.png';
import droneImage from '../assets/pngegg.png';

const EarthDroneAnimation = () => {
    // State for animation values
    const [earthRotation, setEarthRotation] = useState(0);
    const [drone1Position, setDrone1Position] = useState({ x: 0, y: 0 });
    const [drone2Position, setDrone2Position] = useState({ x: 0, y: 0 });
    const [showMessage, setShowMessage] = useState(false);
  
    // Animation loop using useEffect
    useEffect(() => {
      const animationFrame = requestAnimationFrame(() => {
        // Update earth rotation (0.2 degrees per frame for double speed)
        setEarthRotation(prev => (prev + 0.2) % 360);
        
        // Update drone positions with sine waves for oscillation
        const time = Date.now() / 1000;
        
        // Drone 1 oscillation (moved 100px to the left)
        setDrone1Position({
          x: Math.sin(time * 2.0) * 10 - 100, // Horizontal movement adjusted
          y: Math.sin(time * 1.4) * 8          // Vertical movement
        });
        
        // Drone 2 oscillation (moved faster)
        setDrone2Position({
          x: Math.sin(time * 2.4) * 12, // Increased speed
          y: Math.sin(time * 1.6) * 10
        });
      });
      
      // Clean up animation frame on unmount
      return () => cancelAnimationFrame(animationFrame);
    });

    // Convert lat/lng to x,y coordinates on the globe
    const latLngToXY = (lat, lng) => {
      // Simple conversion for demonstration
      // This is a very simplified conversion that works for this visual demo
      // Real lat/lng to 3D would be more complex
      
      // Normalize lat from -90/90 to 0/180
      const normalizedLat = (90 - lat) / 180;
      // Normalize lng from -180/180 to 0/360
      const normalizedLng = (lng + 180) / 360;
      
      // Convert to x,y coordinates on the globe
      // Center of globe is at (50%, 50%)
      const radius = 120; // Half of the 240px earth diameter
      
      // Calculate position based on normalized coordinates
      // This is a simple projection that works for the visual effect
      const x = Math.cos(normalizedLng * Math.PI * 2) * Math.sin(normalizedLat * Math.PI) * radius;
      const y = Math.cos(normalizedLat * Math.PI) * radius;
      
      return { x, y };
    };
    
    // Coordinates for Delaware
    const delawareCoords = { lat: 39.680693, lng: -75.753817 };
    const delawareXY = latLngToXY(delawareCoords.lat, delawareCoords.lng);
    
    // Coordinates for a destination point (example)
    const destinationCoords = { lat: 39.65, lng: -75.72 };
    const destinationXY = latLngToXY(destinationCoords.lat, destinationCoords.lng);
  
    return (
      <div style={{ position: 'relative', width: '700px', height: '450px', backgroundColor: '#1e293b', overflow: 'hidden', borderRadius: '12px' }}>
        
        {/* Earth in the center */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${earthRotation}deg)`,
            zIndex: 1 // Ensure it is above the black circle
          }}
        >
          {/* Earth image */}
          <div style={{ width: '240px', height: '240px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={earthImage}
              alt="Earth" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', zIndex: 100 }}
            />
          </div>
          
          {/* Green circle at Delaware coordinates */}
          <div 
            style={{
              position: 'absolute',
              left: `calc(50% + ${delawareXY.x}px)`,
              top: `calc(50% + ${delawareXY.y}px)`,
              width: '12px',
              height: '12px',
              backgroundColor: '#00ff00',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              boxShadow: '0 0 8px #00ff00',
              cursor: 'pointer'
            }}
            onClick={() => setShowMessage(!showMessage)}
          />
          
          {/* Red circle at destination coordinates */}
          <div 
            style={{
              position: 'absolute',
              left: `calc(50% + ${destinationXY.x}px)`,
              top: `calc(50% + ${destinationXY.y}px)`,
              width: '12px',
              height: '12px',
              backgroundColor: '#ff0000',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              boxShadow: '0 0 8px #ff0000'
            }}
          />
          
          {/* Line connecting the points */}
          <svg 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '240px',
              height: '240px',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          >
            <line 
              x1={120 + delawareXY.x} 
              y1={120 + delawareXY.y} 
              x2={120 + destinationXY.x} 
              y2={120 + destinationXY.y} 
              style={{
                stroke: 'rgba(255, 255, 255, 0.7)',
                strokeWidth: '2',
                strokeDasharray: '5,5'
              }} 
            />
          </svg>
        </div>
  
        {/* Drone 1 */}
        <div 
          style={{ 
            position: 'absolute', 
            left: `calc(30% + ${drone1Position.x}px)`, 
            top: `calc(40% + ${drone1Position.y}px)`,
            zIndex: 2 // Ensure it is above the Earth
          }}
        >
          <div style={{ width: '68px', height: '68px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={droneImage}
              alt="Drone 1" 
              style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }}
            />
          </div>
        </div>
  
        {/* Drone 2 */}
        <div 
          style={{ 
            position: 'absolute', 
            left: `calc(70% + ${drone2Position.x}px)`, 
            top: `calc(60% + ${drone2Position.y}px)`,
            zIndex: 2 // Ensure it is above the Earth
          }}
        >
          <div style={{ width: '68px', height: '68px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={droneImage}
              alt="Drone 2" 
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        
        {/* Message popup */}
        {showMessage && (
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '20%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '15px',
              borderRadius: '10px',
              zIndex: 10,
              maxWidth: '300px',
              boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
              border: '1px solid #00ff00'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>Aid Shipment</h3>
            <p style={{ margin: '0 0 5px 0' }}><strong>From:</strong> Nazim Karaca</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Sending:</strong> Water supplies</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Message:</strong> "Hope this helps!"</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Status:</strong> <span style={{ color: '#00ff00' }}>En route</span></p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Coordinates:</strong> 39.680693, -75.753817</p>
            <button 
              style={{
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #00ff00',
                padding: '5px 10px',
                marginTop: '10px',
                cursor: 'pointer',
                borderRadius: '5px'
              }}
              onClick={() => setShowMessage(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default EarthDroneAnimation;