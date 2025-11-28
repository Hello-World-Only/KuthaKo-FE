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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-5">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Verify OTP
          </h1>

          <p className="text-center text-gray-500 mb-6">Sent to: {value}</p>

          <form onSubmit={handleVerify} className="mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="
          w-full p-3.5 mb-5
          bg-gray-50 border border-gray-200 
          rounded-xl outline-none
          focus:border-gray-400 focus:bg-white
          text-gray-800 text-base
        "
            />

            <button
              type="submit"
              disabled={loading}
              className={`
          w-full p-3.5 rounded-xl text-white font-semibold text-base
          shadow-md transition-all
          ${
            loading
              ? "bg-gray-700/70 cursor-wait"
              : "bg-black hover:bg-gray-900 active:scale-95"
          }
        `}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        </div>
      </div>
    </>
    // <div style={{ padding: 20 }}>
    //   <h1>Verify OTP</h1>
    //   <p>Sent to: {value}</p>

    //   <form onSubmit={handleVerify} style={{ marginTop: 20 }}>
    //     <input
    //       type="text"
    //       placeholder="Enter OTP"
    //       value={otp}
    //       onChange={(e) => setOtp(e.target.value)}
    //       style={{ padding: 10, width: "100%", marginBottom: 20 }}
    //     />

    //     <button
    //       type="submit"
    //       disabled={loading}
    //       style={{
    //         padding: 12,
    //         width: "100%",
    //         background: "black",
    //         color: "white",
    //         opacity: loading ? 0.7 : 1,
    //       }}
    //     >
    //       {loading ? "Verifying..." : "Verify & Continue"}
    //     </button>
    //   </form>
    // </div>
  );
}
