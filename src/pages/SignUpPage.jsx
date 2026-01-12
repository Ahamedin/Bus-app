import { SignUp } from "@clerk/clerk-react";
import "./Auth.css";

const SignUpPage = () => {
  return (
    <div className="auth-container">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
