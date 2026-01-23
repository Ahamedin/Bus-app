import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../components/Highway.css";
import "./UserDetailsForm.css";

const UserDetailsForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [seatNo, setSeatNo] = useState("");
  const [destination, setDestination] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/users/save-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        seatNo,
        destination,
        phone,
      }),
    });

    navigate("/");
  };

  return (
    <section className="details-section">
      <div className="details-container">

        <div className="hero-text-vertical show details-heading">
        <h1>Student Detail's</h1>
          <p>Fill once to complete registration</p>
        </div>

        <form className="details-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Seat No"
            value={seatNo}
            onChange={(e) => setSeatNo(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button type="submit">Save Details</button>
        </form>

      </div>
    </section>
  );
};

export default UserDetailsForm;
