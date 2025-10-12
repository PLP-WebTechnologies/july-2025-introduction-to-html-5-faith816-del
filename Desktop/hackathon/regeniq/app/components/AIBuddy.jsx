"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function AIBuddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response for now
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "🌱 Thanks for your question! Soon I'll give real farm insights here.",
          sender: "ai",
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800 transition z-50"
      >
        <MessageCircle size={26} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white/30 backdrop-blur-md text-black rounded-2xl shadow-lg border border-white/40 z-50">
          <div className="p-3 bg-green-700 text-white rounded-t-2xl">
            🌿 RegenIQ Smart Assistant
          </div>

          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-green-200 self-end"
                    : "bg-white/70"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex p-2 border-t border-white/40">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask RegenIQ..."
              className="flex-1 bg-transparent text-black outline-none px-2"
            />
            <button
              onClick={handleSend}
              className="bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
