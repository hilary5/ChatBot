import { Menu, Plus, MessageSquare } from 'lucide-react';

type SidebarProps = {
   isOpen: boolean;
   onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
   return (
      <>
         {/* Mobile overlay */}
         {isOpen && (
            <div 
               className="fixed inset-0 bg-black/50 z-40 md:hidden" 
               onClick={onToggle}
            />
         )}
         
         {/* Sidebar container */}
         <div
            className={`fixed md:inset-y-0 md:left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
               isOpen ? 'translate-x-0 inset-y-0 left-0' : '-translate-x-full'
            }`}
         >
            <div className="flex flex-col h-full p-4 gap-4">
               <div className="flex items-center justify-between md:hidden">
                  <span className="font-semibold text-lg">Menu</span>
                  <button onClick={onToggle} className="p-2 hover:bg-gray-800 rounded-md">
                     <Menu size={20} />
                  </button>
               </div>
               
               <button className="flex items-center gap-2 p-3 text-sm font-medium border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors w-full">
                  <Plus size={16} />
                  New Chat
               </button>

               <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-2">
                  <div className="text-xs font-semibold text-gray-400 mb-2 px-2">Recent Chats</div>
                  {/* Placeholder history items */}
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md w-full text-left truncate">
                     <MessageSquare size={16} />
                     What is the meaning of life?
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md w-full text-left truncate">
                     <MessageSquare size={16} />
                     React vs Vue for 2026 apps
                  </button>
               </div>

               <div className="mt-auto pt-4 border-t border-gray-800 text-sm text-gray-400 text-center">
                  ChatBot v2.0
               </div>
            </div>
         </div>
      </>
   );
};

export default Sidebar;
