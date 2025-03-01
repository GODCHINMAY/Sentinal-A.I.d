import React, { useState, useEffect } from 'react';
import earthImage from '../assets/earth.png';
import droneImage from '../assets/pngegg.png';

const EarthDroneAnimation = () => {
    // State for animation values
    const [earthRotation, setEarthRotation] = useState(0);
    const [drone1Position, setDrone1Position] = useState({ x: 0, y: 0 });
    const [drone2Position, setDrone2Position] = useState({ x: 0, y: 0 });
  
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
            {/* If the image is in the public folder, use */}
            <img 
              src={earthImage} // Adjust the path if necessary
              alt="Earth" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', zIndex: 100 }}
            />
            {/* Or, if using imports from src folder, use the imported variable */}
            {/* <img src={earthImage} alt="Earth" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> */}
          </div>
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
              src={droneImage} // Adjust the path if necessary
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
              src={droneImage} // Placeholder image path, or adjust accordingly
              alt="Drone 2" 
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default EarthDroneAnimation;