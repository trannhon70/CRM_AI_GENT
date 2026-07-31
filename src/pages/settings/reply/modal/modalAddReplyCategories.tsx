import { Checkbox, Chip, Popover, TextField, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { animated, useSpring } from '@react-spring/web';
import type { FC } from "react";
import * as React from 'react';
import { HexColorPicker } from "react-colorful";
import { FaCheck } from "react-icons/fa";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { VscSymbolColor } from "react-icons/vsc";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../../../redux/store';
import { getContrastTextColor } from '../../../../utils/color';
import { quickReplyCategoriessAPI } from '../../../../apis/quickReplyCategories.api';
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
    height: 400,
    bgcolor: '#F2F4F7',
    border: '0px solid #000',
    boxShadow: 24,
    borderRadius: 2
};
const colors = [
    "#77149E",
    "#FF7A45",
    "#FA8C16",
    "#13C2C2",
    "#1890FF",
    "#597EF7",
    "#9254DE",
    "#FFC53D",
    "#1CAE67",
];

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

interface IProps {
    item?: any,
    setItem?: any,
}

const ModalAddCategories: FC<IProps> = (props) => {
    const { item, setItem } = props
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [form, setForm] = React.useState<any>({
        color: colors[0],
        page_id: id,
        name: "",
    })

    const openPopover = Boolean(anchorEl);
    const idPopover = openPopover ? 'simple-popover' : undefined;

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setForm({
            color: colors[0],
            page_id: id,
            name: "",
        });
        setItem(null)
    }
    const handleClick = (event: any) => {
        setAnchorEl(event.target);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleSave = () => {
        if (form.name === "") return toast.warning("Tên chủ đề không được bỏ trống!")
        setLoading(true)
        if (item?.id) {

        } else {
            quickReplyCategoriessAPI.create(form)
                .then((_res) => {
                    toast.success("Thêm chủ đề thành công!");
                    handleClose();
                })
                .catch((err) => {
                    toast.error(err.response?.data?.message);
                    return err;
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    return <div>
        <Tooltip title="Thêm mới" >
            <div onClick={handleOpen} className="h-8 w-8 bg-[#EAECF0] rounded cursor-pointer hover:bg-[#b1b3b6] flex items-center justify-center" >
                <IoMdAdd size={20} />
            </div>
        </Tooltip>
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
                        <div className='text-lg font-medium text-black ' >{form?.id ? "Cập nhật" : "Thêm mới chủ đề"}</div>
                        <div onClick={handleClose} className='w-8 h-8 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded' >
                            <IoMdClose size={25} />
                        </div>
                    </div>
                    <div className='flex-1 min-h-0 gap-2.5 px-7 py-2 box-border border-t border-b border-gray-300' >
                        <div className='mt-2' >
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Nhập tên chủ đề"
                                placeholder="Nhập tên chủ đề"
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
                                onChange={(event) =>
                                    setForm((prev: any) => ({
                                        ...prev,
                                        name: event.target.value,
                                    }))
                                }
                                value={form.name}
                                error={form.name === "" ? true : false}
                            />
                        </div>
                        <div className='mt-4' >
                            <div className='mb-2' >Bộ chọn màu</div>
                            <div className='flex items-center justify-between' >
                                <div onClick={handleClick} aria-describedby={id} className='flex items-center justify-center h-9 w-9 rounded bg-gray-400 cursor-pointer' >
                                    <VscSymbolColor color='white' size={20} />
                                </div>
                                <Popover
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                width: 200,
                                                height: 200,
                                                p: 1,
                                                overflow: "hidden",
                                            },
                                        },
                                    }}
                                    id={idPopover}
                                    open={openPopover}
                                    anchorEl={anchorEl}
                                    onClose={handleClosePopover}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <HexColorPicker
                                        style={{ width: "100%", height: "100%" }}
                                        color={form.color}
                                        onChange={(newColor) =>
                                            setForm((prev: any) => ({
                                                ...prev,
                                                color: newColor,
                                            }))
                                        }
                                    />
                                </Popover>
                                {colors.map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => setForm((form: any) => ({ ...form, color: color }))}
                                        className={`flex items-center justify-center h-9 w-9 rounded cursor-pointer transition-all ${form.color === color
                                            ? "ring-2 ring-offset-2 ring-gray-400"
                                            : ""
                                            }`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {form.color === color && (
                                            <FaCheck color="white" size={20} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className='mt-2' >Màu chủ đề sẽ được hiển thị</div>
                            <Chip sx={{ background: form.color, color: getContrastTextColor(form.color) }} size='small' label={form.color} />

                        </div>


                    </div>
                    <div className='flex items-center justify-end h-14 px-7 gap-2.5 ' >

                        <Button onClick={handleClose} color='inherit' variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Đóng</Button>
                        <Button loading={loading} onClick={handleSave} variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>{form?.id ? "Cập nhật" : "Lưu"}</Button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </div>
}

export default ModalAddCategories