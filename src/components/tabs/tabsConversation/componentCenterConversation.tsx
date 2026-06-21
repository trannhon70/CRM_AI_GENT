import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type { FC } from "react";
import { IoIosLogOut } from "react-icons/io";
import { TiEyeOutline } from "react-icons/ti";
import { FaUserPlus } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { IoMailUnreadSharp } from "react-icons/io5";
import { BsLayoutSidebarReverse } from "react-icons/bs";

type Message = {
    id: number;
    text: string;
    isSender: boolean; // true = mình gửi, false = người dùng gửi
}

const messages: Message[] = [
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
    { id: 1, text: 'Xin chào bạn cần hỗ trợ gì?', isSender: false },
    { id: 2, text: 'Tôi muốn hỏi về sản phẩm', isSender: true },
    { id: 3, text: 'Vâng bạn cần hỗ trợ gì ạ?', isSender: false },
]

const ComponentCenterConversation: FC = () => {
    return <div className="h-full flex flex-col overflow-hidden">
        <div className="h-[7vh] p-2.5 box-border flex items-end justify-between border-b border-gray-200" >
            <div className="flex gap-2.5 items-center" >
                <Avatar  >N</Avatar>
                <div className="" >
                    <div className="text-sm font-medium text-black" > Kevin tran</div>
                    <div className="flex items-center gap-1" >
                        <TiEyeOutline />
                        <div>được xem bởi Kevin trần - 15:40 hôm qua</div>

                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1.5" >
                <Tooltip title="Phân công nhân viên">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><FaUserPlus size={16} color="#344054" /></div>
                </Tooltip>
                <Tooltip title="Tất cả hội thoại của người dùng này">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><TbListDetails size={16} color="#344054" /></div>
                </Tooltip>
                <Tooltip title="Đánh dấu chưa đọc">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><IoMailUnreadSharp size={16} color="#344054" /></div>
                </Tooltip>
                <Tooltip title="Thông tin hội thoại">
                    <div className="p-2 rounded bg-[#ECEDF4] hover:bg-[#b3b4bb] cursor-pointer" ><BsLayoutSidebarReverse size={16} color="#344054" /></div>
                </Tooltip>
            </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#E5DED8] p-3 flex flex-col gap-3">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.isSender ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    {/* Avatar */}
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {msg.isSender ? 'A' : 'N'}
                    </Avatar>

                    {/* Bubble */}
                    <div
                        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm
                            ${msg.isSender
                                ? 'bg-[#0f447d] text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none'
                            }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>

        <div className="h-[7vh]">
            <div className="border-t bg-white px-3 py-2 border-gray-200">
                <div className="flex items-end gap-2">
                    {/* Icon bên trái */}
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        😊
                    </button>

                    {/* Input */}
                    <div className="flex-1">
                        <textarea
                            rows={1}
                            placeholder="Aa"
                            className="
          w-full
          resize-none
          rounded-3xl
          bg-gray-100
          px-4
          py-2.5
          outline-none
          max-h-32
          overflow-y-auto
        "
                        />
                    </div>

                    {/* Gửi */}
                    <button className="p-2 text-blue-500 hover:bg-gray-100 rounded-full">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default ComponentCenterConversation