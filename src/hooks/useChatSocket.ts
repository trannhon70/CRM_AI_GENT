import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from './chatSocketSingleton';

type UseChatSocketProps = {
  onNewMessage?: (message: any) => void;
  onSyncStatus?: (message: any) => void;
  roomId: string;
};

export const useChatSocket = ({
  onNewMessage,
  onSyncStatus,
  roomId,
}: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const prevRoomRef = useRef<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 1. INIT SOCKET + LISTEN EVENTS (chỉ chạy 1 lần)
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('🔌 Connected');
      setIsConnected(true);
      socket.emit('joinRoom', roomId);
      prevRoomRef.current = roomId;
    };

    const handleDisconnect = () => {
      console.log('❌ Disconnected');
      setIsConnected(false);
    };

    const handleNewMessage = (message: any) => {
      onNewMessage?.(message);
    };

    const handleSyncStatus = (message: any) => {
      onSyncStatus?.(message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('send_message', handleNewMessage);
    socket.on('syncStatus', handleSyncStatus);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('send_message', handleNewMessage);
      socket.off('syncStatus', handleSyncStatus);
    };
  }, []);

  // 2. HANDLE ROOM CHANGE (QUAN TRỌNG NHẤT)
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    // leave room cũ
    if (prevRoomRef.current) {
      socket.emit('leaveRoom', prevRoomRef.current);
    }

    // join room mới
    socket.emit('joinRoom', roomId);
    prevRoomRef.current = roomId;
  }, [roomId, isConnected]);

  // 3. SEND MESSAGE
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