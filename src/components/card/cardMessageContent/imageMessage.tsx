import type { FC } from "react";
import { MessageDirection } from "../../../utils";
import { BsEmojiSmile, BsReply } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { formatUnixTime } from "../../../utils/date";
import CardMessageReply from "../cardMessageReply";
import CardHoverIconMessage from "../cardHoverIconMessage";

type Props = {
    message: any;
};

const ImageMessage: FC<Props> = ({ message }) => {
    const isStaff = message.direction === MessageDirection.STAFF;
    const attachment = message.attachments?.[0];
    const image =
        attachment?.preview_url ??
        attachment?.url;
    return (
        <div id={`message-${message.facebook_mid}`} className={`group flex ${isStaff ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end gap-2">

                {/* Action bên trái khi hover */}
                {isStaff && (
                    <CardHoverIconMessage message={message} />
                )}

                <div className="flex flex-col w-full">
                    {message.reply_to && (
                        <CardMessageReply message={message} isStaff={isStaff} />
                    )}

                    {/* Bubble */}
                    <div
                        className={`max-w-[100%] rounded-2xl px-3 py-2 text-sm break-words  whitespace-pre-line
                                ${isStaff
                                ? "bg-[#0f447d] text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"
                            }`}
                    >
                        <img
                            src={image}
                            className="max-w-[250px] rounded-xl"
                        />
                    </div>

                    {/* Thời gian */}
                    <span
                        className={`text-[11px] text-gray-500 mt-1 ${isStaff ? "text-right mr-2" : "ml-2"
                            }`}
                    >
                        {formatUnixTime(message.sent_at)}
                    </span>
                </div>

                {/* Action bên phải khi hover */}
                {!isStaff && (
                    <CardHoverIconMessage message={message} />
                )}
            </div>
        </div>
    );
};

export default ImageMessage;