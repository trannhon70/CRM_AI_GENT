import type { FC } from "react";
import { MessageDirection, MessageType } from "../../../utils";
import { MdAttachFile } from "react-icons/md";

interface IProps {
    message?: any,
    isStaff?: any
}
const CardMessageReply: FC<IProps> = (props) => {
    const { message, isStaff } = props;

    const scrollToReply = () => {
        if (!message.reply_to_id) return;
        const el = document.getElementById(
            `message-${message.reply_to_id}`
        );
        if (!el) return;
        el.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        el.classList.add("reply-highlight");
        setTimeout(() => {
            el.classList.remove("reply-highlight");
        }, 2000);
    };

    const renderType = (value: string) => {
        switch (value) {
            case MessageType.TEXT:
                return message.reply_to.text
            case MessageType.IMAGE:
                return <div className="flex items-center gap-1" > File đính kèm <MdAttachFile /></div>;

            default:
                return <div className="flex items-center gap-1" > File đính kèm <MdAttachFile /></div>;
        }
    }
    return <div
        onClick={scrollToReply}
        className={`mb-1 max-w-full rounded-xl border-l-4 px-3 py-2 text-xs cursor-pointer
                                ${isStaff
                ? "bg-blue-700/20 border-blue-300 text-blue-100"
                : "bg-gray-100 border-gray-400 text-gray-600"
            }`}
    >
        <div className="font-semibold mb-1">
            {message.reply_to.direction === MessageDirection.STAFF ? "Trả lời tin nhắn của bạn" : "Trả lời tin nhắn của khách hàng"}
        </div>

        <div className="truncate">
            {renderType(message.reply_to.type)}
        </div>
    </div>
}

export default CardMessageReply