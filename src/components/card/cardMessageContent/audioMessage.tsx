import type { FC } from "react";
import { MessageDirection } from "../../../utils";

type Props = {
    message: any;
};

const AudioMessage: FC<Props> = ({ message }) => {
    return (
        <div
            className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm
                                                    ${message.direction === MessageDirection.STAFF
                    ? 'bg-[#0f447d] text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
        >
            <audio controls>
                <source src={message.attachments?.[0]?.url} />
            </audio>
        </div>

    );
};

export default AudioMessage;