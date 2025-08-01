"use client";
import { useState } from "react";

export default function Chatbot() {
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const toggleChat = () => setShowChat(!showChat);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "No response from AI." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-[#00A6B5] hover:bg-[#008C9E] text-white p-4 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {showChat && (
        <div className="fixed bottom-20 right-6 w-80 bg-[#FFFFFF] dark:bg-[#2D3E50] border border-[#E5E7EB] dark:border-[#4B5563] rounded-xl shadow-xl z-50 flex flex-col max-h-[70vh]">
          <div className="p-3 border-b border-[#E5E7EB] font-semibold text-[#2D3E50] dark:text-[#F5F6F5]">
            StudyMate AI
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  msg.role === "user"
                    ? "text-right text-[#2D3E50]"
                    : "text-left text-[#6B7280]"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-md ${
                    msg.role === "user" ? "bg-[#E5E7EB]" : "bg-[#F5F6F5]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex p-2 border-t border-[#E5E7EB]">
            <input
              className="flex-1 px-3 py-1 border rounded-md text-sm bg-[#FFFFFF] dark:bg-[#2D3E50] text-[#2D3E50] dark:text-[#F5F6F5] border-[#E5E7EB] dark:border-[#4B5563]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-3 py-1 bg-[#00A6B5] text-[#FFFFFF] rounded-md text-sm hover:bg-[#008C9E]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
