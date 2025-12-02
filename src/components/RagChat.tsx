"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function RagChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    // Add user message
    const userQuery = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setInput("");
    setLoading(true);
    setIsStreaming(true);

    // Add empty bot message that will be updated during streaming
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Check if response is streaming or JSON
      const contentType = res.headers.get("content-type");

      if (contentType?.includes("text/plain")) {
        // Handle streaming response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setIsStreaming(false);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          // Update the last message (bot message) with accumulated text
          setMessages((prev) => {
            const newMessages = [...prev];
            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1] = {
                sender: "bot",
                text: accumulatedText,
              };
            }
            return newMessages;
          });
        }
      } else if (contentType?.includes("application/json")) {
        // Handle JSON response (fallback for errors or non-streaming)
        const data = await res.json();
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              sender: "bot",
              text: data.answer || "No response received.",
            };
          }
          return newMessages;
        });
        setIsStreaming(false);
      } else {
        throw new Error("Unexpected content type");
      }
    } catch (err) {
      console.error("Error in sendMessage:", err);
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1] = {
            sender: "bot",
            text: "Sorry, I encountered an error. Please try again.",
          };
        }
        return newMessages;
      });
      setIsStreaming(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[330px] w-full">
      {/* CHAT WINDOW */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-4 space-y-4"
      >
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-10">
            Ask me anything about Emmanuel 👨🏽‍💻✨
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
              msg.sender === "user"
                ? "bg-my-primary/20 ml-auto border border-my-primary/40"
                : "bg-white/10 border border-white/20"
            }`}
          >
            {msg.text || (
              // Show typing indicator for empty bot message while streaming
              (isStreaming && i === messages.length - 1) && (
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </span>
              )
            )}
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading && input.trim()) {
              sendMessage();
            }
          }}
          disabled={loading}
          className="flex-1 p-2 text-sm bg-white/10 border border-white/20 rounded-lg outline-none focus:border-my-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Ask a question..."
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-my-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}