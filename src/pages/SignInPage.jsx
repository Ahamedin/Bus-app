import { SignIn } from "@clerk/clerk-react";
import "./Auth.css";

const SignInPage = () => {
  return (
    <div className="auth-container">
      <SignIn />
    </div>
  );
};

export default SignInPage;
