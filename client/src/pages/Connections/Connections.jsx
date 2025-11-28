import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function Connections() {
    const [connections, setConnections] = useState([]);

    const loadConnections = async () => {
        try {
            const res = await api.get("/connections");
            setConnections(res.data.data || []);
        } catch (err) {
            console.log(err);
            alert("Failed to load connections");
        }
    };

    const removeConnection = async (userId) => {
        try {
            await api.delete("/connections/remove", {
                data: { userId },
            });
            loadConnections();
        } catch (err) {
            console.log(err);
            alert("Failed to remove connection");
        }
    };

    useEffect(() => {
        loadConnections();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Your Connections</h1>

            {connections.length === 0 && <p>No connections yet</p>}

            {connections.map((c) => (
                <div key={c._id} style={{ marginTop: 20, padding: 15, border: "1px solid #ddd" }}>
                    <h3>{c.name}</h3>
                    {c.avatar && <img src={c.avatar} alt="" style={{ width: 60, height: 60, borderRadius: "50%" }} />}
                    <button
                        onClick={() => removeConnection(c._id)}
                        style={{
                            marginTop: 10,
                            padding: 10,
                            background: "red",
                            color: "white",
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
