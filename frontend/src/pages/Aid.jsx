import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Aid.css';

// Map controller component to fit bounds
function MapController({ locations }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations]);
  
  return null;
}

function Aid() {
  const [mode, setMode] = useState(null); // 'request' or 'supply'
  const [step, setStep] = useState(1);
  // Initialize with a hardcoded request
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Chinmay',
      phone: '3025551234',
      resources: {
        food: false,
        water: true,
        clothes: false,
        medical: false,
        shelter: false
      },
      details: 'Need clean drinking water urgently',
      coordinates: {
        latitude: 39.772640,
        longitude: -75.595256
      },
      locationDescription: 'Newark, Delaware',
      timestamp: new Date().toISOString()
    }
  ]);
  const [supplies, setSupplies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    resources: {
      food: false,
      water: false,
      clothes: false,
      medical: false,
      shelter: false
    },
    details: '',
    coordinates: null,
    locationDescription: ''
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [connectionLine, setConnectionLine] = useState(null);
  
  // Create custom icons using URLs instead of imports
  const requestMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
  
  const supplyMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  // Map center (default)
  const defaultCenter = [39.6766, -75.7506]; // University of Delaware coordinates
  
  // Handle mode selection
  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setStep(2);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Phone validation - only allow digits
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: digits
        }));
      }
    } else if (name.startsWith('resource-')) {
      // Handle checkbox resources
      const resource = name.replace('resource-', '');
      setFormData(prev => ({
        ...prev,
        resources: {
          ...prev.resources,
          [resource]: e.target.checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Get user's current location
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
          
          // Use reverse geocoding to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`)
            .then(response => response.json())
            .then(data => {
              const locationDesc = data.display_name || 'Location detected';
              setFormData(prev => ({
                ...prev,
                coordinates: coords,
                locationDescription: locationDesc
              }));
              
              // If this is a supply response, create a connection line to the request
              if (mode === 'supply' && requests.length > 0) {
                const requestCoords = [requests[0].coordinates.latitude, requests[0].coordinates.longitude];
                const supplyCoords = [coords.latitude, coords.longitude];
                setConnectionLine([requestCoords, supplyCoords]);
              }
              
              setLocationLoading(false);
            })
            .catch(error => {
              console.error("Error getting location details:", error);
              setFormData(prev => ({
                ...prev,
                coordinates: coords,
                locationDescription: `Coordinates: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
              }));
              
              // If this is a supply response, create a connection line to the request
              if (mode === 'supply' && requests.length > 0) {
                const requestCoords = [requests[0].coordinates.latitude, requests[0].coordinates.longitude];
                const supplyCoords = [coords.latitude, coords.longitude];
                setConnectionLine([requestCoords, supplyCoords]);
              }
              
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
  
  // Format phone number for display
  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
  };
  
  // Get all map locations for bounds
  const getMapLocations = () => {
    const locations = [];
    
    // Add request locations
    requests.forEach(request => {
      if (request.coordinates) {
        locations.push([request.coordinates.latitude, request.coordinates.longitude]);
      }
    });
    
    // Add supply locations
    supplies.forEach(supply => {
      if (supply.coordinates) {
        locations.push([supply.coordinates.latitude, supply.coordinates.longitude]);
      }
    });
    
    // Add current form location if available
    if (formData.coordinates) {
      locations.push([formData.coordinates.latitude, formData.coordinates.longitude]);
    }
    
    return locations;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      alert("Please enter your name");
      return;
    }
    
    if (!formData.phone || formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    
    if (mode === 'request' && !Object.values(formData.resources).some(v => v)) {
      alert("Please select at least one resource");
      return;
    }
    
    if (!formData.coordinates) {
      const confirmContinue = window.confirm("No location detected. This may delay response. Continue anyway?");
      if (!confirmContinue) {
        return;
      }
    }
    
    // Process the submission
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      if (mode === 'request') {
        // Add to requests
        const newRequest = {
          id: Date.now(),
          ...formData,
          timestamp: new Date().toISOString()
        };
        setRequests(prev => [...prev, newRequest]);
      } else {
        // Add to supplies
        const newSupply = {
          id: Date.now(),
          ...formData,
          timestamp: new Date().toISOString()
        };
        setSupplies(prev => [...prev, newSupply]);
        
        // Create connection line to the request if coordinates are available
        if (formData.coordinates && requests.length > 0) {
          const requestCoords = [requests[0].coordinates.latitude, requests[0].coordinates.longitude];
          const supplyCoords = [formData.coordinates.latitude, formData.coordinates.longitude];
          setConnectionLine([requestCoords, supplyCoords]);
        }
      }
      
      setProcessing(false);
      setSuccess(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setMode(null);
        setStep(1);
        setFormData({
          name: '',
          phone: '',
          resources: {
            food: false,
            water: false,
            clothes: false,
            medical: false,
            shelter: false
          },
          details: '',
          coordinates: null,
          locationDescription: ''
        });
      }, 5000);
    }, 2000);
  };
  
  return (
    <div className="aid-container">
      <h1 className="aid-title">Emergency Aid Coordination</h1>
      
      {/* Map Section */}
      <div className="map-section">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Request Markers */}
          {requests.map(request => (
            <React.Fragment key={request.id}>
              <Marker
                position={[request.coordinates.latitude, request.coordinates.longitude]}
                icon={requestMarkerIcon}
              >
                <Popup className="marker-popup">
                  <h3>Aid Request</h3>
                  <p><strong>From:</strong> {request.name}</p>
                  <p><strong>Needs:</strong> {
                    Object.entries(request.resources)
                      .filter(([_, value]) => value)
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ')
                  }</p>
                  <p><strong>Details:</strong> {request.details}</p>
                  <p><strong>Contact:</strong> {formatPhoneNumber(request.phone)}</p>
                </Popup>
              </Marker>
              
              <Circle
                center={[request.coordinates.latitude, request.coordinates.longitude]}
                radius={500}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
              />
            </React.Fragment>
          ))}
          
          {/* Supply Markers */}
          {supplies.map(supply => (
            <React.Fragment key={supply.id}>
              <Marker
                position={[supply.coordinates.latitude, supply.coordinates.longitude]}
                icon={supplyMarkerIcon}
              >
                <Popup className="marker-popup">
                  <h3>Aid Supply</h3>
                  <p><strong>From:</strong> {supply.name}</p>
                  <p><strong>Providing:</strong> {
                    Object.entries(supply.resources)
                      .filter(([_, value]) => value)
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ')
                  }</p>
                  <p><strong>Details:</strong> {supply.details}</p>
                  <p><strong>Contact:</strong> {formatPhoneNumber(supply.phone)}</p>
                </Popup>
              </Marker>
              
              <Circle
                center={[supply.coordinates.latitude, supply.coordinates.longitude]}
                radius={500}
                pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
              />
            </React.Fragment>
          ))}
          
          {/* Current Form Location */}
          {formData.coordinates && (
            <React.Fragment>
              <Marker
                position={[formData.coordinates.latitude, formData.coordinates.longitude]}
                icon={mode === 'request' ? requestMarkerIcon : supplyMarkerIcon}
              >
                <Popup className="marker-popup">
                  <h3>Your Location</h3>
                  <p>{formData.locationDescription}</p>
                </Popup>
              </Marker>
              
              <Circle
                center={[formData.coordinates.latitude, formData.coordinates.longitude]}
                radius={500}
                pathOptions={{ 
                  color: mode === 'request' ? 'red' : 'green', 
                  fillColor: mode === 'request' ? 'red' : 'green', 
                  fillOpacity: 0.2 
                }}
              />
            </React.Fragment>
          )}
          
          {/* Connection Line between Request and Supply */}
          {connectionLine && (
            <Polyline
              positions={connectionLine}
              pathOptions={{ 
                color: 'red', 
                weight: 3, 
                dashArray: '10, 10',
                opacity: 0.7
              }}
            />
          )}
          
          {/* Map Controller to fit bounds */}
          <MapController locations={getMapLocations()} />
        </MapContainer>
      </div>
      
      {/* Mode Selection */}
      {step === 1 && (
        <div className="mode-selection">
          <h2>How would you like to help?</h2>
          <div className="mode-buttons">
            <button 
              className="mode-button request-button"
              onClick={() => handleModeSelect('request')}
            >
              <span className="mode-icon">🆘</span>
              <span className="mode-label">Request Aid</span>
              <span className="mode-description">I need emergency supplies</span>
            </button>
            
            <button 
              className="mode-button supply-button"
              onClick={() => handleModeSelect('supply')}
            >
              <span className="mode-icon">🎁</span>
              <span className="mode-label">Supply Aid</span>
              <span className="mode-description">I can provide supplies</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Form Section */}
      {step === 2 && !success && (
        <div className="form-section">
          <h2>{mode === 'request' ? 'Request Aid' : 'Supply Aid'}</h2>
          <p className="form-description">
            {mode === 'request' 
              ? 'Please provide your information to request emergency supplies.' 
              : 'Thank you for offering to help! Please provide your information.'}
          </p>
          
          <form onSubmit={handleSubmit} className="aid-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="text" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                required
              />
              <p className="input-note">We'll send updates via SMS</p>
            </div>
            
            <div className="form-group resources-group">
              <label>
                {mode === 'request' 
                  ? 'Resources Needed' 
                  : 'Resources You Can Provide'}
              </label>
              
              <div className="resources-checkboxes">
                <label className="resource-checkbox">
                  <input 
                    type="checkbox" 
                    name="resource-food" 
                    checked={formData.resources.food}
                    onChange={handleInputChange}
                  />
                  <span className="resource-icon">🍲</span>
                  <span>Food</span>
                </label>
                
                <label className="resource-checkbox">
                  <input 
                    type="checkbox" 
                    name="resource-water" 
                    checked={formData.resources.water}
                    onChange={handleInputChange}
                  />
                  <span className="resource-icon">💧</span>
                  <span>Water</span>
                </label>
                
                <label className="resource-checkbox">
                  <input 
                    type="checkbox" 
                    name="resource-clothes" 
                    checked={formData.resources.clothes}
                    onChange={handleInputChange}
                  />
                  <span className="resource-icon">👕</span>
                  <span>Clothes</span>
                </label>
                
                <label className="resource-checkbox">
                  <input 
                    type="checkbox" 
                    name="resource-medical" 
                    checked={formData.resources.medical}
                    onChange={handleInputChange}
                  />
                  <span className="resource-icon">🩹</span>
                  <span>Medical</span>
                </label>
                
                <label className="resource-checkbox">
                  <input 
                    type="checkbox" 
                    name="resource-shelter" 
                    checked={formData.resources.shelter}
                    onChange={handleInputChange}
                  />
                  <span className="resource-icon">🏠</span>
                  <span>Shelter</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="details">Additional Details</label>
              <textarea 
                id="details" 
                name="details" 
                value={formData.details}
                onChange={handleInputChange}
                placeholder={mode === 'request' 
                  ? 'Describe your situation and specific needs...' 
                  : 'Describe what you can provide and any limitations...'}
                rows={4}
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
              
              {formData.coordinates && (
                <div className="location-confirmed">
                  <p className="location-success">✓ Location successfully detected</p>
                  <p className="location-details">{formData.locationDescription}</p>
                  <p className="coordinates-details">
                    GPS: {formData.coordinates.latitude.toFixed(6)}, {formData.coordinates.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="back-button"
                onClick={() => {
                  setMode(null);
                  setStep(1);
                }}
              >
                Back
              </button>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={processing}
              >
                {processing 
                  ? 'Processing...' 
                  : mode === 'request' 
                    ? 'Submit Request' 
                    : 'Offer Aid'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>
            {mode === 'request' 
              ? 'Aid Request Submitted!' 
              : 'Thank You For Your Support!'}
          </h2>
          
          <div className="success-details">
            <p>
              {mode === 'request'
                ? 'Your request has been received and a drone will be dispatched to your location shortly.'
                : 'Your offer to help has been registered. A drone will be dispatched to collect supplies.'}
            </p>
            <p>A confirmation SMS has been sent to: <strong>{formatPhoneNumber(formData.phone)}</strong></p>
          </div>
          
          <div className="eta-info">
            <p>Estimated drone arrival: <strong>15-20 minutes</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aid; 