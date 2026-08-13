import { Avatar, Box, CircularProgress, ClickAwayListener, Fade, InputAdornment, Paper, Popper, TextField } from "@mui/material";
import React, { Fragment, useLayoutEffect, useState, type FC } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import IconActionButton from "../../../../components/icons/iconActionButton";
import { SocialIcon } from "../../../../components/icons/SocialIcon";
import { useDebounce } from "../../../../hooks/useDebounce";
import { userPageRepository } from "../../../../storage";

interface ComponentSelectProps {
    onSelect?: (item: any) => void;
    source_page?: any;
}

const ComponentSelect: FC<ComponentSelectProps> = ({ onSelect, source_page }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const [search, setSearch] = React.useState<string>("");
    const { searchDebounce, loading } = useDebounce(search, 500);
    const [data, setData] = useState<any>([]);
    const [selectedPage, setSelectedPage] = useState<any>(null);

    useLayoutEffect(() => {
        getDataCache()
    }, [searchDebounce])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getDataCache = async () => {
        const result = await userPageRepository.search({ search: searchDebounce });
        setData(result)
    }

    const handleSelectItem = (item: any) => {
        setSelectedPage(item);
        onSelect?.(item);
        // Nếu muốn chọn xong thì đóng luôn popper:
        // handleClose();
    };

    return (
        <Fragment>
            <div className="flex-1 bg-white rounded px-5 py-3">
                {
                    selectedPage ?
                        <div className="flex items-center gap-3">
                            <Avatar src={selectedPage.page.page_avatar}>
                                {selectedPage.page.page_name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-[#4a4b4d]">Trang đích</div>
                                <>
                                    <div className="text-xl font-medium"> {selectedPage.page.page_name}</div>
                                    <div className="flex items-center gap-2 text-sm text-[#4a4b4d]">
                                        <SocialIcon value={selectedPage.page.page_platform} />  {selectedPage.page.page_id}
                                    </div>
                                </>

                            </div>


                            <IconActionButton icon={!open ? <FaAngleDown size={20} /> : <FaAngleUp size={20} />} tooltip="" color="default" onClick={handleClick} />
                        </div>
                        : <div className="flex items-center gap-3">
                            <Avatar >
                                ?
                            </Avatar>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-[#4a4b4d]">Trang đích</div>
                                <div className="flex items-center gap-2 text-lg font-medium text-[#4a4b4d]">Chưa chọn trang</div>

                            </div>


                            <IconActionButton icon={!open ? <FaAngleDown size={20} /> : <FaAngleUp size={20} />} tooltip="" color="default" onClick={handleClick} />
                        </div>

                }
            </div>

            <Popper open={open} anchorEl={anchorEl} placement="bottom-end" transition
                modifiers={[{ name: "offset", options: { offset: [21, 35], }, },]}
                sx={{ zIndex: (theme) => theme.zIndex.modal + 100, }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <Paper
                            elevation={10}
                            sx={{ width: 505, borderRadius: 2, overflow: "hidden", border: "1px solid #E5E7EB" }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    <Box sx={{ px: 2, py: 1, fontWeight: 600, borderBottom: "1px solid #F3F4F6", }}>
                                        <TextField fullWidth variant="outlined" placeholder="Nhập tên trang để tìm kiếm"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (<InputAdornment position="start"> {loading ? (
                                                        <CircularProgress size={18} />
                                                    ) : (
                                                        <IoSearch size={20} />
                                                    )}</InputAdornment>)
                                                },
                                            }}
                                            sx={{ "& .MuiOutlinedInput-root": { height: 32, } }}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => { setSearch(event.target.value) }}
                                        />
                                    </Box>

                                    <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                                        {data.filter((item: any) => item.fanpage_id !== source_page?.id).map((item: any) => {
                                            const isActive = selectedPage?.id === item.id;
                                            return (
                                                <Box
                                                    key={item.id}
                                                    onClick={() => handleSelectItem(item)}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        px: 2,
                                                        py: 1.5,
                                                        cursor: "pointer",
                                                        transition: ".2s",
                                                        bgcolor: isActive ? "#EEF2FF" : "transparent",
                                                        borderLeft: isActive ? "3px solid #4F46E5" : "3px solid transparent",
                                                        "&:hover": {
                                                            bgcolor: isActive ? "#EEF2FF" : "#F5F7FA",
                                                        },
                                                    }}
                                                >
                                                    <Avatar src={item.page.page_avatar}>
                                                        {item.page.page_name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box flex={1}>
                                                        <Box sx={{ fontWeight: 600, color: "#111827" }}>{item.page.page_name}</Box>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#6B7280", fontSize: 13 }}>
                                                            <SocialIcon value={item.page.page_platform} />
                                                            {item.page.page_id}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Fragment>
    );
};

export default ComponentSelect;