import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

import { useAtom } from "jotai";
import { userAtom } from "../../state/userAtom";

import LeftSidebar from "../../dashboard/LeftSidebar";
import ChatList from "../../dashboard/ChatList";
import ChatWindow from "../Chat/ChatWindow";
import UserProfile from "../Profile/UserProfile";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);

  // FIXED — useState for active chat
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => {
        console.log("ME RESPONSE:", res.data);
        setUser(res.data.data);
      })
      .catch((err) => console.log("ME ERROR:", err));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="h-screen w-full flex bg-[#f1f1f1]">
      <LeftSidebar />

      <ChatList activeChat={activeChat} setActiveChat={setActiveChat} />

      <div className="flex-1 overflow-y-auto bg-white">
        {activeChat ? (
          <ChatWindow chatId={activeChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
