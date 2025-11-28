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

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const [activeChat, setActiveChat] = useState(null);
  const [screen, setScreen] = useState("chat"); // chat | scan | qr | pending | connections | profile

  useEffect(() => {
    api
      .get("/me")
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
      default:
        return activeChat ? (
          <ChatWindow chatId={activeChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f1f1f1]">
      <LeftSidebar onNavigate={setScreen} user={user} />

      {/* ChatList is visible when main screen is chat or connections (you can tweak) */}
      {screen === "chat" && (
        <ChatList
          activeChat={activeChat}
          setActiveChat={(chatId) => {
            setActiveChat(chatId);
            setScreen("chat");
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto bg-white">{renderMain()}</div>
    </div>
  );
}
