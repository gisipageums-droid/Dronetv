import { useState, ChangeEvent, FC } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDBuEscUVq4Ys6rEVMRMuI7tp4aK9g10vA");

interface AIInputFieldProps {
  label?: string;
  placeholder?: string;
  promptPrefix?: string;
  onChange?: (value: string) => void;
  inputClassName?: string;
  multiline?: boolean;
  rows?: number;
  value?:string;
}

const AIInputField: FC<AIInputFieldProps> = ({
  label,
  placeholder = "",
  promptPrefix = "",
  onChange,
  inputClassName,
  multiline = false,
  rows = 3,
}) => {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; text: string }[]
  >([]);
  const [selectedText, setSelectedText] = useState<string>("");

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `${promptPrefix} ${chatInput}`;
      const result = await model.generateContent(prompt);
      let generated = (await result.response.text()).trim();

      generated = generated
        .replace(/\n\s*\n/g, "\n")
        .replace(/(\. )/g, ".\n")
        .trim();

      const aiMessage = { role: "ai", text: generated };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const captureSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      setSelectedText(selection);
    }
  };

  const handleSubmitSelection = () => {
    if (selectedText) {
      setValue(selectedText);
      onChange?.(selectedText);
    }
    setPopupOpen(false);
    setSelectedText("");
  };

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2 items-start">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onChange?.(e.target.value);
            }}
            placeholder={placeholder}
            rows={rows}
            className={
              inputClassName ||
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
            }
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className={
              inputClassName ||
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
            }
          />
        )}
        <button
          type="button"
          onClick={() => {
            setPopupOpen(true);
            if (value.trim()) {
              // Add user message from textarea
              const initialUserMessage = { role: "user", text: value.trim() };
              setChatMessages([initialUserMessage]); // reset chat with first message
              setChatInput(""); // clear input

              // Send AI response immediately
              (async () => {
                setLoading(true);
                try {
                  const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                  });
                  const prompt = `${promptPrefix} ${value.trim()}`;
                  const result = await model.generateContent(prompt);
                  let generated = (await result.response.text()).trim();
                  generated = generated
                    .replace(/\n\s*\n/g, "\n")
                    .replace(/(\. )/g, ".\n")
                    .trim();

                  const aiMessage = { role: "ai", text: generated };
                  setChatMessages((prev) => [...prev, aiMessage]);
                } catch (error) {
                  console.error("AI chat failed:", error);
                } finally {
                  setLoading(false);
                }
              })();
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition"
        >
          ✨Generate
        </button>
      </div>

      {popupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <span className="text-transparent bg-gradient-to-br from-sky-400 to-blue-600 bg-clip-text text-2xl drop-shadow-[0_0_4px_rgba(56,189,248,0.7)]">
                  ✦
                </span>
                Ask Gemini
              </h2>
              <button
                onClick={() => setPopupOpen(false)}
                className="p-2 rounded-full hover:bg-red-50 transition-colors group"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              onMouseUp={captureSelection}
            >
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                    {msg.role === "user" ? "U" : "AI"}
                  </div>
                  {/* Bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-line shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-gray-400 italic">AI is thinking...</div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={sendChatMessage}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                Send
              </button>
            </div>

            {/* Selected text preview & submit */}
            {selectedText && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-300 text-sm text-blue-800">
                <strong>Selected:</strong> {selectedText}
              </div>
            )}
            <div className="p-3">
              <button
                onClick={handleSubmitSelection}
                disabled={!selectedText}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Submit Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInputField;
