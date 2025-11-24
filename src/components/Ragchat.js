import React, {useState, useRef, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";

const CHAT_STORAGE_KEY = "keploy_chat_history";

const CEO_WELCOME_MESSAGE = {
  id: "ceo-welcome",
  text: `Hey, I'm Neha, founder of Keploy.io. We are building Keploy to make testing faster with ai. Curious? [Book a Call](https://calendar.app.google/cXVaj6hbMUjvmrnt9) and I'll walk you through!`,
  sender: "ceo",
  timestamp: new Date(),
};

const FAQ_QUESTIONS = [
  "What is Keploy and how does it work?",
  "How does Keploy differ from traditional testing tools?",
  "Can Keploy integrate with our existing CI/CD pipeline?",
  "How does Keploy handle test maintenance?",
];

const RagChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [botStatus, setBotStatus] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(80);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const [showGreetingMessage, setShowGreetingMessage] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [description, setDescription] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleResizeMouseDown = (e) => {
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = inputHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleResizeMouseMove = (e) => {
    if (!isResizing) return;
    const deltaY = e.clientY - startYRef.current;
    let newHeight = startHeightRef.current - deltaY;
    newHeight = Math.max(60, Math.min(200, newHeight));
    setInputHeight(newHeight);
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMouseMove);
      window.addEventListener("mouseup", handleResizeMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleResizeMouseMove);
      window.removeEventListener("mouseup", handleResizeMouseUp);
    };
  }, [isResizing]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      const {scrollTop, scrollHeight, clientHeight} = messagesContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    };

    messagesContainer.addEventListener("scroll", handleScroll);
    setTimeout(() => handleScroll(), 100);

    return () => {
      messagesContainer.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([CEO_WELCOME_MESSAGE]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChat) {
        try {
          const parsed = JSON.parse(savedChat);
          setMessages(
            parsed.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        } catch (e) {
          console.error("Failed to parse chat history", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen && showGreetingMessage) {
      const timer = setTimeout(() => {
        setShowGreetingMessage(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showGreetingMessage]);

  const TypingIndicator = () => (
    <div className="flex space-x-1 py-2">
      <div
        className="w-2 h-2 rounded-full bg-orange-300 animate-bounce"
        style={{animationDelay: "0ms"}}
      />
      <div
        className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
        style={{animationDelay: "150ms"}}
      />
      <div
        className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"
        style={{animationDelay: "300ms"}}
      />
    </div>
  );

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    if (isLoading) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Please wait for the current response to complete.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const statuses = [
      "Reviewing your query...",
      "Searching our knowledge base...",
      "Formulating the best response...",
    ];

    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      setBotStatus(statuses[statusIndex]);
      statusIndex = (statusIndex + 1) % statuses.length;
    }, 2000);

    try {
      const response = await fetch("https://docbot.keploy.io/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({question: messageText}),
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now().toString(),
        text:
          data.answer ||
          "I couldn't find an answer to that question. Please try rephrasing or ask something else about Keploy.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error while processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      clearInterval(statusInterval);
      setBotStatus("");
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleFAQClick = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const renderMarkdown = (text) => {
    let html = text
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline underline-offset-4">$1</a>'
      )
      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong class="font-bold text-gray-700 dark:text-gray-200">$1</strong>'
      )
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-white dark:bg-gray-700 px-2 py-0.5 rounded text-sm font-mono">$1</code>'
      );

    return (
      <div
        className="text-sm leading-relaxed text-gray-600 dark:text-gray-300"
        dangerouslySetInnerHTML={{__html: html}}
      />
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{scale: 0, rotate: -30}}
            animate={{scale: 1, rotate: 0}}
            exit={{scale: 0}}
            whileHover={{scale: 1.1, rotate: 5}}
            whileTap={{scale: 0.95}}
            className="relative"
          >
            {showGreetingMessage && (
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 20}}
                transition={{delay: 0.3, duration: 0.5}}
                className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm text-gray-800 dark:text-gray-200"
              >
                <p className="font-semibold mb-1">
                  Hey, I'm Keploy AI Assistant!
                </p>
                <p>May I help you?</p>
                <div className="absolute top-full right-4 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-gray-800" />
              </motion.div>
            )}

            <button
              onClick={toggleChat}
              className="rounded-full w-14 h-14 p-0 bg-[#FF6B35] shadow-lg hover:bg-[#E55C2B] transition-all duration-300 flex items-center justify-center"
              title="Open chat"
            >
              <div className="flex items-center justify-center w-full h-full p-2">
                <img
                  src="/images/avatars/bunny-4.png"
                  alt="Keploy Bot"
                  className="h-full w-full object-contain"
                />
              </div>
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.9}}
            transition={{duration: 0.2}}
            className="w-80 md:w-[26rem] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[65vh] md:h-[80vh] relative"
            style={{maxHeight: "calc(100vh - 100px)"}}
          >
            {/* Chat header */}
            <div className="bg-[#FF6B35] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-white/10 rounded-lg flex items-center justify-center">
                    <img
                      src="/images/avatars/bunny-4.png"
                      alt="Keploy Bot"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold">Keploy AI Assistant</h3>
                </div>
                <button
                  className="h-7 w-7 text-white hover:bg-white/10 rounded transition-colors flex items-center justify-center"
                  onClick={toggleChat}
                  title="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative p-2">
              {/* Support Button */}
              {!showSupportForm && (
                <div className="absolute top-2 right-2 group z-20">
                  <button
                    onClick={() => setShowSupportForm(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    title="Contact support"
                  >
                    📞
                  </button>
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block">
                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg animate-fadeIn">
                      Support
                    </div>
                  </div>
                </div>
              )}

              {/* Support Form */}
              {showSupportForm && (
                <motion.div
                  initial={{opacity: 0, y: -5, scale: 0.95}}
                  animate={{opacity: 1, y: 0, scale: 1}}
                  exit={{opacity: 0, y: -5, scale: 0.95}}
                  className="absolute right-2 top-2 w-72 bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-30"
                >
                  <button
                    onClick={() => setShowSupportForm(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                  >
                    ✕
                  </button>

                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-300 mb-2">
                    Need further assistance?
                  </p>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setFormStatus("submitting");
                      const name =
                        e.currentTarget.elements.namedItem("name").value;
                      const email =
                        e.currentTarget.elements.namedItem("email").value;
                      const desc =
                        e.currentTarget.elements.namedItem("description").value;

                      try {
                        const res = await fetch(
                          "https://docbot.keploy.io/support",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              name,
                              email,
                              description: desc,
                            }),
                          }
                        );

                        if (res.ok) {
                          setFormStatus("success");
                        } else {
                          setFormStatus("error");
                        }
                      } catch (err) {
                        console.error("Fetch Error:", err);
                        setFormStatus("error");
                      }

                      setTimeout(() => {
                        setFormStatus("idle");
                        setShowSupportForm(false);
                      }, 3000);
                    }}
                    className="space-y-2"
                  >
                    <input
                      name="name"
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <textarea
                      name="description"
                      required
                      placeholder="Your message / query"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className={`w-full text-sm text-white rounded py-2 font-medium transition-colors ${
                        formStatus === "error"
                          ? "bg-red-500 hover:bg-red-600"
                          : formStatus === "success"
                            ? "bg-green-500"
                            : "bg-[#FF6B35] hover:bg-[#E55C2B]"
                      } ${formStatus === "submitting" ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {formStatus === "submitting" && "Submitting..."}
                      {formStatus === "success" && "Submitted ✅"}
                      {formStatus === "error" && "Failed ❌"}
                      {formStatus === "idle" && "Submit"}
                    </button>
                  </form>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-3">
                    You can also reach out to our team on{" "}
                    <a
                      href="https://join.slack.com/t/keploy/shared_invite/zt-12rfbvc01-o54cOG0X1G6eVJTuI_orSA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-semibold hover:opacity-80"
                    >
                      Slack.
                    </a>
                  </p>
                </motion.div>
              )}
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-hidden relative">
              <div
                ref={messagesContainerRef}
                className="h-full overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.2}}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "ceo" ? (
                      <div className="flex items-start space-x-3 max-w-xs md:max-w-md">
                        <img
                          src="/images/avatars/neha-img.jpeg"
                          alt="Neha Gupta"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
                        />
                        <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl rounded-bl-none px-4 py-3 overflow-hidden">
                          <div className="font-semibold text-sm -mb-[10px]">
                            Neha Gupta
                          </div>
                          {renderMarkdown(message.text)}
                          <div className="text-xs mt-2 opacity-80 text-right text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 overflow-hidden ${
                          message.sender === "user"
                            ? "bg-orange-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-br-none"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-bl-none"
                        }`}
                      >
                        {message.sender === "bot" ? (
                          renderMarkdown(message.text)
                        ) : (
                          <p className="text-sm">{message.text}</p>
                        )}
                        <div
                          className={`text-xs mt-1 opacity-80 text-right ${
                            message.sender === "user"
                              ? "text-orange-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#FF6B35] animate-spin text-lg">
                          ⟳
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {botStatus}
                        </span>
                      </div>
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}

                {/* FAQ Section */}
                {isOpen && messages.length <= 1 && (
                  <motion.div className="space-y-3">
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                      Try asking me about:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {FAQ_QUESTIONS.map((question, index) => (
                        <motion.div
                          key={index}
                          whileHover={{y: -2}}
                          whileTap={{scale: 0.98}}
                        >
                          <button
                            onClick={() => handleFAQClick(question)}
                            className="w-full cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-left bg-white dark:bg-gray-900"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="p-1 bg-orange-100 dark:bg-gray-700 rounded-full flex-shrink-0">
                                <span className="text-[#FF6B35]">✨</span>
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">
                                {question}
                              </p>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 w-8 h-8 bg-[#FF6B35] hover:bg-[#E55C2B] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    title="Scroll to bottom"
                  >
                    ↓
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input area */}
            <div
              className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              style={{height: `${inputHeight}px`}}
            >
              {/* Resize handle */}
              <div
                ref={resizeRef}
                className="w-full h-3 cursor-row-resize flex items-center justify-center group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onMouseDown={handleResizeMouseDown}
              >
                <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors" />
              </div>

              {/* Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex space-x-2 p-3 h-full"
              >
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Keploy..."
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35] resize-none disabled:opacity-50"
                  disabled={isLoading}
                  rows={Math.max(1, Math.floor((inputHeight - 40) / 24))}
                  style={{
                    maxHeight: "100%",
                    overflowY: "auto",
                  }}
                />
                <button
                  type="submit"
                  className="bg-[#FF6B35] hover:bg-[#E55C2B] text-white rounded-lg w-10 h-10 flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={!inputValue.trim() || isLoading}
                  title="Send message"
                >
                  {isLoading ? "⟳" : "→"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RagChat;
