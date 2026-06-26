import Button from "@mui/material/Button";
import type { FC } from "react";
import { AiOutlineReload } from "react-icons/ai";

const PendingSyncComponent: FC = () => {
    return <div className=" justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-3">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AiOutlineReload className="text-xl text-amber-600" />
            </div>

            <div>
                <p className="text-sm font-semibold text-gray-800">
                    Đồng bộ dữ liệu
                </p>
                <p className="text-xs text-gray-500">
                    Đồng bộ toàn bộ tin nhắn để tiếp tục sử dụng hệ thống.
                </p>
            </div>
        </div>

        <div className="flex items-center justify-center" >
            <Button
                startIcon={<AiOutlineReload />}
                variant="contained"
                size="small"
                sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                }}
            >
                Đồng bộ ngay
            </Button>
        </div>
    </div>
}

export default PendingSyncComponent