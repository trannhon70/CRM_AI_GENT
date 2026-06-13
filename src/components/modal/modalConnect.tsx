import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from '@react-spring/web';
import { IoMdAddCircle } from 'react-icons/io';
import { borderRadius } from '@mui/system';
import { IoMdClose } from "react-icons/io";
import facebook from "../../assets/images/facebook.png"
import activate from "../../assets/images/wait-activate.png"
import instagram from "../../assets/images/instagram.png"
import TabFlatFormAll from '../tabs/tabsConnectPage/tabPlatformall';
import TabFaceBook from '../tabs/tabsConnectPage/tabFacebook';
import TabInstagram from '../tabs/tabsConnectPage/tabsInstagram';

interface FadeProps {
    children: React.ReactElement<any>;
    in?: boolean;
    onClick?: any;
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onExited?: (node: HTMLElement, isAppearing: boolean) => void;
    ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null as any, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null as any, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 600,
    bgcolor: '#F2F4F7',
    border: '0px solid #000',
    boxShadow: 24,
    borderRadius: 2
};

const dataPages = [
    { id: 1, name: "Chờ kích hoạt", image: activate },
    { id: 2, name: "Facebook", image: facebook },
    { id: 3, name: "Instagram", image: instagram },

]

interface IProps { }
const ModalConnect: React.FC<IProps> = (props) => {
    const { } = props
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [active, setActive] = React.useState<number>(1)

    const renderTabActive = (active: number) => {
        switch (active) {
            case 1:
                return <TabFlatFormAll />
            case 2:
                return <TabFaceBook />
            case 3:
                return <TabInstagram />
            default:
                return <TabFlatFormAll />
        }
    }

    return (
        <div>
            <Button onClick={handleOpen} className="flex items-center gap-2" variant="outlined" color="inherit" size="small">
                <IoMdAddCircle size={25} />
                Kết nối
            </Button>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: { slots: { transition: Fade } },
                }}
            >
                <Fade in={open}>
                    <Box sx={style} className="flex flex-col">
                        <div className='flex items-center justify-between p-3' >
                            <div className='text-lg font-medium text-black ' >Thêm kết nối</div>
                            <div onClick={handleClose} className='w-8 h-8 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded' >
                                <IoMdClose size={25} />
                            </div>
                        </div>
                        <div className='flex-1 min-h-0 flex gap-2.5' >
                            <div className='bg-white overflow-y-auto w-[30%] p-3 rounded-tr-md' >
                                {
                                    dataPages.map((item: any, index: number) => {
                                        return <div key={item - index}
                                            onClick={() => setActive(item.id)}
                                            className={`flex items-center gap-2.5 p-2 rounded mt-1 cursor-pointer  ${active === item.id ? 'bg-[#EAECF0]' : 'hover:bg-[#EAECF0]'}`} >
                                            <img className='rounded' width={30} height={30} src={item.image} alt="" />
                                            <div className='text-lg font-normal text-black' >{item.name}</div>
                                        </div>
                                    })
                                }

                            </div>
                            <div className=' bg-white w-[70%] rounded-tl-md' >
                                {renderTabActive(active)}
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default ModalConnect