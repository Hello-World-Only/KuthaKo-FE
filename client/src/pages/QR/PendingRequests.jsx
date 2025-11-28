import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PendingRequests() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPending = async () => {
    try {
      const res = await api.get("/qr/pending");
      setRequest(res.data.pendingRequest || null);
    } catch (err) {
      console.log("PENDING ERR:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  // ------------ ACCEPT ------------
  const acceptRequest = async () => {
    try {
      await api.post("/qr/accept", {
        requestId: request._id,
      });

      toast.success("Request accepted!");
      setRequest(null); // remove from UI
      // navigate("/connections"); // optional
    } catch (err) {
      toast.error("Failed to accept");
    }
  };

  // ------------ REJECT ------------
  const rejectRequest = () => {
    toast("Request rejected", { icon: "✖️" });
    setRequest(null);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Pending Request</h2>

      {!request ? (
        <p>No pending requests</p>
      ) : (
        <div
          style={{
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 10,
            maxWidth: 300,
          }}
        >
          <img
            src={request.from.avatar}
            alt="avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <h3 style={{ marginTop: 10 }}>{request.from.name}</h3>
          <p style={{ color: "#666", marginBottom: 15 }}>
            {request.from.email}
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={acceptRequest}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#28a745",
                color: "white",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Accept
            </button>

            <button
              onClick={rejectRequest}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#dc3545",
                color: "white",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
