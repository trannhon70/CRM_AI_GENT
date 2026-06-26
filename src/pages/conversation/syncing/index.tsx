import type { FC } from "react";
import { AiOutlineReload } from "react-icons/ai";

const SyncingComponent: FC = () => {
    return <div className="justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 mb-3">
        <div className="flex items-center gap-3">
            <AiOutlineReload size={25} className="animate-spin text-blue-500" />
            <div>
                <p className="font-semibold">Đang đồng bộ dữ liệu...</p>
                <p className="text-xs text-gray-500">
                    Vui lòng chờ trong giây lát.
                </p>
            </div>
        </div>
    </div>
}

export default SyncingComponent