import { Chip, InputAdornment, Skeleton, Tab, TableCell, Tabs, TextField, Tooltip } from "@mui/material";
import type { FC } from "react";
import React from "react";
import { BsCloudDownloadFill, BsCloudUploadFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { GrSearch } from "react-icons/gr";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RiFileCopy2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { quickReplyAPI } from "../../../apis/quickReply.api";
import ActionFab from "../../../components/common/ActionFab";
import CommonTable from "../../../components/common/CommonTable";
import IconActionButton from "../../../components/icons/iconActionButton";
import { getPagingQuickReply, removeItem } from "../../../features/quickReplySlice";
import { useDebounce } from "../../../hooks/useDebounce";
import type { AppDispatch, RootState } from "../../../redux/store";
import { getContrastTextColor } from "../../../utils/color";
import ModalAddQuickReply from "./modal/modalAddQuickReply";
import ModalDeleteAll from "./modal/modalDeleteAll";
import ModalCopyQuickReply from "./modal/modalCopyQuickReply";

const ComponentQuickReply: FC = () => {
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = React.useState<string>("");
    const { searchDebounce } = useDebounce(search, 500);
    const { data, loading, hasMore, pageIndex } = useSelector((state: RootState) => state.quickReply);
    const [item, setItem] = React.useState<any>(null)
    const [loadingId, setLoadingId] = React.useState<number | null>(null);
    const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>([]);
    const [selectable, setSelectable] = React.useState<boolean>(false)


    React.useEffect(() => {
        dispatch(getPagingQuickReply({ page_id: String(id), pageIndex: 1, limit: 100, search: searchDebounce }))
    }, [id, searchDebounce, dispatch])

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            if (distanceToBottom < 50 && hasMore && loading !== "pending") {
                dispatch(getPagingQuickReply({ page_id: String(id), pageIndex: Number(pageIndex) + 1, limit: 100, search: searchDebounce }))
            }
        },
        [hasMore, loading]
    );

    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 70
        },
        {
            key: "quickReplyCategory",
            label: "Chủ đề",
            width: 200
        },
        {
            key: "content",
            label: "Tin nhắn"
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

    const onclickEdit = (item: any) => {
        setItem(item)
    }

    const onclickDelete = (event: any) => {
        setLoadingId(event.id)
        quickReplyAPI.isDelete(event.id).then((_res: any) => {
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

    return <div className="bg-white rounded-xl  px-6 py-3 shadow-sm mt-3 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between shrink-0" >
            <Tabs
                value={"false"}
                // onChange={handleChange}
                sx={{
                    borderBottom: "1px solid #e5e7eb",
                    "& .MuiTabs-indicator": {
                        height: 3,
                        borderRadius: "999px",
                        backgroundColor: "#1877F2",
                    },
                    "& .MuiTab-root": {
                        textTransform: "none",
                        color: "#6b7280",
                        fontWeight: 500,
                        minHeight: 48,
                    },
                    "& .Mui-selected": {
                        color: "#1877F2",
                        fontWeight: 600,
                    },
                }}
            >
                <Tab value={"false"} label="Trả lời nhanh" />

            </Tabs>
            <div className="flex items-center gap-2.5" >
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
                        width: 250,
                        "& .MuiOutlinedInput-root": {
                            height: 32,
                        },
                    }}
                />
                {
                    selectedKeys.length > 0 && <div className="flex items-center gap-2.5" >
                        <Chip variant="outlined" color="success" label={`Đã chọn ${selectedKeys.length}`} size="small" />
                        <ModalDeleteAll selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
                    </div>
                }
                <IconActionButton
                    icon={<IoCheckmarkDoneOutline size={20} />}
                    tooltip="Chọn mẫu trả lời"
                    color={selectable ? "primary" : "default"}
                    onClick={() => {
                        setSelectable((prev) => {
                            const next = !prev;
                            if (!next) {
                                setSelectedKeys([]); // tắt chế độ chọn thì clear luôn các dòng đã tick
                            }
                            return next;
                        });
                    }}
                />
                <IconActionButton
                    icon={<BsCloudUploadFill size={20} />}
                    tooltip="Tải lên"
                    color="success"
                    disabled={selectable}
                // onClick={handleUpload}
                />
                <IconActionButton
                    icon={<BsCloudDownloadFill size={20} />}
                    tooltip="Tải tất cả danh sách QR"
                    color="secondary"
                    disabled={selectable}
                // onClick={handleUpload}
                />
                <ModalCopyQuickReply selectable={selectable} />


                <ModalAddQuickReply item={item} setItem={setItem} disabled={selectable} />
            </div>
        </div>
        <CommonTable
            selectable={selectable}
            selectedKeys={selectedKeys}
            onSelectedKeysChange={setSelectedKeys}
            containerRef={tableContainerRef}
            handleScroll={handleScroll}
            containerProps={{ sx: { mt: 0 } }}
            skeletonCount={10}
            columns={columns}
            data={data}
            loading={loading}
            getRowKey={(item) => item.id}
            emptyText="Coming soon"
            renderRow={(item: any, index: number) => (
                <>
                    <TableCell align="center"> {index + 1} </TableCell>
                    <TableCell>
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
                    <TableCell><div className="font-medium"> {item.content}</div></TableCell>

                    <TableCell sx={{ display: "flex", gap: "10px" }} align="center">

                        <Tooltip title="Chỉnh sửa" >
                            <ActionFab onClick={() => onclickEdit(item)} color='success'>
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
}

export default ComponentQuickReply