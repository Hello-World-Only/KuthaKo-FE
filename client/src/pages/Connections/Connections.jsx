import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Connections() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadContacts = async () => {
    try {
      const res = await api.get("/connections");
      setContacts(res.data.contacts || []); // <-- FIXED
    } catch (err) {
      console.log("CONTACTS ERROR:", err.response?.data || err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2 className="text-xl font-semibold mb-4">Your Contacts</h2>

      {contacts.length === 0 && <p>No contacts yet.</p>}

      <div className="flex flex-col gap-3">
        {contacts.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-4 bg-white p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate(`/chat/${user._id}`)} // clicking opens chat (we will build next)
          >
            {/* Avatar */}
            <img
              src={user.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.status}</p>
            </div>

            {/* Online Indicator */}
            <div
              className={`w-3 h-3 rounded-full ${
                user.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
