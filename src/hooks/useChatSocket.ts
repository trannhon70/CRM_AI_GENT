import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from './chatSocketSingleton';

type UseChatSocketProps = {
  pageId: string;
  conversationId?: string;
  onNewMessage?: (message: any) => void;
  onSyncStatus?: (message: any) => void;
};

export const useChatSocket = ({
  pageId,
  conversationId,
  onNewMessage,
  onSyncStatus,
}: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  const currentPageRoomRef = useRef<string | null>(null);
  const currentConversationRoomRef = useRef<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  // ===========================
  // INIT SOCKET (1 lần)
  // ===========================
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('🔌 Connected:', socket.id);
      setIsConnected(true);

      // Join lại page room
      if (pageId) {
        const room = `page:${pageId}`;
        socket.emit('joinRoom', room);
        currentPageRoomRef.current = room;
      }

      // Join lại conversation room
      if (conversationId) {
        const room = `conversation:${conversationId}`;
        socket.emit('joinRoom', room);
        currentConversationRoomRef.current = room;
      }
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

    // Nếu socket đã connect trước khi hook mount
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('send_message', handleNewMessage);
      socket.off('syncStatus', handleSyncStatus);
    };
  }, [onNewMessage, onSyncStatus]);

  // ===========================
  // PAGE ROOM
  // ===========================
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected || !pageId) return;

    const newRoom = `page:${pageId}`;

    if (
      currentPageRoomRef.current &&
      currentPageRoomRef.current !== newRoom
    ) {
      socket.emit('leaveRoom', currentPageRoomRef.current);
    }

    if (currentPageRoomRef.current !== newRoom) {
      socket.emit('joinRoom', newRoom);
      currentPageRoomRef.current = newRoom;
    }
  }, [pageId, isConnected]);

  // ===========================
  // CONVERSATION ROOM
  // ===========================
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    // Không mở conversation nào
    if (!conversationId) {
      if (currentConversationRoomRef.current) {
        socket.emit('leaveRoom', currentConversationRoomRef.current);
        currentConversationRoomRef.current = null;
      }
      return;
    }

    const newRoom = `conversation:${conversationId}`;

    if (
      currentConversationRoomRef.current &&
      currentConversationRoomRef.current !== newRoom
    ) {
      socket.emit('leaveRoom', currentConversationRoomRef.current);
    }

    if (currentConversationRoomRef.current !== newRoom) {
      socket.emit('joinRoom', newRoom);
      currentConversationRoomRef.current = newRoom;
    }
  }, [conversationId, isConnected]);

  // ===========================
  // SEND MESSAGE
  // ===========================
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