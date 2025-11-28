// pages/Settings/Settings.jsx
import React from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../state/userAtom";
import toast from "react-hot-toast";

export default function SettingsScreen() {
  const [user, setUser] = useAtom(userAtom);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
    // prefer programmatic navigation if you use react-router
    window.location.href = "/";
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>

        <div className="mb-6">
          <img
            src={user?.avatar || "https://i.pravatar.cc/100"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover mx-auto shadow"
          />
          <p className="mt-3 text-gray-800 font-medium">
            {user?.name || "User"}
          </p>
          <p className="text-gray-500 text-sm">{user?.email || ""}</p>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
