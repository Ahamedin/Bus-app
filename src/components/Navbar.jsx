import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">Bus App</h2>

      {/* Hamburger Icon (Mobile Only) */}
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* Nav Links */}
      <div className={`nav-links ${open ? "active" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setOpen(false)}>About</Link>

        <SignedIn>
          <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <Link to="/sign-in" onClick={() => setOpen(false)}>Sign In</Link>
          <Link to="/sign-up" onClick={() => setOpen(false)}>Sign Up</Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
