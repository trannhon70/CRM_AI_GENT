import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FC } from "react";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { IoMailUnreadSharp } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { TiEyeOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { fetchPagingLivemessage, sendMessage, updateMessage } from "../../../features/liveMessageSlice";
import type { AppDispatch, RootState } from "../../../redux/store";
import { MessageDirection, MessageType } from "../../../utils";
import TextMessage from "../../card/cardMessageContent/textMessage";
import VideoMessage from "../../card/cardMessageContent/videoMessage";
import ImageMessage from "../../card/cardMessageContent/imageMessage";
import AudioMessage from "../../card/cardMessageContent/audioMessage";
import dayjs from "dayjs";
import { LiveMessageAPI } from "../../../apis/liveMessage.api";


const ComponentCenterConversation: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const conversation = useSelector((state: RootState) => state.conversation);
    const { data: messages, limit, pageIndex, hasMore } = useSelector((state: RootState) => state.message);
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isLoadMoreRef = useRef(false);
    const previousScrollHeight = useRef(0);
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (!conversation.active?.id) return;
        dispatch(fetchPagingLivemessage({ pageIndex: 1, limit: 100, conversation_id: conversation.active.id, search: "", }));
    }, [conversation.active?.id, dispatch]);

    const renderMessageContent = (msg: any) => {
        switch (msg.type) {
            case MessageType.TEXT:
                return <TextMessage message={msg} />;
            case MessageType.IMAGE:
                return <ImageMessage message={msg} />;

            case MessageType.VIDEO:
                return <VideoMessage message={msg} />;

            case MessageType.AUDIO:
                return <AudioMessage message={msg} />;

            // case MessageType.STICKER:
            //     return <StickerMessage message={msg} />;

            default:
                return null;
        }
    };

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        if (el.scrollTop === 0 && hasMore) {
            previousScrollHeight.current = el.scrollHeight;
            isLoadMoreRef.current = true;
            dispatch(fetchPagingLivemessage({ pageIndex: pageIndex + 1, limit, conversation_id: conversation.active?.id, search: "", }));
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll);
        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, [pageIndex, hasMore]);

    //Sau khi messages thay đổi sẽ scroll xuống cuối, trừ khi đang load thêm tin nhắn cũ
    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        if (isLoadMoreRef.current) {
            const newScrollHeight = el.scrollHeight;
            el.scrollTop += newScrollHeight - previousScrollHeight.current;
            isLoadMoreRef.current = false;
        } else {
            bottomRef.current?.scrollIntoView({
                behavior: "auto",
                block: "end",
            });
        }
    }, [messages]);

    const messageElements = useMemo(() => {
        return messages.map((msg: any, index: number) => {
            const prev = messages[index - 1];
            const showDate = !prev || !dayjs.unix(prev.sent_at).isSame(dayjs.unix(msg.sent_at), "day");

            return (
                <div key={msg.id}>
                    {showDate && (
                        <div className="flex justify-center my-4">
                            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {dayjs.unix(msg.sent_at).format("hh:mm:ss DD/MM/YYYY")}
                            </div>
                        </div>
                    )}

                    <div
                        className={`flex items-end gap-2 ${msg.direction === MessageDirection.STAFF
                            ? "flex-row-reverse"
                            : "flex-row"
                            }`}
                    >
                        <Avatar
                            src={
                                msg.direction !== MessageDirection.STAFF
                                    ? msg.conversation?.avatar
                                    : msg.user?.avatar
                            }
                        >
                            {msg.direction !== MessageDirection.STAFF
                                ? msg.conversation?.full_name?.charAt(0).toUpperCase()
                                : msg.user?.full_name?.charAt(0).toUpperCase()}
                        </Avatar>

                        {renderMessageContent(msg)}
                    </div>
                </div>
            );
        });
    }, [messages]);



    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (!text.trim()) return;
            const body = {
                id: Date.now().toString(),
                page_id: conversation.active.page_id,
                customer_id: conversation.active.customer_id,
                conversation_id: conversation.active.id,
                type: MessageType.TEXT,
                text: text,
                direction: MessageDirection.STAFF,
                sent_at: Math.floor(Date.now() / 1000),
            };
            dispatch(sendMessage(body));
            LiveMessageAPI.sendMessage(body).then((_response: any) => {
                setText("");
            }).catch((error) => {
                console.error("Error sending message:", error);
                setText("");
            });

        }
    };

    return <div className="h-full flex flex-col overflow-hidden">
        <div className="h-[7vh] p-2.5 box-border flex items-end justify-between border-b border-gray-200" >
            <div className="flex gap-2.5 items-center" >
                <Avatar src={conversation.active?.avatar || undefined}>
                    {conversation.active?.full_name?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="" >
                    <div className="text-sm font-medium text-black" > {conversation.active?.full_name}</div>
                    <div className="flex items-center gap-1" >
                        <TiEyeOutline />
                        <div>được xem bởi {conversation.active?.full_name} - {dayjs.unix(conversation.active?.last_message_at ? conversation.active.last_message_at : conversation.active.updated_at).fromNow()}</div>

                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1.5" >
                <Tooltip title="Phân công nhân viên">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><FaUserPlus size={16} color="#344054" /></div>
                </Tooltip>
                <Tooltip title="Tất cả hội thoại của người dùng này">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><TbListDetails size={16} color="#344054" /></div>
                </Tooltip>
                <Tooltip title="Đánh dấu chưa đọc">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><IoMailUnreadSharp size={16} color="#344054" /></div>
                </Tooltip>
                <Tooltip title="Thông tin hội thoại">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><BsLayoutSidebarReverse size={16} color="#344054" /></div>
                </Tooltip>
            </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-auto bg-[#E5DED8] p-3 flex flex-col gap-3">
            {messageElements}
            <div ref={bottomRef} />
        </div>

        <div className="h-[8vh]">
            <div className="border-t border-gray-200 bg-white p-3">
                <div className="flex items-end gap-2 rounded-3xl border border-gray-300 bg-white px-3 py-2 shadow-sm">

                    {/* Emoji */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100"
                    >
                        😊
                    </button>

                    {/* Input */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        rows={1}
                        className="max-h-36 flex-1 resize-none overflow-y-auto bg-transparent py-2 text-[15px] outline-none placeholder:text-gray-400"
                    />

                    {/* Upload */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                    >
                        📎
                    </button>

                    {/* Image */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                    >
                        🖼️
                    </button>

                    {/* Send */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600"
                    >
                        ➤
                    </button>

                </div>
            </div>
        </div>
    </div>
}

export default ComponentCenterConversation