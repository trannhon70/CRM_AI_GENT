import { Chip, InputAdornment, Skeleton, Switch, TableCell, TextField, Tooltip } from "@mui/material";
import type { FC } from "react";
import React, { useState } from "react";
import { BsChatDots } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { GrSearch } from "react-icons/gr";
import { MdDelete, MdOutlineTopic } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ActionFab from "../../../components/common/ActionFab";
import CommonTable from "../../../components/common/CommonTable";
import { getPagingQuickReplycategories, removeItem } from "../../../features/quickReplycategoriesSlice";
import { useDebounce } from "../../../hooks/useDebounce";
import type { AppDispatch, RootState } from "../../../redux/store";
import { getContrastTextColor } from "../../../utils/color";
import ModalAddCategories from "./modal/modalAddReplyCategories";
import { quickReplyCategoriessAPI } from "../../../apis/quickReplyCategories.api";
import { toast } from "react-toastify";


interface IProps {

}
const ComponentReplyCategories: FC<IProps> = (props) => {
    const { } = props
    const { id } = useParams();
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = React.useState<string>("");
    const { data, loading, hasMore, pageIndex } = useSelector((state: RootState) => state.quickReplycategories);
    const searchDebounce = useDebounce(search, 500);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    React.useEffect(() => {
        dispatch(getPagingQuickReplycategories({ page_id: String(id), pageIndex: 1, limit: 10, search: searchDebounce }))
    }, [id, searchDebounce, dispatch])
    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 70
        },
        {
            key: "name",
            label: "Tên chủ đề"
        },
        {
            key: "color",
            label: "Màu chủ đề"
        },

        {
            key: "action",
            label: "Thao tác",
            align: "center",
            width: 120,
            skeleton: (
                <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    sx={{ mx: "auto" }}
                />
            ),
        }
    ];

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            if (distanceToBottom < 50 && hasMore && loading !== "pending") {
                dispatch(getPagingQuickReplycategories({ page_id: String(id), pageIndex: Number(pageIndex) + 1, limit: 10, search: searchDebounce }))
            }
        },
        [hasMore, loading]
    );

    const onclickDelete = (event: any) => {
        setLoadingId(event.id)
        quickReplyCategoriessAPI.isDelete(event.id).then((_res: any) => {
            dispatch(removeItem(event.id));
            toast.success("Xóa chủ đề thành công!")
        }).catch((_res: any) => {
            toast.error(
                _res.response?.data?.message || 'Lỗi khi kết nối!'
            );
        }).finally(() => {
            setLoadingId(null);
        })
    }
    return <div className="flex flex-row flex-1 min-h-0 gap-2.5 mt-3 max-xl:flex-col ">
        <div className="flex-1 bg-white rounded-xl  px-6 py-3 shadow-sm box-border  overflow-auto max-xl:mb-2.5 max-xl:min-h-[400px]">
            <div className="text-lg font-medium text-black shrink-0">
                Chức năng & công cụ
            </div>
            <div className="flex gap-2.5 border-b border-b-[#E4E7EC] py-2" >
                <div><BsChatDots size={20} /></div>
                <div className="" >
                    <div className="text-sm font-medium text-black">
                        Gợi ý mẫu trả lời nhanh
                    </div>
                    <div className=" mt-1 font-normal text-[#4a4b4d] border-b border-b-[#E4E7EC]">
                        Khi nhập /  <strong>+ &lt;Nội dung ký tự tắt&gt;</strong> (ví dụ: /Appcake),
                        hệ thống sẽ gợi ý câu trả lời nhanh mà bạn đã cài đặt <Switch aria-label="Switch" disabled defaultChecked />
                    </div>
                    <div className=" mt-1 font-normal text-[#4a4b4d] ">
                        Gửi ngay mẫu trả lời nhanh khi chọn từ mục gợi ý <Switch aria-label="Switch" disabled defaultChecked />
                    </div>
                </div>
            </div>
            <div className="flex gap-2.5 border-b border-b-[#E4E7EC] py-2" >
                <div><MdOutlineTopic size={20} /></div>
                <div className="" >
                    <div className="text-sm font-medium text-black">
                        Chủ đề câu trả lời nhanh
                    </div>
                    <div className=" mt-1 font-normal text-[#4a4b4d] ">
                        Cài đặt chủ đề cho các câu trả lời nhanh của bạn để dễ dàng phân biệt các nhóm câu. <Switch aria-label="Switch" disabled defaultChecked />
                    </div>

                </div>
            </div>
            <div className="flex gap-2.5 border-b border-b-[#E4E7EC] py-2" >
                <div><FaUsers size={20} /></div>
                <div className="" >
                    <div className="text-sm font-medium text-black">
                        Cài đặt thông tin nhân viên
                    </div>
                    <div className="mt-1 font-normal text-[#4a4b4d]">
                        Cài đặt thông tin chi tiết nhân viên trả lời để chèn vào trong nội dung
                        câu trả lời nhanh theo biến {'#{STAFF_DETAILS}'}
                        <Switch aria-label="Switch" disabled defaultChecked />
                    </div>

                </div>
            </div>
        </div>

        <div className="flex-1 bg-white rounded-xl  px-6 py-3 shadow-sm box-border flex flex-col min-h-0 max-xl:min-h-[500px]">
            <div className="text-lg font-medium text-black shrink-0 flex gap-1.5 items-center ">
                Chủ đề câu trả lời nhanh
                <Chip color="primary" label={`${data.length} chủ đề`} size="small" />
            </div>
            <div className="text-lg font-medium text-black shrink-0 flex gap-1.5 items-center justify-between mt-1 ">
                <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => { setSearch(event.target.value) }}
                    value={search}
                    size="small"
                    variant="outlined"
                    placeholder="Tìm kiếm tin nhắn"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <GrSearch />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        width: 200,
                        "& .MuiOutlinedInput-root": {
                            height: 32,
                        },
                    }}
                />
                <ModalAddCategories />
            </div>
            <CommonTable
                containerRef={tableContainerRef}
                handleScroll={handleScroll}
                containerProps={{ sx: { mt: 1 } }}
                skeletonCount={10}
                columns={columns}
                data={data}
                loading={loading}
                getRowKey={(item) => item.id}
                emptyText="Coming soon"
                renderRow={(item: any, index: number) => (
                    <>
                        <TableCell align="center"> {index + 1} </TableCell>
                        <TableCell><div className="font-medium"> {item.name}</div></TableCell>
                        <TableCell> <Chip label={item.color} size="small" sx={{ backgroundColor: item.color, color: getContrastTextColor(item.color) }} /></TableCell>
                        <TableCell sx={{ display: "flex", gap: "10px" }} align="center">

                            <Tooltip title="Chỉnh sửa" >
                                <ActionFab color='success'>
                                    <FiEdit size={22} />
                                </ActionFab>
                            </Tooltip>


                            <Tooltip title="Xóa" >
                                <ActionFab
                                    loading={loadingId === item.id}
                                    disabled={loadingId !== null}
                                    onClick={() => onclickDelete(item)}
                                    color='error'
                                >
                                    <MdDelete size={22} color="red" />
                                </ActionFab>
                            </Tooltip>
                        </TableCell>
                    </>
                )}
            />
        </div>
    </div>
}

export default ComponentReplyCategories