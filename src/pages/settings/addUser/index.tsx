import TextField from "@mui/material/TextField";
import { useState, type FC } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ProviderEnumData, RoleData } from "../../../utils";
import { userPagesAPI } from "../../../apis/userPages.api";
import { toast } from "react-toastify";
import LoadingLayout from "../../../components/loadingLayout";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

const users = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        role: "CSKH",
    },
    {
        id: 2,
        name: "Trần Văn B",
        email: "tranvanb@gmail.com",
        role: "SALE",
    },
];

const PageAddUser: FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(false)
    const [form, setForm] = useState<any>({
        email: "",
        role: "",
        provider: "",
        page_id: id
    })
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
                <h3 className="text-lg font-semibold mb-4">
                    Danh sách người dùng hiện tại
                </h3>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3">Tên</th>
                            <th className="text-left py-3">Email</th>
                            <th className="text-left py-3">Vai trò</th>
                            <th className="text-center py-3">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="py-3">{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>

                                <td className="text-center">
                                    <button className="text-red-500 hover:text-red-700 cursor-pointer">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PageAddUser;