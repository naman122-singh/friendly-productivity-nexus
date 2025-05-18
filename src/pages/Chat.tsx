
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyStored, setApiKeyStored] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if API key exists in localStorage
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setApiKeyStored(true);
    } else {
      // Show API key dialog if no key is stored
      setShowApiKeyDialog(true);
    }
    
    // Load messages from localStorage
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        sender: "bot",
        text: "Hello! I'm your AI assistant powered by OpenAI. How can I help you today?",
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
  
  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use the chat feature",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("openai_api_key", apiKey);
    setApiKeyStored(true);
    setShowApiKeyDialog(false);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Check if API key is available
    if (!apiKeyStored) {
      setShowApiKeyDialog(true);
      return;
    }
    
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
    
    try {
      // Call OpenAI API
      const response = await callOpenAI(inputValue, messages);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response,
        timestamp: Date.now()
      };
      
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      saveMessagesToStorage(newMessages);
    } catch (error) {
      // Handle API error
      console.error("OpenAI API error:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: Date.now()
      };
      
      const newMessages = [...updatedMessages, errorMessage];
      setMessages(newMessages);
      saveMessagesToStorage(newMessages);
      
      toast({
        title: "Error",
        description: "Failed to connect to OpenAI API. Check your API key or try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const callOpenAI = async (prompt: string, previousMessages: ChatMessage[]): Promise<string> => {
    // Format previous messages for context (limit to last 10 messages)
    const recentMessages = previousMessages.slice(-10).map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));
    
    // Prepare the API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides accurate, concise answers. You are part of a productivity app that helps students and working professionals manage their tasks, notes, and daily activities."
          },
          ...recentMessages,
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to connect to OpenAI API");
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
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
      text: "Hello! I'm your AI assistant powered by OpenAI. How can I help you today?",
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowApiKeyDialog(true)} 
            className="mr-2"
          >
            {apiKeyStored ? "Update API Key" : "Set API Key"}
          </Button>
          <Button variant="outline" onClick={handleClearChat}>
            Clear Chat
          </Button>
        </div>
      </div>
      
      <Card className="flex-1 flex flex-col mb-4 overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
            Assistant {apiKeyStored ? "" : "(API Key Required)"}
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
          placeholder={apiKeyStored ? "Type your message here..." : "Please set your OpenAI API key first"}
          disabled={loading || !apiKeyStored}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !inputValue.trim() || !apiKeyStored}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              OpenAI API Key Required
            </DialogTitle>
            <DialogDescription>
              Please enter your OpenAI API key to use the chat feature. Your key will be stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers. You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI's website</a>.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApiKeySubmit}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
