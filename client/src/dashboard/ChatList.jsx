// import { useState, useEffect } from "react";
// import api from "../api/axiosInstance";

// export default function ChatList({ activeChat, setActiveChat }) {
//   const [contacts, setContacts] = useState([]);
//   const [chatMap, setChatMap] = useState({});
//   const [q, setQ] = useState("");

//   useEffect(() => {
//     loadConnections();
//     loadChats();
//   }, []);

//   const loadConnections = async () => {
//     try {
//       const res = await api.get("/connections");
//       setContacts(res.data.contacts || []);
//     } catch (err) {
//       console.error("CONNECTION ERR:", err);
//     }
//   };

//   const loadChats = async () => {
//     try {
//       const res = await api.get("/chat/list");

//       const map = {};

//       (res.data.chats || []).forEach((chat) => {
//         if (!chat) return;
//         if (!chat.otherUser) return;
//         if (!chat.otherUser._id) return;

//         map[chat.otherUser._id] = chat;
//       });

//       setChatMap(map);
//     } catch (err) {
//       console.error("CHAT LIST ERR:", err);
//     }
//   };

//   const filtered = contacts.filter((c) =>
//     (c.name || "").toLowerCase().includes(q.toLowerCase())
//   );

//   return (
//     <div className="w-80 border-r h-screen bg-white flex flex-col">
//       <div className="p-3 border-b">
//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           placeholder="Search"
//           className="w-full px-3 py-2 rounded bg-gray-100"
//         />
//       </div>

//       <div className="flex-1 overflow-auto">
//         {filtered.map((c) => {
//           const chat = chatMap[c._id];

//           return (
//             <div
//               key={c._id}
//               onClick={() =>
//                 setActiveChat(
//                   chat
//                     ? {
//                         type: "chat",
//                         chatId: chat.chatId,
//                         name: c.name,
//                         avatar: c.avatar,
//                         otherUserId: c._id,
//                       }
//                     : {
//                         type: "user",
//                         userId: c._id,
//                         name: c.name,
//                         avatar: c.avatar,
//                       }
//                 )
//               }
//               className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b"
//             >
//               <img
//                 src={c.avatar}
//                 className="w-12 h-12 rounded-full object-cover"
//               />

//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold truncate">{c.name}</p>
//                 <p className="truncate text-sm text-gray-500">
//                   {chat?.lastMessage?.text || "Start chat"}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
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
        if (!chat?.otherUser?._id) return;
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
    <div className="w-full sm:w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* SEARCH BAR */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="
          w-full px-4 py-2 
          rounded-full bg-gray-100 
          text-sm text-gray-700
          outline-none 
          focus:ring-2 focus:ring-gray-300
        "
        />
      </div>

      {/* CONTACT LIST */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-6 text-sm">
            No contacts found
          </div>
        )}

        {filtered.map((c) => {
          const chat = chatMap[c._id];
          const isActive = activeChat?.otherUserId === c._id;

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
              className={`
              flex items-center gap-3 px-3 py-3 cursor-pointer
              border-b border-gray-100 select-none
              ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}
              transition
            `}
            >
              {/* Avatar */}
              <img
                src={c.avatar}
                className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0"
              />

              {/* Name + Last Message */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{c.name}</p>
                <p className="truncate text-xs text-gray-500">
                  {chat?.lastMessage?.text || "Start chat"}
                </p>
              </div>

              {/* Unread count */}
              {chat?.unreadCount > 0 && (
                <span
                  className="
                min-w-[20px] h-[20px] 
                rounded-full bg-green-500 text-white text-xs 
                flex items-center justify-center 
              "
                >
                  {chat.unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
