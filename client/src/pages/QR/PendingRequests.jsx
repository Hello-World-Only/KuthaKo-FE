import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    try {
      const res = await api.get("/qr/pending"); // ✅ FIXED ENDPOINT
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("PENDING ERR:", err.response?.data || err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Pending Request</h2>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id}>Request from: {req.fromUser?.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
