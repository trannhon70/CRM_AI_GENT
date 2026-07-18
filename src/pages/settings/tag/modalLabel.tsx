import { Chip, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { animated, useSpring } from '@react-spring/web';
import type { FC } from "react";
import * as React from 'react';
import { IoMdClose } from "react-icons/io";
import { HexColorPicker } from "react-colorful";

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
    width: 500,
    height: 600,
    bgcolor: '#F2F4F7',
    border: '0px solid #000',
    boxShadow: 24,
    borderRadius: 2
};


const ModalLabel: FC = () => {
    const [open, setOpen] = React.useState(false);
    const [color, setColor] = React.useState("#aabbcc");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return <div>
        <Button onClick={handleOpen} variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Thêm thẻ</Button>

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
                        <div className='text-lg font-medium text-black ' >Thêm mới thẻ</div>
                        <div onClick={handleClose} className='w-8 h-8 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded' >
                            <IoMdClose size={25} />
                        </div>
                    </div>
                    <div className='flex-1 min-h-0 gap-2.5 px-7 py-2 box-border border-t border-b border-gray-300' >
                        <div>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Nhập tên thẻ"
                                placeholder="Nhập tên thẻ"
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: 35,
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "8px 14px", // 👈 giảm padding tương ứng với height nhỏ lại
                                    },
                                    "& .MuiInputLabel-root": {
                                        top: "-9px", // 👈 label chưa focus nhích lên cho cân giữa
                                    },
                                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                                        top: "0px", // 👈 label sau khi focus/có giá trị thì về đúng vị trí chuẩn
                                    },
                                }}
                            />
                        </div>
                        <div className='mt-4' >
                            <div className='mb-2' >Bộ chọn màu</div>
                            <HexColorPicker color={color} onChange={setColor} />
                            <div className='mt-2' >Màu chủ đề sẽ được hiển thị</div>
                            <Chip size='small' label="Chip Filled" />
                        </div>
                    </div>
                    <div className='flex items-center justify-end h-14 px-7 gap-2.5 ' >

                        <Button onClick={handleClose} color='inherit' variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Đóng</Button>
                        <Button variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Thêm thẻ</Button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </div>
}

export default ModalLabel