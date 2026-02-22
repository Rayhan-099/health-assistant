import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, User } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Health Assistant powered by AI. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickReplies = [
    "Tell me about nutrition",
    "Exercise recommendations",
    "Mental health tips",
    "First aid basics"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('health-chat', {
        body: { messages: conversationHistory }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="glass-panel sticky top-0 z-10 p-4 md:p-6 border-b border-white/10 mt-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-white">Health Assistant</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    message.isUser
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {message.isUser ? <User size={18} className="sm:w-5 sm:h-5" /> : <Bot size={18} className="sm:w-5 sm:h-5" />}
                </div>
                <div
                  className={`glass-panel max-w-[75%] sm:max-w-[80%] p-3 sm:p-4 ${
                    message.isUser
                      ? 'bg-green-500/20 border-green-400/30'
                      : 'bg-blue-500/20 border-blue-400/30'
                  }`}
                >
                  <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                  <span className="text-xs text-white/50 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="glass-panel bg-blue-500/20 border-blue-400/30 p-3 sm:p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Replies */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-4">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(reply)}
                    className="glass-panel px-3 py-2 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="flex gap-2 sm:gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your health question..."
              className="flex-1 glass-panel px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 rounded-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="glass-button-primary px-4 sm:px-6 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} className="sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;