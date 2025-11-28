import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useAtom } from "jotai";
import { userAtom } from "../../state/userAtom";

import LeftSidebar from "../../dashboard/LeftSidebar";
import ChatList from "../../dashboard/ChatList";
import ChatWindow from "../Chat/ChatWindow";
import UserProfile from "../Profile/UserProfile";
import ScanQR from "../QR/ScanQR";
import ShowQR from "../QR/ShowQR";
import PendingRequests from "../QR/PendingRequests";
import Connections from "../Connections/Connections";
import SettingsScreen from "../Settings/Settings";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);

  const [activeChat, setActiveChat] = useState(null);

  // chat | scan | qr | pending | connections | profile
  const [screen, setScreen] = useState("chat");

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  const renderMain = () => {
    switch (screen) {
      case "scan":
        return <ScanQR />;

      case "qr":
        return <ShowQR />;

      case "pending":
        return <PendingRequests />;

      case "connections":
        return <Connections />;

      case "profile":
        return <UserProfile />;

      case "settings":
        return <SettingsScreen />;

      case "chat":
      default:
        return activeChat ? (
          <ChatWindow activeChat={activeChat} setActiveChat={setActiveChat} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 transform -translate-y-6">
            <div className="text-2xl font-semibold mb-1">Select a chat</div>
            <p className="text-center max-w-xs text-sm">
              Start messaging by selecting a chat from the list.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-100">
      {/* SIDEBAR */}
      <div className="hidden sm:flex">
        <LeftSidebar
          onNavigate={(target) => {
            setScreen(target);
            if (target !== "chat") setActiveChat(null);
          }}
          user={user}
        />
      </div>

      {/* CHAT LIST (visible on desktop, hidden on mobile when chat open) */}
      {screen === "chat" && (
        <div
          className={`
          bg-white border-r border-gray-200 
          w-full sm:w-[380px] 
          h-full overflow-y-auto
          ${activeChat ? "hidden sm:block" : "block"}
        `}
        >
          <ChatList
            activeChat={activeChat}
            setActiveChat={(chatInfo) => {
              setActiveChat(chatInfo);
              setScreen("chat");
            }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        className={`
        flex-1 h-full 
        bg-[#f7f7f7] 
        relative 
        overflow-hidden
        ${!activeChat && screen === "chat" ? "hidden sm:flex" : "flex"}
      `}
      >
        <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden m-2 sm:m-4">
          {renderMain()}
        </div>
      </div>
    </div>
  );
}
