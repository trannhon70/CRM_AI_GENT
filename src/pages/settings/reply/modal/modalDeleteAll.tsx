import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { animated, useSpring } from '@react-spring/web';
import type { FC } from "react";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import IconActionButton from "../../../../components/icons/iconActionButton";
import { quickReplyAPI } from '../../../../apis/quickReply.api';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../../../redux/store';
import { useDispatch } from 'react-redux';
import { removeItemAll } from '../../../../features/quickReplySlice';



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
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 120,
    bgcolor: '#F2F4F7',
    border: '0px solid #000',
    boxShadow: 24,
    borderRadius: 2
};

interface IProps {
    selectedKeys: any[],
    setSelectedKeys: any
}
const ModalDeleteAll: FC<IProps> = (props) => {
    const { selectedKeys, setSelectedKeys } = props;
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    }

    const onClickDeleteAll = () => {
        setLoading(true)
        quickReplyAPI.isDeleteAll(selectedKeys).then((_res: any) => {
            dispatch(removeItemAll(selectedKeys));
            setSelectedKeys([])
            toast.success("Xóa thành công!")
        }).catch((_res: any) => {
            toast.error(
                _res.response?.data?.message || 'Lỗi khi kết nối!'
            );
        }).finally(() => {
            setLoading(false);
        })
    }
    return <div>
        <IconActionButton
            icon={<RiDeleteBin6Line size={25} />}
            tooltip=""
            color="error"
            onClick={handleOpen}
        />
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
                    <div className='flex-1 min-h-0 gap-2.5 px-7 py-2 box-border  border-b border-gray-300 flex items-center font-semibold text-lg' >

                        <IconActionButton
                            icon={<RiDeleteBin6Line size={20} />}
                            tooltip=""
                            color="error"

                        /> Bạn có chắc chắn muốn xoá {selectedKeys.length || 0} mẫu không?

                    </div>
                    <div className='flex items-center justify-end h-14 px-7 gap-2.5 ' >

                        <Button onClick={handleClose} color='inherit' variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Đóng</Button>
                        <Button loading={loading} onClick={onClickDeleteAll} variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Đồng ý</Button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </div>

}

export default ModalDeleteAll