// src/dashboard/ChatList.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function ChatList({ activeChat, setActiveChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await api.get("/chat/list");
      setChats(res.data.data || []);
    } catch (err) {
      console.log("Chat list error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="w-80 border-r bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      {/* Search */}
      <div className="p-3">
        <input
          className="w-full bg-gray-100 px-3 py-2 rounded-lg outline-none"
          placeholder="Search"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No chats yet.</div>
        ) : (
          chats.map((chat) => {
            const lastMsg = chat.lastMessage?.text || "No messages yet";
            const time = chat.lastMessage?.createdAt
              ? formatTime(chat.lastMessage.createdAt)
              : "";

            return (
              <div
                key={chat._id}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b 
                                    ${
                                      activeChat === chat._id
                                        ? "bg-gray-100"
                                        : "hover:bg-gray-50"
                                    }`}
                onClick={() => setActiveChat(chat._id)}
              >
                <img
                  src={chat.otherUser?.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {chat.otherUser?.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate w-40">
                    {lastMsg}
                  </div>
                </div>

                <div className="text-[10px] text-gray-400">{time}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
