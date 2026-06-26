import Button from "@mui/material/Button";
import type { FC } from "react";

const SyncFailedComponent: FC = () => {
    return <div className=" flex justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-3">
        <div>
            <p className="font-semibold text-red-600">
                Đồng bộ thất bại
            </p>
            <p className="text-xs text-gray-500">
                Vui lòng thử lại.
            </p>
        </div>

        <Button variant="contained" color="error">
            Thử lại
        </Button>
    </div>
}

export default SyncFailedComponent