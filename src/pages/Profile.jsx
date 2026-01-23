import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import "./Profile.css";   // 👈 import CSS

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetch(`http://localhost:5000/api/users/profile/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then((dbUser) => {
        setData(dbUser);
        setLoading(false);
      })
      .catch(() => {
        setError("Profile data not found");
        setLoading(false);
      });
  }, [isLoaded, user]);

  if (!isLoaded) return <p>Loading user...</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="profile-container">
      
      <div className="profile-heading hero-text-vertical show">
        <h1>Student Profile</h1>
      </div>

      <div className="profile-card">
        <p><span>Name:</span> {data.name}</p>
        <p><span>Seat No:</span> {data.seatNo}</p>
        <p><span>Destination:</span> {data.destination}</p>
        <p><span>Phone:</span> {data.phone}</p>
      </div>

    </section>
  );
};

export default Profile;
