import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserDetailsPage from "./components/UserDetailsForm";
import AuthRedirect from "./pages/AuthRedirect";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* AUTH ROUTES */}
     <Route path="/sign-in" element={<SignInPage />} />
       <Route path="/details" element={<UserDetailsPage />} />
       <Route path="/auth-redirect" element={<AuthRedirect />} />



        <Route path="/sign-up" element={<SignUpPage />} />



        {/* PROTECTED ROUTES */}
        <Route
          path="/profile"
          element={
            <SignedIn>
              <Profile />
            </SignedIn>
          }
        />

        <Route
          path="/admin"
          element={
            <>
              <SignedIn>
                <Admin />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
