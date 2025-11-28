// import { useEffect, useState, useRef } from "react";
// import api from "../../api/axiosInstance";
// import { useAtom } from "jotai";
// import { userAtom } from "../../state/userAtom";

// export default function ChatWindow({ activeChat, setActiveChat }) {
//   const [user] = useAtom(userAtom);

//   const [messages, setMessages] = useState([]);
//   const [otherUser, setOtherUser] = useState(null);
//   const [chatId, setChatId] = useState(null);

//   const [input, setInput] = useState("");
//   const chatRef = useRef(null);

//   const scrollBottom = () => {
//     setTimeout(() => {
//       if (chatRef.current)
//         chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }, 50);
//   };

//   const loadChat = async (id) => {
//     try {
//       const res = await api.get(`/chat/${id}/messages`);

//       setChatId(id);
//       setMessages(res.data.messages);

//       const partner = res.data.chat.participants.find(
//         (m) => m._id !== user._id
//       );

//       setOtherUser(partner);
//       scrollBottom();
//     } catch (err) {
//       console.log("CHAT NOT READY");
//     }
//   };

//   useEffect(() => {
//     if (!activeChat) return;

//     if (activeChat.type === "chat") {
//       loadChat(activeChat.chatId);
//       return;
//     }

//     if (activeChat.type === "user") {
//       api
//         .post("/chat/start", { receiverId: activeChat.userId })
//         .then((res) => {
//           const id = res.data.chatId;

//           setActiveChat({
//             type: "chat",
//             chatId: id,
//             name: activeChat.name,
//             avatar: activeChat.avatar,
//           });

//           loadChat(id);
//         })
//         .catch((err) => console.error("START CHAT ERR", err));
//     }
//   }, [activeChat]);

//   const sendMessage = async () => {
//     if (!input.trim() || !otherUser) return;

//     try {
//       const res = await api.post("/chat/send", {
//         receiverId: otherUser._id,
//         chatId,
//         text: input,
//         type: "text",
//       });

//       setMessages((prev) => [...prev, res.data.message]);
//       setInput("");
//       scrollBottom();
//     } catch (err) {
//       console.error("SEND FAILED", err);
//     }
//   };

//   if (!activeChat)
//     return (
//       <div className="h-full flex items-center justify-center text-gray-400">
//         Select a chat to start messaging
//       </div>
//     );

//   if (!otherUser)
//     return (
//       <div className="h-full flex items-center justify-center text-gray-400">
//         Loading chat...
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-3 border-b flex items-center gap-3">
//         <img
//           src={otherUser.avatar}
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <p className="font-semibold">{otherUser.name}</p>
//       </div>

//       <div
//         ref={chatRef}
//         className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f5]"
//       >
//         {messages.map((msg) => {
//           const mine = msg.sender === user._id;
//           return (
//             <div
//               key={msg._id}
//               className={`max-w-[75%] p-2 rounded-lg text-sm ${
//                 mine
//                   ? "bg-blue-500 text-white ml-auto"
//                   : "bg-white border mr-auto"
//               }`}
//             >
//               {msg.text}
//             </div>
//           );
//         })}
//       </div>

//       <div className="p-3 border-t flex gap-2 bg-white">
//         <input
//           className="flex-1 px-3 py-2 border rounded"
//           placeholder="Type message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

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

  const loadChat = async (id) => {
    try {
      const res = await api.get(`/chat/${id}/messages`);

      setChatId(id);
      setMessages(res.data.messages);

      const partner = res.data.chat.participants.find(
        (m) => m._id !== user._id
      );

      setOtherUser(partner);
      scrollBottom();
    } catch (err) {
      console.log("CHAT NOT READY");
    }
  };

  useEffect(() => {
    if (!activeChat) return;

    if (activeChat.type === "chat") {
      loadChat(activeChat.chatId);
      return;
    }

    if (activeChat.type === "user") {
      api
        .post("/chat/start", { receiverId: activeChat.userId })
        .then((res) => {
          const id = res.data.chatId;

          setActiveChat({
            type: "chat",
            chatId: id,
            name: activeChat.name,
            avatar: activeChat.avatar,
          });

          loadChat(id);
        })
        .catch((err) => console.error("START CHAT ERR", err));
    }
  }, [activeChat]);

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

  if (!activeChat)
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-lg">
        Select a chat to start messaging
      </div>
    );

  if (!otherUser)
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-lg">
        Loading chat...
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-2 border-b border-gray-300 bg-white flex items-center gap-3 shadow-sm">
        <img
          src={otherUser.avatar}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold text-gray-800">{otherUser.name}</p>
      </div>

      {/* MESSAGES AREA */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg) => {
          const mine = msg.sender === user._id;

          return (
            <div
              key={msg._id}
              className={`
                max-w-[75%] p-3 rounded-xl mb-3 text-sm shadow-sm
                ${
                  mine
                    ? "ml-auto bg-green-500 text-white rounded-br-none"
                    : "mr-auto bg-white text-gray-800 border rounded-bl-none"
                }
              `}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      {/* INPUT BAR */}
      <div className="p-3 border-t border-gray-300 bg-white flex items-center gap-2 shadow-sm">
        <input
          className="
            flex-1 px-4 py-2 rounded-full border 
            bg-gray-50 text-gray-800
            focus:outline-none focus:ring-2 focus:ring-gray-300
          "
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="
            px-5 py-2 rounded-full
            bg-green-600 text-white font-medium
            hover:bg-green-700 active:scale-95 transition
          "
        >
          Send
        </button>
      </div>
    </div>
  );
}
