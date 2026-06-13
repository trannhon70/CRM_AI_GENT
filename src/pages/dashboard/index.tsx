import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import type { FC } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import facebook from "../../assets/images/facebook-logo.png";
import platform_all from "../../assets/images/platform_all.jpg";
import ModalConnect from "../../components/modal/modalConnect";

const Dashboard: FC = () => {
    return (
        <div className="bg-[#ECEDF4] h-[95vh] w-full flex flex-col">
            <div className="w-[1000px] m-auto py-4 flex flex-col flex-1 min-h-0">
                {/* Header search */}
                <div className="px-4 py-3 bg-white rounded">
                    <div className="text-lg font-bold text-black">Bảng điều khiển</div>
                    <div className="mt-2 flex items-center justify-between">
                        <TextField
                            label=""
                            id="1-input"
                            sx={{ width: '40ch' }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IoSearch size={20} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            size="small"
                            placeholder="Tìm kiếm"
                        />
                        <ModalConnect />

                    </div>
                </div>

                {/* Platform tabs */}
                <div className="px-4 py-3 bg-white rounded mt-4 flex items-center w-full overflow-x-auto shrink-0">
                    <div className="relative flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#BAE0FF] after:content-[''] after:absolute after:right-[-8px] after:top-1/2 after:-translate-y-1/2 after:w-px after:h-8 after:bg-gray-300">
                        <div className="flex items-center gap-2 w-[120px]">
                            <img width={20} height={20} src={platform_all} alt="" />
                            <span className="text-base font-medium text-black">Tất cả</span>
                        </div>
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-xs">1</span>
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#BAE0FF] ml-4">
                        <div className="flex items-center gap-2 w-[120px]">
                            <img width={20} height={20} src={facebook} alt="" />
                            <span className="text-base font-medium text-black">Facebook</span>
                        </div>
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-xs">1</span>
                    </div>

                </div>

                {/* Main content - chiếm hết phần còn lại */}
                <div className="px-4 py-3 bg-white rounded mt-4 flex-1 min-h-0 overflow-y-auto grid grid-cols-3">
                    <div className="border rounded border-neutral-400 p-3 h-20 cursor-pointer flex items-center gap-2.5 hover:border-amber-400 " >
                        <img width={50} height={50} src={platform_all} alt="..." className="rounded-full" />
                        <div>
                            <div className="font-bold text-base text-black" >Tin tức ý khoa</div>
                            <div className="flex items-center gap-2 mt-1" >
                                <img width={15} height={15} src={facebook} alt="" />
                                <span>01234567899999</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;