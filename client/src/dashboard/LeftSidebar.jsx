import React from "react";
import { Home, QrCode, Scan, Users, Settings } from "lucide-react";

export default function LeftSidebar({ onNavigate, user }) {
  return (
    <div className="w-16 h-screen bg-white border-r flex flex-col items-center py-4">
      <div className="flex flex-col gap-6">
        <Home
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("chat")}
        />

        <QrCode
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("qr")}
        />

        <Scan
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("scan")}
        />

        <Users
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("connections")}
        />
      </div>

      <div className="flex-1" />

      <div className="flex flex-col items-center gap-4 mb-4">
        <Settings
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("settings")}
        />

        <img
          src={user?.avatar || "https://i.pravatar.cc/100"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={() => onNavigate("profile")}
        />
      </div>
    </div>
  );
}
