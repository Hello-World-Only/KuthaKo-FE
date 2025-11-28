import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export default function ChatList({ activeChat, setActiveChat }) {
  const [chats, setChats] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/chat/list");
      setChats(res.data.chats || []);
    } catch (err) {
      console.error("CHAT LIST ERROR:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = chats.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="w-80 border-r h-screen bg-white flex flex-col">
      <div className="p-3 border-b">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="w-full px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <p className="p-4 text-gray-500">No chats</p>
        ) : (
          filtered.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => setActiveChat(chat.chatId)}
              className={`p-3 flex gap-3 cursor-pointer hover:bg-gray-100 ${
                activeChat === chat.chatId ? "bg-gray-100" : ""
              }`}
            >
              <img
                src={chat.otherUser?.avatar || "https://i.pravatar.cc/100"}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-semibold truncate">
                    {chat.otherUser?.name}
                  </p>
                  {chat.lastMessage && (
                    <small className="text-xs text-gray-400">
                      {formatDistanceToNowStrict(
                        parseISO(chat.lastMessage.createdAt),
                        { addSuffix: true }
                      )}
                    </small>
                  )}
                </div>

                <p className="truncate text-sm text-gray-500">
                  {chat.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
