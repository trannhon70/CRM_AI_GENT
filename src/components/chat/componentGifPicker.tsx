import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import type { FC } from "react";
import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiGifFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import ResizeObserver from "react-resize-observer";
import { LiveMessageAPI } from "../../apis/liveMessage.api";
import { sendMessage } from "../../features/liveMessageSlice";
import { useDebounce } from "../../hooks/useDebounce";
import type { AppDispatch, RootState } from "../../redux/store";
import { MessageDirection, MessageType } from "../../utils";

const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

function GridDemo({ onGifClick, search }: any) {
    const [width, setWidth] = useState(window.innerWidth);

    const fetchGifs = (offset: number) => {
        if (search.trim()) {
            return giphyFetch.search(search, {
                offset,
                limit: 10,
            });
        }

        return giphyFetch.trending({
            offset,
            limit: 10,
        });
    };

    return (
        <>
            <Grid
                key={search}
                fetchGifs={fetchGifs}
                onGifClick={onGifClick}
                width={width}
                columns={3}
                gutter={6}
            />
            <ResizeObserver
                onResize={({ width }) => setWidth(width)}
            />
        </>
    );
}

const ComponentGifPicker: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const conversation = useSelector((state: RootState) => state.conversation);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [search, setSearch] = React.useState<string>("")
    const searchDebounce = useDebounce(search, 500);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onChangeSearch = (event: any) => {
        setSearch(event.target.value)
    }

    const handleSendGif = async (gif: any) => {
        const body = {
            id: Date.now().toString(),
            page_id: conversation.active.page_id,
            customer_id: conversation.active.customer_id,
            conversation_id: conversation.active.id,
            type: MessageType.IMAGE,
            attachments: [
                {
                    id: gif.id,
                    url: gif.images.downsized.url,
                    name: gif.title,
                    size: gif.images.downsized.size,
                    mime_type: gif.type,
                    width: gif.images.downsized.width,
                    height: gif.images.downsized.height,
                }
            ],
            direction: MessageDirection.STAFF,
            sent_at: Math.floor(Date.now() / 1000),
        };
        // thực hiện update UI message
        dispatch(sendMessage(body));
        await LiveMessageAPI.sendMessage(body)

        handleClose()
    }
    return <div>
        <Tooltip title="Chọn file GIF">
            <button
                id={id}
                onClick={handleClick}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 cursor-pointer"
            >
                <PiGifFill size={25} />
            </button>
        </Tooltip>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            slotProps={{
                paper: {
                    sx: {
                        overflow: "hidden",
                        transform: "translate(-300px, -20px) !important",
                        height: 400,
                        width: 400,
                        background: "#333334"
                    },
                },
            }}
        >
            <div className="flex flex-col h-full">
                <div className="p-2 shrink-0" >
                    <TextField id="outlined-basic" placeholder="tìm kiếm GIF" variant="outlined" size="small" fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoSearchSharp size={25} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "9999px",
                                backgroundColor: "#f3f4f6",
                                transition: "all .2s",

                                "& fieldset": {
                                    border: "none",
                                },

                                "&:hover": {
                                    backgroundColor: "#e5e7eb",
                                },

                                "&.Mui-focused": {
                                    backgroundColor: "#fff",
                                    boxShadow: "0 0 0 2px rgba(24,119,242,.15)",
                                },
                            },

                            "& input": {
                                py: 1,
                                fontSize: 14,
                            },
                        }}
                        onChange={onChangeSearch}
                    />
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pb-1 box-border" >
                    <GridDemo
                        search={searchDebounce}
                        onGifClick={(gif: any, e: any) => {
                            e.preventDefault();
                            handleSendGif(gif)
                        }}
                    />
                </div>
            </div>
        </Popover>
    </div>
}

export default ComponentGifPicker