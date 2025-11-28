import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
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

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userAtom } from "./state/userAtom";
import api from "./api/axiosInstance";

import { pageTitles } from "./utils/pageTitles";

export default function App() {
  const location = useLocation();
  const setUser = useSetAtom(userAtom);

  // Auto page titles
  useEffect(() => {
    const title = pageTitles[location.pathname] || "KuthaKo";
    document.title = title;
  }, [location.pathname]);

  // Load logged-in user
  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/onboarding" element={<Onboarding />} />

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
