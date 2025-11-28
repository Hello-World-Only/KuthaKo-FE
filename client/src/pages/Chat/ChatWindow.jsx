import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosInstance";
import { useAtom } from "jotai";
import { userAtom } from "../../state/userAtom";

export default function ChatWindow({ chatId }) {
  const [user] = useAtom(userAtom);

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [realChatId, setRealChatId] = useState(null); // final chat id
  const [input, setInput] = useState("");

  const chatRef = useRef(null);

  // Scroll to bottom
  const scrollBottom = () => {
    setTimeout(() => {
      if (chatRef.current)
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  };

  // 🔥 Determine if chatId is a real chat or a userId
  const loadChat = async (id) => {
    try {
      // Try loading messages — if this fails -> it's a userId
      const res = await api.get(`/chat/${id}/messages`);

      // SUCCESS → it's a real chat
      setRealChatId(id);
      setMessages(res.data.messages || []);
      scrollBottom();

      // Extract chat partner (backend standard)
      const partner =
        res.data.chat?.members?.find((m) => m._id !== user._id) || null;

      setOtherUser(partner);
    } catch (err) {
      console.log("Probably userId, not chatId → creating chat...");

      // id is actually a userId → create chat by sending init message
      await createChatWithUser(id);
    }
  };

  // Create chat by sending empty init message
  const createChatWithUser = async (userId) => {
    try {
      const res = await api.post("/chat/send", {
        receiverId: userId,
        text: "",
        type: "init",
      });

      // Now chat exists
      const newChatId = res.data.message.chatId;
      setRealChatId(newChatId);

      // Now load messages
      const msgRes = await api.get(`/chat/${newChatId}/messages`);
      setMessages(msgRes.data.messages || []);

      // Set other user
      const partner =
        msgRes.data.chat?.members?.find((m) => m._id !== user._id) || null;
      setOtherUser(partner);

      scrollBottom();
    } catch (err) {
      console.error("Chat creation failed", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await api.post("/chat/send", {
        receiverId: otherUser._id,
        chatId: realChatId,
        text: input,
        type: "text",
      });

      setMessages((prev) => [...prev, res.data.message]);
      setInput("");
      scrollBottom();
    } catch (err) {
      console.error("SEND FAILED", err);
    }
  };

  // Load chat on mount / change
  useEffect(() => {
    if (chatId) loadChat(chatId);
  }, [chatId]);

  if (!otherUser)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading chat...
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-3 border-b flex items-center gap-3 bg-white">
        <img
          src={otherUser.avatar || "https://i.pravatar.cc/100"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{otherUser.name}</p>
      </div>

      {/* MESSAGES */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f7f7f7]"
      >
        {messages.map((msg) => {
          const mine = msg.sender === user._id;

          return (
            <div
              key={msg._id}
              className={`max-w-[75%] p-2 rounded-lg text-sm ${
                mine
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white text-black mr-auto border"
              }`}
            >
              {msg.text || <span className="text-gray-400">Started chat</span>}
            </div>
          );
        })}
      </div>

      {/* INPUT BOX */}
      <div className="p-3 border-t bg-white flex gap-3">
        <input
          className="flex-1 px-3 py-2 border rounded-lg outline-none"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
