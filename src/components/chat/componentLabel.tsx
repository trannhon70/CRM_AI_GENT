import { Tooltip } from "@mui/material";
import { useLayoutEffect, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { getAllLabel } from "../../features/labelSlice";
import type { Label } from "../../types/label";
import { getContrastTextColor } from "../../utils/color";

interface IProps {

}
const ComponentLabel: FC<IProps> = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();
    const { dataAll } = useSelector((state: RootState) => state.label);

    useLayoutEffect(() => {
        dispatch(getAllLabel({ page_id: id }))
    }, [dispatch, id])

    return <div className="min-h-[3vh] max-h-[9vh] overflow-auto grid grid-cols-8 gap-0.5 box-border">
        {
            dataAll.length > 0 && dataAll.map((item: Label, index: number) => {
                return <Tooltip key={item.id} title={item.name} placement="top-start">
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
                    >
                        <span className="block w-full truncate text-center">
                            {item.name}
                        </span>
                    </div>
                </Tooltip>
            })
        }


    </div>
}

export default ComponentLabel