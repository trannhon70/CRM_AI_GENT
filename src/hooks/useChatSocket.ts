import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from './chatSocketSingleton';

type UseChatSocketProps = {
  roomId: string;
  onNewMessage?: (message: any) => void;
  onSyncStatus?: (message: any) => void;
};

export const useChatSocket = ({
  roomId,
  onNewMessage,
  onSyncStatus,
}: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const currentRoomRef = useRef<string | null>(null);
  const pendingRoomRef = useRef<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  // INIT SOCKET (CHỈ 1 LẦN)
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    // CONNECT
    const handleConnect = () => {
      console.log('🔌 Connected:', socket.id);
      setIsConnected(true);

      // join room nếu đã có pending
      const roomToJoin = pendingRoomRef.current;
      if (roomToJoin) {
        socket.emit('joinRoom', roomToJoin);
        currentRoomRef.current = roomToJoin;
      }
    };

    // DISCONNECT
    const handleDisconnect = () => {
      console.log('❌ Disconnected');
      setIsConnected(false);
    };

    // EVENTS
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
  }, [onNewMessage, onSyncStatus]);

  // HANDLE ROOM CHANGE
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // lưu room mới vào pending
    pendingRoomRef.current = roomId;

    // nếu chưa connect → chờ connect rồi join
    if (!isConnected) return;

    // leave room cũ
    if (currentRoomRef.current && currentRoomRef.current !== roomId) {
      socket.emit('leaveRoom', currentRoomRef.current);
    }

    // join room mới
    socket.emit('joinRoom', roomId);

    currentRoomRef.current = roomId;
  }, [roomId, isConnected]);

  // SEND MESSAGE
  const sendMessage = (data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
  };
};