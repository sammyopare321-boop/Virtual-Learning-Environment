'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, Sparkles, Copy, Check, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    explanation?: string;
    keyPoints?: string[];
    examples?: string[];
    practiceProblems?: string[];
    relatedConcepts?: string[];
    tips?: string;
  };
}

interface StudentTutorProps {
  courseTitle?: string;
  topic?: string;
  studentLevel?: 'beginner' | 'intermediate' | 'advanced';
  onClose?: () => void;
}

export default function StudentTutor({
  courseTitle = 'Course',
  topic = 'General',
  studentLevel = 'intermediate',
  onClose,
}: StudentTutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/tutoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          courseTitle,
          topic,
          studentLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get tutoring response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.explanation || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date(),
        metadata: {
          explanation: data.explanation,
          keyPoints: data.keyPoints,
          examples: data.examples,
          practiceProblems: data.practiceProblems,
          relatedConcepts: data.relatedConcepts,
          tips: data.tips,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get tutoring response');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">AI Tutor</h3>
            <p className="text-white/80 text-xs">{topic}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 border border-primary-100">
              <BookOpen size={32} className="text-primary-600" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Welcome to AI Tutor</h4>
            <p className="text-slate-500 text-xs max-w-xs">
              Ask me anything about {topic}. I'll provide explanations, examples, and practice problems.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {message.type === 'assistant' && message.metadata && (
                    <div className="mt-3 space-y-2 text-xs">
                      {message.metadata.keyPoints && message.metadata.keyPoints.length > 0 && (
                        <div>
                          <p className="font-semibold text-slate-700 mb-1">Key Points:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {message.metadata.keyPoints.map((point, i) => (
                              <li key={i} className="text-slate-600">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.metadata.examples && message.metadata.examples.length > 0 && (
                        <div>
                          <p className="font-semibold text-slate-700 mb-1">Examples:</p>
                          <ul className="space-y-1">
                            {message.metadata.examples.map((example, i) => (
                              <li key={i} className="text-slate-600 italic">
                                • {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.metadata.tips && (
                        <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2">
                          <p className="font-semibold text-amber-900 mb-1">💡 Tip:</p>
                          <p className="text-amber-800">{message.metadata.tips}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {message.type === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="mt-2 flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {copied === message.id ? (
                        <>
                          <Check size={12} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded-xl rounded-bl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
