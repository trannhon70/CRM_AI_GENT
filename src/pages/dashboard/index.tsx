import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TextField from "@mui/material/TextField";
import { useEffect, useState, type FC } from "react";
import { IoSearch, IoSettings } from "react-icons/io5";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fanPagesAPI } from '../../apis/fanpage.api';
import { userPagesAPI } from "../../apis/userPages.api";
import facebook from "../../assets/images/facebook-logo.png";
import platform_all from "../../assets/images/platform_all.jpg";
import ModalConnect from "../../components/modal/modalConnect";
import { getRemainingDaysText } from '../../utils/date';
import LoadingLayout from '../../components/loadingLayout';
import { useLocalStorage } from '../../hooks/useLocalStorage';


const providerIcons: Record<string, string> = {
    all: platform_all,
    facebook: facebook,

};

const Dashboard: FC = () => {
    const navige = useNavigate()
    const [data, setData] = useState<any>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(100);
    const [search, setSearch] = useState<string>("");
    const [provider, setProvider] = useState<string>("");
    const [dataProvider, setDataProvider] = useState<any>([]);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeProvider, setActiveProvider] = useState('Tất cả');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { set } = useLocalStorage("roomId", null)

    const getPagingUserPage = async () => {
        const result = await userPagesAPI.getpaging({ pageIndex, pageSize, search, provider });
        setData(result.data)
    }

    const getCountProviderUserPage = async () => {
        const result = await userPagesAPI.getCountProvider();
        setDataProvider(result)
    }

    useEffect(() => {
        getCountProviderUserPage()
    }, [])
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        getPagingUserPage()
    }, [pageSize, pageIndex, debouncedSearch, provider])

    const onChangeSearch = (event: any) => {
        setSearch(event.target.value)
    }

    const onClickRouter = (value: any) => {
        set(value);
        navige(`conversation/${value}`)
    }

    const handleSettingClick = (
        item: any,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        setSelectedItem(item);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const handleRenewToken = (item: any) => {
        setLoading(true);
        fanPagesAPI.tokenRenewal({ access_token: item.page.access_token, fanpage_id: item.fanpage_id }).then((_res: any) => {
            toast.success('Gia hạn thành công!');
            handleClose();
            getPagingUserPage();
            setLoading(false);
        }).catch((_err: any) => {
            setLoading(false);
            handleClose();
            toast.error('Lỗi khi kết nối!')
        })
    }

    const handleDelete = (item: any) => {
        setLoading(true);
        userPagesAPI.deleteUserPage(item.id).then((_res: any) => {
            toast.success('Xóa page thành công!');
            handleClose();
            getPagingUserPage();
            setLoading(false);
        }).catch((_err: any) => {
            setLoading(false);
            handleClose();
            toast.error('Lỗi khi kết nối!')
        })
    }

    if (loading) return <LoadingLayout />
    return (
        <div className="bg-[#ECEDF4] h-[95vh] w-full flex flex-col">
            <div className="w-[1000px] m-auto py-4 flex flex-col flex-1 min-h-0">
                {/* Header search */}
                <div className="px-4 py-3 bg-white rounded">
                    <div className="text-lg font-bold text-black">Bảng điều khiển</div>
                    <div className="mt-2 flex items-center justify-between">
                        <TextField
                            onChange={onChangeSearch}
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
                <div className="px-4 py-3 bg-white rounded mt-4 flex items-center gap-1 w-full overflow-x-auto shrink-0">
                    {
                        dataProvider.map((item: any, index: number) => {
                            return <div
                                key={item.provider}
                                onClick={() => {
                                    setActiveProvider(item.provider);
                                    setProvider(item.provider === 'Tất cả' ? '' : item.provider);
                                }}
                                className={`relative flex items-center justify-between px-3 py-2 rounded cursor-pointer
                                    ${activeProvider === item.provider
                                        ? ' bg-[#BAE0FF]'
                                        : 'hover:bg-[#BAE0FF]'
                                    }
                                    ${index % 2 === 0
                                        ? "after:content-[''] after:absolute after:right-[-8px] after:top-1/2 after:-translate-y-1/2 after:w-px after:h-8 after:bg-gray-300"
                                        : ''
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2 w-[120px]">
                                    <img width={20} height={20} src={providerIcons[item.provider] || platform_all} alt="" />
                                    <span className="text-base font-medium text-black">{item.provider}</span>
                                </div>
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-xs">
                                    {item.count || 0}
                                </span>
                            </div>
                        })
                    }
                </div>

                {/* Main content - chiếm hết phần còn lại */}
                <div className="px-4 py-3 bg-white rounded mt-4 flex-1 min-h-0 overflow-y-auto grid grid-cols-3 items-start gap-2.5">
                    {
                        data.length > 0 && data.map((item: any, _index: number) => {
                            const remainingDays = Number(getRemainingDaysText(item.page.data_access_expires_at))
                            return <div
                                key={item.id}
                                onClick={() => onClickRouter(item.page.page_id)}
                                className="group flex items-center gap-2.5 min-h-24 rounded-xl border border-gray-200 bg-white p-2 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {/* Avatar */}
                                <img
                                    src={item.page.page_avatar}
                                    alt={item.page.page_name}
                                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900 truncate text-base">
                                            {item.page.page_name}
                                        </h3>

                                        <img
                                            src={facebook}
                                            alt="facebook"
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className=" flex flex-col gap-1 text-sm text-gray-500">
                                        <span>
                                            <span className="font-medium text-gray-700">
                                                Page ID:
                                            </span>{" "}
                                            {item.page.page_id}
                                        </span>
                                        {remainingDays <= 0 ? (
                                            <div className="mt-1 rounded-md border border-red-300 bg-red-50 p-2">
                                                <div className="font-medium text-red-700">
                                                    ❌ Đã hết hạn
                                                </div>
                                                <div className="text-xs text-red-600">
                                                    Token Facebook đã hết hạn. Tin nhắn sẽ không được đồng bộ. Vui lòng kết nối lại Fanpage ngay.
                                                </div>
                                            </div>
                                        ) : remainingDays < 7 ? (
                                            <div className="mt-1 rounded-md border border-red-300 bg-red-50 p-2">
                                                <div className="font-medium text-red-700">
                                                    🚨 Sắp hết hạn
                                                </div>
                                                <div className="text-xs text-red-600">
                                                    Token còn {remainingDays} ngày. Vui lòng gia hạn sớm để tránh gián đoạn nhận tin nhắn.
                                                </div>
                                            </div>
                                        ) : remainingDays < 30 ? (
                                            <div className="mt-1 rounded-md border border-yellow-300 bg-yellow-50 p-2">
                                                <div className="font-medium text-yellow-700">
                                                    ⚠️ Cảnh báo
                                                </div>
                                                <div className="text-xs text-yellow-600">
                                                    Token còn {remainingDays} ngày. Nên gia hạn trước khi hết hạn.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                    Active
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Token còn {remainingDays} ngày
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <IconButton onClick={(e) => handleSettingClick(item, e)} aria-label="delete">
                                    <IoSettings size={30} />
                                </IconButton>
                            </div>
                        })
                    }
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleRenewToken(selectedItem);
                            }}
                            className='gap-2'
                        >
                            <LiaMoneyCheckAltSolid className='text-green-700' size={20} />
                            Gia hạn token
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleDelete(selectedItem);
                            }}
                            className='gap-2'
                        >
                            <MdDelete size={20} color='red' />
                            Xóa page
                        </MenuItem>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;