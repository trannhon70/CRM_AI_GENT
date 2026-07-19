import { Skeleton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from "@mui/material/Chip";
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import TableCell from '@mui/material/TableCell';
import Tabs from "@mui/material/Tabs";
import TextField from '@mui/material/TextField';
import type { FC } from "react";
import * as React from 'react';
import { BsQuestionCircleFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { GrSearch } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { labelAPI } from '../../../apis/label.api';
import ActionFab from '../../../components/common/ActionFab';
import CommonTable from '../../../components/common/CommonTable';
import { getPagingLabel, removeItem, updateItemLabel } from '../../../features/labelSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import type { AppDispatch, RootState } from '../../../redux/store';
import type { Label } from '../../../types/label';
import { getContrastTextColor } from '../../../utils/color';
import { formatUnixTime } from '../../../utils/date';
import ModalLabel from './modalLabel';
import { LuUndo2 } from "react-icons/lu";

const PageSettingTag: FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, hasMore, pageIndex } = useSelector((state: RootState) => state.label);
    const [active, setActive] = React.useState<any>("false");
    const [search, setSearch] = React.useState("");
    const searchDebounce = useDebounce(search, 500);
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const [item, setItem] = React.useState<any>(null)

    React.useEffect(() => {
        dispatch(getPagingLabel({ page_id: String(id), is_deleted: active, pageIndex: 1, limit: 20, search: searchDebounce }))
    }, [id, active, searchDebounce, dispatch])

    const handleChange = (_: React.SyntheticEvent, newValue: boolean) => {
        tableContainerRef.current?.scrollTo({
            top: 0,
            behavior: "auto", // hoặc "smooth"
        });

        setActive(newValue);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 70
        },
        {
            key: "name",
            label: "Tên thẻ"
        },
        {
            key: "color",
            label: "Màu sắc"
        },
        {
            key: "created",
            label: "Ngày tạo"
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
                dispatch(getPagingLabel({ page_id: String(id), is_deleted: active, pageIndex: Number(pageIndex) + 1, limit: 20, search: searchDebounce }))
            }

        },
        [hasMore, loading]
    );

    const onclickDelete = (event: Label) => {
        labelAPI.isDelete(event.id).then((_res: any) => {
            dispatch(removeItem(event.id));
            toast.success("Xóa thẻ hội thoại thành công!")
        }).catch((_res: any) => {
            toast.error(
                _res.response?.data?.message || 'Lỗi khi kết nối!'
            );
        })
    }

    const onclickEdit = (item: Label) => {
        setItem(item)
    }

    const onclickRestore = (event: Label) => {
        labelAPI.restore(event.id).then((_res: any) => {
            dispatch(
                updateItemLabel({
                    item: _res.data[0],
                    currentDeleted: active
                })
            );
            toast.success("Khôi phục thẻ hội thoại thành công!")
        }).catch((_res: any) => {
            toast.error(
                _res.response?.data?.message || 'Lỗi khi kết nối!'
            );
        })
    }

    return <div className="h-full">
        <div className="text-2xl font-bold text-black mb-5">
            Thẻ hội thoại
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm h-[calc(100%-52px)] flex flex-col">
            <div className="flex items-center gap-2.5 text-lg text-black/90 font-medium" >Thẻ hội thoại <BsQuestionCircleFill className="cursor-pointer" color="#B9BEC7" size={22} /> <Chip label="0 thẻ" color="warning" variant="filled" size="small" /></div>
            <div>Sử dụng thẻ hội thoại giúp phân biệt các hội thoại hoặc khách hàng </div>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, mt: 2, }}>
                <Tabs
                    value={active}
                    onChange={handleChange}
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
                    <Tab value={"false"} label="Danh sách thẻ" />
                    <Tab value={"true"} label="Thẻ ngưng sử dụng" />
                </Tabs>
                <div className='flex items-center justify-between mt-2' >
                    <TextField
                        onChange={handleSearch}
                        value={search}
                        size="small"
                        variant="outlined"
                        placeholder="Tìm kiếm thẻ"
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
                                height: 35,
                            },
                        }}
                    />
                    <div>
                        <ModalLabel item={item} setItem={setItem} active={active} />
                    </div>
                </div>
                <CommonTable
                    containerRef={tableContainerRef}
                    handleScroll={handleScroll}
                    containerProps={{ sx: { mt: 2 } }}
                    skeletonCount={10}
                    columns={columns}
                    data={data}
                    loading={loading}
                    getRowKey={(item) => item.id}
                    emptyText="Coming soon"
                    renderRow={(item: Label, index: number) => (
                        <>
                            <TableCell align="center"> {index + 1} </TableCell>
                            <TableCell><div className="font-medium"> {item.name}</div></TableCell>
                            <TableCell> <Chip label={item.color} size="small" sx={{ backgroundColor: item.color, color: getContrastTextColor(item.color) }} /></TableCell>
                            <TableCell>{formatUnixTime(item.created_at)}</TableCell>
                            <TableCell sx={{ display: "flex", gap: "10px" }} align="center">
                                {
                                    active === 'false' ?
                                        <Tooltip title="Chỉnh sửa" >
                                            <ActionFab onClick={() => onclickEdit(item)} color='success'>
                                                <FiEdit size={22} />
                                            </ActionFab>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Khôi phục" >
                                            <ActionFab onClick={() => onclickRestore(item)} color='success'>
                                                <LuUndo2 size={22} />
                                            </ActionFab>
                                        </Tooltip>
                                }

                                <Tooltip title="Xóa" >
                                    <ActionFab onClick={() => onclickDelete(item)} color='error'>
                                        <MdDelete size={22} color="red" />
                                    </ActionFab>
                                </Tooltip>
                            </TableCell>
                        </>
                    )}
                />

            </Box>
        </div>


    </div>
}

export default PageSettingTag