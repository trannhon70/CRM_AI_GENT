import Avatar from "@mui/material/Avatar";
import type { FC } from "react";
import { GrMail } from "react-icons/gr";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { setActiveConversation } from "../../../features/conversationSlice";
import dayjs from "dayjs";
import { conversationAPI } from "../../../apis/conversation.api";
import { MessageType } from "../../../utils";
import { FaImage } from "react-icons/fa";
import { PiFileAudioLight } from "react-icons/pi";
import { FcVideoCall } from "react-icons/fc";
import { Chip } from "@mui/material";
import { getContrastTextColor } from "../../../utils/color";
interface IProps {
    item?: any,
}
const ConversationItem: FC<IProps> = (props) => {
    const { item } = props
    const dispatch = useDispatch<AppDispatch>();
    const { setStorage } = useLocalStorage<string | null>("conversationId", null);
    const conversation = useSelector((state: RootState) => state.conversation);


    const onclickItem = async () => {
        dispatch(setActiveConversation(item))
        setStorage(String(item.id));
        if (item.unread_count > 0) {
            await conversationAPI.updateUnreadCount({ conversation_id: item.id, unread_count: 0, page_id: item.page_id });
        }
    }

    const renderType = (value: any) => {
        switch (value) {
            case MessageType.TEXT:
                return <div>{item.lastMessage?.text}</div>
            case MessageType.IMAGE:
                return <div className="flex items-center gap-1" > <FaImage size={20} /> hình ảnh</div>
            case MessageType.AUDIO:
                return <div className="flex items-center gap-1" > <PiFileAudioLight size={20} /> âm thanh</div>
            case MessageType.VIDEO:
                return <div className="flex items-center gap-1" > <FcVideoCall size={20} /> video</div>
            default:
                return <div>{item.lastMessage?.text}</div>
        }
    }
    return <div
        onClick={onclickItem}
        className={` w-full h-[80px] px-3 flex items-center gap-3 cursor-pointer overflow-hidden transition-colors hover:bg-gray-100
        ${Number(conversation.active?.id) === item.id ? "bg-[#D2EBFF]" : ""}`}>
        <div className="flex-shrink-0">
            <Avatar src={item.avatar || undefined} sx={{ width: 42, height: 42 }} >
                {item.full_name?.charAt(0).toUpperCase()}
            </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 h-full flex flex-col justify-center overflow-hidden">
            <div className="truncate font-medium text-sm"> {item.full_name} </div>
            <div className="truncate text-sm text-gray-500"> {renderType(item.lastMessage?.type)} </div>
            <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                {item.labels?.map((label: any) => (
                    <Chip key={label.id} variant="filled" label={label.name} size="small"
                        sx={{
                            height: 20, maxWidth: 100, flexShrink: 0, color: getContrastTextColor(label.color), bgcolor: label.color,
                            "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            },
                        }}
                    />
                ))}
            </div>
        </div>

        <div className="w-[55px] h-full flex-shrink-0 flex flex-col items-end justify-between py-1">
            <div className="text-[11px] text-gray-400 whitespace-nowrap">
                {dayjs.unix(item.last_message_at || item.updated_at).fromNow()}
            </div>
            <div className="h-5 flex items-center">
                {item.unread_count > 0 && (
                    <div className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
                        {item.unread_count > 9 ? "9+" : item.unread_count}
                    </div>
                )}
            </div>

            <GrMail color="#98A2B3" size={20} />
        </div>
    </div>
}

export default ConversationItem