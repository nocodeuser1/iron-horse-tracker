import { Bot, Send } from 'lucide-react';

export function AIChat() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-500 mt-1">
          Ask questions about your permit requirements
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            AI Assistant Coming Soon
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Our AI assistant will use a local LLM for complete data privacy.
            Ask questions about your permit requirements, deadlines, and
            compliance status.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {[
              'What requirements are due this month?',
              'Show me overdue inspections',
              'Summarize compliance status',
              'What tests need scheduling?',
            ].map((q) => (
              <button
                key={q}
                className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask about your permit requirements..."
            disabled
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            disabled
            className="p-2.5 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
