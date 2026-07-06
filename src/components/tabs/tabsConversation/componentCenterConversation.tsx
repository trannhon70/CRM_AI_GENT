import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useRef, type FC } from "react";
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
    const messages = useSelector((state: RootState) => state.message);
    const bottomRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages.data]);

    useEffect(() => {
        if (conversation.active) {
            dispatch(fetchPagingLivemessage({ pageIndex: 1, pageSize: 100, conversation_id: conversation.active?.id, search: "" }))
        }
    }, [conversation.active])

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

        <div className="flex-1 overflow-auto bg-[#E5DED8] p-3 flex flex-col gap-3">
            {messages.data.map((msg: any) => (
                <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.direction === MessageDirection.STAFF ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    {/* Avatar */}
                    <Avatar src={msg.direction !== MessageDirection.STAFF ? msg.conversation?.avatar : msg.user?.avatar}>
                        {msg.direction !== MessageDirection.STAFF ? msg.conversation?.full_name?.charAt(0).toUpperCase() : msg.user?.full_name?.charAt(0).toUpperCase()}
                    </Avatar>
                    {
                        renderMessageContent(msg)
                    }

                </div>
            ))}
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