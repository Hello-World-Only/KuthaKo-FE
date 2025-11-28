// import React from "react";
// import { Home, QrCode, Scan, Users, Settings, Hourglass } from "lucide-react";

// export default function LeftSidebar({ onNavigate, user }) {
//   return (
//     <div className="w-16 h-screen bg-white border-r flex flex-col items-center py-4">
//       {/* TOP ICONS */}
//       <div className="flex flex-col gap-6">
//         {/* Chat */}
//         <Home
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => onNavigate("chat")}
//         />

//         {/* Generate QR */}
//         <QrCode
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => onNavigate("qr")}
//         />

//         {/* Scan QR */}
//         <Scan
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => onNavigate("scan")}
//         />

//         {/* Connections */}
//         <Users
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => onNavigate("connections")}
//         />

//         {/* Pending Requests */}
//         <Hourglass
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => onNavigate("pending")}
//         />
//       </div>

//       {/* PUSH TO BOTTOM */}
//       <div className="flex-1" />

//       {/* SETTINGS + AVATAR */}
//       <div className="flex flex-col items-center gap-4 mb-4">
//         <Settings
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => onNavigate("settings")}
//         />

//         <img
//           src={user?.avatar || "https://i.pravatar.cc/100"}
//           alt="avatar"
//           className="w-10 h-10 rounded-full object-cover cursor-pointer"
//           onClick={() => onNavigate("profile")}
//         />
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Home, QrCode, Scan, Users, Settings, Hourglass } from "lucide-react";

export default function LeftSidebar({ onNavigate, user }) {
  return (
    <div className="w-16 h-screen bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm select-none">
      {/* TOP ICONS */}
      <div className="flex flex-col gap-6 mt-2">
        {/* Chat */}
        <div
          onClick={() => onNavigate("chat")}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <Home className="w-5 h-5 text-gray-700" />
        </div>

        {/* Generate QR */}
        <div
          onClick={() => onNavigate("qr")}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <QrCode className="w-5 h-5 text-gray-700" />
        </div>

        {/* Scan QR */}
        <div
          onClick={() => onNavigate("scan")}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <Scan className="w-5 h-5 text-gray-700" />
        </div>

        {/* Connections */}
        <div
          onClick={() => onNavigate("connections")}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <Users className="w-5 h-5 text-gray-700" />
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => onNavigate("pending")}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <Hourglass className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* SETTINGS + AVATAR */}
      <div className="flex flex-col items-center gap-5 mb-4">
        {/* Settings icon */}
        <div
          onClick={() => onNavigate("settings")}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </div>

        {/* Avatar */}
        <img
          src={user?.avatar || "https://i.pravatar.cc/100"}
          alt="avatar"
          className="
            w-10 h-10 rounded-full object-cover 
            shadow-md cursor-pointer 
            hover:scale-105 transition
          "
          onClick={() => onNavigate("profile")}
        />
      </div>
    </div>
  );
}
