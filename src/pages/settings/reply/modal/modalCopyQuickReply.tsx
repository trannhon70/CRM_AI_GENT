import { Alert, Avatar, Chip, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, TableCell, TextField, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import type { TooltipProps } from '@mui/material/Tooltip';
import { tooltipClasses } from '@mui/material/Tooltip';
import { animated, useSpring } from '@react-spring/web';
import React, { Fragment, type FC } from "react";
import { GrSearch } from 'react-icons/gr';
import { IoMdClose } from "react-icons/io";
import { RiFileCopy2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import facebook from "../../../../assets/images/facebook.png";
import CommonTable from '../../../../components/common/CommonTable';
import IconActionButton from "../../../../components/icons/iconActionButton";
import { getPagingQuickReply } from '../../../../features/quickReplySlice';
import { useDebounce } from '../../../../hooks/useDebounce';
import type { AppDispatch, RootState } from "../../../../redux/store";
import { getContrastTextColor } from '../../../../utils/color';
import ComponentSelect from '../select';

interface FadeProps {
    children: React.ReactElement<any>;
    in?: boolean;
    onClick?: any;
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onExited?: (node: HTMLElement, isAppearing: boolean) => void;
    ownerState?: any;
}
const BootstrapTooltip = styled(
    ({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    )
)(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        fontSize: "14px", // <-- chỉnh ở đây
        lineHeight: 1.4,
        padding: "10px 12px",
        maxWidth: 800,
    },
}));

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
    const { children, in: open, onClick, onEnter, onExited, ownerState, ...other } = props;
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
    width: 1100,
    height: "90vh",
    bgcolor: '#F2F4F7',
    border: '0px solid #000',
    boxShadow: 24,
    borderRadius: 2
};

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    margin: 0,
    padding: '0px 10px',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover, // tự động theo theme light/dark
    },
}));


