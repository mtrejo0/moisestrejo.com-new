"use client";

import { useState, useRef, useEffect } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoHelpCircleOutline } from "react-icons/io5";

const GPTSkin = () => {
  const [lines, setLines] = useState([]);
  const [line, setLine] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastInput, setLastInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." }
  ]);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const models = [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Good balance of capability and speed" },
    { id: "gpt-4", name: "GPT-4", description: "Most capable model, but slower and more expensive" },
    { id: "gpt-4-turbo-preview", name: "GPT-4 Turbo", description: "Latest GPT-4 with improved capabilities" },
    { id: "gpt-3.5-turbo-16k", name: "GPT-3.5 Turbo 16K", description: "Extended context window" },
  ];

  // Auto adjust height of textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Adjust height whenever content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [line]);

  // Scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const callOpenAI = async (prompt) => {
    try {
      if (!apiKey) {
        setLines(v => [...v, "Error: Please set your OpenAI API key in settings"]);
        return;
      }

      setIsLoading(true);
      
      // Add new user message to messages array
      const updatedMessages = [...messages, { role: "user", content: prompt }];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedMessages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message;
      
      // Update messages with both user input and AI response
      setMessages([...updatedMessages, aiResponse]);
      setLines(v => [...v, `AI: ${aiResponse.content}`]);
    } catch (error) {
      setLines(v => [...v, `Error: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const onEnter = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      const input = e.target.value.trim();
      if (!input) return; // Don't send empty messages
      
      setLastInput(input);
      setLines(v => [...v, `You: ${input}`]);
      setLine("");
      await callOpenAI(input);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '!!') {
      setLine(lastInput);
    } else {
      setLine(value);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('openai_model', selectedModel);
    setShowSettings(false);
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    const savedModel = localStorage.getItem('openai_model');
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  // Add a function to clear context
  const clearContext = () => {
    setMessages([{ role: "system", content: "You are a helpful assistant." }]);
    setLines([]);
    setLine("");
    setLastInput("");
  };

  return (
    <div className="bg-black  relative text-[#11ff11] mb-[-132px] pl-8">
      {/* Icons */}
      <div className="absolute top-4 right-4 flex gap-3">
        <div 
          className="cursor-pointer"
          onClick={() => setShowHelp(!showHelp)}
        >
          <IoHelpCircleOutline 
            size={24} 
            className="text-[#11ff11] hover:text-[#0dd10d] transition-colors"
          />
        </div>
        <div 
          className="cursor-pointer"
          onClick={() => setShowSettings(!showSettings)}
        >
          <IoSettingsSharp 
            size={24} 
            className="text-[#11ff11] hover:text-[#0dd10d] transition-colors"
          />
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute top-12 right-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-[#11ff11] w-80 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#11ff11] text-lg">Commands</h3>
            <IoMdClose 
              className="cursor-pointer hover:text-[#0dd10d] transition-colors" 
              size={20}
              onClick={() => setShowHelp(false)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-[#11ff11] text-sm">
              <span className="font-bold">!!</span> - Repeat last message
            </div>
            <div className="text-[#11ff11] text-sm">
              <span className="font-bold">Enter</span> - Send message
            </div>
            <div className="text-[#11ff11] text-sm">
              <span className="font-bold">Shift+Enter</span> - Add new line
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute top-12 right-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-[#11ff11] w-80 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#11ff11] text-lg">Settings</h3>
            <IoMdClose 
              className="cursor-pointer hover:text-[#0dd10d] transition-colors" 
              size={20}
              onClick={() => setShowSettings(false)}
            />
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-[#11ff11] text-sm">OpenAI API Key</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 block w-full bg-black border border-[#11ff11] rounded px-3 py-2 text-[#11ff11] focus:outline-none focus:border-[#0dd10d]"
                placeholder="sk-..."
              />
            </label>
            
            <div className="block">
              <span className="text-[#11ff11] text-sm block mb-2">Model</span>
              <div className="space-y-2">
                {models.map((model) => (
                  <label 
                    key={model.id} 
                    className="flex items-start space-x-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="model"
                      value={model.id}
                      checked={selectedModel === model.id}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="mt-1"
                    />
                    <div className="text-[#11ff11] text-sm">
                      <div className="font-medium group-hover:text-[#0dd10d] transition-colors">
                        {model.name}
                      </div>
                      <div className="text-[#11ff11]/70 text-xs">
                        {model.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-[#11ff11] text-black py-2 rounded hover:bg-[#0dd10d] transition-colors font-medium"
              onClick={saveApiKey}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div 
        ref={messagesContainerRef}
        className="overflow-y-auto min-h-96 pt-16"
      >
        <div className="flex flex-col">
          {lines.map((l, index) => (
            <div key={index} className="whitespace-pre-wrap py-1">
              {l}
            </div>
          ))}
          {isLoading && (
            <div className="text-[#11ff11] animate-pulse py-1">
              Processing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black p-4">
        <div className="relative flex items-start">
          <div className="absolute left-[-16px] top-2 text-[#11ff11]">{'>'}</div>
          <textarea 
            ref={textareaRef}
            className="w-full bg-black border-none text-[#11ff11] focus:outline-none resize-none min-h-[24px] max-h-[200px] overflow-y-auto pl-2"
            onKeyDown={onEnter}
            value={line}
            onChange={handleInputChange}
            placeholder={apiKey ? "Type your message..." : "Please set your API key in settings..."}
            disabled={!apiKey || isLoading}
            rows={1}
            style={{
              lineHeight: '1.5',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GPTSkin;
