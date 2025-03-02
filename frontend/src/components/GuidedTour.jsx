import React, { useState, useEffect } from 'react';
import './GuidedTour.css';

function GuidedTour({ onClose }) {
  const [step, setStep] = useState(0);
  
  const tourSteps = [
    {
      text: "Welcome to our Disaster Relief Platform! I'll show you around so you can make the most of our features.",
      position: { top: '50%', left: '50%' }
    },
    {
      text: "This is our Globe view. Here you can see disaster events happening around the world in real-time.",
      position: { top: '30%', left: '50%' },
      targetElement: '.globe-container'
    },
    {
      text: "If you're in an emergency, use the SOS feature to quickly request help and share your location.",
      position: { top: '70%', left: '30%' },
      targetElement: '.sos-button'
    },
    {
      text: "The Aid section shows available resources and relief efforts in your area.",
      position: { top: '40%', left: '70%' },
      targetElement: '.aid-section'
    },
    {
      text: "That's it for now! Feel free to explore, and you can restart this tour anytime from the help menu.",
      position: { top: '50%', left: '50%' }
    }
  ];

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="guided-tour-overlay">
      <div 
        className="tour-bubble"
        style={{ 
          top: tourSteps[step].position.top, 
          left: tourSteps[step].position.left 
        }}
      >
        <p>{tourSteps[step].text}</p>
        <div className="tour-controls">
          <button onClick={onClose}>Skip</button>
          <button onClick={handleNext}>
            {step < tourSteps.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuidedTour; 