'use client';

import { useState, useEffect } from 'react';
import { AIMessage, AIMessageType, AIService } from '@/services/aiService';

interface AIAssistantProps {
  context?: string;
  onMessageSend?: (message: string) => void;
}

export default function AIAssistant({ context = 'start', onMessageSend }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (context) {
      const message = AIService.getGuidanceMessage(context);
      setMessages([message]);
    }
  }, [context]);

  const getMessageIcon = (type: AIMessageType) => {
    const icons: Record<AIMessageType, string> = {
      guidance: '💡',
      hint: '💭',
      observation: '👁️',
      feedback: '✅',
      safety: '⚠️',
      success: '🎉'
    };
    return icons[type] || '💬';
  };

  const getMessageStyle = (type: AIMessageType) => {
    const styles: Record<AIMessageType, string> = {
      guidance: 'bg-blue-50 border-blue-200',
      hint: 'bg-purple-50 border-purple-200',
      observation: 'bg-green-50 border-green-200',
      feedback: 'bg-green-50 border-green-200',
      safety: 'bg-yellow-50 border-yellow-200',
      success: 'bg-green-50 border-green-200'
    };
    return styles[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">⚗️</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">AI Lab Assistant</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">AI-powered</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border ${getMessageStyle(message.type)}`}
          >
            <div className="flex items-start space-x-2">
              <span className="text-xl">{getMessageIcon(message.type)}</span>
              <div className="flex-1">
                <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input (Optional - for future expansion) */}
      {onMessageSend && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => onMessageSend('')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
