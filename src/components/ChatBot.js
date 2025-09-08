import React, {useState, useEffect, useRef} from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [botStatus, setBotStatus] = useState("");
  const [showGreetingMessage, setShowGreetingMessage] = useState(true);
  const messagesEndRef = useRef(null);

  const CHAT_STORAGE_KEY = "chat_history";

  const toggleChat = () => setIsOpen(!isOpen);

  // Load saved messages
  useEffect(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  // Hide greeting after 7s
  useEffect(() => {
    if (!isOpen && showGreetingMessage) {
      const timer = setTimeout(() => setShowGreetingMessage(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showGreetingMessage]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const statuses = [
      "Reviewing your query...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setBotStatus(statuses[idx]);
      idx = (idx + 1) % statuses.length;
    }, 2000);

    try {
      const res = await fetch("https://docbot.keploy.io/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({question: userMsg.text}),
      });
      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        text: data.answer || "I couldn't find an answer. Try rephrasing.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "⚠️ Error: please try again later.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      clearInterval(interval);
      setBotStatus("");
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        fontFamily: "sans-serif",
      }}
    >
      {/* Floating Button */}
      {!isOpen && (
        <div style={{position: "relative"}}>
          {showGreetingMessage && (
            <div
              style={{
                position: "absolute",
                bottom: "75px",
                right: "0",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "10px 12px",
                width: "220px",
                fontSize: "14px",
                color: "#374151",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              <p style={{fontWeight: "600", marginBottom: "4px"}}>
                Hey, I'm Keploy AI Assistant!
              </p>
              <p>May I help you?</p>
            </div>
          )}

          <button
            onClick={toggleChat}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#FF6B35",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease",
              color: "#fff",
              fontSize: "24px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            💬
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: "360px",
            height: "520px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#FF6B35",
              color: "#fff",
              padding: "12px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "15px",
            }}
          >
            Keploy AI Assistant
            <button
              onClick={toggleChat}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              background: "#f9fafb",
              fontSize: "14px",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  margin: "8px 0",
                  display: "flex",
                  justifyContent:
                    m.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: m.sender === "user" ? "#ffedd5" : "#e5e7eb",
                    color: "#1f2937",
                    maxWidth: "75%",
                    wordWrap: "break-word",
                  }}
                >
                  {m.text}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginTop: "4px",
                      textAlign: "right",
                    }}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                style={{fontSize: "13px", color: "#6b7280", marginTop: "6px"}}
              >
                {botStatus}...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "8px",
              display: "flex",
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "8px 10px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                background: "#FF6B35",
                border: "none",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
