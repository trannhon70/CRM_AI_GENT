import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import type { FC } from "react";
import { GrMail } from "react-icons/gr";

dayjs.extend(relativeTime);
dayjs.locale("vi");
interface IProps {
    item?: any,
}
const ConversationItem: FC<IProps> = (props) => {
    const { item } = props

    return <div className="p-2 hover:bg-gray-300 cursor-pointer flex items-center w-full bg-[#D2EBFF] gap-2">
        <Avatar src={item.avatar || undefined}>
            {item.full_name?.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex-1 min-w-0">
            <div className="truncate font-medium">
                {item.full_name}
            </div>

            <div className="truncate text-sm text-gray-500 mt-2">
                {item.lastMessage?.text}
            </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
            <div className="text-xs text-gray-500">{dayjs(item.last_message_at).fromNow()}</div>
            {
                item.unread_count > 0 && <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {item.unread_count > 9 ? "9+" : item.unread_count}
                </div>
            }

            <div>
                <GrMail color="#98A2B3" size={25} />
            </div>
        </div>
    </div>
}

export default ConversationItem