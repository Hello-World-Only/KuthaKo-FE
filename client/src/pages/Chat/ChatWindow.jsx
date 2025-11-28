import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import { useAtom } from "jotai";
import { userAtom } from "../../state/userAtom";

export default function ChatWindow({ activeChat, setActiveChat }) {
  const [user] = useAtom(userAtom);

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [chatId, setChatId] = useState(null);

  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const scrollBottom = () => {
    setTimeout(() => {
      if (chatRef.current)
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  };

  // If chatId exists → load messages
  const loadChat = async (id) => {
    try {
      const res = await api.get(`/chat/${id}/messages`);

      setMessages(res.data.messages || []);

      const partner =
        res.data.chat?.members?.find((m) => m._id !== user._id) || null;

      setOtherUser(partner);
      setChatId(id);
      scrollBottom();
    } catch (err) {
      console.log("Chat not found yet.");
    }
  };

  // When user clicks on a contact
  useEffect(() => {
    if (!activeChat) return;

    if (activeChat.type === "user") {
      // create new chat
      api
        .post("/chat/send", {
          receiverId: activeChat.id,
          text: "",
          type: "text",
        })
        .then((res) => {
          const newId = res.data.chatId;
          setChatId(newId);

          setActiveChat({
            type: "chat",
            id: newId,
            name: activeChat.name,
            avatar: activeChat.avatar,
          });

          loadChat(newId);
        })
        .catch((err) => console.error("CREATE CHAT ERR:", err));
    } else {
      loadChat(activeChat.id);
    }
  }, [activeChat]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !otherUser) return;

    try {
      const res = await api.post("/chat/send", {
        receiverId: otherUser._id,
        chatId,
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

  if (!otherUser)
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center gap-3">
        <img
          src={activeChat.avatar}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{activeChat.name}</p>
      </div>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f5]"
      >
        {messages.map((msg) => {
          const mine = msg.sender === user._id;
          return (
            <div
              key={msg._id}
              className={`max-w-[75%] p-2 rounded-lg text-sm ${
                mine
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white border mr-auto"
              }`}
            >
              {msg.text || "<empty>"}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
