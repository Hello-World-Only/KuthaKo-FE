import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ScanQR() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      scanFrame();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const scanFrame = () => {
    const webcam = webcamRef.current;
    if (!webcam) return;

    const video = webcam.video;

    if (!video || video.readyState !== 4) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { videoWidth, videoHeight } = video;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
    const code = jsQR(imageData.data, videoWidth, videoHeight);

    if (code && !scanned) {
      setScanned(true);
      handleScanResult(code.data);
    }
  };

  const handleScanResult = async (result) => {
    try {
      const res = await api.post("/qr/scan", {
        qrToken: result,
      });

      alert("Connection request sent!");
      navigate("/home");
    } catch (err) {
      console.error("SCAN ERROR", err);
      alert("Invalid QR");
      setScanned(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h2 className="text-xl font-semibold">Scan QR Code</h2>

      <div className="relative w-72 h-72 rounded-lg overflow-hidden shadow">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          className="w-full h-full object-cover"
          videoConstraints={{ facingMode: "environment" }}
          playsInline // REQUIRED FOR SAMSUNG/ANDROID
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      <p className="text-gray-500 text-sm">
        Point your phone camera at the QR code on the other device.
      </p>
    </div>
  );
}
