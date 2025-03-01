import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SOS.css';

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
  const navigate = useNavigate();

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

  return (
    <div className="sos-container">
      <div className="sos-header">
        <h1>Emergency Drone Assistance</h1>
        <button className="return-button" onClick={handleReturn}>Return to Safety</button>
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
                <label htmlFor="emergencyType">Emergency Type</label>
                <select 
                  id="emergencyType" 
                  name="emergencyType" 
                  value={userInfo.emergencyType} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="medical">Medical Emergency</option>
                  <option value="fire">Fire</option>
                  <option value="structural">Structural Damage</option>
                  <option value="flooding">Flooding</option>
                  <option value="other">Other Emergency</option>
                </select>
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
              <p><strong>Emergency Type:</strong> {userInfo.emergencyType.charAt(0).toUpperCase() + userInfo.emergencyType.slice(1)}</p>
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
          <div className="drone-dispatched">
            <div className="success-icon">✓</div>
            <h2>Drone Successfully Dispatched</h2>
            
            <div className="personal-message">
              <p>Dear <strong>{userInfo.name}</strong>,</p>
              <p>A drone is being dispatched to your location at <strong>{userInfo.locationDescription}</strong>.</p>
              <p>We've received your emergency request and help is on the way.</p>
            </div>
            
            <div className="drone-info">
              <p><strong>ETA:</strong> 4 minutes</p>
              <p><strong>Drone ID:</strong> SentinelAI-DR042</p>
              <p><strong>Capabilities:</strong> Medical supplies, thermal imaging, communication relay</p>
              <p><strong>Emergency Type:</strong> {userInfo.emergencyType.charAt(0).toUpperCase() + userInfo.emergencyType.slice(1)} Response</p>
            </div>
            
            <p className="instructions">
              Please remain in your current location if possible. The drone will establish 
              communication upon arrival. Your location has been shared with local emergency services.
            </p>
            
            <div className="contact-confirmation">
              <p>A confirmation SMS has been sent to: <strong>{formatPhoneNumber(userInfo.phone)}</strong></p>
            </div>
            
            <button className="track-drone-button">TRACK DRONE LOCATION</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SOS; 