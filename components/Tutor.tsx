
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { ChatMessage } from '../types';

const Tutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Chào bạn! Mình là MathMaster AI. Bạn cần giúp đỡ gì về kiến thức Toán hôm nay không?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await geminiService.chatWithTutor(messages, input);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Rất tiếc, mình không phản hồi được lúc này.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-4 border-b border-teal-50 bg-teal-50/30 flex items-center justify-between">
        <h2 className="font-bold text-teal-800 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Gia Sư MathMaster Online
        </h2>
        <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full font-bold">Gemini Power</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-br-none' 
                : 'bg-white border border-teal-100 text-slate-800 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-teal-100 p-4 rounded-2xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-teal-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi gia sư bất cứ điều gì..."
            className="flex-1 p-3 bg-slate-50 rounded-xl border border-teal-100 outline-none focus:border-teal-400 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition-all shadow-md shadow-teal-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
