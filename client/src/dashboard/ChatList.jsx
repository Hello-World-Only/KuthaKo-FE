import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

export default function ChatList({ activeChat, setActiveChat }) {
  const [contacts, setContacts] = useState([]);
  const [chatMap, setChatMap] = useState({});
  const [q, setQ] = useState("");

  useEffect(() => {
    loadConnections();
    loadChats();
  }, []);

  const loadConnections = async () => {
    try {
      const res = await api.get("/connections");
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("CONNECTION ERR:", err);
    }
  };

  const loadChats = async () => {
    try {
      const res = await api.get("/chat/list");

      const map = {};

      (res.data.chats || []).forEach((chat) => {
        if (!chat) return;
        if (!chat.otherUser) return;
        if (!chat.otherUser._id) return;

        map[chat.otherUser._id] = chat;
      });

      setChatMap(map);
    } catch (err) {
      console.error("CHAT LIST ERR:", err);
    }
  };

  const filtered = contacts.filter((c) =>
    (c.name || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="w-80 border-r h-screen bg-white flex flex-col">
      <div className="p-3 border-b">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="w-full px-3 py-2 rounded bg-gray-100"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.map((c) => {
          const chat = chatMap[c._id];

          return (
            <div
              key={c._id}
              onClick={() =>
                setActiveChat(
                  chat
                    ? {
                        type: "chat",
                        chatId: chat.chatId,
                        name: c.name,
                        avatar: c.avatar,
                        otherUserId: c._id,
                      }
                    : {
                        type: "user",
                        userId: c._id,
                        name: c.name,
                        avatar: c.avatar,
                      }
                )
              }
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b"
            >
              <img
                src={c.avatar}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <p className="truncate text-sm text-gray-500">
                  {chat?.lastMessage?.text || "Start chat"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
