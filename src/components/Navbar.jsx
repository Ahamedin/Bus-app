import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Bus App</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {/* Logged-in users */}
        <SignedIn>
          <Link to="/profile">Profile</Link>
          {/* <Link to="/admin">Admin</Link> */}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        {/* Logged-out users */}
        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
          <Link to="/sign-up">Sign Up</Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
