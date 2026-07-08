import type { FC } from "react";
import { MessageDirection } from "../../../utils";
import { BsEmojiSmile, BsReply } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { formatUnixTime } from "../../../utils/date";

type Props = {
    message: any;
};

const TextMessage: FC<Props> = ({ message }) => {
    const isStaff = message.direction === MessageDirection.STAFF;

    return (
        <div className={`group flex ${isStaff ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end gap-2">

                {/* Action bên trái khi hover */}
                {isStaff && (
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <BsEmojiSmile size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <BsReply size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <HiOutlineDotsHorizontal size={18} />
                        </button>
                    </div>
                )}

                <div className="flex flex-col">
                    {/* Bubble */}
                    <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm break-words  whitespace-pre-line
                        ${isStaff
                                ? "bg-[#0f447d] text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"
                            }`}
                    >
                        {message.text}
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
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <BsEmojiSmile size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <BsReply size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <HiOutlineDotsHorizontal size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextMessage;