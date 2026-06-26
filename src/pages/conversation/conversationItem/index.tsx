import Avatar from "@mui/material/Avatar";
import type { FC } from "react";
import { GrMail } from "react-icons/gr";

const ConversationItem: FC = () => {
    return <div className="p-2 hover:bg-gray-300 cursor-pointer flex items-center w-full bg-[#D2EBFF] gap-2">
        <Avatar  >N</Avatar>

        <div className="flex-1 min-w-0">
            <div className="truncate font-medium">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
                reiciendis maiores voluptatem rerum excepturi enim ipsam dolore eos
                tenetur.
            </div>

            <div className="truncate text-sm text-gray-500 mt-2">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
                reiciendis maiores voluptatem rerum excepturi enim ipsam dolore eos
                tenetur.
            </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
            <div className="text-xs text-gray-500">09:06</div>

            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                9+
            </div>
            <div>
                <GrMail color="#98A2B3" size={25} />
            </div>
        </div>
    </div>
}

export default ConversationItem