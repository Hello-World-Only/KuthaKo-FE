// src/pages/Chat/ChatWindow.jsx
import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null); // to show name + avatar
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const scrollBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch chat info + messages
  useEffect(() => {
    if (!chatId) return;

    const load = async () => {
      try {
        // get chat messages
        const msgRes = await api.get(`/chat/${chatId}/messages`);
        setMessages(msgRes.data.data || []);

        // get chat info from chat list
        const list = await api.get("/chat/list");
        const chat = list.data.data.find((c) => c._id === chatId);
        setChatInfo(chat?.otherUser || null);

        scrollBottom();
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await api.post("/chat/send", {
      chatId,
      text,
    });

    setMessages((prev) => [...prev, res.data.data]);
    setText("");
    scrollBottom();
  };

  return (
    <div className="flex flex-col h-full bg-[#ececec]">
      {/* CHAT HEADER */}
      <div className="px-4 py-3 bg-white border-b flex items-center gap-3 shadow-sm">
        {chatInfo && (
          <img
            src={chatInfo.avatar}
            className="w-10 h-10 rounded-full object-cover"
            alt={chatInfo.name}
          />
        )}
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {chatInfo?.name || "User"}
          </span>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble msg={msg} key={msg._id} />
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT BAR */}
      <div className="p-3 bg-white border-t flex items-center gap-3">
        <input
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
