import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../state/useAuthUser";
import { Home, MessageCircle, QrCode, Scan, Settings } from "lucide-react";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const user = useAuthUser();

  return (
    <div className="w-16 h-screen bg-white border-r flex flex-col items-center py-4">
      <div className="flex flex-col gap-6">
        <Home
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <MessageCircle
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/home")}
        />

        {/* Generate QR */}
        <QrCode
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/qr")}
        />

        {/* Scan QR */}
        <Scan
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/scan")}
        />
      </div>

      <div className="flex-1"></div>

      <div className="flex flex-col items-center gap-4 mb-4">
        <Settings
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/settings")}
        />

        <img
          src={user?.avatar}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={() => navigate("/profile")}
          alt="me"
        />
      </div>
    </div>
  );
}
