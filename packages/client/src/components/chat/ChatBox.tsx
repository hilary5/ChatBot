import { postChat } from '@/lib/api';
import { useRef, useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Code, Lightbulb } from 'lucide-react';
import ChatInput, { type ChatFormData } from './ChatInput';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import TypingIndicator from './TypingIndicator';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

const EmptyState = ({ onSuggestionSelect }: { onSuggestionSelect: (text: string) => void }) => {
   const suggestions = [
      { icon: <Code size={20} />, text: 'Write a React hook for local storage', label: 'Code generation' },
      { icon: <MessageSquare size={20} />, text: 'Explain quantum computing to a 5-year-old', label: 'Simple explanation' },
      { icon: <Lightbulb size={20} />, text: 'Give me 5 ideas for a weekend project', label: 'Brainstorming' },
      { icon: <Sparkles size={20} />, text: 'Help me rewrite this email professionally', label: 'Writing assistant' }
   ];

   return (
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl mx-auto px-4 h-full">
         <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-6 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/20">
            <Sparkles size={32} />
         </div>
         <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">How can I help you today?</h2>
         <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
            I'm your AI assistant. Ask me anything, or try one of these suggestions below.
         </p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            {suggestions.map((suggestion, i) => (
               <button 
                  key={i}
                  onClick={() => onSuggestionSelect(suggestion.text)}
                  className="flex flex-col items-start p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
               >
                  <div className="text-gray-500 dark:text-gray-400 mb-2">{suggestion.icon}</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{suggestion.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{suggestion.label}</div>
               </button>
            ))}
         </div>
      </div>
   );
};

const ChatBox = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID());
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages, isBotTyping]);

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play().catch(e => console.log('Audio play failed:', e));

         const { data } = await postChat<ChatResponse>({
            prompt,
            conversationId: conversationId.current,
         });

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
         console.log(error);
         setError('Something went wrong. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   const handleSuggestionSelect = (text: string) => {
      onSubmit({ prompt: text });
   };

   return (
      <div className="flex flex-col h-full w-full relative">
         <div className="flex flex-col flex-1 overflow-y-auto w-full">
            <div className="w-full max-w-3xl mx-auto px-4 flex-1 flex flex-col pt-8 pb-32">
               {messages.length > 0 ? (
                  <>
                     <ChatMessages messages={messages} />
                     {isBotTyping && <div className="mt-4"><TypingIndicator /></div>}
                     {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
                     <div ref={messagesEndRef} />
                  </>
               ) : (
                  <EmptyState onSuggestionSelect={handleSuggestionSelect} />
               )}
            </div>
         </div>
         <div className="absolute bottom-0 left-0 right-0 w-full">
            <ChatInput onSubmit={onSubmit} />
         </div>
      </div>
   );
};

export default ChatBox;
