import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import type { FC } from "react";
import React from "react";
import EmojiPicker from 'emoji-picker-react';

interface IProps {
    textareaRef?: any,
    setText?: any,
    text?: any
}

const ComponentEmojiPicker: FC<IProps> = (props) => {
    const { textareaRef, setText, text } = props
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleEmoji = (emoji: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newText =
            text.substring(0, start) +
            emoji +
            text.substring(end);

        setText(newText);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd =
                start + emoji.length;
        });
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
            <EmojiPicker onEmojiClick={(emojiData) => handleEmoji(emojiData.emoji)} />

        </Popover>
    </div>
}

export default ComponentEmojiPicker