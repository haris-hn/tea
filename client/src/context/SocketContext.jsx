import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const isProd = import.meta.env.PROD;
      const socketUrl = isProd 
        ? (import.meta.env.VITE_NEST_API_URL || "https://focused-presence-production-e1f3.up.railway.app") 
        : "http://localhost:5001";

      const newSocket = io(socketUrl, {
        query: { userId: user._id }
      });

      const playSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio playback failed:', e));
      };

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('new_review', (data) => {
        playSound();
        toast.success(data.message, {
          duration: 5000,
          position: 'top-right',
        });
      });

      newSocket.on('new_reply', (data) => {
        playSound();
        toast.success(data.message, {
          duration: 5000,
          position: 'top-right',
          icon: '💬',
        });
      });

      newSocket.on('new_like', (data) => {
        playSound();
        toast.success(data.message, {
          duration: 5000,
          position: 'top-right',
          icon: '❤️',
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
