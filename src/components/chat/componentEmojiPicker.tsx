import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import type { FC } from "react";
import React from "react";
import EmojiPicker from 'emoji-picker-react';

const ComponentEmojiPicker: FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    return <div>
        <Tooltip title="Chọn icons">
            <button
                id={id}
                onClick={handleClick}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 cursor-pointer"
            >
                😊
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
                        transform: "translate(-40px, -20px) !important",

                    },
                },
            }}
        >
            <EmojiPicker onEmojiClick={(emojiObject) => console.log(emojiObject)} />

        </Popover>
    </div>
}

export default ComponentEmojiPicker