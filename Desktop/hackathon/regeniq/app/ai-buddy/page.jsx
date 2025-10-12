"use client";

import { useState, useRef, useEffect } from "react";
import AuthCheck from "../components/AuthCheck";
import { Camera, X } from "lucide-react";
import OpenAI from "openai";

// ✅ Direct frontend OpenAI connection
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function AIBuddyPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello, farmer! I’m RegenIQ’s AI Buddy. How can I assist you today? You can type or even upload a photo of your plants for analysis!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const chatEndRef = useRef(null);

  // 🌀 Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 📸 Convert image file → Base64 for GPT-4o vision
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  // 💬 Send message or image
  const handleSend = async () => {
    if (!input.trim() && !image) return;

    const userMessage = { sender: "user", text: input, image };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImage(null);
    setLoading(true);

    try {
      let aiReply = "";

      if (image) {
        // 🧠 GPT-4o Vision (base64 support)
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are RegenIQ AI Buddy, an expert in regenerative farming. Analyze uploaded plant or soil photos for diseases, pests, or growth issues, and give practical solutions.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    input ||
                    "Analyze this image and describe the plant or soil condition like a regenerative farming expert.",
                },
                {
                  type: "image_url",
                  image_url: { url: image }, // 👈 Corrected base64 handling
                },
              ],
            },
          ],
        });

        aiReply =
          response.choices?.[0]?.message?.content ||
          "🌿 I couldn’t clearly identify the issue. Try another photo or describe the plant’s symptoms.";
      } else {
        // 💬 Text-only chat
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are RegenIQ AI Buddy, a regenerative farming assistant offering concise, practical answers about soil, crops, pests, and sustainability.",
            },
            { role: "user", content: input },
          ],
        });

        aiReply =
          response.choices?.[0]?.message?.content ||
          "🌱 Sorry, I couldn’t process that right now.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error("AI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "⚠️ There was an issue analyzing that image or message. Check your OpenAI key or internet connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Clear chat
  const handleClearChat = () => {
    if (confirm("Clear all chat messages?")) {
      setMessages([
        {
          sender: "ai",
          text: "👋 Chat cleared. I'm ready for your next question, farmer!",
        },
      ]);
    }
  };

  return (
    <AuthCheck>
      <main
        className="min-h-screen flex flex-col items-center p-6 text-[#01411C]"
        style={{ backgroundColor: "#B2AC88" }}
      >
        {/* 🌿 Header */}
        <section className="max-w-3xl text-center mb-6">
          <h1 className="text-4xl font-extrabold mb-3 text-[#01411C]">
            🤖 RegenIQ AI Buddy
          </h1>
          <p className="text-lg text-[#2f3e2f] leading-relaxed">
            Ask questions or upload photos — get real regenerative farming
            insights powered by AI.
          </p>
        </section>

        {/* 💬 Chat */}
        <section className="w-full max-w-3xl flex flex-col bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-[#9CAF88] overflow-hidden flex-grow">
          <div className="flex flex-col gap-3 p-6 overflow-y-auto h-[60vh]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-[#01411C] text-white rounded-br-none"
                      : "bg-[#E8EDDE] text-[#01411C] rounded-bl-none"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="uploaded"
                      className="rounded-lg mb-2 max-h-48 object-cover"
                    />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-600 italic">
                🤖 AI is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ✍️ Input Area */}
          <div className="flex items-center gap-3 border-t border-[#9CAF88]/60 bg-white/80 p-4">
            {/* Upload */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Camera
                className="text-[#01411C] hover:scale-110 transition"
                size={26}
              />
            </label>

            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about soil, pests, or upload a plant photo..."
              className="flex-grow p-3 rounded-xl border border-[#9CAF88]/50 focus:outline-none focus:ring-2 focus:ring-[#01411C]/50"
            />

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!input.trim() && !image}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                !input.trim() && !image
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#01411C] hover:bg-[#013d17] text-white"
              }`}
            >
              Send
            </button>

            {/* Clear */}
            <button
              onClick={handleClearChat}
              className="ml-2 p-2 text-[#800020] hover:text-red-700"
              title="Clear Chat"
            >
              <X size={20} />
            </button>
          </div>
        </section>

        {/* 🌱 Footer */}
        <footer className="text-sm text-[#01411C]/80 mt-6">
          RegenIQ © {new Date().getFullYear()} • Empowering Regenerative Farming
        </footer>
      </main>
    </AuthCheck>
  );
}