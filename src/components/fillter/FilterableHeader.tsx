// components/FilterableHeader.tsx
import { useState } from "react";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Checkbox,
    ListItemText,
    Typography,
    Divider,
    Button,
} from "@mui/material";
import { MdFilterListAlt } from "react-icons/md";


export interface FilterOption {
    value: string;
    label: string;
    color?: string;
}

interface FilterableHeaderProps {
    label: string;
    options: FilterOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function FilterableHeader({
    label,
    options,
    selected,
    onChange,
}: FilterableHeaderProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const active = selected.length > 0;

    const toggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <span>{label}</span>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
                sx={{ color: active ? "primary.main" : "#94a3b8" }}
            >
                <MdFilterListAlt size={20} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                {options.map((opt) => (
                    <MenuItem
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        dense
                    >
                        <Checkbox
                            size="small"
                            checked={selected.includes(opt.value)}
                            sx={{ p: 0.5, mr: 1 }}
                        />
                        <ListItemText primary={opt.label} />
                    </MenuItem>
                ))}
                {options.length === 0 && (
                    <MenuItem disabled dense>
                        <Typography variant="body2" color="text.secondary">
                            Không có dữ liệu
                        </Typography>
                    </MenuItem>
                )}
                {active && (
                    <>
                        <Divider />
                        <Box sx={{ px: 1.5 }}>
                            <Button
                                color="warning"
                                variant="contained"
                                size="small"
                                fullWidth
                                onClick={() => onChange([])}
                            >
                                Xoá lọc
                            </Button>
                        </Box>
                    </>
                )}
            </Menu>
        </Box>
    );
}