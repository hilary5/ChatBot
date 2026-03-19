import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Copy, Check, Bot, User } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export type Message = {
   content: string;
   role: 'user' | 'bot';
};

type Props = {
   messages: Message[];
};

const CopyButton = ({ text }: { text: string }) => {
   const [copied, setCopied] = useState(false);

   const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <button 
         onClick={handleCopy}
         className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all shadow-sm"
         title="Copy message"
      >
         {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      </button>
   );
};

const ChatMessages = ({ messages }: Props) => {
   return (
      <div className="flex flex-col gap-6">
         {messages.map((message, index) => (
            <motion.div
               key={index}
               initial={{ opacity: 0, y: 10, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  message.role === 'user' 
                     ? 'bg-blue-600 text-white' 
                     : 'bg-emerald-500 text-white'
               }`}>
                  {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
               </div>
               
               <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                     className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base ${
                        message.role === 'user' 
                           ? 'bg-blue-600 text-white rounded-tr-sm' 
                           : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                     }`}
                  >
                     <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                           code({node, inline, className, children, ...props}: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                 <div className="rounded-md overflow-hidden my-2 border border-gray-200 dark:border-gray-700 text-sm">
                                    <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 border-b border-gray-200 dark:border-gray-700">
                                       <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{match[1]}</span>
                                       <CopyButton text={String(children).replace(/\n$/, '')} />
                                    </div>
                                    <SyntaxHighlighter
                                       {...props}
                                       // @ts-ignore
                                       style={vscDarkPlus}
                                       language={match[1]}
                                       PreTag="div"
                                       customStyle={{ margin: 0, borderRadius: 0, padding: '1rem' }}
                                    >
                                       {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                 </div>
                              ) : (
                                 <code {...props} className={`${className} bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-[0.9em]`}>
                                    {children}
                                 </code>
                              );
                           },
                           p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                           ul: ({children}) => <ul className="list-disc ml-5 mb-2 flex flex-col gap-1">{children}</ul>,
                           ol: ({children}) => <ol className="list-decimal ml-5 mb-2 flex flex-col gap-1">{children}</ol>,
                           li: ({children}) => <li>{children}</li>,
                           a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>,
                        }}
                     >
                        {message.content}
                     </ReactMarkdown>
                  </div>
                  {message.role === 'bot' && (
                     <div className="flex gap-2 mt-1 px-1">
                        <CopyButton text={message.content} />
                     </div>
                  )}
               </div>
            </motion.div>
         ))}
      </div>
   );
};

export default ChatMessages;
