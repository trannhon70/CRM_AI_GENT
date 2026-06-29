import Tooltip from "@mui/material/Tooltip";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState, type FC } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaCircleUser, FaMessage } from "react-icons/fa6";
import HeaderConversation from "../../header/headerConversation";
import ComponentLeftConversation from "../../tabs/tabsConversation/componentLeftConversation";
import ComponentCenterConversation from "../../tabs/tabsConversation/componentCenterConversation";

const sidebar = [
    { id: 1, icon: <FaMessage size={20} color="white" />, title: <div>Tất cả hội thoại</div> },
    { id: 2, icon: <FaCircleUser size={20} color="white" />, title: <div>Lọc chưa lọc</div> },
    { id: 3, icon: <BiSolidMessageRounded size={20} color="white" />, title: <div>Lọc bình luận</div> },
    { id: 4, icon: <BsEnvelopeFill size={20} color="white" />, title: <div>Lọc tin nhắn</div> },
]

const LayoutConversation: FC = () => {
    const [active, setActive] = useState<number>(1)
    return <Layout style={{ height: '100%', width: '100%' }}>
        <HeaderConversation />

        <Content
            style={{ height: 'calc(100% - 5vh)' }}
        >
            <div className="flex h-full box-border">
                {/* Sidebar */}
                <div className="w-14 shrink-0 bg-[#0f447d] overflow-y-auto">
                    <div className="flex flex-col items-center pt-3">
                        {sidebar.map((item: any) => (
                            <Tooltip
                                key={item.id}
                                describeChild
                                title={item.title}
                                placement="right-start"
                            >
                                <div
                                    className={`px-2.5 py-1.5 rounded cursor-pointer mt-3 hover:bg-[#506DAD]
                ${active === item.id ? 'bg-[#506DAD]' : ''}`}
                                    onClick={() => setActive(item.id)}
                                >
                                    {item.icon}
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#0f447d]">
                    <div className="h-full flex-1 flex rounded-tl-2xl bg-white" >
                        <div className="w-1/4 lg:w-[25%] border-r border-gray-200">
                            <ComponentLeftConversation />
                        </div>

                        <div className="w-2/4 lg:w-[50%] border-r border-gray-200 flex flex-col h-full">
                            <ComponentCenterConversation />
                        </div>

                        <div className="w-1/4 lg:w-[25%]">
                            sadsad
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    </Layout>
}

export default LayoutConversation