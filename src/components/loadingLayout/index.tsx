import React, { type FC } from "react";

import { Spin } from 'antd';

const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const content = <div style={contentStyle} />;
const LoadingLayout: FC = () => {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" >
        <Spin tip="Loading" size="large">
            {content}
        </Spin>
    </div>
}

export default LoadingLayout