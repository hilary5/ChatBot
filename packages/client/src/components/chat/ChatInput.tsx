import { type KeyboardEvent, useRef } from 'react';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, watch } = useForm<ChatFormData>();
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const { ref, ...rest } = register('prompt', {
      required: true,
      validate: (data) => data.trim().length > 0,
   });
   const promptValue = watch('prompt');

   const submit = handleSubmit((data) => {
      reset({ prompt: '' });
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
      }
      onSubmit(data);
   });

   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };

   const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.height = 'auto';
      e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 200)}px`;
   };

   return (
      <div className="px-4 pb-4 bg-white dark:bg-gray-950 sticky bottom-0 z-10">
         <div className="max-w-3xl mx-auto relative">
            <form
               onSubmit={submit}
               className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-blue-500/50 p-2 pl-4 rounded-3xl transition-shadow"
            >
               <textarea
                  {...rest}
                  ref={(e) => {
                     ref(e);
                     // @ts-ignore
                     textareaRef.current = e;
                  }}
                  onKeyDown={handleKeyDown}
                  onInput={handleInput}
                  autoFocus
                  rows={1}
                  className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 max-h-[200px] overflow-y-auto"
                  placeholder="Ask anything..."
                  maxLength={2000}
               />
               <Button 
                  disabled={!promptValue?.trim()} 
                  className={`rounded-full w-10 h-10 flex-shrink-0 transition-all ${
                     promptValue?.trim() 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                  }`}
               >
                  <FaArrowUp />
               </Button>
            </form>
            <div className="text-center mt-2 text-xs text-gray-400">
               ChatBot can make mistakes. Consider verifying important information.
            </div>
         </div>
      </div>
   );
};

export default ChatInput;
