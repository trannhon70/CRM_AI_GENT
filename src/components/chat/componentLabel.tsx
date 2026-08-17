import { Tooltip } from "@mui/material";
import { useLayoutEffect, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { getAllLabel } from "../../features/labelSlice";
import type { Label } from "../../types/label";
import { getContrastTextColor } from "../../utils/color";
import { conversationAPI } from "../../apis/conversation.api";
import { toast } from "react-toastify";

interface IProps {

}
const ComponentLabel: FC<IProps> = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();
    const { dataAll } = useSelector((state: RootState) => state.label);
    const conversation = useSelector((state: RootState) => state.conversation);

    useLayoutEffect(() => {
        dispatch(getAllLabel({ page_id: id }))
    }, [dispatch, id])

    const onClickSaveLabel = (item: any) => {
        const body = {
            id: conversation.active.id,
            label_id: item.id,
            page_id: id
        }

        conversationAPI.addLabelToConversation(body).then((_res: any) => {
            toast.success(`Cập nhật nhãn ${item.name} cho ${conversation.active.full_name} thành công! `)
        }).catch((_res: any) => {
            toast.error(
                _res.response?.data?.message || 'Lỗi khi kết nối!'
            );
        })
    }

    return <div className="min-h-[3vh] max-h-[9vh] overflow-auto">
        {(() => {
            const remainder = dataAll.length % 6;

            const rows =
                remainder === 0
                    ? [dataAll]
                    : [
                        dataAll.slice(0, remainder),
                        dataAll.slice(remainder),
                    ];

            return rows.map((rowItems, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid gap-0.5 mt-0.5"
                    style={{
                        gridTemplateColumns: `repeat(${rowItems.length}, minmax(0, 1fr))`,
                    }}
                >
                    {rowItems.map((item: Label) => (
                        <Tooltip
                            key={item.id}
                            title={item.name}
                            placement="top-start"
                        >
                            <div
                                className="
                                min-w-0 h-[3vh]
                                flex items-center justify-center
                                px-2 cursor-pointer
                                bg-[var(--item-color)]
                                text-[var(--item-text-color)]
                                hover:bg-transparent
                                hover:text-gray-700
                                transition-colors duration-200
                            "
                                style={{
                                    '--item-color': item.color,
                                    '--item-text-color': getContrastTextColor(item.color),
                                } as React.CSSProperties}
                                onClick={() => onClickSaveLabel(item)}
                            >
                                <span className="block w-full truncate text-center">
                                    {item.name}
                                </span>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            ));
        })()}
    </div>
}

export default ComponentLabel