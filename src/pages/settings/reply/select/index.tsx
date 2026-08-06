import { Avatar, Box, ClickAwayListener, Fade, InputAdornment, Paper, Popper, TextField } from "@mui/material";
import React, { Fragment, type FC } from "react";
import IconActionButton from "../../../../components/icons/iconActionButton";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import facebook from "../../../../assets/images/facebook.png";
import { GrSearch } from "react-icons/gr";

const pages = [
    {
        id: 1,
        name: "Tư vấn nam khoa HCM",
        username: "tuvannamkhoahcm88",
    },
    {
        id: 2,
        name: "Phòng khám ABC",
        username: "phongkhamabc",
    },
    {
        id: 3,
        name: "Bệnh viện XYZ",
        username: "benhvienxyz",
    },
];

const ComponentSelect: FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <div className="flex-1 bg-white rounded px-5 py-3">
                <div className="flex items-center gap-3">
                    <Avatar>A</Avatar>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-[#4a4b4d]">Trang đích</div>
                        <div className="text-xl font-medium"> Tư vấn nam khoa HCM </div>
                        <div className="flex items-center gap-2 text-sm text-[#4a4b4d]">
                            <img src={facebook} className="w-4 h-4" alt="" />  tuvannamkhoahcm88
                        </div>
                    </div>
                    <IconActionButton icon={!open ? <FaAngleDown size={20} /> : <FaAngleUp size={20} />} tooltip="" color="default" onClick={handleClick} />
                </div>
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
                                                input: { startAdornment: (<InputAdornment position="start"><GrSearch /> </InputAdornment>) },
                                            }}
                                            sx={{ "& .MuiOutlinedInput-root": { height: 32, } }}
                                        />
                                    </Box>

                                    <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                                        {pages.map((page) => (
                                            <Box
                                                key={page.id}
                                                sx={{
                                                    display: "flex", alignItems: "center", gap: 2, px: 2, py: 1.5, cursor: "pointer", transition: ".2s",
                                                    "&:hover": {
                                                        bgcolor: "#F5F7FA",
                                                    },
                                                }}
                                            >
                                                <Avatar> {page.name.charAt(0)} </Avatar>
                                                <Box flex={1}>
                                                    <Box sx={{ fontWeight: 600, color: "#111827", }}>{page.name} </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#6B7280", fontSize: 13, }} >
                                                        <img src={facebook} className="w-4 h-4" alt="..." />
                                                        {page.username}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
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