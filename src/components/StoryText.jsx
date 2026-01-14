import { useEffect, useRef } from "react";

const StoryText = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          textRef.current.classList.add("show");
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(textRef.current);
  }, []);

  return (
    <section className="story-section">
      <div className="highway-container">

        {/* Road wrapper for mobile layout */}
        <div className="road-wrapper">
          <div className="vertical-road"></div>
        </div>

        <div ref={textRef} className="hero-text-vertical">
          <h1>Campus Moments on Every Ride</h1>
          <p>
            From study chats to fun debates,  
            the bus ride keeps the campus spirit alive.  
            Travel together, grow together.
          </p>
        </div>

      </div>
    </section>
  );
};

export default StoryText;
