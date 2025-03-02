import React, { useEffect, useState } from 'react';
import droneImage from '../assets/croppedadobetrans.png';

function Hovering() {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPosition(prevPosition => {
        // Change direction when reaching limits
        if (prevPosition >= 30) {
          setDirection(-1);
        } else if (prevPosition <= -30) {
          setDirection(1);
        }
        
        // Move in current direction
        return prevPosition + (direction * 2);
      });
    }, 30);

    return () => clearInterval(animationInterval);
  }, [direction]);

  return (
    <div className="hovering-drone-container" style={{ 
      display: 'flex',
      justifyContent: 'center',
      margin: '20px 0 40px 0',
      height: '300px',
      position: 'relative'
    }}>
      <img 
        src={droneImage} 
        alt="Hovering Drone" 
        style={{
          width: '250px',
          height: 'auto',
          transform: `translateY(${position}px)`,
          transition: 'transform 0.1s ease',
          filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4))'
        }}
      />
    </div>
  );
}

export default Hovering; 