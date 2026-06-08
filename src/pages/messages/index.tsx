import { Fragment, useCallback, useEffect, useState, type FC } from "react";
import ComponentCardOnlineVisitors from "../../components/card/cardOnlineVisitors";
import { useLocation } from "react-router-dom";
import { Result } from "antd";
import CardHeaderChat from "../../components/card/cardHeaderChat";
import { conversationAPI } from "../../apis/conversation.api";
import CardBodyChatBox from "../../components/card/cardBodyChatBox";
import { messageAPI } from "../../apis/message.api";
import { useChatSocket } from "../../hooks/useChatSocket";
import CardInputChatBox from "../../components/card/cardInputChatBox";
import { SENDER_TYPE } from "../../utils";
import ComponentCardChatList from "../../components/card/cardChatList";
import CardDetailCustomer from "../../components/card/cardDetailCustomer";
import logo from '@/assets/react.svg';

const Messages: FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const conversationId = queryParams.get("conversationId");
    const [conversation, setConversation] = useState<any>(null);
    const [pageSize, setPageSize] = useState<number>(500);
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [data, setData] = useState<any>([]);
    const [active, setActive] = useState<boolean>(true);



    return <Fragment>
        <div className="flex items-center w-full" >
            <div className="w-[22%] bg-white h-[95vh] border-r-[2px] border-r-gray-300 overflow-auto">
                <ComponentCardChatList />
                <ComponentCardOnlineVisitors />
            </div>

            <div className={`${active ? " w-[56%]" : "w-[78%]"}  bg-[#f0f2f5] h-[95vh] border-r-[2px] border-r-gray-300 overflow-auto`} >
                <Fragment>
                    <CardHeaderChat conversation={conversation} setActive={setActive} active={active} />
                    <CardBodyChatBox data={data} />
                    <CardInputChatBox sendMessage={() => { }} conversation={conversation} noti={0} />
                </Fragment>


            </div>

            <div className="w-[22%] bg-white h-[95vh] border-r-[2px] border-r-gray-300 overflow-auto" >
                <CardDetailCustomer conversation={conversation} /> : <Result
                    status="warning"
                    title="404"
                    subTitle="Chưa có dữ liệu "
                />


            </div>


        </div>
    </Fragment>
}

export default Messages