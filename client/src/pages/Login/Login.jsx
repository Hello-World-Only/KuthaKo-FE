import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/auth.api";

import loginLogo from "../../assets/login-logo.png";

export default function Login() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    setLoading(true);

    try {
      await sendOtp(value);
      navigate("/verify", { state: { value } });
    } catch (err) {
      console.log(err);
      alert("Failed to send OTP");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-5">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={loginLogo}
              alt="KuthaKo Logo"
              className="w-20 h-20 object-contain"
            />
            <img
              src={loginLogo}
              alt="KuthaKo Logo"
              className="w-20 h-20 object-contain"
            />
            <img
              src={loginLogo}
              alt="KuthaKo Logo"
              className="w-20 h-20 object-contain"
            />
            <img
              src={loginLogo}
              alt="KuthaKo Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Login to KuthaKo
          </h1>

          {/* Subtitle (optional – can remove) */}
          <p className="text-center text-gray-500 mb-6">
            Enter your email or phone number
          </p>

          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="text"
              placeholder="Email or phone"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </>
    // <div style={{ padding: 20 }}>
    //   <h1>Login</h1>

    //   <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
    //     <input
    //       type="text"
    //       placeholder="Email or phone"
    //       value={value}
    //       onChange={(e) => setValue(e.target.value)}
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
    //         opacity: loading ? 0.7 : 1
    //       }}
    //     >
    //       {loading ? "Sending..." : "Send OTP"}
    //     </button>
    //   </form>
    // </div>
  );
}
