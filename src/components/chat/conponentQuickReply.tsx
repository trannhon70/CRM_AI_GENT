import { Chip, Popover, TableCell, Tooltip } from "@mui/material";
import React, { Fragment, useLayoutEffect, type FC } from "react";
import { FaEdit } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllQuickReply } from "../../features/quickReplySlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { getContrastTextColor } from "../../utils/color";
import CommonTable from "../common/CommonTable";
import IconActionButton from "../icons/iconActionButton";
import ActionFab from "../common/ActionFab";
import { IoSendSharp } from "react-icons/io5";

interface IProps {

}
const ComponentQuickReply: FC<IProps> = (props) => {
    const { } = props
    const { id } = useParams();
    const navige = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const { dataAll, loading } = useSelector((state: RootState) => state.quickReply);
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;

    useLayoutEffect(() => {
        if (!open) return;
        dispatch(getAllQuickReply({ page_id: id }))
    }, [open])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 50,
        },
        {
            key: "quickReplyCategory",
            label: "Chủ đề",
            width: 130
        },
        {
            key: "content",
            label: "Tin nhắn"
        },

        {
            key: "Thao tác",
            label: "Thao tác",
            width: 80
        },

    ];

    const onClickEdit = () => {
        navige(`/setting/reply/${id}`)
    }

    const handleSend = (item: any) => {
        console.log(item);

    }

    return <Fragment>
        <Tooltip title="Trả lời nhanh">
            <button
                id={ids}
                onClick={handleClick}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 cursor-pointer"
            >
                <IoChatbubbleEllipsesOutline size={25} />
            </button>
        </Tooltip>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            slotProps={{
                paper: {
                    sx: {
                        overflow: "hidden",
                        transform: "translate(-200px, -20px) !important",
                        height: 400,
                        width: 600,
                        background: "white"
                    },
                },
            }}
        >
            <div className="flex flex-col h-full">
                <div className="py-1 px-2 shrink-0 border-b-gray-300 border-b" >
                    <div className="flex items-center justify-end text-blue-900 font-medium gap-2.5 " >Mẫu trả lời nhanh
                        <IconActionButton
                            icon={<FaEdit size={20} />}
                            tooltip="Sửa câu trả lời nhanh"
                            color="default"
                            // disabled={selectable}
                            onClick={onClickEdit}
                        /></div>
                </div>
                <CommonTable
                    containerRef={tableContainerRef}
                    containerProps={{ sx: { mt: 0 } }}
                    skeletonCount={10}
                    columns={columns}
                    data={dataAll}
                    loading={loading}
                    getRowKey={(item) => item.id}
                    emptyText="Coming soon"
                    renderRow={(item: any, index: number) => (
                        <>
                            <TableCell align="center"> {index + 1} </TableCell>
                            <TableCell  >
                                {item?.quickReplyCategory ? (
                                    <Chip
                                        label={item.quickReplyCategory.name}
                                        size="small"
                                        sx={{
                                            backgroundColor: item.quickReplyCategory.color,
                                            color: getContrastTextColor(item.quickReplyCategory.color),
                                        }}
                                    />
                                ) : (
                                    <span>—</span> // hoặc để trống, tùy UX bạn muốn
                                )}
                            </TableCell>
                            <TableCell className="max-w-0">
                                <Tooltip title={item.content} >
                                    <div className="font-medium truncate">
                                        {item.content}
                                    </div>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                                <IconActionButton
                                    icon={<IoSendSharp size={20} />}
                                    tooltip="Gửi"
                                    color="primary"
                                    // disabled={selectable}
                                    onClick={() => handleSend(item)}
                                />
                            </TableCell>

                        </>
                    )}
                />
            </div>
        </Popover>
    </Fragment>
}

export default ComponentQuickReply