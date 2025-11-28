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
    // Start scanning immediately
    const interval = setInterval(() => {
      scanFrame();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const scanFrame = () => {
    const video = webcamRef.current?.video;
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
      await api.post("/qr/scan", { qrToken: result });

      alert("Connection request sent!");
      navigate("/home");
    } catch (err) {
      console.error("SCAN ERROR", err);
      alert("Invalid or expired QR");
      setScanned(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-white">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Scan QR Code
      </h2>

      {/* Webcam Box */}
      <div
        className="
      relative w-72 h-72 rounded-xl overflow-hidden 
      shadow-lg border border-gray-200 bg-black
    "
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          playsInline
          screenshotFormat="image/png"
          className="w-full h-full object-cover"
          videoConstraints={{ facingMode: "environment" }}
        />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* QR Scan Overlay corners */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-sm"></div>
          <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-sm"></div>
          <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-sm"></div>
          <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-sm"></div>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-500 text-sm mt-4">
        Point your camera at the QR code.
      </p>
    </div>
  );

  // return (
  //   <div className="flex flex-col items-center p-4 space-y-4">
  //     <h2 className="text-xl font-semibold">Scan QR Code</h2>

  //     <div className="relative w-72 h-72 rounded-lg overflow-hidden shadow">
  //       <Webcam
  //         ref={webcamRef}
  //         audio={false}
  //         playsInline
  //         screenshotFormat="image/png"
  //         className="w-full h-full object-cover"
  //         videoConstraints={{ facingMode: "environment" }}
  //       />

  //       <canvas
  //         ref={canvasRef}
  //         className="absolute top-0 left-0 w-full h-full"
  //       />
  //     </div>

  //     <p className="text-gray-500 text-sm">Point your camera at the QR code.</p>
  //   </div>
  // );
}
