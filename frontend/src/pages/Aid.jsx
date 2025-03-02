import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Aid.css';
import droneImage from '../assets/pngegg.png';
import droneIcon from '../assets/camera-drone.png'; // Import the drone icon

// Custom drone marker component that moves along the line
function MovingDroneMarker({ startPoint, endPoint, speed = 0.001, color = '#00ff00', cargo = "Water supplies" }) {
  const map = useMap();
  const [position, setPosition] = useState(startPoint);
  const [progress, setProgress] = useState(0);
  const markerRef = useRef(null);
  
  // Create custom drone icon
  const droneMarkerIcon = new L.Icon({
    iconUrl: droneIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) return 0; // Reset to start when reaching the end
        return prev + speed; // Speed of movement
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [speed]);
  
  useEffect(() => {
    // Calculate position along the line based on progress
    const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * progress;
    const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * progress;
    setPosition([lat, lng]);
  }, [progress, startPoint, endPoint]);
  
  return (
    <Marker 
      position={position} 
      icon={droneMarkerIcon}
      ref={markerRef}
    >
      <Popup>
        <div className="marker-popup">
          <h3>Drone Delivery</h3>
          <p><strong>Status:</strong> En route</p>
          <p><strong>Cargo:</strong> {cargo}</p>
          <p><strong>ETA:</strong> 10 minutes</p>
        </div>
      </Popup>
    </Marker>
  );
}

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
  const [activeTab, setActiveTab] = useState('available');
  const [showMessage, setShowMessage] = useState(false);
  const [dronePosition, setDronePosition] = useState(0);
  
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
  
  // Animate drone along the path
  useEffect(() => {
    const interval = setInterval(() => {
      setDronePosition(prev => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const availableAid = [
    {
      id: 1,
      type: 'Water',
      quantity: '500 gallons',
      location: 'Newark, DE',
      provider: 'Nazim Karaca',
      coordinates: '39.680693, -75.753817',
      message: 'Hope this helps!',
      status: 'En route'
    },
    {
      id: 2,
      type: 'Food',
      quantity: '200 meals',
      location: 'Wilmington, DE',
      provider: 'Delaware Food Bank',
      coordinates: '39.745949, -75.546589',
      status: 'Available'
    },
    {
      id: 3,
      type: 'Medical Supplies',
      quantity: '50 first aid kits',
      location: 'Dover, DE',
      provider: 'Delaware Medical Association',
      coordinates: '39.158168, -75.524368',
      status: 'Available'
    }
  ];

  const requestedAid = [
    {
      id: 1,
      type: 'Shelter',
      quantity: 'For 20 people',
      location: 'Smyrna, DE',
      requester: 'Smyrna Community Center',
      coordinates: '39.299236, -75.604094',
      urgency: 'High'
    },
    {
      id: 2,
      type: 'Generators',
      quantity: '5 units',
      location: 'Milford, DE',
      requester: 'Milford Hospital',
      coordinates: '38.911697, -75.428454',
      urgency: 'Critical'
    }
  ];

  // Define the specific coordinates for the first path
  const supplierCoords = [39.680605, -75.753669]; // Green point
  const recipientCoords = [39.772907, -75.595519]; // Red point
  
  // Define the specific coordinates for the second path
  const secondSupplierCoords = [39.768637, -75.705611]; // Second green point
  const secondRecipientCoords = [39.725489, -75.536638]; // Second red point
  
  // Define the specific coordinates for the third path (help request)
  const helpRequestCoords = [39.321477, -76.711912]; // Person asking for help
  const helpSupplyCoords = [39.638061, -75.498640]; // Supply point responding
  
  // Define the specific coordinates for the fourth path
  const fourthSupplyCoords = [39.523080, -76.349780]; // Supply point
  const fourthRequestCoords = [39.314488, -75.597656]; // Location needing help
  
  // Define the specific coordinates for the fifth path
  const fifthSupplyCoords = [40.023802, -76.263398]; // Supply point
  const fifthRequestCoords = [39.868021, -75.716831]; // Location needing help
  
  // Define the specific coordinates for the sixth path
  const sixthRequestCoords = [40.053855, -76.704422]; // Location needing help
  const sixthSupplyCoords = [39.782318, -76.657465]; // Supply point
  
  // Create custom icons for the markers
  const greenMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
  
  const redMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
  
  const orangeMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
  
  // Add this to your existing getMapLocations function or create a new one
  const getAllMapLocations = () => {
    const locations = [...getMapLocations()];
    
    // Add all the specific coordinates
    locations.push(supplierCoords);
    locations.push(recipientCoords);
    locations.push(secondSupplierCoords);
    locations.push(secondRecipientCoords);
    locations.push(helpRequestCoords);
    locations.push(helpSupplyCoords);
    locations.push(fourthSupplyCoords);
    locations.push(fourthRequestCoords);
    locations.push(fifthSupplyCoords);
    locations.push(fifthRequestCoords);
    locations.push(sixthRequestCoords);
    locations.push(sixthSupplyCoords);
    
    return locations;
  };

  return (
    <div className="aid-container">
      <h1 className="aid-title">Emergency Aid Coordination</h1>
      
      {/* Map Section */}
      <div className="map-section">
        <MapContainer 
          center={defaultCenter} 
          zoom={12} 
          style={{ height: '500px', width: '100%', zIndex: 1 }}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* First Path */}
          {/* Supplier Point - Green Circle */}
          <Circle
            center={supplierCoords}
            radius={300}
            pathOptions={{ 
              color: '#00ff00', 
              fillColor: '#00ff00', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Supplier Marker */}
          <Marker
            position={supplierCoords}
            icon={greenMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Water Supply</h3>
              <p><strong>From:</strong> Nazim Karaca</p>
              <p><strong>Sending:</strong> Clean drinking water</p>
              <p><strong>Message:</strong> "Stay hydrated! We're here to help."</p>
              <p><strong>Coordinates:</strong> 39.680605, -75.753669</p>
            </Popup>
          </Marker>
          
          {/* Recipient Point - Red Circle */}
          <Circle
            center={recipientCoords}
            radius={300}
            pathOptions={{ 
              color: '#ff0000', 
              fillColor: '#ff0000', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Recipient Marker */}
          <Marker
            position={recipientCoords}
            icon={redMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Water Needed</h3>
              <p><strong>Location:</strong> Newark, DE</p>
              <p><strong>Request:</strong> Clean drinking water</p>
              <p><strong>Coordinates:</strong> 39.772907, -75.595519</p>
            </Popup>
          </Marker>
          
          {/* Black Line Connecting the Points */}
          <Polyline
            positions={[supplierCoords, recipientCoords]}
            pathOptions={{ 
              color: 'black', 
              weight: 2,
              opacity: 0.8
            }}
          />
          
          {/* Moving Drone Marker */}
          <MovingDroneMarker 
            startPoint={supplierCoords} 
            endPoint={recipientCoords} 
            speed={0.001}
            cargo="Water supplies"
          />
          
          {/* Second Path */}
          {/* Second Supplier Point - Green Circle */}
          <Circle
            center={secondSupplierCoords}
            radius={300}
            pathOptions={{ 
              color: '#00ff00', 
              fillColor: '#00ff00', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Second Supplier Marker */}
          <Marker
            position={secondSupplierCoords}
            icon={greenMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Medical Supply</h3>
              <p><strong>From:</strong> Delaware Medical Center</p>
              <p><strong>Sending:</strong> First aid kits and medications</p>
              <p><strong>Message:</strong> "Medical supplies on the way!"</p>
              <p><strong>Coordinates:</strong> 39.768637, -75.705611</p>
            </Popup>
          </Marker>
          
          {/* Second Recipient Point - Red Circle */}
          <Circle
            center={secondRecipientCoords}
            radius={300}
            pathOptions={{ 
              color: '#ff0000', 
              fillColor: '#ff0000', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Second Recipient Marker */}
          <Marker
            position={secondRecipientCoords}
            icon={redMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Medical Aid Needed</h3>
              <p><strong>Location:</strong> Wilmington, DE</p>
              <p><strong>Request:</strong> Medical supplies</p>
              <p><strong>Coordinates:</strong> 39.725489, -75.536638</p>
            </Popup>
          </Marker>
          
          {/* Second Black Line Connecting the Points */}
          <Polyline
            positions={[secondSupplierCoords, secondRecipientCoords]}
            pathOptions={{ 
              color: 'black', 
              weight: 2,
              opacity: 0.8
            }}
          />
          
          {/* Second Moving Drone Marker */}
          <MovingDroneMarker 
            startPoint={secondSupplierCoords} 
            endPoint={secondRecipientCoords}
            speed={0.0008} // Slightly different speed for visual variety
            cargo="Medical supplies"
          />
          
          {/* Third Path - Help Request */}
          {/* Help Request Point - Red Circle */}
          <Circle
            center={helpRequestCoords}
            radius={300}
            pathOptions={{ 
              color: '#ff0000', 
              fillColor: '#ff0000', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Help Request Marker */}
          <Marker
            position={helpRequestCoords}
            icon={redMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>URGENT: Help Needed</h3>
              <p><strong>From:</strong> Baltimore County</p>
              <p><strong>Request:</strong> Food and shelter supplies</p>
              <p><strong>Message:</strong> "Families stranded after flooding. Need immediate assistance."</p>
              <p><strong>Coordinates:</strong> 39.321477, -76.711912</p>
            </Popup>
          </Marker>
          
          {/* Help Supply Point - Green Circle */}
          <Circle
            center={helpSupplyCoords}
            radius={300}
            pathOptions={{ 
              color: '#00ff00', 
              fillColor: '#00ff00', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Help Supply Marker */}
          <Marker
            position={helpSupplyCoords}
            icon={greenMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Emergency Response</h3>
              <p><strong>From:</strong> Delaware Emergency Management</p>
              <p><strong>Sending:</strong> Food, blankets, and emergency shelter kits</p>
              <p><strong>Message:</strong> "Help is on the way. Hang tight!"</p>
              <p><strong>Coordinates:</strong> 39.638061, -75.498640</p>
            </Popup>
          </Marker>
          
          {/* Third Black Line Connecting the Points */}
          <Polyline
            positions={[helpSupplyCoords, helpRequestCoords]}
            pathOptions={{ 
              color: 'black', 
              weight: 2,
              opacity: 0.8
            }}
          />
          
          {/* Third Moving Drone Marker */}
          <MovingDroneMarker 
            startPoint={helpSupplyCoords} 
            endPoint={helpRequestCoords}
            speed={0.0012} // Faster speed for urgent help
            cargo="Emergency supplies"
          />
          
          {/* Fourth Path */}
          {/* Fourth Supply Point - Green Circle */}
          <Circle
            center={fourthSupplyCoords}
            radius={300}
            pathOptions={{ 
              color: '#00ff00', 
              fillColor: '#00ff00', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Fourth Supply Marker */}
          <Marker
            position={fourthSupplyCoords}
            icon={greenMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Food & Water Supply</h3>
              <p><strong>From:</strong> Harford County Relief</p>
              <p><strong>Sending:</strong> Food packages and bottled water</p>
              <p><strong>Message:</strong> "Relief supplies incoming. Stay safe!"</p>
              <p><strong>Coordinates:</strong> 39.523080, -76.349780</p>
            </Popup>
          </Marker>
          
          {/* Fourth Request Point - Red Circle */}
          <Circle
            center={fourthRequestCoords}
            radius={300}
            pathOptions={{ 
              color: '#ff0000', 
              fillColor: '#ff0000', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Fourth Request Marker */}
          <Marker
            position={fourthRequestCoords}
            icon={redMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Help Needed</h3>
              <p><strong>Location:</strong> Kent County</p>
              <p><strong>Request:</strong> Food and water for 30 people</p>
              <p><strong>Message:</strong> "Power outage for 3 days. Running low on supplies."</p>
              <p><strong>Coordinates:</strong> 39.314488, -75.597656</p>
            </Popup>
          </Marker>
          
          {/* Fourth Black Line Connecting the Points */}
          <Polyline
            positions={[fourthSupplyCoords, fourthRequestCoords]}
            pathOptions={{ 
              color: 'black', 
              weight: 2,
              opacity: 0.8
            }}
          />
          
          {/* Fourth Moving Drone Marker */}
          <MovingDroneMarker 
            startPoint={fourthSupplyCoords} 
            endPoint={fourthRequestCoords}
            speed={0.0009} // Different speed
            cargo="Food and water"
          />
          
          {/* Fifth Path */}
          {/* Fifth Supply Point - Green Circle */}
          <Circle
            center={fifthSupplyCoords}
            radius={300}
            pathOptions={{ 
              color: '#00ff00', 
              fillColor: '#00ff00', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Fifth Supply Marker */}
          <Marker
            position={fifthSupplyCoords}
            icon={greenMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Shelter & Clothing</h3>
              <p><strong>From:</strong> New Castle Community Center</p>
              <p><strong>Sending:</strong> Tents, blankets, and clothing</p>
              <p><strong>Message:</strong> "Shelter supplies on the way. Stay strong!"</p>
              <p><strong>Coordinates:</strong> 39.468411, -75.716831</p>
            </Popup>
          </Marker>
          
          {/* Fifth Request Point - Red Circle */}
          <Circle
            center={fifthRequestCoords}
            radius={300}
            pathOptions={{ 
              color: '#ff0000', 
              fillColor: '#ff0000', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Fifth Request Marker */}
          <Marker
            position={fifthRequestCoords}
            icon={redMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Shelter Needed</h3>
              <p><strong>Location:</strong> Northern Delaware</p>
              <p><strong>Request:</strong> Emergency shelter for 15 families</p>
              <p><strong>Message:</strong> "Homes damaged by storm. Need temporary shelter urgently."</p>
              <p><strong>Coordinates:</strong> 39.868021, -75.716831</p>
            </Popup>
          </Marker>
          
          {/* Fifth Black Line Connecting the Points */}
          <Polyline
            positions={[fifthSupplyCoords, fifthRequestCoords]}
            pathOptions={{ 
              color: 'black', 
              weight: 2,
              opacity: 0.8
            }}
          />
          
          {/* Fifth Moving Drone Marker */}
          <MovingDroneMarker 
            startPoint={fifthSupplyCoords} 
            endPoint={fifthRequestCoords}
            speed={0.0011} // Different speed
            cargo="Shelter supplies"
          />
          
          {/* Sixth Path */}
          {/* Sixth Request Point - Red Circle */}
          <Circle
            center={sixthRequestCoords}
            radius={300}
            pathOptions={{ 
              color: '#ff0000', 
              fillColor: '#ff0000', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Sixth Request Marker */}
          <Marker
            position={sixthRequestCoords}
            icon={redMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>URGENT: Medical Help</h3>
              <p><strong>Location:</strong> Lancaster County</p>
              <p><strong>Request:</strong> Medical supplies and personnel</p>
              <p><strong>Message:</strong> "Multiple injuries after building collapse. Need medical assistance ASAP."</p>
              <p><strong>Coordinates:</strong> 40.053855, -76.704422</p>
            </Popup>
          </Marker>
          
          {/* Sixth Supply Point - Green Circle */}
          <Circle
            center={sixthSupplyCoords}
            radius={300}
            pathOptions={{ 
              color: '#00ff00', 
              fillColor: '#00ff00', 
              fillOpacity: 0.4,
              weight: 2
            }}
            eventHandlers={{
              click: (e) => {
                e.target.openPopup();
              }
            }}
          />
          
          {/* Sixth Supply Marker */}
          <Marker
            position={sixthSupplyCoords}
            icon={greenMarkerIcon}
          >
            <Popup className="marker-popup">
              <h3>Medical Response Team</h3>
              <p><strong>From:</strong> York County Emergency Services</p>
              <p><strong>Sending:</strong> Paramedics and emergency medical supplies</p>
              <p><strong>Message:</strong> "Medical team dispatched. ETA 15 minutes."</p>
              <p><strong>Coordinates:</strong> 39.782318, -76.657465</p>
            </Popup>
          </Marker>
          
          {/* Sixth Black Line Connecting the Points */}
          <Polyline
            positions={[sixthSupplyCoords, sixthRequestCoords]}
            pathOptions={{ 
              color: 'black', 
              weight: 2,
              opacity: 0.8
            }}
          />
          
          {/* Sixth Moving Drone Marker */}
          <MovingDroneMarker 
            startPoint={sixthSupplyCoords} 
            endPoint={sixthRequestCoords}
            speed={0.0015} // Faster speed for medical emergency
            cargo="Medical team & supplies"
          />
          
          {/* Map Controller to fit all points */}
          <MapController locations={[
            supplierCoords, 
            recipientCoords, 
            secondSupplierCoords, 
            secondRecipientCoords,
            helpRequestCoords,
            helpSupplyCoords,
            fourthSupplyCoords,
            fourthRequestCoords,
            fifthSupplyCoords,
            fifthRequestCoords,
            sixthRequestCoords,
            sixthSupplyCoords
          ]} />
        </MapContainer>
      </div>
      
      {/* Mode Selection */}
      {step === 1 && (
        <div className="mode-selection">
          <h2>What would you like to do?</h2>
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
      
      <div className="aid-tabs">
        <button 
          className={`aid-tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Aid
        </button>
        <button 
          className={`aid-tab ${activeTab === 'requested' ? 'active' : ''}`}
          onClick={() => setActiveTab('requested')}
        >
          Requested Aid
        </button>
      </div>
      
      {/* Map showing the aid location */}
      <div className="aid-map">
        <div className="map-container">
          <div className="map-point green" onClick={() => setShowMessage(!showMessage)}>
            <div className="point-pulse"></div>
          </div>
          <div className="map-point red"></div>
          
          {/* Line connecting points */}
          <div className="map-line"></div>
          
          {/* Drone animation */}
          <div 
            className="drone-icon" 
            style={{ 
              left: `${dronePosition}%`,
              top: `calc(50% - ${dronePosition * 0.2}px)`
            }}
          >
            <img src={droneImage} alt="Drone" />
          </div>
          
          {/* Coordinates */}
          <div className="coordinates start">39.680693, -75.753817</div>
          <div className="coordinates end">39.65, -75.72</div>
        </div>
        
        {/* Message popup */}
        {showMessage && (
          <div className="aid-message">
            <h3>Aid Shipment</h3>
            <p><strong>From:</strong> Nazim Karaca</p>
            <p><strong>Sending:</strong> Water supplies</p>
            <p><strong>Message:</strong> "Hope this helps!"</p>
            <p><strong>Status:</strong> <span className="status-active">En route</span></p>
            <p><strong>Coordinates:</strong> 39.680693, -75.753817</p>
            <button onClick={() => setShowMessage(false)}>Close</button>
          </div>
        )}
      </div>
      
      <div className="aid-list">
        {activeTab === 'available' ? (
          <>
            <h2>Available Aid Resources</h2>
            {availableAid.map(aid => (
              <div key={aid.id} className="aid-card">
                <div className="aid-card-header">
                  <h3>{aid.type}</h3>
                  <span className={`aid-status ${aid.status === 'En route' ? 'en-route' : 'available'}`}>
                    {aid.status}
                  </span>
                </div>
                <div className="aid-card-body">
                  <p><strong>Quantity:</strong> {aid.quantity}</p>
                  <p><strong>Location:</strong> {aid.location}</p>
                  <p><strong>Provider:</strong> {aid.provider}</p>
                  <p><strong>Coordinates:</strong> {aid.coordinates}</p>
                  {aid.message && <p><strong>Message:</strong> "{aid.message}"</p>}
                </div>
                <div className="aid-card-footer">
                  <button>Request</button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2>Requested Aid</h2>
            {requestedAid.map(aid => (
              <div key={aid.id} className="aid-card">
                <div className="aid-card-header">
                  <h3>{aid.type}</h3>
                  <span className={`aid-urgency ${aid.urgency.toLowerCase()}`}>
                    {aid.urgency}
                  </span>
                </div>
                <div className="aid-card-body">
                  <p><strong>Quantity:</strong> {aid.quantity}</p>
                  <p><strong>Location:</strong> {aid.location}</p>
                  <p><strong>Requester:</strong> {aid.requester}</p>
                  <p><strong>Coordinates:</strong> {aid.coordinates}</p>
                </div>
                <div className="aid-card-footer">
                  <button>Provide Aid</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Aid; 