import { useEffect, useState } from "react";
import { useUser, SignedIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import UserDetailsForm from "../components/UserDetailsForm";

const UserDetailsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!user) return;

  fetch(`http://localhost:5000/api/users/check/${user.id}`)
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        navigate("/");
      }
    });
}, [user, navigate]);   // ✅ add navigate



  if (loading) return <p>Checking profile...</p>;

  return (
    <SignedIn>
      <UserDetailsForm />
    </SignedIn>
  );
};

export default UserDetailsPage;
