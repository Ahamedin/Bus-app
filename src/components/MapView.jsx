import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// 🔵 College location (example – change later)
const COLLEGE_LOCATION = {
  lat: 12.9716, // example
  lng: 77.5946, // example
};

const MapView = () => {
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState(null);

  const calculateRoute = async () => {
    if (!destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: COLLEGE_LOCATION,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirections(result);
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <div style={{ padding: "20px", background: "#eef" }}>
        <h2>Bus Route Tracking</h2>

        <input
          type="text"
          placeholder="Enter destination address"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
          }}
        />

        <button onClick={calculateRoute} style={{ padding: "10px 20px" }}>
          Show Route
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={COLLEGE_LOCATION}
        zoom={12}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
