import { Button, Chip, InputAdornment, Skeleton, Tab, TableCell, Tabs, TextField, Tooltip } from "@mui/material";
import type { FC } from "react";
import React from "react";
import { BsCloudDownloadFill, BsCloudUploadFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { GrSearch } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { RiFileCopy2Fill } from "react-icons/ri";
import ActionFab from "../../../components/common/ActionFab";
import CommonTable from "../../../components/common/CommonTable";
import { getContrastTextColor } from "../../../utils/color";
import { formatUnixTime } from "../../../utils/date";
import ComponentReplyCategories from "./componentReplyCategories";

const PageReply: FC = () => {
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 70
        },
        {
            key: "name",
            label: "Chủ đề"
        },
        {
            key: "color",
            label: "Tin nhắn"
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
    return <div className="h-full flex flex-col overflow-hidden">
        <div className="text-2xl font-medium text-black shrink-0">
            Hỗ trợ trả lời
        </div>

        <div className="bg-white rounded-xl  px-6 py-3 shadow-sm mt-3 flex-1 min-h-0 flex flex-col">
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
                        // onChange={handleSearch}
                        // value={search}
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
                    <Tooltip title="Tải lên" >
                        <div className="h-8 w-8 bg-[#EAECF0] rounded cursor-pointer hover:bg-[#b1b3b6] flex items-center justify-center" >
                            <BsCloudUploadFill size={20} />
                        </div>
                    </Tooltip>
                    <Tooltip title="Tải tất cả danh sách QR" >
                        <div className="h-8 w-8 bg-[#EAECF0] rounded cursor-pointer hover:bg-[#b1b3b6] flex items-center justify-center" >
                            <BsCloudDownloadFill size={20} />
                        </div>
                    </Tooltip>
                    <Tooltip title="Sao chép tất cả danh sách QR" >
                        <div className="h-8 w-8 bg-[#EAECF0] rounded cursor-pointer hover:bg-[#b1b3b6] flex items-center justify-center" >
                            <RiFileCopy2Fill size={20} />
                        </div>
                    </Tooltip>
                    <Button variant="contained" sx={{ height: 32, px: 2, textTransform: "none" }}>Thêm mẫu</Button>
                </div>
            </div>
            <CommonTable
                containerRef={tableContainerRef}
                // handleScroll={handleScroll}
                containerProps={{ sx: { mt: 0 } }}
                skeletonCount={10}
                columns={columns}
                data={[]}
                // loading={loading}
                // getRowKey={(item) => item.id}
                emptyText="Coming soon"
                renderRow={(item: any, index: number) => (
                    <>
                        <TableCell align="center"> {index + 1} </TableCell>
                        <TableCell><div className="font-medium"> {item.name}</div></TableCell>
                        <TableCell> <Chip label={item.color} size="small" sx={{ backgroundColor: item.color, color: getContrastTextColor(item.color) }} /></TableCell>
                        <TableCell>{formatUnixTime(item.created_at)}</TableCell>
                        <TableCell sx={{ display: "flex", gap: "10px" }} align="center">

                            <Tooltip title="Chỉnh sửa" >
                                <ActionFab color='success'>
                                    <FiEdit size={22} />
                                </ActionFab>
                            </Tooltip>


                            <Tooltip title="Xóa" >
                                <ActionFab color='error'>
                                    <MdDelete size={22} color="red" />
                                </ActionFab>
                            </Tooltip>
                        </TableCell>
                    </>
                )}
            />
        </div>
        <ComponentReplyCategories />

    </div>
}

export default PageReply