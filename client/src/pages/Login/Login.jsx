import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/auth.api";

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
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Email or phone"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
