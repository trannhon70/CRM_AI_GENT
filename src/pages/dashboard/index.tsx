import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import type { FC } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import facebook from "../../assets/images/facebook-logo.png";
import platform_all from "../../assets/images/platform_all.jpg";

const Dashboard: FC = () => {

    return <div className="bg-[#ECEDF4] h-[95vh] w-full" >
        <div className="w-[1000px] m-auto py-4" >
            <div className="px-4 py-3 bg-white rounded " >
                <div className="text-lg font-bold text-black " >Bảng điều khiển</div>
                <div className="mt-2 flex items-center justify-between" >
                    <TextField
                        label=""
                        id={`1-input`}
                        sx={{ width: '40ch' }}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <IoSearch size={20} />
                                </InputAdornment>,
                            },
                        }}
                        size="small"
                        placeholder="Tìm kiếm"
                    />
                    <Button className='flex items-center gap-2' variant="outlined" color='inherit' size="small" >
                        <IoMdAddCircle size={25} />
                        Kết nối
                    </Button>
                </div>
            </div>
            <div className="px-4 py-3 bg-white rounded mt-4 flex items-center w-full overflow-x-auto">
                <div className="relative flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#BAE0FF] after:content-[''] after:absolute after:right-[-8px] after:top-1/2 after:-translate-y-1/2 after:w-px after:h-8 after:bg-gray-300 ">
                    <div className="flex items-center gap-2 w-[120px]">
                        <img width={20} height={20} src={platform_all} alt="" />
                        <span className="text-base font-medium text-black">
                            Tất cả
                        </span>
                    </div>

                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-xs">
                        1
                    </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-[#BAE0FF] ml-4 "
                >
                    <div className="flex items-center gap-2 w-[120px]">
                        <img width={20} height={20} src={facebook} alt="" />
                        <span className="text-base font-medium text-black">
                            Facebook
                        </span>
                    </div>

                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-xs">
                        1
                    </span>
                </div>

            </div>

            <div className="px-4 py-3 bg-white rounded mt-4 flex items-center w-full overflow-y-auto h-[70vh]">

            </div>
        </div>
    </div>
}

export default Dashboard