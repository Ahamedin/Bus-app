import HighwaySection from "../components/HighwaySection";
import StoryText from "../components/StoryText";
import Destination from "../components/Destination";
import MapView from "../components/MapView";
import bus2 from "../assets/bus2.png";
import "../components/Highway.css";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <img src={bus2} alt="" className="bus-topview" />
      <HighwaySection />
      <StoryText />
      <Destination />
      <MapView />
    </div>
  );
};

export default Home;
