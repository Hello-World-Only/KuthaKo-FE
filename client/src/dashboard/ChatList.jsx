import { useEffect, useState } from "react";
import api from "../api/axiosInstance"; // adjust path if needed
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export default function ChatList({ activeChat, setActiveChat }) {
  const [contacts, setContacts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/connections"); // your backend returns contacts
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("CHATLIST ERR:", err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = contacts.filter((c) =>
    (c.name || "").toLowerCase().includes(q.trim().toLowerCase())
  );

  if (loading) return <div className="w-80 p-4">Loading...</div>;

  return (
    <div className="w-80 border-r h-screen bg-white flex flex-col">
      <div className="p-3 border-b">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search or start new chat"
          className="w-full px-3 py-2 rounded bg-gray-100 outline-none text-sm"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-gray-500">No contacts</div>
        ) : (
          filtered.map((c) => (
            <div
              key={c._id}
              onClick={() => setActiveChat(c._id)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition ${
                activeChat === c._id ? "bg-gray-100" : ""
              }`}
            >
              <img
                src={c.avatar || "https://i.pravatar.cc/100"}
                alt={c.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold truncate">{c.name}</p>
                  <small className="text-xs text-gray-400">
                    {c.lastSeen
                      ? formatDistanceToNowStrict(parseISO(c.lastSeen), {
                          addSuffix: true,
                        })
                      : ""}
                  </small>
                </div>
                <p className="text-sm text-gray-500 truncate">{c.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
