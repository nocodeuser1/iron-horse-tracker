import { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Zap,
  Lock,
  MessageCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const SAMPLE_QUESTIONS = [
  'What requirements are due this month?',
  'Show me all overdue inspections',
  'Summarize our compliance status',
  'What tests need scheduling next quarter?',
  'Which equipment has the most pending actions?',
];

const CANNED_RESPONSES: Record<string, string> = {
  'What requirements are due this month?':
    "Based on your permit data, you have **7 requirements** due this month:\n\n• 2 Quarterly inspections (Compressors)\n• 1 Semi-annual throughput report\n• 3 Monthly sample collections\n• 1 Annual flare efficiency test\n\nThe most urgent is the compressor inspection due in 3 days. Would you like me to show the full details?",
  'Show me all overdue inspections':
    "I found **3 overdue inspections**:\n\n🔴 Storage Tank visual inspection — 12 days overdue\n🔴 Flare pilot monitoring check — 5 days overdue\n🟡 Dehydrator emissions inspection — 1 day overdue\n\nI'd recommend prioritizing the storage tank inspection first. Shall I help draft a compliance action plan?",
  'Summarize our compliance status':
    "Here's your compliance snapshot:\n\n✅ **Overall Score: 87%** — Good standing\n📊 48 of 55 requirements completed on time\n⏰ 4 items due this week\n🔴 3 items currently overdue\n\nYour strongest area is Throughput Reports (100% on time). Inspections need attention with 2 recurring late items. Want me to analyze trends?",
};

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };
    const response = CANNED_RESPONSES[text];
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text:
        response ||
        "I'm not available yet, but when launched I'll be able to answer questions like this using a **local LLM** — keeping all your permit data private and secure. Stay tuned! 🚀",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Intelligent permit compliance assistant
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-gradient-to-r from-burgundy-500 to-burgundy-600 dark:from-burgundy-800 dark:to-burgundy-900 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gold-400 rounded-full border-2 border-burgundy-500 animate-pulse" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">IH Permit Assistant</h2>
                <p className="text-xs text-white/70">Preview Mode · Coming Soon</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-200 text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI Preview
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Welcome message */}
            <div className="flex gap-3 animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-burgundy-100 dark:bg-burgundy-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-burgundy-600 dark:text-burgundy-200" />
              </div>
              <div className="bg-gray-50 dark:bg-dark-surface rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  👋 Welcome! I'm the <strong>Iron Horse Permit Assistant</strong>.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  I'll help you navigate your Title V permit requirements, track deadlines, and maintain compliance — all powered by a <strong>local LLM</strong> for complete data privacy.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                  Try one of the sample questions to see a demo! →
                </p>
              </div>
            </div>

            {/* User messages */}
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-slide-up ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${(i % 2) * 0.1}s` }}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-burgundy-100 dark:bg-burgundy-800 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-burgundy-600 dark:text-burgundy-200" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-md text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-burgundy-500 text-white rounded-tr-sm'
                      : 'bg-gray-50 dark:bg-dark-surface text-gray-700 dark:text-gray-300 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface/50"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your permit requirements..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500/30 focus:border-burgundy-500 transition-all"
              />
              <button
                type="submit"
                className="p-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Sample Questions */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-burgundy-500" />
              Try asking...
            </h3>
            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-3.5 py-2.5 bg-gray-50 dark:bg-dark-surface hover:bg-burgundy-50 dark:hover:bg-burgundy-900/30 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-burgundy-700 dark:hover:text-burgundy-200 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-burgundy-200 dark:hover:border-burgundy-700"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-burgundy-50 to-gold-50 dark:from-burgundy-900/40 dark:to-dark-card rounded-2xl shadow-sm border border-burgundy-100 dark:border-dark-border p-5">
            <h3 className="text-sm font-semibold text-burgundy-900 dark:text-burgundy-100 mb-3">
              Coming Soon
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: Shield,
                  title: 'Local LLM',
                  desc: 'Runs on your infrastructure — data never leaves your network',
                },
                {
                  icon: Zap,
                  title: 'Instant Answers',
                  desc: 'Query permit data in natural language',
                },
                {
                  icon: Lock,
                  title: 'Fully Private',
                  desc: 'No cloud APIs — complete data sovereignty',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-burgundy-500/10 dark:bg-burgundy-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-burgundy-600 dark:text-burgundy-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-burgundy-900 dark:text-burgundy-100">
                      {title}
                    </p>
                    <p className="text-xs text-burgundy-600 dark:text-burgundy-300 mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
