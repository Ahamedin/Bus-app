import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import "./TripTracker.css";

const GMAPS_KEY   = "AIzaSyDiueVafmMYqloszSSngL3KN2EnAbRckIM";
const LIBRARIES   = ["places"];
const MAP_STYLE   = { width: "100%", height: "420px" };
const DEFAULT_CENTER = { lat: 11.0168, lng: 76.9558 };
const API         = "http://localhost:5000";

export default function TripTracker() {
  const { user, isLoaded } = useUser();

  const [source, setSource]           = useState("");
  const [destination, setDestination] = useState("");
  const [sourceCoords, setSourceCoords]   = useState(null);
  const [destCoords, setDestCoords]       = useState(null);
  const [directions, setDirections]   = useState(null);
  const [mapError, setMapError]       = useState("");

  const [tripActive, setTripActive]   = useState(false);
  const [etaMinutes, setEtaMinutes]   = useState(null);
  const [alerted, setAlerted]         = useState(false);
  const [busLocation, setBusLocation] = useState(null);
  const [statusMsg, setStatusMsg]     = useState("");
  const [loading, setLoading]         = useState(false);

  const sourceRef = useRef(null);
  const destRef   = useRef(null);
  const pollRef   = useRef(null);

  // ── Sync with Bus Location ──────────────────────────────
  const syncBusLocation = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/gps/location`);
      const data = await res.json();
      if (data.busLocation?.lat) {
        const coords = data.busLocation;
        setSourceCoords(coords);
        setSource("Bus Current Location");
        setBusLocation(coords);
        setMapError("");
      } else {
        setMapError("Bus location not available yet (waiting for ESP32)");
      }
    } catch {
      setMapError("Failed to fetch bus location");
    }
  }, []);


  // ── Get Current Geolocation (Browser) ───────────────────
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSourceCoords(coords);
        setSource("My Location (Current GPS)");
        setLoading(false);
        setMapError("");
        
        // Auto-center map to current location
        setBusLocation(coords); 
      },
      () => {
        setMapError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  // ── Map Click Handler to set Destination ──────────────────
  const onMapClick = useCallback((e) => {
    if (tripActive) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setDestCoords({ lat, lng });
    setDestination(`Map Selection (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
  }, [tripActive]);

  // ── Draw map route + extract coords from result ──────────
  const showRoute = useCallback(async () => {
    if (!source || !destination) {
      setMapError("Enter both source and destination (or click on map)");
      return;
    }
    setMapError("");

    const svc = new window.google.maps.DirectionsService();
    try {
      const result = await svc.route({
        origin:      sourceCoords || source,
        destination: destCoords   || destination,
        travelMode:  window.google.maps.TravelMode.DRIVING,
      });

      setDirections(result);

      // Extract lat/lng from the directions result
      const leg = result.routes[0].legs[0];
      setSourceCoords({ lat: leg.start_location.lat(), lng: leg.start_location.lng() });
      setDestCoords({   lat: leg.end_location.lat(),   lng: leg.end_location.lng() });
      
      // Update text fields if they were simple strings
      if (typeof source === "string" && !source.includes("Map")) setSource(leg.start_address);
      if (typeof destination === "string" && !destination.includes("Map")) setDestination(leg.end_address);
      
      setMapError("");
    } catch {
      setMapError("Route not found — try full names or click on the map");
    }
  }, [source, destination, sourceCoords, destCoords]);



  // ── Start trip ────────────────────────────────────────────
  const startTrip = async () => {
    if (!sourceCoords || !destCoords) {
      setMapError("⚠️ Click 'Show Route' first to confirm the locations");
      return;
    }
    if (!isLoaded || !user) return;

    setLoading(true);
    setStatusMsg("");
    try {
      const res = await fetch(`${API}/api/users/set-trip/${user.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination, sourceCoords, destCoords }),
      });

      // Parse JSON first to get the real backend error message
      const data = await res.json();

      if (!res.ok) {
        // Show the actual backend error so user knows what to fix
        if (res.status === 404) {
          throw new Error("Profile not found — please complete your profile at /details first");
        }
        throw new Error(data.message || "Failed to start trip");
      }

      setTripActive(true);
      setAlerted(false);
      setStatusMsg("✅ Trip started! Monitoring your route...");
    } catch (e) {
      setStatusMsg("❌ " + e.message);
    }
    setLoading(false);
  };


  // ── End trip ──────────────────────────────────────────────
  const endTrip = async () => {
    if (!user) return;
    clearInterval(pollRef.current);
    await fetch(`${API}/api/users/end-trip/${user.id}`, { method: "PUT" });
    setTripActive(false);
    setEtaMinutes(null);
    setAlerted(false);
    setBusLocation(null);
    setStatusMsg("🏁 Trip ended.");
  };

  // ── Poll backend for ETA + bus location ──────────────────
  useEffect(() => {
    if (!tripActive || !user) return;

    const poll = async () => {
      try {
        // Get user trip status (ETA, alerted)
        const tripRes  = await fetch(`${API}/api/users/trip-status/${user.id}`);
        const tripData = await tripRes.json();
        setEtaMinutes(tripData.etaMinutes);
        setAlerted(tripData.tripAlerted);

        // Get bus live location
        const locRes  = await fetch(`${API}/api/gps/location`);
        const locData = await locRes.json();
        if (locData.busLocation?.lat) setBusLocation(locData.busLocation);
      } catch { /* silent */ }
    };

    poll();
    pollRef.current = setInterval(poll, 5000);
    return () => clearInterval(pollRef.current);
  }, [tripActive, user]);

  // ── Initial setup: Get bus location as default source ────
  useEffect(() => {
    if (!tripActive && !source) {
      syncBusLocation();
    }
  }, [tripActive, source, syncBusLocation]);


  // ── Blinking alert effect ─────────────────────────────────
  useEffect(() => {
    if (alerted) setStatusMsg("🚨 Wake up! Your stop is less than 10 minutes away!");
  }, [alerted]);

  if (!isLoaded) return <p className="tt-loading">Loading user...</p>;

  return (
    <div className="tt-page">
      {/* HEADER */}
      <div className="tt-header">
        <h1>🚌 Trip Tracker</h1>
        <p>Set your source & destination — we'll wake you up before you arrive!</p>
      </div>

      {/* TRIP FORM */}
      <div className="tt-card">
        <h2>📍 Plan Your Trip</h2>
        <div className="tt-inputs">
          <div className="tt-input-group">
            <label>🟢 Source</label>
            <div className="tt-input-with-btn">
              <input
                ref={sourceRef}
                type="text"
                placeholder="Name or use GPS →"
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setSourceCoords(null);
                }}
                disabled={tripActive}
              />
              <button 
                className="tt-icon-btn" 
                onClick={syncBusLocation} 
                title="Use Bus Current Location"
                disabled={tripActive || loading}
              >
                🚌
              </button>
              <button 
                className="tt-icon-btn" 
                onClick={useMyLocation} 
                title="Use My Phone GPS"
                disabled={tripActive || loading}
              >
                📍
              </button>
            </div>
          </div>

          <div className="tt-input-group">
            <label>🔴 Destination</label>
            <input
              ref={destRef}
              type="text"
              placeholder="Name or Click Map"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setDestCoords(null);
              }}
              disabled={tripActive}
            />
          </div>

        </div>

        {mapError && <p className="tt-error">{mapError}</p>}

        <div className="tt-btn-row">
          {!tripActive ? (
            <>
              <button className="tt-btn tt-btn-secondary" onClick={showRoute}>
                🗺️ Show Route
              </button>
              <button
                className="tt-btn tt-btn-primary"
                onClick={startTrip}
                disabled={loading}
              >
                {loading ? "Starting..." : "🚀 Start Trip"}
              </button>
              <button 
                className="tt-btn tt-btn-outline" 
                onClick={async () => {
                   setStatusMsg("⚡ Sending test alert to ESP32...");
                   const res = await fetch(`${API}/api/gps/update`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ lat: 0, lng: 0, forceAlert: true })
                   });
                   if (res.ok) setStatusMsg("✅ Hardware test signal sent!");
                }}
              >
                💺 Test Alert
              </button>
            </>

          ) : (
            <button className="tt-btn tt-btn-danger" onClick={endTrip}>
              🛑 End Trip
            </button>
          )}
        </div>

        {statusMsg && (
          <p className={`tt-status ${alerted ? "tt-status-alert" : ""}`}>
            {statusMsg}
          </p>
        )}
      </div>

      {/* ETA CARD */}
      {tripActive && (
        <div className={`tt-eta-card ${alerted ? "tt-eta-alert" : ""}`}>
          {alerted ? (
            <div className="tt-alert-content">
              <div className="tt-alert-icon">🚨</div>
              <h2>WAKE UP!</h2>
              <p>Your destination is less than 10 minutes away!</p>
              <p className="tt-seat">Seat: <strong>{user?.firstName}</strong></p>
            </div>
          ) : (
            <div className="tt-eta-content">
              <div className="tt-eta-label">ETA to Destination</div>
              <div className="tt-eta-number">
                {etaMinutes !== null ? etaMinutes : "--"}
              </div>
              <div className="tt-eta-unit">minutes</div>
              {etaMinutes !== null && etaMinutes > 10 && (
                <div className="tt-eta-safe">😴 You can rest — we'll alert you!</div>
              )}
              {etaMinutes !== null && etaMinutes <= 10 && !alerted && (
                <div className="tt-eta-soon">⚠️ Getting close!</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TRIP INFO */}
      {tripActive && (
        <div className="tt-trip-info">
          <div className="tt-info-chip">🟢 {source || "Source"}</div>
          <div className="tt-info-arrow">→</div>
          <div className="tt-info-chip">🔴 {destination || "Destination"}</div>
        </div>
      )}

      {/* MAP */}
      <div className="tt-map-container">
        <LoadScript googleMapsApiKey={GMAPS_KEY} libraries={LIBRARIES}>
          <GoogleMap
            mapContainerStyle={MAP_STYLE}
            center={
              busLocation
                ? { lat: busLocation.lat, lng: busLocation.lng }
                : DEFAULT_CENTER
            }
            zoom={12}
            onClick={onMapClick}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: false,
              zoomControl: true,
            }}

          >
            {directions && <DirectionsRenderer directions={directions} />}
            {busLocation && (
              <Marker
                position={{ lat: busLocation.lat, lng: busLocation.lng }}
                label={{ text: "🚌", fontSize: "24px" }}
                title="Bus Location"
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* HOW IT WORKS */}
      <div className="tt-how-card">
        <h3>⚙️ How it works</h3>
        <ol>
          <li>Enter your source & destination, then click <strong>Show Route</strong></li>
          <li>Click <strong>Start Trip</strong> to activate monitoring</li>
          <li>The bus GPS is tracked in real-time via ESP32</li>
          <li>When ≤ 10 minutes away → the seat <strong>vibrates & taps</strong> to wake you!</li>
        </ol>
      </div>
    </div>
  );
}

// ── Dark map style ────────────────────────────────────────
const darkMapStyle = [
  { elementType: "geometry",   stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill",   stylers: [{ color: "#8ec6ff" }] },
  { featureType: "road", elementType: "geometry",
    stylers: [{ color: "#16213e" }] },
  { featureType: "road", elementType: "geometry.stroke",
    stylers: [{ color: "#0f3460" }] },
  { featureType: "water", elementType: "geometry",
    stylers: [{ color: "#0f3460" }] },
  { featureType: "transit", elementType: "geometry",
    stylers: [{ color: "#2f3948" }] },
  { featureType: "poi", elementType: "geometry",
    stylers: [{ color: "#1a1a2e" }] },
];
