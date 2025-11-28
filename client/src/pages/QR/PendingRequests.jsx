// import { useEffect, useState } from "react";
// import api from "../../api/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function PendingRequests() {
//   const [request, setRequest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const loadPending = async () => {
//     try {
//       const res = await api.get("/qr/pending");
//       setRequest(res.data.pendingRequest || null);
//     } catch (err) {
//       console.log("PENDING ERR:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadPending();
//   }, []);

//   // ------------ ACCEPT ------------
//   const acceptRequest = async () => {
//     try {
//       await api.post("/qr/accept", {
//         requestId: request._id,
//       });

//       toast.success("Request accepted!");
//       setRequest(null); // remove from UI
//       // navigate("/connections"); // optional
//     } catch (err) {
//       toast.error("Failed to accept");
//     }
//   };

//   // ------------ REJECT ------------
//   const rejectRequest = () => {
//     toast("Request rejected", { icon: "✖️" });
//     setRequest(null);
//   };

//   if (loading) return <p style={{ padding: 20 }}>Loading…</p>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ marginBottom: 20 }}>Pending Request</h2>

//       {!request ? (
//         <p>No pending requests</p>
//       ) : (
//         <div
//           style={{
//             padding: 20,
//             border: "1px solid #ddd",
//             borderRadius: 10,
//             maxWidth: 300,
//           }}
//         >
//           <img
//             src={request.from.avatar}
//             alt="avatar"
//             style={{
//               width: 80,
//               height: 80,
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />

//           <h3 style={{ marginTop: 10 }}>{request.from.name}</h3>
//           <p style={{ color: "#666", marginBottom: 15 }}>
//             {request.from.email}
//           </p>

//           <div style={{ display: "flex", gap: 10 }}>
//             <button
//               onClick={acceptRequest}
//               style={{
//                 flex: 1,
//                 padding: "10px 0",
//                 background: "#28a745",
//                 color: "white",
//                 borderRadius: 6,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Accept
//             </button>

//             <button
//               onClick={rejectRequest}
//               style={{
//                 flex: 1,
//                 padding: "10px 0",
//                 background: "#dc3545",
//                 color: "white",
//                 borderRadius: 6,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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

  const acceptRequest = async () => {
    try {
      await api.post("/qr/accept", { requestId: request._id });
      toast.success("Request accepted!");
      setRequest(null);
    } catch (err) {
      toast.error("Failed to accept");
    }
  };

  const rejectRequest = () => {
    toast("Request rejected", { icon: "✖️" });
    setRequest(null);
  };

  if (loading) return <div className="p-6 text-gray-600">Loading…</div>;

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Pending Request
      </h2>

      {!request ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div
          className="
            bg-white p-6 rounded-xl shadow-md border border-gray-200 
            w-full max-w-xs flex flex-col items-center
          "
        >
          {/* Avatar */}
          <img
            src={request.from.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover shadow mb-3"
          />

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-800">
            {request.from.name}
          </h3>

          {/* Email */}
          <p className="text-gray-500 text-sm mb-4">{request.from.email}</p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={acceptRequest}
              className="
                flex-1 py-2.5 
                bg-green-600 hover:bg-green-700 
                text-white rounded-lg 
                transition font-medium
              "
            >
              Accept
            </button>

            <button
              onClick={rejectRequest}
              className="
                flex-1 py-2.5 
                bg-red-500 hover:bg-red-600 
                text-white rounded-lg 
                transition font-medium
              "
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
