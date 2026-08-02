import type { FC } from "react";
import ComponentQuickReply from "./componentQuickReply";
import ComponentReplyCategories from "./componentReplyCategories";

const PageReply: FC = () => {

    return <div className="h-full flex flex-col">
        <div className="text-2xl font-medium text-black shrink-0">
            Hỗ trợ trả lời
        </div>

        <ComponentQuickReply />
        <ComponentReplyCategories />

    </div>
}

export default PageReply