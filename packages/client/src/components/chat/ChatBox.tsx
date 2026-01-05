import { api } from '@/lib/api';
import { useRef, useState } from 'react';
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

const ChatBox = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play();

         const { data } = await api.post<ChatResponse>(
            'https://chatbotservers.vercel.app/api/chat',
            {
               prompt,
               conversationId: conversationId.current,
            }
         );
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.log(error);
         setError('Something went wrong. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-screen max-w-2xl mx-auto">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            {<ChatMessages messages={messages} />}
            {isBotTyping && <TypingIndicator />}
            {error && <div className="text-red-500">{error}</div>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBox;
