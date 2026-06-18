import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import { Outlet } from "react-router-dom"
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

const LayoutConversation: FC = () => {
    const { logout } = useContext(AuthContext)
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    useEffect(() => {
        dispatch(fetchUserById());
    }, [dispatch])


    const onclickLogout = () => {
        logout()
    }
    return <Layout>
        <div className="w-full h-[5vh] bg-[#0f447d] text-[#b0c1d4] flex items-center justify-between  box-border " >
            <div className="w-[1200px] m-auto flex items-center justify-between" >
                <Link href="#"><img width={150} src={logo} alt="..." /></Link>
                <div className="flex items-center gap-2">
                    <div>
                        <Button className='flex items-center gap-2' aria-describedby={id} variant="outlined" color='inherit' onClick={handleClick}>
                            <Avatar
                                alt="Remy Sharp"
                                src={users.user.avatar}
                                sx={{ width: 30, height: 30 }}
                            />
                            {users.user.full_name}
                        </Button>
                        <Popover
                            id={id}
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
        </div>
        <Content
            style={{
                // background: 'w',
                height: '95vh'
            }}
        >
            <Outlet />
        </Content>
    </Layout>
}

export default LayoutConversation