import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const UserDetailsPage = lazy(() => import("./components/UserDetailsForm"));
const AuthRedirect = lazy(() => import("./pages/AuthRedirect"));
const TripTracker = lazy(() => import("./pages/TripTracker"));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense
        fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading app…</div>}
      >
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
            path="/trip"
            element={
              <SignedIn>
                <TripTracker />
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
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
