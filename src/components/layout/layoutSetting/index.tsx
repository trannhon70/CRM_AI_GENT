import { Content } from "antd/es/layout/layout";
import type { FC } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderConversation from "../../header/headerConversation";
import { Layout } from "antd";
import { IoSettings } from "react-icons/io5";
import { IoPersonAddSharp } from "react-icons/io5";

const siderBar = [
    { id: 1, icon: <IoSettings />, title: "Cài đặt chung", url: "setting/general" },
    { id: 2, icon: <IoPersonAddSharp />, title: "Thêm người dùng", url: "setting/add-user-page" },
]

const LayoutSetting: FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const active = location.pathname.split("/").slice(1, 2);
    const navige = useNavigate();


    const onClickRouter = (url: string) => {
        navige(`/${url}/${id}`)
    }
    return <Layout style={{ height: '100%', width: '100%' }}>
        <HeaderConversation />

        <Content
            className="w-full"
            style={{ height: 'calc(100% - 5vh)' }}
        >
            <div className="max-w-[1200px] mx-auto w-full flex h-full">
                <div className="w-[280px] shrink-0 px-2.5 box-border">
                    <div className="text-3xl font-bold py-2" >
                        Cài đặt
                    </div>
                    {
                        siderBar.map((item: any) => {
                            return <div onClick={() => { onClickRouter(item.url) }} key={item.id}
                                className={`flex items-center gap-2.5 text-xl hover:bg-blue-300 hover:text-blue-600 rounded py-1.5 px-3 cursor-pointer mt-1
                                    ${location.pathname === `/${item.url}/${id}`
                                        ? "text-blue-600 bg-blue-300"
                                        : ""
                                    }`}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </div>
                        })
                    }
                </div>

                <div className="flex-1 bg-[#ECEDF4] px-10 py-5 overflow-auto box-border">
                    <Outlet />
                </div>
            </div>
        </Content>
    </Layout>
}

export default LayoutSetting