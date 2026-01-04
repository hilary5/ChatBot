import './App.css';
import { useEffect } from 'react';
import ChatBox from './components/chat/ChatBox';

function App() {
   useEffect(() => {
      const setVh = () => {
         document.documentElement.style.setProperty(
            '--vh',
            `${window.innerHeight * 0.01}px`
         );
      };
      setVh();
      window.addEventListener('resize', setVh);
      return () => window.removeEventListener('resize', setVh);
   }, []);

   return (
      <div
         className="p-4 w-full self-center mx-auto flex flex-col"
         style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
         <ChatBox />
      </div>
   );
}

export default App;
