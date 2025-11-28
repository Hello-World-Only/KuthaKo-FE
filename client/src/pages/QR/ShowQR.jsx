import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import { QRCodeCanvas } from "qrcode.react";

export default function ShowQR() {
  const [qrToken, setQrToken] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef(null);

  const generateQR = async () => {
    try {
      const res = await api.post("/qr/generate");

      const data = res.data;

      setQrToken(data.qrToken);
      setExpiresAt(data.expiresAt);

      const expiresIn = Math.floor(
        (new Date(data.expiresAt) - new Date()) / 1000
      );

      setRemaining(expiresIn);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            generateQR();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.log("QR ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to generate QR");
    }
  };

  useEffect(() => {
    generateQR();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white text-center">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Your QR Code</h1>

      {/* QR Box */}
      {qrToken ? (
        <div
          className="
          bg-white p-6 mt-6 rounded-xl shadow-md border border-gray-200 
          inline-flex items-center justify-center
        "
        >
          <QRCodeCanvas value={qrToken} size={220} />
        </div>
      ) : (
        <p className="text-gray-500 mt-6 text-sm">Generating…</p>
      )}

      {/* Timer */}
      <p className="mt-4 text-gray-600 text-sm">
        Expires in: <span className="font-semibold">{remaining}s</span>
      </p>

      {/* Regenerate Button (Optional) */}
      <button
        onClick={generateQR}
        className="
        mt-6 px-5 py-2 rounded-full
        bg-gray-900 text-white
        hover:bg-black transition
      "
      >
        Refresh QR
      </button>
    </div>
  );
}
