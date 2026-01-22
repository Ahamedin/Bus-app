import "../components/Highway.css";
import "./Profile.css";

const Profile = () => {
  return (
    <section className="about-section">
      <div className="profile-container">

        {/* Heading */}
        <div className="hero-text-vertical show profile-heading">
          <h1>Student Profile</h1>
          <p>Your Bus Details</p>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <p><span>Name:</span> Demo Student</p>
          <p><span>Bus No:</span> 12</p>
          <p><span>Destination:</span> Home Stop</p>
          <p><span>Alert Status:</span> Pending</p>
        </div>

      </div>
    </section>
  );
};

export default Profile;
