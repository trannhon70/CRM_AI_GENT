// components/SelectWithClear.tsx
import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import type { SelectChangeEvent, SelectProps, } from '@mui/material';
import { MdClear } from 'react-icons/md';

export interface SelectWithClearOption {
    id: string | number;
    name: string;
    color?: string;
    [key: string]: any;
}

interface SelectWithClearProps {
    label?: string;
    value?: string | number;
    data: SelectWithClearOption[];
    onChange: (value: string | number) => void;
    fullWidth?: boolean;
    disabled?: boolean;
    size?: SelectProps['size'];
    height?: number;
    MenuProps?: SelectProps['MenuProps'];
    showColor?: boolean; // có hiện chấm màu hay không
    placeholder?: string;
    sx?: SelectProps['sx'];
}

const SelectWithClear: React.FC<SelectWithClearProps> = ({
    label,
    value,
    data,
    onChange,
    fullWidth = true,
    disabled = false,
    size = 'small',
    height = 36,
    MenuProps,
    showColor = true,
    placeholder,
    sx,
}) => {
    const labelId = `select-with-clear-label-${label}`;

    const handleChange = (event: SelectChangeEvent<any>) => {
        onChange(event.target.value as string | number);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <FormControl fullWidth={fullWidth} disabled={disabled}>
            <InputLabel sx={{ top: -8 }} id={labelId}>
                {label}
            </InputLabel>
            <Select
                sx={{
                    height,
                    '& .MuiSelect-select': {
                        py: 0.75,
                    },
                    ...sx,
                }}
                size={size}
                labelId={labelId}
                value={value}
                label={label}
                onChange={handleChange}
                MenuProps={MenuProps}
                renderValue={(selected) => {
                    if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>{placeholder}</span>;
                    }
                    const item = data.find((d) => d.id === selected);
                    if (!item) return null;
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {showColor && (
                                <div
                                    className="w-5 h-5 rounded shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                            )}
                            <span>{item.name}</span>
                        </div>
                    );
                }}
                endAdornment={
                    value ? (
                        <IconButton
                            size="small"
                            sx={{ position: 'absolute', right: 28 }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={handleClear}
                        >
                            <MdClear fontSize="small" />
                        </IconButton>
                    ) : null
                }
            >
                {data.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        className="flex items-center gap-2.5"
                    >
                        {showColor && (
                            <div
                                className="w-5 h-5 rounded shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                        )}
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectWithClear;