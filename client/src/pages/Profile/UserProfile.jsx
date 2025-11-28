import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import toast from "react-hot-toast";

/**
 * UserProfile
 *
 * Props:
 *  - user (optional) : if provided will be used as initial data.
 *
 * Behavior:
 *  - If no user prop, component will fetch /users/me
 *  - Shows avatar, name, username, email (read-only), status/bio
 *  - Allows editing name, username, status/bio
 *  - Allows changing avatar (preview + upload)
 *  - Saves via PUT /users/me (profile fields)
 *  - Uploads avatar via POST /users/avatar (multipart). If that fails it will
 *    attempt to PUT base64 avatar to /users/me as fallback.
 *
 * If your backend uses different endpoints, change below accordingly.
 */

export default function UserProfile({ user: initialUserProp }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(initialUserProp || null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    status: "",
    bio: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null); // local preview url
  const [avatarFile, setAvatarFile] = useState(null); // selected File

  const fileRef = useRef();

  // Fetch user if not provided
  useEffect(() => {
    if (initialUserProp) {
      setUser(initialUserProp);
      setFormFromUser(initialUserProp);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await api.get("/users/me");
        const u = res.data.data;
        setUser(u);
        setFormFromUser(u);
      } catch (err) {
        console.error("Failed to load user:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [initialUserProp]);

  function setFormFromUser(u) {
    setForm({
      name: u?.name || "",
      username: u?.username || "",
      email: u?.email || "",
      status: u?.status || "",
      bio: u?.bio || "",
    });

    setAvatarPreview(u?.avatar || null);
  }

  const onChange = (key, value) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const onSelectFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);

    // Create preview
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
  };

  const triggerFile = () => {
    fileRef.current?.click();
  };

  // convert file -> base64 (fallback method)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1) If avatar selected, try to upload it first (multipart)
      if (avatarFile) {
        try {
          const fd = new FormData();
          fd.append("avatar", avatarFile);

          // try POST /users/avatar (common pattern)
          await api.post("/users/avatar", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          toast.success("Avatar uploaded");
        } catch (errUpload) {
          console.warn(
            "avatar upload failed, falling back to base64 method",
            errUpload
          );

          // fallback: convert to base64 and include in profile PUT
          try {
            const base64 = await fileToBase64(avatarFile);
            // merge into form body as avatar field
            const body = { ...form, avatar: base64 };
            await api.put("/users/me", body);
            toast.success("Profile updated (avatar via fallback)");
            // refresh user
            const res = await api.get("/users/me");
            setUser(res.data.data);
            setFormFromUser(res.data.data);
            setAvatarFile(null);
            setAvatarPreview(res.data.data.avatar || null);
            setSaving(false);
            return;
          } catch (err2) {
            console.error("fallback avatar update failed", err2);
            toast.error("Failed to upload avatar");
          }
        }
      }

      // 2) Update profile fields (name, username, status, bio) via PUT /users/me
      const body = {
        name: form.name,
        username: form.username,
        status: form.status,
        bio: form.bio,
        // don't send email (usually immutable) unless you want to
      };

      await api.put("/users/me", body);

      // refresh user data
      const res = await api.get("/users/me");
      setUser(res.data.data);
      setFormFromUser(res.data.data);

      toast.success("Profile updated");
      setAvatarFile(null);
    } catch (err) {
      console.error("Save failed", err);
      toast.error(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // reset to original
    setFormFromUser(user);
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
  };

  if (loading) return <div className="p-6 text-gray-600">Loading profile…</div>;

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar column */}
          <div className="flex flex-col items-center w-full sm:w-48">
            <div
              className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md"
              style={{ minWidth: 128, minHeight: 128 }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No avatar</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileRef}
              onChange={onSelectFile}
            />

            <div className="mt-3 w-full flex gap-2">
              <button
                onClick={triggerFile}
                className="flex-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                type="button"
              >
                Change
              </button>

              <button
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
                className="flex-1 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-sm text-red-600"
                type="button"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Form column */}
          <div className="flex-1 w-full">
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.name ? "Your profile" : "Profile"}
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">Name</label>
                <input
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Username</label>
                <input
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={form.username}
                  onChange={(e) => onChange("username", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">
                  Email (read-only)
                </label>
                <input
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                  value={form.email}
                  readOnly
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Status</label>
                <input
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={form.status}
                  onChange={(e) => onChange("status", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-gray-600">Bio</label>
                <textarea
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => onChange("bio", e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  saving
                    ? "bg-gray-600 cursor-wait"
                    : "bg-black hover:bg-gray-900"
                }`}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                onClick={handleCancel}
                type="button"
                className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Raw JSON for quick debug (optional) */}
        <div className="mt-6 text-xs text-gray-400">
          <div>
            Joined: {new Date(user?.createdAt || Date.now()).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
