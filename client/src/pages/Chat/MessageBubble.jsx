import { useAuthUser } from "../../state/useAuthUser";

export default function MessageBubble({ msg }) {
  const user = useAuthUser();
  const isMine = msg.sender === user?._id;

  return (
    <div className={`flex my-1 ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`
                    max-w-[65%] px-3 py-2 rounded-lg text-sm relative
                    ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }
                `}
      >
        {msg.text}

        <div
          className={`text-[10px] mt-1 ${
            isMine ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
