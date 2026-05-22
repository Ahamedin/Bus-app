import { Suspense, lazy, useEffect, useRef, useState } from "react";
import HighwaySection from "../components/HighwaySection";
import StoryText from "../components/StoryText";
import Destination from "../components/Destination";
import bus2 from "../assets/bus2.png";
import "../components/Highway.css";
import "./Home.css";

const MapView = lazy(() => import("../components/MapView"));

const Home = () => {
  const mapTriggerRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const node = mapTriggerRef.current;
    if (!node || showMap) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showMap]);

  return (
    <div className="home-container">
      <img src={bus2} alt="" className="bus-topview" loading="eager" decoding="async" />
      <HighwaySection />
      <StoryText />
      <Destination />
      <section ref={mapTriggerRef} className="map-section">
        {showMap ? (
          <Suspense fallback={<div className="map-loading">Loading map…</div>}>
            <MapView />
          </Suspense>
        ) : (
          <div className="map-placeholder">
            <p>Map loads when you scroll here.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
