import "./Highway.css";

const HighwaySection = () => {
  return (
    <section className="highway-section">
      <div className="highway-container">

        {/* Road */}
        <div className="road-wrapper">
          <div className="vertical-road"></div>
        </div>

        {/* Text */}
        <div className="hero-text-vertical show">
          <h1>
            From <br />
            Kalasalingam <br />
            to Your Home
          </h1>

          <p>
            After a day of learning at Kalasalingam, ride home safely.
            Live bus tracking, timely alerts, and a relaxed journey guaranteed.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HighwaySection;
