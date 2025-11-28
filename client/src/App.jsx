import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./pages/auth/PrivateRoute";
import PublicRoute from "./pages/auth/PublicRoute";
import { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import VerifyOTP from "./pages/Login/VerifyOTP";
import Onboarding from "./pages/Onboarding/Onboarding";

import Home from "./pages/Home/Home";
import UserProfile from "./pages/Profile/UserProfile";
import ShowQR from "./pages/QR/ShowQR";
import ScanQR from "./pages/QR/ScanQR";
import PendingRequests from "./pages/QR/PendingRequests";
import Connections from "./pages/Connections/Connections";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { userAtom } from "./state/userAtom";
import api from "./api/axiosInstance";
import { pageTitles } from "./utils/pageTitles";

export default function App() {
  const location = useLocation();
  const setUser = useSetAtom(userAtom);

  const [authLoaded, setAuthLoaded] = useState(false);

  // ---------- AUTO PAGE TITLES ----------
  useEffect(() => {
    const title = pageTitles[location.pathname] || "KuthaKo";
    document.title = title;
  }, [location.pathname]);

  // ---------- LOAD USER (NO REDIRECT UNTIL DONE) ----------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setAuthLoaded(true);
      return;
    }

    api
      .get("/users/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setAuthLoaded(true));
  }, []);

  // ---------- PREVENT ROUTES FROM RENDERING UNTIL AUTH LOADED ----------
  if (!authLoaded) {
    return (
      <div className="p-10 text-center text-gray-500">Checking session...</div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/verify"
          element={
            <PublicRoute>
              <VerifyOTP />
            </PublicRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <PublicRoute>
              <Onboarding />
            </PublicRoute>
          }
        />

        {/* ---------- PRIVATE ROUTES ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/qr" element={<ShowQR />} />
          <Route path="/scan" element={<ScanQR />} />
          <Route path="/pending" element={<PendingRequests />} />
          <Route path="/connections" element={<Connections />} />
        </Route>
      </Routes>
    </>
  );
}
