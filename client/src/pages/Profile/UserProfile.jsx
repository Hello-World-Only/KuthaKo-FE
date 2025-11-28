export default function UserProfile({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user.name}</h1>

      {user.avatar && (
        <img
          src={user.avatar}
          alt="avatar"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            marginTop: 20,
            objectFit: "cover",
          }}
        />
      )}

      <p style={{ marginTop: 20 }}>
        Status: {user.status || "Hey there! I am using ChatApp."}
      </p>
    </div>
  );
}
