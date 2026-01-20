import { SignIn } from "@clerk/clerk-react";
import "./Auth.css";
import UserDetailsForm from "../components/UserDetailsForm";


const SignInPage = () => {
  return (
    <div className="auth-container">
 <SignIn afterSignInUrl="/details" /> 
    </div>
  );
};

export default SignInPage;
