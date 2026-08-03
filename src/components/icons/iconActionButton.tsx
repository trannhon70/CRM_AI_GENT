import { Button, Tooltip, type SxProps } from "@mui/material";
import { type ReactNode } from "react";

export type IconActionButtonColor =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";

interface ColorSet {
    bg: string;
    hover: string;
    color: string;
}

// Bảng màu style giống MUI palette (light + main + contrastText)
const COLOR_MAP: Record<IconActionButtonColor, ColorSet> = {
    default: {
        bg: "#EAECF0",
        hover: "#b1b3b6",
        color: "#475569",
    },
    primary: {
        bg: "#E0EAFF",
        hover: "#C7D7FE",
        color: "#3538CD",
    },
    secondary: {
        bg: "#F4EBFF",
        hover: "#E9D7FE",
        color: "#6941C6",
    },
    success: {
        bg: "#D1FADF",
        hover: "#A6F4C5",
        color: "#027A48",
    },
    error: {
        bg: "#FEE4E2",
        hover: "#FECDCA",
        color: "#B42318",
    },
    warning: {
        bg: "#FEF0C7",
        hover: "#FEDF89",
        color: "#B54708",
    },
    info: {
        bg: "#E0F2FE",
        hover: "#B9E6FE",
        color: "#026AA2",
    },
};

interface IconActionButtonProps {
    icon: ReactNode;
    tooltip?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    sx?: SxProps;
    color?: IconActionButtonColor;
    // vẫn cho override riêng lẻ nếu cần màu tuỳ chỉnh ngoài preset
    bgColor?: string;
    hoverColor?: string;
    textColor?: string;
    size?: number;
}

function IconActionButton({
    icon,
    tooltip,
    onClick,
    disabled,
    sx,
    color = "default",
    bgColor,
    hoverColor,
    textColor,
    size = 32,
}: IconActionButtonProps) {
    const preset = COLOR_MAP[color];

    const button = (
        <Button
            onClick={onClick}
            disabled={disabled}
            sx={{
                minWidth: size,
                width: size,
                height: size,
                padding: 0,
                borderRadius: 1,
                backgroundColor: bgColor ?? preset.bg,
                color: textColor ?? preset.color,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color .2s",
                "&:hover": {
                    backgroundColor: hoverColor ?? preset.hover,
                },
                "&.Mui-disabled": {
                    backgroundColor: "#f1f5f9",
                    color: "#cbd5e1",
                },
                ...sx,
            }}
        >
            {icon}
        </Button>
    );

    if (!tooltip) return button;

    return (
        <Tooltip title={tooltip} disableInteractive>
            <span>{button}</span>
        </Tooltip>
    );
}

export default IconActionButton;