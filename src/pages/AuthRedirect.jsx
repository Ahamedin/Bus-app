import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

 useEffect(() => {
  if (!user) return;

  fetch(`http://localhost:5000/api/users/check/${user.id}`)
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        navigate("/");
      } else {
        navigate("/details");
      }
    })
    .catch(err => console.error(err));
}, [user]);


  return <p>Checking account...</p>;
};

export default AuthRedirect;
