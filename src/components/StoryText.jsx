import VerticalRoad from "./VerticalRoad";

const StoryText = () => {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        background: "#f5f5f5",
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
            padding: "80px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h2>The Journey Begins...</h2>
          <p>
            Every evening, students board the bus from college, traveling safely
            towards their homes.
          </p>
          <p>
            Our system ensures students never miss their stop.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StoryText;
