import Tooltip from "@mui/material/Tooltip";
import type { FC } from "react";
import { BsReply } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { replyMessage } from "../../../features/liveMessageSlice";

interface IProps {
    message?: any
}
const CardHoverIconMessage: FC<IProps> = (props) => {
    const { message } = props
    const dispatch = useDispatch()

    const onClickIconReply = () => {
        dispatch(replyMessage(message))
    }

    return <div className="opacity-0 group-hover:opacity-100 transition flex gap-1 items-center">
        <Tooltip title="Trả lời">
            <button onClick={onClickIconReply} className="p-1 rounded-full hover:bg-gray-200 cursor-pointer">
                <BsReply size={16} />
            </button>
        </Tooltip>
        <button className="p-1 rounded-full hover:bg-gray-200 cursor-pointer">
            <HiOutlineDotsHorizontal size={18} />
        </button>
    </div>
}

export default CardHoverIconMessage