import React from "react";
import { Home, QrCode, Scan, Users, Settings, Hourglass } from "lucide-react";

export default function LeftSidebar({ onNavigate, user }) {
  return (
    <div className="w-16 h-screen bg-white border-r flex flex-col items-center py-4">
      {/* TOP ICONS */}
      <div className="flex flex-col gap-6">
        {/* Chat */}
        <Home
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("chat")}
        />

        {/* Generate QR */}
        <QrCode
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("qr")}
        />

        {/* Scan QR */}
        <Scan
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("scan")}
        />

        {/* Connections */}
        <Users
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("connections")}
        />

        {/* Pending Requests */}
        <Hourglass
          className="w-6 h-6 cursor-pointer"
          onClick={() => onNavigate("pending")}
        />
      </div>

      {/* PUSH TO BOTTOM */}
      <div className="flex-1" />

      {/* SETTINGS + AVATAR */}
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
