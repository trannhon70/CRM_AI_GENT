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
        className={`p-2 hover:bg-gray-300 cursor-pointer flex items-center w-full gap-2 ${Number(conversation.active?.id) === item.id ? "bg-[#D2EBFF]" : ""} `}
    >
        <Avatar src={item.avatar || undefined}>
            {item.full_name?.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex-1 min-w-0">
            <div className="truncate font-medium">
                {item.full_name}
            </div>

            <div className="truncate text-sm text-gray-500 mt-2 ">
                {
                    renderType(item.lastMessage?.type)
                }
            </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
            <div className="text-xs text-gray-500">{dayjs.unix(item.last_message_at ? item.last_message_at : item.updated_at).fromNow()}</div>
            <div className="h-5" >
                {
                    item.unread_count > 0 && <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {item.unread_count > 9 ? "9+" : item.unread_count}
                    </div>
                }
            </div>

            <div>
                <GrMail color="#98A2B3" size={25} />
            </div>
        </div>
    </div>
}

export default ConversationItem