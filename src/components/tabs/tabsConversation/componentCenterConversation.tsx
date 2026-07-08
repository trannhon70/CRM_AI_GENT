import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { IoMailUnreadSharp } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { TiEyeOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { fetchPagingLivemessage } from "../../../features/liveMessageSlice";
import type { AppDispatch, RootState } from "../../../redux/store";
import { MessageDirection, MessageType } from "../../../utils";
import TextMessage from "../../card/cardMessageContent/textMessage";
import VideoMessage from "../../card/cardMessageContent/videoMessage";
import ImageMessage from "../../card/cardMessageContent/imageMessage";
import AudioMessage from "../../card/cardMessageContent/audioMessage";
import dayjs from "dayjs";


const ComponentCenterConversation: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const conversation = useSelector((state: RootState) => state.conversation);
    const { data: messages, limit, pageIndex, hasMore } = useSelector((state: RootState) => state.message);
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!conversation.active?.id) return;
        dispatch(fetchPagingLivemessage({ pageIndex: 1, limit: 20, conversation_id: conversation.active.id, search: "", }));
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

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        // Load lần đầu hoặc có tin nhắn mới
        bottomRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
        });
    }, [hasMore]);


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

        <div className="h-[7vh]">
            <div className="border-t bg-white px-3 py-2 border-gray-200">
                <div className="flex items-end gap-2">
                    {/* Icon bên trái */}
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        😊
                    </button>

                    {/* Input */}
                    <div className="flex-1">
                        <textarea
                            rows={1}
                            placeholder="Aa"
                            className=" w-full resize-none rounded-3xlbg-gray-100 px-4 py-2.5 outline-none max-h-32 overflow-y-auto"
                        />
                    </div>

                    {/* Gửi */}
                    <button className="p-2 text-blue-500 hover:bg-gray-100 rounded-full">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default ComponentCenterConversation