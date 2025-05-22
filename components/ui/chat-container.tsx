import React from 'react';
import { ChatInput } from './chat-input';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

export function ChatContainer() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");


  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      content,
      isUser: true
    }]);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex h-full flex-col">
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      {/* 输入框区域 */}
      <ChatInput inputValue={inputValue} onInputChange={handleInputChange} />
    </div>
  );
} 