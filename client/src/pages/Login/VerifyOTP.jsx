import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { verifyOtp } from "../../api/auth.api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const value = state?.value;
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setLoading(true);

    try {
      const res = await verifyOtp(value, otp);

      Cookies.set("token", res.data.token);

      const user = res.data.user;

      // If user has no avatar or name → onboarding
      const needsOnboarding =
        !user.name || user.name.trim() === "" || !user.avatar;

      if (needsOnboarding) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
      alert("OTP verification failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Verify OTP</h1>
      <p>Sent to: {value}</p>

      <form onSubmit={handleVerify} style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ padding: 10, width: "100%", marginBottom: 20 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            width: "100%",
            background: "black",
            color: "white",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>
    </div>
  );
}
