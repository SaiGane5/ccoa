import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { sendChatMessage } from '../../api/ccoaApi';
import LoadingSpinner from '../common/LoadingSpinner';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const ChatWindow = ({ sessionId }) => {
  // ... All the state and functions from the previous version remain the same ...
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "I can now search for external resources. Ask me for a tutorial!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(sessionId, input);
      const botMessage = {
        sender: 'bot',
        text: response.data.answer,
        provenance: response.data.provenance,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to get a response.");
      const errorMessage = {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  
  return (
    <div className="flex h-full flex-col rounded-lg bg-brand-gray border border-brand-light-gray">
      <div className="flex-grow space-y-6 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <div key={index} className={clsx('flex items-start gap-4', { 'justify-end': msg.sender === 'user' })}>
            {msg.sender === 'bot' && <div className="flex-shrink-0 rounded-full bg-brand-light-gray p-2"><Bot className="h-6 w-6 text-brand-accent" /></div>}
            
            <div className={`max-w-lg rounded-lg px-4 py-3 ${msg.sender === 'user' ? 'bg-brand-accent text-white' : 'bg-brand-dark'}`}>
              <ReactMarkdown
                className="prose prose-invert prose-sm max-w-none"
                rehypePlugins={[rehypeHighlight]}
              >
                {msg.text}
              </ReactMarkdown>
              
              {msg.provenance && msg.provenance.length > 0 && (
                <div className="mt-3 border-t border-brand-light-gray/50 pt-2">
                  <h4 className="text-xs font-bold text-gray-400">Sources:</h4>
                  {msg.provenance.map((p, i) => (
                    <details key={i} className="mt-1 cursor-pointer">
                      <summary className="text-xs text-brand-accent hover:underline flex items-center gap-1"><FileText size={12}/>{p.file_path}</summary>
                      <pre className="mt-2 rounded bg-black p-2 text-xs text-gray-400 overflow-x-auto"><code>{p.content_chunk}</code></pre>
                    </details>
                  ))}
                </div>
              )}
            </div>
            
            {msg.sender === 'user' && <div className="flex-shrink-0 rounded-full bg-brand-light-gray p-2"><User className="h-6 w-6 text-gray-300" /></div>}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-4">
             <div className="flex-shrink-0 rounded-full bg-brand-light-gray p-2"><Bot className="h-6 w-6 text-brand-accent" /></div>
             <div className="max-w-lg rounded-lg px-4 py-3 bg-brand-dark flex items-center">
                <LoadingSpinner size="sm" />
             </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-brand-light-gray p-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask to generate code or find a tutorial..."
            className="w-full resize-none rounded-lg bg-brand-dark border border-brand-light-gray p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-brand-accent p-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;