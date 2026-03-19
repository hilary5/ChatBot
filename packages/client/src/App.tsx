import './App.css';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import ChatBox from './components/chat/ChatBox';
import Sidebar from './components/layout/Sidebar';

function App() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   return (
      <div className="flex h-screen w-full bg-white dark:bg-gray-950 overflow-hidden">
         <Sidebar 
            isOpen={isSidebarOpen} 
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
         />
         
         <div className="flex-1 flex flex-col min-w-0">
            {/* Top Navigation for mobile */}
            <div className="md:hidden flex items-center p-4 border-b">
               <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
               >
                  <Menu size={24} />
               </button>
               <h1 className="ml-4 font-semibold text-lg text-gray-800 dark:text-gray-200">ChatBot</h1>
            </div>

            <main className="flex-1 overflow-hidden p-4">
               <ChatBox />
            </main>
         </div>
      </div>
   );
}
export default App;
