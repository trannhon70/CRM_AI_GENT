import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from "@mui/material/Chip";
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from "@mui/material/Tabs";
import TextField from '@mui/material/TextField';
import type { FC } from "react";
import * as React from 'react';
import { BsQuestionCircleFill } from "react-icons/bs";
import { GrSearch } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ActionFab from '../../../components/common/ActionFab';
import { getPagingLabel } from '../../../features/labelSlice';
import type { AppDispatch, RootState } from '../../../redux/store';
import { formatUnixTime } from '../../../utils/date';

const PageSettingTag: FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { data } = useSelector((state: RootState) => state.label);
    const [active, setActive] = React.useState<any>("false");

    React.useEffect(() => {
        dispatch(getPagingLabel({ page_id: String(id), is_deleted: active, pageIndex: 1, limit: 10, search: "" }))
    }, [id, active])

    const handleChange = (_: React.SyntheticEvent, newValue: boolean) => {
        setActive(newValue);
    };
    return <div className="h-full">
        <div className="text-2xl font-bold text-black mb-5">
            Thẻ hội thoại
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm h-[calc(100%-52px)] flex flex-col">
            <div className="flex items-center gap-2.5 text-lg text-black/90 font-medium" >Thẻ hội thoại <BsQuestionCircleFill className="cursor-pointer" color="#B9BEC7" size={25} /> <Chip label="0 thẻ" color="warning" variant="filled" size="small" /></div>
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
                                height: 40,
                            },
                        }}
                    />
                    <div>
                        <Button variant="contained" sx={{ height: 40, px: 2.5, textTransform: "none" }}>Thêm thẻ</Button>
                    </div>
                </div>
                <TableContainer sx={{ mt: 2, flex: 1, overflow: "auto", minHeight: 0, }} component={Paper}>
                    <Table sx={{ minWidth: 650, marginTop: '10px' }} aria-label="simple table" stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell align="left">Tên thẻ</TableCell>
                                <TableCell align="left">Màu sắc</TableCell>
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
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left">{item.name}</TableCell>
                                    <TableCell align="left">{item.color}</TableCell>
                                    <TableCell align="left">{formatUnixTime(item.created_at)}</TableCell>
                                    <TableCell align="center">
                                        <ActionFab
                                            color="error"
                                            aria-label="delete"
                                        // onClick={handleDelete}
                                        >
                                            <MdDelete size={20} />
                                        </ActionFab>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>

            </Box>
        </div>


    </div>
}

export default PageSettingTag