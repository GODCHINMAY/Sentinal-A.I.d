import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SOS.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import droneIconImage from '../assets/camera-drone.png';

function SOS() {
  const [calling, setCalling] = useState(false);
  const [droneDispatched, setDroneDispatched] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    emergencyType: 'medical',
    emergencyDetails: '',
    coordinates: null,
    locationDescription: 'Location not provided'
  });
  const [showTracker, setShowTracker] = useState(false);
  const [dronePosition, setDronePosition] = useState(null);
  const [droneEta, setDroneEta] = useState(240); // Initial ETA in seconds (4 minutes)
  const animationRef = useRef(null);
  const navigate = useNavigate();
  const [showArrivalNotification, setShowArrivalNotification] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    // Phone number validation - only allow digits
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        setUserInfo(prev => ({
          ...prev,
          [name]: digits
        }));
      }
    } else {
      setUserInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get coordinates
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
         
          // Use reverse geocoding to get address (simplified version)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`)
            .then(response => response.json())
            .then(data => {
              const locationDesc = data.display_name || 'Location detected';
              setUserInfo(prev => ({
                ...prev,
                coordinates: coords,
                locationDescription: locationDesc
              }));
              setLocationLoading(false);
            })
            .catch(error => {
              console.error("Error getting location details:", error);
              setUserInfo(prev => ({
                ...prev,
                coordinates: coords,
                locationDescription: `Coordinates: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
              }));
              setLocationLoading(false);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
          alert("Unable to get your location. Please ensure location services are enabled.");
        }
      );
    } else {
      setLocationLoading(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
   
    // Validate phone number
    if (userInfo.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
   
    // Validate location
    if (!userInfo.coordinates) {
      const confirmContinue = window.confirm("No location detected. This may delay emergency response. Continue anyway?");
      if (!confirmContinue) {
        return;
      }
    }
   
    setShowForm(false);
  };

  const handleCallDrone = () => {
    setCalling(true);
    setProcessing(true);
   
    // Simulate processing for 3 seconds
    setTimeout(() => {
      setProcessing(false);
    }, 3000);
   
    // Simulate drone dispatch after 3 seconds
    setTimeout(() => {
      setCalling(false);
      setDroneDispatched(true);
      
      // Initialize drone position and start animation immediately
      const randomPosition = generateRandomDronePosition();
      setDronePosition(randomPosition);
      startDroneAnimation(randomPosition);
    }, 3000);
  };

  const handleReturn = () => {
    navigate('/');
  };

  // Format phone number for display
  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
  };

  // Function to generate a random starting position for the drone
  const generateRandomDronePosition = () => {
    if (!userInfo.coordinates) return null;
   
    // Generate a position 2-4 km away in a random direction
    const distance = (2 + Math.random() * 2) / 111; // Convert km to degrees (approx)
    const angle = Math.random() * 2 * Math.PI; // Random angle in radians
   
    return {
      latitude: userInfo.coordinates.latitude + (distance * Math.cos(angle)),
      longitude: userInfo.coordinates.longitude + (distance * Math.sin(angle))
    };
  };

  const handleTrackDrone = () => {
    setShowTracker(true);
    const randomPosition = generateRandomDronePosition();
    setDronePosition(randomPosition);
   
    // Start drone animation
    startDroneAnimation(randomPosition);
  };
 
  const startDroneAnimation = (startPos) => {
    if (!startPos || !userInfo.coordinates) return;
   
    let currentPos = { ...startPos };
    const targetPos = userInfo.coordinates;
    const startTime = Date.now();
   
    // You can tweak this speedFactor to 2, 1.5, etc.
    // A value of 2 = 2x faster, 1.5 = 1.5x faster, etc.
    const speedFactor = 1.5;
   
    // The total time in milliseconds (4 minutes = 240 seconds = 240000 ms)
    const totalDuration = droneEta * 1000;
    // The drone will cover that distance in less time
    const adjustedDuration = totalDuration / speedFactor;
   
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Multiply elapsed by speedFactor, then compare to adjustedDuration
      const progress = Math.min((elapsed * speedFactor) / totalDuration, 1);
     
      // Linear interpolation between startPos and targetPos
      currentPos = {
        latitude: startPos.latitude + (targetPos.latitude - startPos.latitude) * progress,
        longitude: startPos.longitude + (targetPos.longitude - startPos.longitude) * progress
      };
     
      setDronePosition(currentPos);
     
      // Recalculate the remaining time (just for display)
      const newRemaining = totalDuration - elapsed * speedFactor;
      const remainingSeconds = Math.ceil(newRemaining / 1000);
      setDroneEta(remainingSeconds);
     
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Drone has arrived at the user's location
        setShowArrivalNotification(true);
      }
    };
   
    animationRef.current = requestAnimationFrame(animate);
  };
 
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
 
  // Drone icon
  const droneIcon = new L.Icon({
    iconUrl: droneIconImage,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
 
  // User location icon
  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177361.png', // Replace with actual user icon URL
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
 
  // Component to center map and fit bounds
  function MapController({ userLocation, droneLocation }) {
    const map = useMap();
   
    useEffect(() => {
      if (userLocation && droneLocation) {
        const bounds = L.latLngBounds(
          [userLocation.latitude, userLocation.longitude],
          [droneLocation.latitude, droneLocation.longitude]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, userLocation, droneLocation]);
   
    return null;
  }
 
  // Format ETA for display
  const formatETA = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCloseArrivalNotification = () => {
    setShowArrivalNotification(false);
  };

  return (
    <div className="sos-container">
      <div className="sos-header" style={ {display: 'flex', flexDirection: 'column'} }>
        <button className="return-button" onClick={handleReturn}>Return to Home</button>
        <h1 style={{color: 'red'}}>Emergency Drone Assistance</h1>
      </div>

      <div className="sos-content">
        {showForm ? (
          <div className="user-info-form-container">
            <h2>Emergency Contact Information</h2>
            <p className="form-description">
              Please provide your information to help us respond effectively to your emergency.
            </p>
           
            <form className="user-info-form" onSubmit={handleSubmitInfo}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
             
              <div className="form-group">
                <label htmlFor="phone">Phone Number (10 digits)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your 10-digit phone number"
                  pattern="[0-9]{10}"
                />
                {userInfo.phone && userInfo.phone.length > 0 && (
                  <p className={`phone-validation ${userInfo.phone.length === 10 ? 'valid' : 'invalid'}`}>
                    {userInfo.phone.length === 10
                      ? "✓ Valid phone number"
                      : `Please enter all 10 digits (${userInfo.phone.length}/10)`}
                  </p>
                )}
              </div>
             
              <div className="form-group">
                <label htmlFor="emergencyDetails">Emergency Details</label>
                <textarea
                  id="emergencyDetails"
                  name="emergencyDetails"
                  value={userInfo.emergencyDetails}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your emergency situation"
                  rows="3"
                />
              </div>
             
              <div className="form-group location-group">
                <label>Your Location</label>
                <button
                  type="button"
                  className="get-location-button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? 'Getting Location...' : 'Get My Location'}
                </button>
               
                {locationLoading && (
                  <div className="location-loading">
                    <div className="location-spinner"></div>
                    <p>Accessing your location...</p>
                  </div>
                )}
               
                {userInfo.coordinates && (
                  <div className="location-confirmed">
                    <p className="location-success">✓ Location successfully detected</p>
                    <p className="location-details">{userInfo.locationDescription}</p>
                    <p className="coordinates-details">
                      GPS: {userInfo.coordinates.latitude.toFixed(6)}, {userInfo.coordinates.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
             
              <button
                type="submit"
                className="submit-info-button"
                disabled={locationLoading}
              >
                Continue to Emergency Call
              </button>
            </form>
          </div>
        ) : !droneDispatched ? (
          <div className="sos-call-section">
            <div className="user-info-summary">
              <h3>Emergency Contact</h3>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Phone:</strong> {formatPhoneNumber(userInfo.phone)}</p>
              {userInfo.emergencyDetails && (
                <p><strong>Details:</strong> {userInfo.emergencyDetails}</p>
              )}
              <p><strong>Location:</strong> {userInfo.locationDescription}</p>
              {userInfo.coordinates && (
                <p><strong>GPS:</strong> {userInfo.coordinates.latitude.toFixed(6)}, {userInfo.coordinates.longitude.toFixed(6)}</p>
              )}
            </div>
           
            <p className="sos-description">
              Call for immediate drone assistance in emergency situations.
              Our AI-powered drones can provide real-time surveillance, deliver emergency supplies,
              and relay your location to first responders.
            </p>
           
            <div className="sos-warning">
              <span className="warning-icon">⚠️</span>
              <p>Only use in genuine emergency situations</p>
            </div>
           
            <button
              className={`sos-call-button ${calling ? 'calling' : ''}`}
              onClick={handleCallDrone}
              disabled={calling}
            >
              {calling ? (
                processing ? 'PROCESSING REQUEST...' : 'DISPATCHING DRONE...'
              ) : 'CALL EMERGENCY DRONE'}
            </button>
           
            {calling && processing && (
              <div className="processing-indicator">
                <div className="loading-circle"></div>
                <p>Processing your request...</p>
              </div>
            )}
           
            {calling && !processing && (
              <div className="calling-indicator">
                <div className="radar-circle"></div>
                <p>Locating nearest available drone...</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="drone-dispatched">
              <div className="success-icon">✓</div>
              <h2>Drone Successfully Dispatched</h2>
             
              <div className="personal-message">
                <p>Dear <strong>{userInfo.name}</strong>,</p>
                <p>A drone is being dispatched to your location at <strong>{userInfo.locationDescription}</strong>.</p>
                <p>We've received your emergency request and help is on the way.</p>
              </div>
              
              <div className="drone-info">
                <p><strong>ETA:</strong> {formatETA(droneEta)}</p>
                <p><strong>Drone ID:</strong> SentinelAI-DR042</p>
                <p><strong>Capabilities:</strong> Photography, medical supplies, water</p>
              </div>
             
              <p className="instructions">
                Please remain in your current location if possible. The drone will establish
                communication upon arrival. Your location has been shared with local emergency services.
              </p>
             
              <div className="contact-confirmation">
                <p>A confirmation SMS has been sent to: <strong>{formatPhoneNumber(userInfo.phone)}</strong></p>
              </div>
            </div>
            
            <div className="drone-map-container">
              <h3>Live Drone Tracking</h3>
              <div className="eta-display">
                <p>Estimated arrival in: <span className="eta-time">{formatETA(droneEta)}</span></p>
              </div>
              
              <div className="map-wrapper">
                {userInfo.coordinates && dronePosition && (
                  <MapContainer
                    center={[userInfo.coordinates.latitude, userInfo.coordinates.longitude]}
                    zoom={13}
                    style={{ height: '400px', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                   
                    <Marker
                      position={[userInfo.coordinates.latitude, userInfo.coordinates.longitude]}
                      icon={userIcon}
                    >
                      <Popup>Your location</Popup>
                    </Marker>
                   
                    <Marker
                      position={[dronePosition.latitude, dronePosition.longitude]}
                      icon={droneIcon}
                    >
                      <Popup>Emergency Drone</Popup>
                    </Marker>
                   
                    <MapController
                      userLocation={userInfo.coordinates}
                      droneLocation={dronePosition}
                    />
                  </MapContainer>
                )}
              </div>
              
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-icon user-icon"></div>
                  <span>Your Location</span>
                </div>
                <div className="legend-item">
                  <div className="legend-icon drone-icon"></div>
                  <span>Emergency Drone</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showArrivalNotification && (
        <div className="drone-arrival-notification">
          <div className="arrival-header">
            <h2 className="arrival-title">Drone Has Arrived!</h2>
          </div>
          <p className="arrival-message">
            The emergency drone has reached your location. Please look around for the drone and follow any instructions provided through its communication system.
          </p>
          <div className="arrival-actions">
            <button className="acknowledge-button" onClick={handleReturn}>
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOS;