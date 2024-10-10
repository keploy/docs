import React, {useState, useCallback, useRef, useEffect} from "react";
import {MessageCircle, X} from "lucide-react";

function textFormat(text) {
  let block = 0;
  let code = ``;
  let lang = "";
  let heading = 2;
  let output = ``;

  for (let i = 0; i < text.length; i++) {
    if (text.substring(i, i + 3) === "```") {
      i += 2;
      if (block === 0) {
        block = 1;
        lang = "";
        while (i < text.length && text.charAt(i) !== "\n") {
          lang += text.charAt(i++);
        }
      } else {
        output += code;
        code = ``;
        lang = "";
        block = 0;
      }
    } else if (block === 0) {
      if (text.substring(i, i + 3) === "###") {
        i += 2;
        heading = 3;
        output += `\n\n`;
      } else if (text.substring(i, i + 2) === "##") {
        i += 1;
        heading = 2;
        output += `\n\n`;
      } else if (text.substring(i, i + 1) == "#") {
        heading = 1;
        output += `\n\n`;
      } else if (text.substring(i, i + 1) == "<") {
        i++;
        while (
          i < text.length &&
          text.substring(i, i + 2) != "/>" &&
          text.substring(i, i + 1) != ">"
        ) {
          i++;
        }
      } else if (text.substring(i, i + 2) === "**") {
        i += 1;
      } else if (text.substring(i, i + 2) === "* ") {
        i += 1;
        output += `\n• `;
      } else if (text.charAt(i) === "\n") {
        output += `\n`;
      } else {
        output += text.charAt(i);
      }
    } else {
      code += text.charAt(i);
    }
  }

  return output;
}

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {text: input, sender: "user"};
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const apiRes = await fetch(
        "https://keploy-api.abhishekkushwaha.me/chat",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({question: input}),
        }
      );

      if (!apiRes.ok) {
        throw new Error(`HTTP error! status: ${apiRes.status}`);
      }

      const {answer} = await apiRes.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        {text: answer, sender: "bot"},
      ]);
    } catch (error) {
      console.error("Error fetching response from Keploy API", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, there was an error processing your request.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  }, [input, isLoading]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="fixed bottom-16 right-16 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="rounded-full bg-[#FF914D] p-4 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-[#FF914D] hover:shadow-2xl"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="flex h-[500px] w-80 flex-col rounded-lg bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold text-black">Chat with us</h3>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex h-full flex-grow flex-col bg-gray-100">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-[#FF914D] text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {textFormat(msg.text)}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="text-center text-gray-500">
                  Bot is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-white p-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  className="flex-1 rounded-lg border bg-white px-4 py-2 text-black focus:border-[#FF914D] focus:outline-none"
                  placeholder="Type your message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  className="rounded-lg bg-[#FF914D] px-4 py-2 text-white disabled:opacity-80"
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
