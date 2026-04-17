import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, User, Bot, Loader2, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { type Language } from '../data';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  lang: Language;
  selectedTopicTitle?: string;
  selectedTopicCoreIdea?: string;
}

export function ChatBot({ lang, selectedTopicTitle, selectedTopicCoreIdea }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiRef = useRef<any>(null);

  useEffect(() => {
    // Lazy initialize Gemini only when needed or on load
    if (!aiRef.current) {
        try {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        } catch (error) {
            console.error("Failed to initialize Gemini:", error);
        }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const systemInstruction = `
        You are a helpful assistant for 'The Library', a public knowledge infrastructure for India.
        Your goal is to explain topics in a very simple, digestible way using common Indian lingo (Hinglish or simple Indian English).
        Avoid academic jargon. Use analogies that a common Indian citizen can relate to.
        Current selected topic: ${selectedTopicTitle || 'General Library Overview'}
        Topic Context: ${selectedTopicCoreIdea || ''}
        The user is currently browsing in: ${lang === 'hi' ? 'Hindi' : lang === 'ur' ? 'Urdu' : 'English'}.
        If they speak to you in Hindi or Urdu, respond accordingly.
        Be encouraging, neutral, and practical.
      `;

      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const modelText = response.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to the knowledge system. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = lang === 'ur';

  return (
    <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex flex-col items-end`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                height: isMinimized ? '60px' : '500px',
                width: '350px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-library-bg border-2 border-library-ink shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-library-ink text-library-bg p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Library Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 transition-colors">
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white/50"
                >
                  {messages.length === 0 && (
                    <div className="text-center py-8 opacity-40 italic text-[12px] font-serif">
                      "Knowledge is for all. Ask me anything about the topics here."
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? (isRtl ? 'justify-start' : 'justify-end') : (isRtl ? 'justify-end' : 'justify-start')}`}>
                      <div className={`max-w-[85%] p-3 text-[13px] ${
                        m.role === 'user' 
                        ? 'bg-library-ink text-library-bg' 
                        : 'bg-library-line text-library-ink'
                      } ${isRtl ? 'font-serif' : 'font-sans'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
                      <div className="bg-library-line p-3 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Analyzing...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-library-line bg-white">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Ask the Guide..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className={`flex-1 bg-transparent border border-library-line p-2 text-[12px] focus:outline-none focus:border-library-ink ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading}
                      className="bg-library-ink text-library-bg p-2 hover:opacity-80 transition-opacity disabled:opacity-20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-library-ink text-library-bg p-4 rounded-none shadow-xl border-2 border-library-bg hover:scale-105 transition-transform"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
