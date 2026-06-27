import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from "@mui/material/Link";
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState, type FC } from "react";
import { IoIosLogOut, IoMdNotifications } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/images/logo.png";
import { AuthContext } from '../../../context/AuthContext';
import { fetchUserById } from "../../../features/usersSlice";
import type { AppDispatch, RootState } from "../../../redux/store";
import Avatar from '@mui/material/Avatar';
import { RiDashboardFill } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchPageId, updateSyncStatus } from "../../../features/fanpagesSlice";
import { useChatSocket } from "../../../hooks/useChatSocket";
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const HeaderConversation: FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const navige = useNavigate()
    const { logout } = useContext(AuthContext)
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users);
    const fanPages = useSelector((state: RootState) => state.fanPages);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const active = location.pathname.split("/")[1];
    const { value } = useLocalStorage("roomId", null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id_open = open ? 'simple-popover' : undefined;

    useEffect(() => {
        dispatch(fetchUserById());
        dispatch(fetchPageId(id));
    }, [dispatch, id])


    const onclickLogout = () => {
        logout()
    }
    const onClickRouter = (value: any) => {
        navige(`/${value}/${id}`)
    }

    useChatSocket({
        roomId: String(value),
        onSyncStatus: (event: any) => {
            dispatch(updateSyncStatus(event));
        },
    });
    return <div className="w-full h-[7vh] max-lg:h-[10vh] bg-[#0f447d] text-[#b0c1d4] flex items-center justify-between box-border overflow-hidden" >
        <div className="max-w-[1200px] w-full m-auto px-4 flex items-center justify-between" >
            <div className='flex items-center gap-7' >
                <Link href="#"><img width={150} src={logo} alt="..." /></Link>
                <div className='flex items-center gap-3' >
                    <div onClick={() => { onClickRouter('conversation') }} className={`rounded text-lg px-3.5 py-1 text-white font-medium cursor-pointer ${active === "conversation" ? "bg-[#394E79]" : "hover:bg-[#394E79]"
                        }`} >Hội thoại</div>
                    <div onClick={() => { onClickRouter('setting/general') }} className={`rounded text-lg px-3.5 py-1 text-white font-medium cursor-pointer ${active === "setting" ? "bg-[#394E79]" : "hover:bg-[#394E79]"
                        }`} >Cài đặt</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <Button className='flex items-center gap-2' aria-describedby={id} variant="outlined" color='inherit' onClick={handleClick}>
                        <Avatar
                            alt="Remy Sharp"
                            src={fanPages.page.page_avatar}
                            sx={{ width: 30, height: 30 }}
                        />
                        {fanPages.page.page_name}
                    </Button>
                    <Popover
                        id={id_open}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}

                    >
                        <Typography className='w-[250px] p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-between' >
                            <Link href="/" style={{ textDecoration: "none" }} className='flex items-center gap-2  ' color='textSecondary' >
                                <RiDashboardFill size={25} />

                                <div className='text-base font-bold capitalize' >Bảng điều khiển</div>
                            </Link>

                        </Typography>
                        <hr className="text-gray-300 h-0.5" />
                        <Typography className='w-[250px] p-2 hover:bg-gray-200 cursor-pointer flex items-center justify-between' >
                            <Link href="account" style={{ textDecoration: "none" }} className='flex items-center gap-2  ' color='textSecondary' >
                                <Avatar
                                    alt="Remy Sharp"
                                    src={users.user.avatar}
                                    sx={{ width: 40, height: 40 }}
                                />
                                <div  >
                                    <div className='text-[12px] font-medium '>Tài khoản</div>
                                    <div className='text-base font-bold capitalize' >{users.user.full_name}</div>
                                </div>
                            </Link>
                            <Tooltip title="Đăng xuất">
                                <IconButton onClick={onclickLogout} aria-label="show new notifications">
                                    <IoIosLogOut color="red" size={30} />
                                </IconButton>
                            </Tooltip>
                        </Typography>
                    </Popover>
                </div>
                <IconButton aria-label="show new notifications">
                    <Badge badgeContent={100} max={99} color="error" variant="standard">
                        <IoMdNotifications color="red" size={30} />
                    </Badge>
                </IconButton>
            </div>
        </div>
    </div >
}

export default HeaderConversation