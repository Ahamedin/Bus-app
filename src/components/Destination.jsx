import { useEffect, useRef } from "react";

const Destination = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      },
      { threshold: 0.3 }
    );
    observer.observe(textRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="destination-section">
      <div className="highway-container">

        {/* Road wrapper for mobile layout */}
        <div className="road-wrapper">
          <div className="vertical-road"></div>
        </div>

        <div ref={textRef} className="hero-text-vertical">
          <h1>Arriving Home Safely</h1>
          <p>
            Get notified before your stop.  
            A smooth and secure end to every college day’s journey.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Destination;
