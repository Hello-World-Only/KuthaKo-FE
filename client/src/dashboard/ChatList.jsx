import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export default function ChatList({ activeChat, setActiveChat }) {
  const [contacts, setContacts] = useState([]);
  const [chatMap, setChatMap] = useState({});
  const [q, setQ] = useState("");

  // Load connections
  const loadConnections = async () => {
    try {
      const res = await api.get("/connections");
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("CONNECTION ERR:", err);
    }
  };

  // Load chats
  const loadChats = async () => {
    try {
      const res = await api.get("/chat/list");

      const map = {};
      (res.data.chats || []).forEach((chat) => {
        const other = chat.otherUser?._id;
        if (other) map[other] = chat; // store chat by userId
      });

      setChatMap(map);
    } catch (err) {
      console.error("CHAT LIST ERR:", err);
    }
  };

  useEffect(() => {
    loadConnections();
    loadChats();
  }, []);

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
        {filtered.length === 0 ? (
          <p className="p-4 text-gray-500">No contacts</p>
        ) : (
          filtered.map((c) => {
            const chat = chatMap[c._id];
            const chatId = chat ? chat.chatId : c._id;
            const lastMsg = chat?.lastMessage;

            return (
              <div
                key={c._id}
                onClick={() => setActiveChat(chatId)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b ${
                  activeChat === chatId ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={c.avatar || "https://i.pravatar.cc/100"}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-semibold truncate">{c.name}</p>
                    {lastMsg?.createdAt && (
                      <small className="text-xs text-gray-400">
                        {formatDistanceToNowStrict(
                          parseISO(lastMsg.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </small>
                    )}
                  </div>

                  <p className="truncate text-sm text-gray-500">
                    {lastMsg?.text || c.status}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
