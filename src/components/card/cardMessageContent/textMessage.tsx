import type { FC } from "react";
import { MessageDirection } from "../../../utils";

type Props = {
    message: any;
};

const TextMessage: FC<Props> = ({ message }) => {
    return (
        <div
            className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm
                            ${message.direction === MessageDirection.STAFF
                    ? 'bg-[#0f447d] text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
        >
            {message.text}
        </div>
    );
};

export default TextMessage;