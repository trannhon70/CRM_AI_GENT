import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { animated, useSpring } from '@react-spring/web';
import type { FC } from "react";
import * as React from 'react';
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '../../../../redux/store';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { TextareaAutosize } from '@mui/material';
import { styled } from "@mui/material/styles";
import { getAllQuickReplycategories } from '../../../../features/quickReplycategoriesSlice';

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: theme.typography.fontFamily,
    lineHeight: 1.5,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "all .2s",

    "&:hover": {
        borderColor: theme.palette.grey[500],
    },

    "&:focus": {
        borderColor: theme.palette.primary.main,
        border: `2px solid ${theme.palette.primary.main}`,
    },

    "&::placeholder": {
        color: theme.palette.text.disabled,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    slotProps: {
        paper: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    },
};

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


interface IProps {
    item?: any,
    setItem?: any,
}

const ModalAddQuickReply: FC<IProps> = (props) => {
    const { item, setItem } = props
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>();
    const { dataAll } = useSelector((state: RootState) => state.quickReplycategories);
    const [form, setForm] = React.useState<any>({
        content: "",
        quick_reply_category_id: "",
    })

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setForm({
            content: "",
            quick_reply_category_id: "",
        });
        setItem(null)
    }

    React.useEffect(() => {
        if (id && open) {
            dispatch(getAllQuickReplycategories({ page_id: id }))
        }
    }, [id, open])

    const handleSave = () => {
        if (form.content === "") return toast.warning("Nội dung không được bỏ trống!")
        console.log(form);

        // setLoading(true)
        if (item?.id) {
            // quickReplyCategoriessAPI.update({ id: form?.id, color: form.color, name: form.name })
            //     .then((_res) => {
            //         console.log(_res);

            //         dispatch(updateItem({ id: form?.id, color: form.color, name: form.name }));
            //         toast.success("Cập nhật chủ đề thành công!");
            //         handleClose();
            //     })
            //     .catch((err) => {
            //         toast.error(err.response?.data?.message);
            //         return err;
            //     })
            //     .finally(() => {
            //         setLoading(false);
            //     });
        } else {
            // quickReplyCategoriessAPI.create(form)
            //     .then((_res) => {
            //         dispatch(insertItem(_res));
            //         toast.success("Thêm chủ đề thành công!");
            //         handleClose();
            //     })
            //     .catch((err) => {
            //         toast.error(err.response?.data?.message);
            //         return err;
            //     })
            //     .finally(() => {
            //         setLoading(false);
            //     });
        }
    }

    // React.useEffect(() => {
    //     if (item?.id) {
    //         setForm(item)
    //         handleOpen()
    //     }
    // }, [item?.id])

    const handleChange = (event: SelectChangeEvent) => {
        setForm((value: any) => ({ ...value, quick_reply_category_id: event.target.value }))
    };

    const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
        setForm((value: any) => ({ ...value, content: event.target.value }))
    }

    return <div>
        <Button onClick={handleOpen} variant="contained" sx={{ height: 32, px: 2, textTransform: "none" }}>Thêm mẫu</Button>

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
                            <FormControl fullWidth>
                                <InputLabel sx={{ top: -8 }} id="demo-simple-select-label">Chủ đề</InputLabel>
                                <Select
                                    sx={{
                                        height: 36,
                                        "& .MuiSelect-select": {
                                            py: 0.75,
                                        },
                                    }}
                                    size='small'
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={form.quick_reply_category_id}
                                    label="Chủ đề"
                                    onChange={handleChange}
                                    MenuProps={MenuProps}
                                    renderValue={(selected) => {
                                        const item = dataAll.find((d: any) => d.id === selected);
                                        return (
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <div className="w-5 h-5 rounded shrink-0" style={{ backgroundColor: item?.color }} />
                                                <span>{item?.name}</span>
                                            </div>
                                        );
                                    }}
                                >
                                    {
                                        dataAll.map((item: any) => {
                                            return <MenuItem key={item.id} value={item.id} className='flex items-center gap-2.5'>
                                                <div
                                                    className="w-5 h-5 rounded shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                {item.name}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <StyledTextarea
                            className='mt-4'
                            minRows={4}
                            placeholder="Nhập nội dung..."
                            onChange={onChangeTextarea}
                        />

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

export default ModalAddQuickReply