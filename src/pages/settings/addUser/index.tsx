import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableCell from '@mui/material/TableCell';
import TextField from "@mui/material/TextField";
import React, { useEffect, useState, type FC } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userPagesAPI } from "../../../apis/userPages.api";
import ActionFab from "../../../components/common/ActionFab";
import CommonTable from "../../../components/common/CommonTable";
import { getPagingUserPage } from "../../../features/userPageSlice";
import { useDebounce } from "../../../hooks/useDebounce";
import type { AppDispatch, RootState } from "../../../redux/store";
import { ProviderEnumData, RoleData } from "../../../utils";
import { formatUnixTime } from "../../../utils/date";


const PageAddUser: FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [isloading, setLoading] = useState<boolean>(false)
    const [form, setForm] = useState<any>({
        email: "",
        role: "",
        provider: "",
        page_id: id
    })

    const [search, setSearch] = useState<string>("");
    const { data, loading, hasMore, pageIndex } = useSelector((state: RootState) => state.userPage);
    const searchDebounce = useDebounce(search, 500);
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getPagingUserPage({ page_id: String(id), pageIndex: 1, limit: 100, search: searchDebounce }))
    }, [id, searchDebounce, dispatch])



    const handleChange = (event: any) => {
        setForm((value: any) => ({
            ...value,
            role: event.target.value
        }))
    };

    const handleChangePrivider = (event: any) => {
        setForm((value: any) => ({
            ...value,
            provider: event.target.value
        }))
    };

    const handleChangeInput = (event: any) => {
        setForm((value: any) => ({
            ...value,
            email: event.target.value
        }))
    };
    const onclickAddUser = () => {
        setLoading(true);
        userPagesAPI.createUserPage(form).then((_res: any) => {
            dispatch(getPagingUserPage({ page_id: String(id), pageIndex: 1, limit: 100, search: searchDebounce }))
            toast.success('Thêm người dùng thành công!');
            setForm({
                email: "",
                role: "",
                provider: "",
                page_id: id
            })
            setLoading(false);

        }).catch((error: any) => {
            toast.error(
                error.response?.data?.message || 'Lỗi khi kết nối!'
            );
            setLoading(false);
        })
    }

    const handleDelete = (item: any) => {
        userPagesAPI.deleteUserPage(item.id).then((_res: any) => {
            toast.success('Xóa người dùng thành công!');
            dispatch(getPagingUserPage({ page_id: String(id), pageIndex: 1, limit: 100, search: searchDebounce }))
        }).catch((_err: any) => {
            toast.error('Lỗi khi kết nối!')
        })
    }

    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 30
        },
        {
            key: "full_name",
            label: "Họ và tên",
            width: 150,
        },
        {
            key: "email",
            label: "Màu sắc"
        },
        {
            key: "role",
            label: "Quyền"
        },
        {
            key: "time",
            label: "Ngày tạo"
        },
        {
            key: "action",
            label: "Thao tác",
            align: "center",
            width: 100,
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
                dispatch(getPagingUserPage({ page_id: String(id), pageIndex: Number(pageIndex) + 1, limit: 100, search: searchDebounce }))
            }
        },
        [hasMore, loading]
    );
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="text-2xl font-bold text-black mb-5 shrink-0">
                Thêm người dùng vào Page
            </div>

            <div className="bg-white rounded-xl px-6 py-3 shadow-sm shrink-0">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Thông tin người dùng
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <TextField className="w-full border rounded-lg px-3 py-2 outline-none" type="email" placeholder="Nhập email người dùng" id="outlined-basic" label="Nhập email người dùng" variant="outlined" size="small" value={form.email}
                                onChange={handleChangeInput}
                            />
                        </div>

                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label"> Quyền</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                label="Quyền"
                                value={form.role}
                                onChange={handleChange}
                            >
                                {
                                    RoleData.map((item: any) => {
                                        return <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label"> Loại tài khoản</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                label="Loại tài khoản"
                                value={form.provider}
                                onChange={handleChangePrivider}
                            >
                                {
                                    ProviderEnumData.map((item: any) => {
                                        return <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>


                    </div>

                    <div className="mt-5">
                        <Button loading={isloading} onClick={onclickAddUser} variant="contained" size="medium">Thêm người dùng</Button>

                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl  px-6 py-3 shadow-sm mt-5 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between shrink-0" >
                    <h3 className="text-lg font-semibold mb-4">
                        Danh sách người dùng hiện tại
                    </h3>
                    <TextField
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start"><IoSearchSharp /></InputAdornment>,
                            },
                        }}
                        className="w-80 border rounded-lg px-3 py-2 outline-none"
                        placeholder="nhập tên hoặc email"
                        id="outlined-basic"
                        label="Tìm kiếm"
                        variant="outlined" size="small"
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => { setSearch(event.target.value) }}
                    />
                </div>
                <CommonTable
                    containerRef={tableContainerRef}
                    handleScroll={handleScroll}
                    containerProps={{ sx: { mt: 2 } }}
                    skeletonCount={10}
                    columns={columns}
                    data={data}
                    loading={loading}
                    getRowKey={(item: any) => item.id}
                    emptyText="Coming soon"
                    renderRow={(item: any, index: number) => (
                        <>
                            <TableCell align="center"> {index + 1} </TableCell>
                            <TableCell><div className="font-medium">{item.user.full_name}</div></TableCell>
                            <TableCell> {item.user.email}</TableCell>
                            <TableCell>{item.role}</TableCell>
                            <TableCell>{formatUnixTime(item.created_at)}</TableCell>
                            <TableCell align="center">

                                <ActionFab
                                    color="error"
                                    aria-label="delete"
                                    onClick={() => handleDelete(item)}
                                >
                                    <MdDelete size={20} />
                                </ActionFab>
                            </TableCell>
                        </>
                    )}
                />

            </div>
        </div>
    );
};

export default PageAddUser;