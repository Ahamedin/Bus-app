import VerticalRoad from "./VerticalRoad";

const Destination = () => {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* LEFT: Road */}
        <div
          style={{
            width: "220px",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <VerticalRoad />
        </div>

        {/* RIGHT: Text */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h2>Your Stop is Near 🚌</h2>
          <p>
            You will receive an alert before reaching your destination.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Destination;
