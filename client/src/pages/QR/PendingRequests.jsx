import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function PendingRequests() {
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadPending = async () => {
        try {
            const res = await api.get("/qr/pending");
            // backend returns: pendingRequest: {...}
            setRequest(res.data.pendingRequest || null);
        } catch (err) {
            console.log(err);
            alert("Failed to load pending request");
        }
    };

    const handleAccept = async () => {
        if (!request) return;

        setLoading(true);
        try {
            await api.post("/qr/accept", { requestId: request._id });
            setRequest(null); // clear after accepting
            alert("Connection accepted!");
        } catch (err) {
            console.log(err);
            alert("Failed to accept request");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPending();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Pending Request</h1>

            {!request && <p>No pending requests</p>}

            {request && (
                <div
                    style={{
                        marginTop: 20,
                        padding: 15,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                    }}
                >
                    <h3>
                        {request.from.name || request.from.email}
                    </h3>

                    {request.from.avatar ? (
                        <img
                            src={request.from.avatar}
                            alt=""
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                marginTop: 10,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "#eee",
                                marginTop: 10,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: 14,
                                color: "#666",
                            }}
                        >
                            No Avatar
                        </div>
                    )}

                    <p style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                        Requested at: {new Date(request.createdAt).toLocaleString()}
                    </p>

                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        style={{
                            marginTop: 12,
                            padding: 10,
                            width: "100%",
                            background: "black",
                            color: "white",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Accepting..." : "Accept Request"}
                    </button>
                </div>
            )}
        </div>
    );
}
