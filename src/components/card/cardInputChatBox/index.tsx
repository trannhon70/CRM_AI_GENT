import { Popover } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { useRef, type FC } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { MdAttachFile, MdInsertEmoticon } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { messageAPI } from '../../../apis/message.api';
import type { RootState } from '../../../redux/store';
import { SENDER_TYPE } from '../../../utils';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 10MB
interface IProps {
    sendMessage?: any;
    conversation?: any;
    noti?: number | undefined,
}
const CardInputChatBox: FC<IProps> = (props) => {
    const { sendMessage, conversation, noti } = props
    const divRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const savedRange = useRef<Range | null>(null);
    const users = useSelector((state: RootState) => state.users);


    const handleClickFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (file.size > MAX_FILE_SIZE) {
                toast.warning("Kích thước file vượt quá 20MB. Vui lòng chọn file nhỏ hơn.");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('senderType', SENDER_TYPE.STAFF);
            formData.append('userId', users?.user?.id);
            formData.append('idComputer', conversation.idComputer);
            formData.append('gclid', conversation.gclid);
            await messageAPI.uploadFile(formData)
        }
    };

    const handleOnBlur = async () => {
        const body = {
            conversationId: conversation.id,
            idComputer: conversation.idComputer,
            gclid: conversation.gclid,
            status: false,
            senderType: SENDER_TYPE.STAFF
        }
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRange.current = sel.getRangeAt(0);
        }
    };

    const onEmojiClick = (event: any) => {
        const emoji = event.emoji;
        const sel = window.getSelection();
        if (savedRange.current) {
            sel?.removeAllRanges();
            sel?.addRange(savedRange.current);
        }
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(emoji);
            range.insertNode(textNode);
            // di chuyển con trỏ sau emoji vừa chèn
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);
            // update lại savedRange
            savedRange.current = sel.getRangeAt(0);
        } else if (divRef.current) {
            divRef.current.innerHTML += emoji;
        }
        divRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    const handleSendMessage = () => {
        if (divRef.current) {
            sendMessage({
                senderType: SENDER_TYPE.STAFF,
                content: divRef.current.innerHTML,
                userId: users?.user?.id,
                idComputer: conversation.idComputer,
                gclid: conversation.gclid,
            })
            divRef.current.innerHTML = '';
        }
    };

    const saveSelection = async () => {
        if (noti !== undefined && noti > 0) {
            const body = {
                conversationId: conversation.id,
                gclid: conversation.gclid,
                senderType: SENDER_TYPE.CUSTOMER
            }
            await messageAPI.updateStatus(body);
        }
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRange.current = sel.getRangeAt(0);
        }
    };



    return <div className='relative' >

        <div className="absolute top-[-15px] left-[7px] flex items-center space-x-2 text-sm text-orange-500 ">
            <span>Đang soạn tin nhắn trên  </span>
            <div className="flex space-x-1">
                <span className="typing-dot w-[6px] h-[6px] rounded-full bg-orange-500 inline-block"></span>
                <span className="typing-dot w-[6px] h-[6px] rounded-full bg-orange-500 inline-block"></span>
                <span className="typing-dot w-[6px] h-[6px] rounded-full bg-orange-500 inline-block"></span>
            </div>
        </div>



        <div
            dangerouslySetInnerHTML={{ __html: 'check.text' }}
            className="absolute bottom-full left-[7px] mb-4 p-1 bg-red-500/90 text-white text-sm max-w-[400px] max-h-[100px] overflow-y-auto flex flex-col-reverse"
        />

        <div className="bg-white h-[7vh]" >
            <div className={`flex items-center transition-all duration-200 `}>
                <div

                    ref={divRef}
                    suppressContentEditableWarning={true}
                    onBlur={handleOnBlur}
                    onKeyDown={handleKeyDown}
                    // onKeyUp={saveSelection}
                    // onMouseUp={saveSelection}
                    // onInput={saveSelection}
                    className="border-gray-200 border w-[70%] h-[64px] p-[5px] overflow-auto focus:outline-green-600 focus:outline-2 focus:outline-offset-[-1px]"
                    style={{ borderBottomLeftRadius: "3px" }}
                />
                <Popover
                    content={<EmojiPicker width={300} height={400} onEmojiClick={onEmojiClick} />}
                    trigger="click"
                >
                    <div className="border-gray-200 border w-[10%] h-[64px] flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-600 cursor-pointer">
                        <MdInsertEmoticon size={25} />
                    </div>
                </Popover>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/*,audio/mp3,video/mp4"
                />
                <div
                    className="border-gray-200 border w-[10%] h-[64px] flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-600 cursor-pointer"
                    onClick={handleClickFile}
                >
                    <MdAttachFile size={22} />
                </div>
                <div
                    className="border-gray-200 border w-[10%] h-[64px] flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-600 cursor-pointer"
                    style={{ borderBottomRightRadius: "3px" }}
                    onClick={handleSendMessage}
                >
                    <LuSendHorizontal size={25} />
                </div>
            </div>
        </div>
    </div>
}

export default CardInputChatBox