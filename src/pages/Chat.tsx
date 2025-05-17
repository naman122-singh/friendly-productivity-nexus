
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        sender: "bot",
        text: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
      localStorage.setItem("chat_messages", JSON.stringify([welcomeMessage]));
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const saveMessagesToStorage = (updatedMessages: ChatMessage[]) => {
    localStorage.setItem("chat_messages", JSON.stringify(updatedMessages));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessagesToStorage(updatedMessages);
    setInputValue("");
    setLoading(true);
    
    // Simulate AI response (replace with actual API call when connected to OpenAI)
    setTimeout(() => {
      const responseText = getBotResponse(inputValue);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: responseText,
        timestamp: Date.now()
      };
      
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      saveMessagesToStorage(newMessages);
      setLoading(false);
    }, 1000);
  };
  
  // Basic responses for demo purposes
  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! How can I assist you today?";
    } else if (lowerInput.includes("help")) {
      return "I can help you manage tasks, take notes, or answer questions. Just let me know what you need!";
    } else if (lowerInput.includes("weather")) {
      return "I'm sorry, I don't have access to real-time weather data yet. Once connected to OpenAI, I'll be able to fetch this information for you.";
    } else if (lowerInput.includes("task") || lowerInput.includes("todo")) {
      return "You can manage your tasks in the Tasks section. Would you like me to help you create a new task?";
    } else if (lowerInput.includes("note")) {
      return "You can create and manage notes in the Notes section. Would you like me to help you create a new note?";
    } else if (lowerInput.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else if (lowerInput.includes("feature") || lowerInput.includes("do")) {
      return "I can help with tasks, notes, answer questions, and more. Once connected to OpenAI, I'll be even more capable!";
    } else {
      return "I understand you're asking about \"" + input + "\". When connected to the OpenAI API, I'll be able to provide more helpful responses. For now, I'm running in demo mode with limited capabilities.";
    }
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const handleClearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      sender: "bot",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: Date.now()
    };
    
    setMessages([welcomeMessage]);
    saveMessagesToStorage([welcomeMessage]);
    
    toast({
      title: "Chat cleared",
      description: "Chat history has been cleared",
    });
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
        <Button variant="outline" onClick={handleClearChat}>
          Clear Chat
        </Button>
      </div>
      
      <Card className="flex-1 flex flex-col mb-4 overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
            Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === "bot" ? (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.sender === "bot" ? "Assistant" : "You"}
                    </span>
                    <span className="text-xs opacity-50 ml-auto">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !inputValue.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};

export default Chat;
