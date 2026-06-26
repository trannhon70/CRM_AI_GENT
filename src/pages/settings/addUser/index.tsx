import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from "@mui/material/TextField";
import React, { useEffect, useState, type FC } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userPagesAPI } from "../../../apis/userPages.api";
import { ProviderEnumData, RoleData } from "../../../utils";
import { MdDelete } from "react-icons/md";
import { formatUnixTime } from "../../../utils/date";
import Fab from "@mui/material/Fab";
import { useDebounce } from "../../../hooks/useDebounce";
import Stack from "@mui/material/Stack";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import { IoMdArrowBack } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";



const PageAddUser: FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(false)
    const [form, setForm] = useState<any>({
        email: "",
        role: "",
        provider: "",
        page_id: id
    })
    const [data, setData] = useState<any>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const searchDebounce = useDebounce(search, 500);

    const getPagingUserPage = async () => {
        const result = await userPagesAPI.getPagingUserPageActive({ page_id: id, pageSize: pageSize, pageIndex: pageIndex, search: search });
        setData(result.data);
        setTotalPage(result.totalPages);
    }

    useEffect(() => {
        getPagingUserPage()
    }, [pageSize, pageIndex, id, searchDebounce])

    useEffect(() => {
        setPageIndex(1);
    }, [searchDebounce]);

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
        userPagesAPI.createUserPage(form).then((res: any) => {
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

    return (
        <div className="h-full">
            <div className="text-2xl font-bold text-black mb-5">
                Thêm người dùng vào Page
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
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
                        <Button loading={loading} onClick={onclickAddUser} variant="contained" size="medium">Thêm người dùng</Button>

                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mt-5">
                <div className="flex items-center justify-between" >
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

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, marginTop: '10px' }} aria-label="simple table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell align="left">Họ và tên</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Quyền</TableCell>
                                <TableCell align="left">Ngày tạo</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item: any, index: number) => (
                                <TableRow
                                    key={item.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {(pageIndex - 1) * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell align="left">{item.user.full_name}</TableCell>
                                    <TableCell align="left">{item.user.email}</TableCell>
                                    <TableCell align="left">{item.role}</TableCell>
                                    <TableCell align="left">{formatUnixTime(item.created_at)}</TableCell>
                                    <TableCell align="center">
                                        <Fab size="small" color="error" aria-label="delete">
                                            <MdDelete size={20} />
                                        </Fab>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>
                <Stack className="mt-2.5 flex items-center justify-end w-full" spacing={2}>
                    <Pagination
                        color="primary"
                        count={totalPage}
                        page={pageIndex}
                        onChange={(_, value) => {
                            setPageIndex(value);
                        }}
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{ previous: IoMdArrowBack, next: IoArrowForward }}
                                {...item}
                            />
                        )}
                    />
                </Stack>
            </div>
        </div>
    );
};

export default PageAddUser;