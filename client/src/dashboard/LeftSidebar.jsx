import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../state/useAuthUser";
import { Home, MessageCircle, QrCode, Settings } from "lucide-react";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const user = useAuthUser();

  const handleQrClick = () => {
    if (!user) {
      navigate("/login"); // Not logged in → go to login
      return;
    }
    navigate("/qr/scan"); // Logged in → go to scanner
  };

  return (
    <div className="w-16 h-screen bg-white border-r flex flex-col items-center py-4">
      {/* --- TOP ICONS --- */}
      <div className="flex flex-col gap-6">
        <Home
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <MessageCircle
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/home")}
        />

        <QrCode
          className="w-6 h-6 cursor-pointer"
          onClick={handleQrClick} // 👈 FIXED
        />
      </div>

      <div className="flex-1"></div>

      {/* --- BOTTOM (SETTINGS + AVATAR) --- */}
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
