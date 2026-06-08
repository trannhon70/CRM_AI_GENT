import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from './chatSocketSingleton';

type UseChatSocketProps = {
  onNewMessage?: (message: any) => void;

};

export const useChatSocket = ({ onNewMessage }: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('🔌 Đã kết nối socket thành công!');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Đã ngắt kết nối socket');
      setIsConnected(false);
    };

    const handleNewMessage = (message: any) => {
      // console.log('📩 New message:', message);
      onNewMessage?.(message);
    };



    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('send_message', handleNewMessage);


    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('send_message', handleNewMessage);

    };
  }, []);

  const sendMessage = (data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data);
    }
  };



  return {
    sendMessage,
    socket: socketRef.current,
    isConnected,
  };
};

