// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// import AvatarUploader from "../../components/profile/AvatarUploader";
// import { updateUser } from "../../api/user.api";


// export default function Onboarding() {
//   const navigate = useNavigate();

//   const token = Cookies.get("token");
//   const decoded = jwtDecode(token);
//   const userId = decoded.id;

//   const [name, setName] = useState("");
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       alert("Please enter your name");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1️⃣ Update name (JSON)
//       await api.put("/me", { name });

//       // 2️⃣ Update avatar (FormData)
//       if (avatarFile) {
//         const form = new FormData();
//         form.append("avatar", avatarFile);
//         await api.put("/me/avatar", form);
//       }

//       navigate("/home");
//     } catch (err) {
//       console.log(err);
//       alert("Onboarding failed");
//     }

//     setLoading(false);
//   };


//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Complete Profile</h1>

//       <AvatarUploader onChange={setAvatarFile} />

//       <div style={{ marginTop: 20 }}>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           style={{ width: "100%", padding: 10 }}
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </div>

//       <button
//         onClick={handleSubmit}
//         style={{
//           marginTop: 20,
//           padding: 12,
//           width: "100%",
//           background: "black",
//           color: "white",
//           opacity: loading ? 0.7 : 1,
//         }}
//       >
//         {loading ? "Saving..." : "Complete Setup"}
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import AvatarUploader from "../../components/profile/AvatarUploader";
import api from "../../api/axiosInstance";

export default function Onboarding() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Update name (JSON)
      await api.put("/me", { name });

      // 2️⃣ Update avatar (FormData)
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        await api.put("/me/avatar", form);
      }

      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Onboarding failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Complete Profile</h1>

      <AvatarUploader onChange={setAvatarFile} />

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter your name"
          style={{ width: "100%", padding: 10 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: 12,
          width: "100%",
          background: "black",
          color: "white",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : "Complete Setup"}
      </button>
    </div>
  );
}
