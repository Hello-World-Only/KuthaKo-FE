import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosInstance";
import io from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = "https://kuthako.onrender.com";

export default function ChatPage() {
  const { otherUserId } = useParams();

  const [chatId, setChatId] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // -----------------------------
  // 1) Connect to socket
  // -----------------------------
  useEffect(() => {
    const token = Cookies.get("token");

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    // Receive message
    socketRef.current.on("chat:receive", (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    return () => socketRef.current.disconnect();
  }, [chatId]);

  // -----------------------------
  // 2) Load chatId + user details + messages
  // -----------------------------
  useEffect(() => {
    loadChat();
  }, [otherUserId]);

  const loadChat = async () => {
    try {
      // Load other user
      const userRes = await api.get(`/user/${otherUserId}`);
      setOtherUser(userRes.data.data);

      // Load chat list
      const listRes = await api.get("/chat/list");

      // Find chat with that user
      const foundChat = listRes.data.chats.find((c) =>
        c.participants.some((p) => p._id === otherUserId)
      );

      if (!foundChat) {
        console.log("No chat exists yet.");
        setChatId(null);
        setMessages([]);
        return;
      }

      setChatId(foundChat._id);

      // Load messages using chatId
      const msgRes = await api.get(`/chat/${foundChat._id}/messages`);
      setMessages(msgRes.data.messages || []);

      scrollToBottom();
    } catch (err) {
      console.log("LOAD CHAT ERROR:", err);
    }
  };

  // -----------------------------
  // 3) Send message
  // -----------------------------
  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.emit("chat:send", {
      receiverId: otherUserId,
      type: "text",
      text,
    });

    setText("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 bg-white shadow">
        <img
          src={otherUser?.avatar}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{otherUser?.name}</p>
          <p className="text-xs text-gray-500">
            {otherUser?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isMine =
            msg.sender.toString() === otherUserId.toString() ? false : true;

          return (
            <div
              key={msg._id}
              className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                isMine
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-white shadow"
              }`}
            >
              {msg.text}
            </div>
          );
        })}

        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT BAR */}
      <div className="p-3 bg-white flex gap-2 shadow">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
