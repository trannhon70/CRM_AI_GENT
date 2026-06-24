import { Content } from "antd/es/layout/layout";
import type { FC } from "react";
import { Outlet } from "react-router-dom";
import HeaderConversation from "../../header/headerConversation";
import { Layout } from "antd";

const LayoutSetting: FC = () => {
    return <Layout style={{ height: '100%', width: '100%' }}>
        <HeaderConversation />

        <Content
            style={{ height: 'calc(100% - 5vh)' }}
        >
            <Outlet />
        </Content>
    </Layout>
}

export default LayoutSetting