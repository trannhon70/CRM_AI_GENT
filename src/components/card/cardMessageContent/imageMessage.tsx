import type { FC } from "react";
import { MessageDirection } from "../../../utils";

type Props = {
    message: any;
};

const ImageMessage: FC<Props> = ({ message }) => {

    const attachment = message.attachments?.[0];
    const image =
        attachment?.preview_url ??
        attachment?.url;
    return (
        <div
            className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm
                                    ${message.direction === MessageDirection.STAFF
                    ? 'bg-[#0f447d] text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
        >
            <img
                src={image}
                className="max-w-[250px] rounded-xl"
            />
        </div>

    );
};

export default ImageMessage;