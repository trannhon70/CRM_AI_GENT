import Button from "@mui/material/Button";
import type { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { fanPagesAPI } from "../../../apis/fanpage.api";
import { toast } from "react-toastify";

const SyncFailedComponent: FC = () => {
    const fanPages = useSelector((state: RootState) => state.fanPages);

    const onClickSync = () => {
        fanPagesAPI.syncing({ page_id: fanPages.page.page_id }).then((res: any) => {
            toast.success("Đồng bộ thành công!")
        }).catch((error: any) => {
            toast.error(
                error.response?.data?.message || 'Lỗi khi kết nối!'
            );
        })
    }
    return <div className=" flex justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-3">
        <div>
            <p className="font-semibold text-red-600">
                Đồng bộ thất bại
            </p>
            <p className="text-xs text-gray-500">
                Vui lòng thử lại.
            </p>
        </div>

        <Button onClick={onClickSync} variant="contained" color="error">
            Thử lại
        </Button>
    </div>
}

export default SyncFailedComponent