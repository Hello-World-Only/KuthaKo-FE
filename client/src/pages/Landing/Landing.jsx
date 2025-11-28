export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-600">KuthaKo</span>
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          A fast, secure, real-time chat app — connect instantly by scanning a
          QR code.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
          >
            Login
          </a>

          <a
            href="/about"
            className="px-6 py-3 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} KuthaKo. All rights reserved.
      </footer>
    </div>
  );
}
