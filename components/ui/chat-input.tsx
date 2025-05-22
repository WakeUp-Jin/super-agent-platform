import React from 'react';
import { Globe, Lightbulb, Plus, Mic } from "lucide-react";



export function ChatInput({ inputValue,onInputChange }:any) {
  const [message, setMessage] = React.useState('');

  return (
    <div className="w-full relative">
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <input
        type="text"
        placeholder="Ask anything"
        value={inputValue}
        onChange={onInputChange}
        className="w-full text-lg text-gray-500 outline-none px-2"
      />
      
      <div className="flex items-center mt-4 gap-3">
        <button className="p-3 rounded-md hover:bg-gray-100">
          <Plus className="w-6 h-6 text-gray-500" />
        </button>
        
        <button className="flex items-center gap-2 px-5 py-2 rounded-md bg-gray-100 border border-gray-300 font-medium">
          <Globe className="w-5 h-5 text-black" />
          <span className="text-black">Search</span>
        </button>
        
        <button className="flex items-center gap-2 px-5 py-2 rounded-md border border-gray-200 hover:bg-gray-100">
          <Lightbulb className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500 font-medium">Reason</span>
        </button>
        
        <div className="ml-auto">
          <button className="p-3 bg-black rounded-md hover:bg-gray-800">
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
  );
} 