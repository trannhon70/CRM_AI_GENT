import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type { FC } from "react";
import { BiSolidShare } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { deleteReplyMessage } from "../../../features/liveMessageSlice";
import type { RootState } from "../../../redux/store";
import { MessageDirection, MessageType } from "../../../utils";
import { MdAttachFile } from "react-icons/md";

interface IProps {

}
const CardInputChatReply: FC<IProps> = (props) => {
    const { } = props
    const { reply } = useSelector((state: RootState) => state.message);
    const dispatch = useDispatch()
    const onClickDeleteReply = () => {
        dispatch(deleteReplyMessage(null))
    }
    return <div className="flex items-start gap-3 w-full rounded-xl bg-gray-50 p-2 border border-gray-200 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
            <BiSolidShare size={18} />
        </div>

        <div className="flex-1 min-w-0">
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-3 py-2">
                <p> {reply.direction === MessageDirection.CUSTOMER ? "Trả lời tin nhắn của khách hàng" : "Trả lời tin nhắn của bạn"}</p>
                {
                    reply.type === MessageType.TEXT ?
                        <p className="line-clamp-2 text-sm text-gray-700 leading-5 break-words">
                            {reply.text}
                        </p> :
                        <div className="flex items-center gap-1" > File đính kèm <MdAttachFile /></div>
                }

            </div>
        </div>

        <Tooltip title="Xóa">
            <IconButton
                size="small"
                color="error"
                className="!self-start"
                onClick={onClickDeleteReply}
            >
                <GrClose size={14} />
            </IconButton>
        </Tooltip>
    </div>
}

export default CardInputChatReply