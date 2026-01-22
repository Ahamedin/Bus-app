import { useState } from "react";
import "./MapView.css";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "80vh",   // ✅ Avoid 100vh overflow issue
};

const DEFAULT_UNIVERSITY = {
  lat: 9.575163364325412,
  lng: 77.68070518973906,
};

const MapView = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState("");

  const calculateRoute = async () => {
    if (!destination) {
      setError("Please enter destination");
      return;
    }

    setError("");

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: source || DEFAULT_UNIVERSITY,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
    } catch (err) {
      setError("Route not found. Enter a valid location.");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDiueVafmMYqloszSSngL3KN2EnAbRckIM"
      libraries={["places"]}   // ✅ REQUIRED
    >
      {/* Controls */}
      <div className="map-controls">
        <h2>Bus Route Tracking</h2>

        <input
          type="text"
          placeholder="Enter source (optional)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <button onClick={calculateRoute}>Show Route</button>

        <p className="hint">
          If source is empty → Kalasalingam University is used.
        </p>

        {error && <p className="error">{error}</p>}
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_UNIVERSITY}
        zoom={12}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
