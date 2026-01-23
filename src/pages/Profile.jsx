import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetch(`http://localhost:5000/api/users/profile/${user.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Profile not found");
        }
        return res.json();
      })
      .then((dbUser) => {
        setData(dbUser);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Profile data not found");
        setLoading(false);
      });
  }, [isLoaded, user]);

  if (!isLoaded) return <p>Loading user...</p>;
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Student Profile</h1>
      <p><b>Name:</b> {data.name}</p>
      <p><b>Seat No:</b> {data.seatNo}</p>
      <p><b>Destination:</b> {data.destination}</p>
      <p><b>Phone:</b> {data.phone}</p>
    </div>
  );
};

export default Profile;
