import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        seatNo,
        destination,
        phone,
      }),
    });

    alert("Details saved successfully");

    // ✅ IMPORTANT: redirect after first save
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Bus Details</h2>

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

      <button type="submit">Save</button>
    </form>
  );
};

export default UserDetailsForm;
