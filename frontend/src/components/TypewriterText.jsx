import React, { useState, useEffect } from 'react';
import './TypewriterText.css';

function TypewriterText({ text, speed = 30, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setStarted(false);
  }, [text]);

  useEffect(() => {
    // Initial delay before starting
    if (!started) {
      const startTimer = setTimeout(() => {
        setStarted(true);
      }, delay);
      
      return () => clearTimeout(startTimer);
    }
    
    // Start typing effect once delay is over
    if (started && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [text, currentIndex, speed, delay, started]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && <span style={{
        display: 'inline-block',
        width: '2px',
        backgroundColor: '#fff',
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
        fontWeight: 'bold'
      }}>|</span>}
    </>
  );
}

export default TypewriterText; 