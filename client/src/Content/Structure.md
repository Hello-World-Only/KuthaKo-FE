```
src/
│
├── api/
│   ├── axiosInstance.js
│   ├── auth.api.js
│   ├── user.api.js
│   ├── qr.api.js
│   └── connections.api.js
│
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loader.jsx
│   │   └── ProtectedRoute.jsx   <-- REQUIRED
│   │
│   ├── profile/
│   │   └── AvatarUploader.jsx
│   │
│   ├── qr/
│   │   ├── QrBox.jsx
│   │   └── CountdownTimer.jsx
│   │
│   ├── pending/
│   │   └── PendingRequestCard.jsx
│   │
│   └── connections/
│       └── ContactCard.jsx
│
├── hooks/
│   ├── useAuth.js
│   └── useCountdown.js
│
├── pages/
│   ├── Landing/                <-- NEWLY ADDED (you want this!)
│   │   └── Landing.jsx
│   │
│   ├── Login/
│   │   ├── Login.jsx
│   │   └── VerifyOTP.jsx
│   │
│   ├── Onboarding/             <-- NEWLY ADDED (your login flow!)
│   │   └── Onboarding.jsx
│   │
│   ├── Home/
│   │   └── Home.jsx
│   │
│   ├── Profile/
│   │   └── Profile.jsx
│   │
│   ├── QR/
│   │   ├── ShowQR.jsx
│   │   ├── ScanQR.jsx
│   │   └── PendingRequests.jsx
│   │
│   └── Connections/
│       └── Connections.jsx
│
├── state/
│   ├── authAtom.js
│   ├── userAtom.js
│   ├── qrAtom.js
│   └── connectionsAtom.js
│
├── utils/
│   ├── token.js
│   └── helpers.js
│
├── App.jsx
├── main.jsx
└── index.css


```