interface IProps {
    selectable?: boolean
}
const ModalCopyQuickReply: FC<IProps> = (props) => {
    const { selectable } = props;
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, hasMore, pageIndex } = useSelector((state: RootState) => state.quickReply);
    const [mode, setMode] = React.useState<'append' | 'replace'>('append');
    const [selectedKeys, setSelectedKeys] = React.useState<React.Key[]>([]);
    const [search, setSearch] = React.useState<string>("");
    const searchDebounce = useDebounce(search, 500);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        dispatch(getPagingQuickReply({ page_id: String(id), pageIndex: 1, limit: 10, search: "" }));
        setSelectedKeys([])
        setSearch("");
        setOpen(false);
    }

    React.useEffect(() => {
        dispatch(getPagingQuickReply({ page_id: String(id), pageIndex: 1, limit: 100, search: searchDebounce }))
    }, [id, searchDebounce, dispatch])

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            if (distanceToBottom < 50 && hasMore && loading !== "pending") {
                dispatch(getPagingQuickReply({ page_id: String(id), pageIndex: Number(pageIndex) + 1, limit: 100, search: searchDebounce }))
            }
        },
        [hasMore, loading]
    );

    const columns: any = [
        {
            key: "stt",
            label: "STT",
            align: "center",
            width: 70
        },
        {
            key: "quickReplyCategory",
            label: "Chủ đề",
            width: 200
        },
        {
            key: "content",
            label: "Tin nhắn",
        },
    ];

    return <Fragment>
        <IconActionButton
            icon={<RiFileCopy2Fill size={20} />}
            tooltip="Sao chép tất cả danh sách QR"
            color="info"
            disabled={selectable}
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
                <Box sx={style} className="flex flex-col ">
                    <div className='flex items-center justify-between p-3 bg-white rounded-tl rounded-tr ' >
                        <div className='text-lg font-medium text-black ' >Sao chép trả lời nhanh</div>
                        <div onClick={handleClose} className='w-8 h-8 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded' >
                            <IoMdClose size={25} />
                        </div>
                    </div>
                    <div className='flex flex-col flex-1 min-h-0 gap-2.5 p-3 bg-[#F2F4F7]' >
                        <div className='flex items-center gap-5 shrink-0 ' >
                            <div className='flex-1 bg-white rounded px-5 p-3' >
                                <div className='flex items-center gap-3' >
                                    <Avatar src={undefined}>
                                        {/* {item.full_name?.charAt(0).toUpperCase()} */} A
                                    </Avatar>
                                    <div className='leading-1' >
                                        <div className='text-[#4a4b4d] text-sm font-semibold'>Trang nguồn</div>
                                        <div className='text-xl text-black font-medium' >Tư vấn nam khoa HCM</div>
                                        <div className='flex items-center gap-2.5 text-[#4a4b4d] text-sm'>
                                            <img src={facebook} alt="facebook" className="w-4 h-4" />
                                            tuvannamkhoahcm88
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='shrink-0' >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 9.99981V21.9998C6 22.265 5.89464 22.5194 5.70711 22.7069C5.51957 22.8945 5.26522 22.9998 5 22.9998C4.73478 22.9998 4.48043 22.8945 4.29289 22.7069C4.10536 22.5194 4 22.265 4 21.9998V9.99981C4 9.73459 4.10536 9.48024 4.29289 9.2927C4.48043 9.10517 4.73478 8.99981 5 8.99981C5.26522 8.99981 5.51957 9.10517 5.70711 9.2927C5.89464 9.48024 6 9.73459 6 9.99981ZM9 8.99981C8.73478 8.99981 8.48043 9.10517 8.29289 9.2927C8.10536 9.48024 8 9.73459 8 9.99981V21.9998C8 22.265 8.10536 22.5194 8.29289 22.7069C8.48043 22.8945 8.73478 22.9998 9 22.9998C9.26522 22.9998 9.51957 22.8945 9.70711 22.7069C9.89464 22.5194 10 22.265 10 21.9998V9.99981C10 9.73459 9.89464 9.48024 9.70711 9.2927C9.51957 9.10517 9.26522 8.99981 9 8.99981ZM29.7075 15.2923L17.7075 3.29231C17.5676 3.1523 17.3894 3.05693 17.1953 3.01828C17.0012 2.97963 16.8 2.99944 16.6172 3.07519C16.4344 3.15094 16.2782 3.27923 16.1683 3.44383C16.0584 3.60842 15.9998 3.80192 16 3.99981V8.99981H13C12.7348 8.99981 12.4804 9.10517 12.2929 9.2927C12.1054 9.48024 12 9.73459 12 9.99981V21.9998C12 22.265 12.1054 22.5194 12.2929 22.7069C12.4804 22.8945 12.7348 22.9998 13 22.9998H16V27.9998C15.9998 28.1977 16.0584 28.3912 16.1683 28.5558C16.2782 28.7204 16.4344 28.8487 16.6172 28.9244C16.8 29.0002 17.0012 29.02 17.1953 28.9813C17.3894 28.9427 17.5676 28.8473 17.7075 28.7073L29.7075 16.7073C29.8005 16.6144 29.8742 16.5041 29.9246 16.3828C29.9749 16.2614 30.0008 16.1312 30.0008 15.9998C30.0008 15.8684 29.9749 15.7383 29.9246 15.6169C29.8742 15.4955 29.8005 15.3852 29.7075 15.2923Z" fill="#95DE64"></path></svg>
                            </div>
                            <ComponentSelect />
                        </div>

                        <div className='flex items-center gap-5 shrink-0 ' >
                            <Alert sx={{ width: "100%", padding: "0px 15px", color: "#4a4b4d", fontWeight: 500 }} severity="info" onClose={() => { }} >
                                Mỗi trang sẽ chỉ có tối đa 1000 câu trả lời nhanh, 200 thẻ hội thoại, nếu quá số lượng, bạn sẽ không thể sao chép được.
                            </Alert>
                        </div>
                        <div className='flex flex-col flex-1 min-h-0 bg-white rounded p-3 ' >
                            <div className='flex items-center justify-between shrink-0' >
                                <TextField
                                    onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => { setSearch(event.target.value) }}
                                    value={search}
                                    size="small"
                                    variant="outlined"
                                    placeholder="Tìm kiếm tin nhắn"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <GrSearch />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        width: 300,
                                        "& .MuiOutlinedInput-root": {
                                            height: 32,
                                        },
                                    }}
                                />
                                {
                                    selectedKeys.length > 0 && <Chip variant="filled" color="primary" label={`Đã chọn ${selectedKeys.length || 0}`} size="small" />
                                }

                            </div>

                            <CommonTable
                                selectable={true}
                                selectedKeys={selectedKeys}
                                onSelectedKeysChange={setSelectedKeys}
                                containerRef={tableContainerRef}
                                handleScroll={handleScroll}
                                containerProps={{ sx: { mt: 1 } }}
                                skeletonCount={10}
                                columns={columns}
                                data={data}
                                loading={loading}
                                getRowKey={(item) => item.id}
                                emptyText="Coming soon"
                                renderRow={(item: any, index: number) => (
                                    <>
                                        <TableCell align="center"> {index + 1} </TableCell>
                                        <TableCell>
                                            {item?.quickReplyCategory ? (
                                                <Chip
                                                    label={item.quickReplyCategory.name}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: item.quickReplyCategory.color,
                                                        color: getContrastTextColor(item.quickReplyCategory.color),
                                                    }}
                                                />
                                            ) : (
                                                <span>—</span> // hoặc để trống, tùy UX bạn muốn
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-75 cursor-pointer">
                                            <BootstrapTooltip title={item.content} placement="top">
                                                <div className="font-medium truncate w-full">
                                                    {item.content}
                                                </div>
                                            </BootstrapTooltip >
                                        </TableCell>
                                    </>
                                )}
                            />

                        </div>
                    </div>
                    <div className='flex items-center justify-between h-14 px-7 gap-2.5 bg-white rounded-bl rounded-br' >
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="copy-mode-label"
                                name="copy-mode-group"
                                value={mode}
                                onChange={(e) => setMode(e.target.value as 'append' | 'replace')}
                            >
                                <StyledFormControlLabel
                                    value="append"
                                    control={<Radio />}
                                    label="Thêm vào danh sách hiện có"
                                />
                                <StyledFormControlLabel
                                    value="replace"
                                    control={<Radio />}
                                    label="Thay thế danh sách hiện có"
                                />
                            </RadioGroup>
                        </FormControl>
                        <div className='flex items-center justify-end gap-2.5' >
                            <Button onClick={handleClose} color='inherit' variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Đóng</Button>
                            <Button loading={false} variant="contained" sx={{ height: 35, px: 2, textTransform: "none" }}>Sao chép</Button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    </Fragment>
}

export default ModalCopyQuickReply