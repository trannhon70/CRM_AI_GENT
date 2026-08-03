import {
    Box,
    Checkbox,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    type SxProps,
    type TableContainerProps,
    type TableProps,
} from "@mui/material";
import { type ReactNode } from "react";

export type LoadingState = "idle" | "pending" | "succeeded" | "failed";

export interface TableColumn {
    key: string;
    label: ReactNode;
    align?: "left" | "center" | "right";
    width?: number | string;
    skeleton?: ReactNode;
}

interface CommonTableProps<T> {
    columns: TableColumn[];
    data: T[];
    loading?: LoadingState;
    emptyText?: ReactNode;
    errorText?: ReactNode;
    skeletonCount?: number;
    renderRow: (item: T, index: number) => ReactNode;
    getRowKey?: (item: T, index: number) => React.Key;
    rowSx?: SxProps;
    tableProps?: TableProps;
    containerProps?: TableContainerProps;
    handleScroll?: any;
    containerRef?: any;

    // ---- Selection (checkbox) ----
    selectable?: boolean;
    selectedKeys?: React.Key[];
    onSelectedKeysChange?: (keys: React.Key[]) => void;
    isRowSelectable?: (item: T) => boolean; // để disable checkbox 1 số dòng nếu cần
}

function CommonTable<T>({
    columns,
    data,
    loading = "idle",
    emptyText = "Không có dữ liệu",
    errorText = "Có lỗi xảy ra",
    skeletonCount = 8,
    renderRow,
    getRowKey,
    rowSx,
    tableProps,
    containerProps,
    handleScroll,
    containerRef,
    selectable = false,
    selectedKeys,
    onSelectedKeysChange,
    isRowSelectable,
}: CommonTableProps<T>) {
    const isLoading = loading === "pending";
    const isError = loading === "failed";

    const getKey = (item: T, index: number): React.Key =>
        getRowKey ? getRowKey(item, index) : index;

    const selectableData = isRowSelectable
        ? data.filter((item) => isRowSelectable(item))
        : data;

    const selectableKeys = selectableData.map((item, i) =>
        getKey(item, data.indexOf(item) !== -1 ? data.indexOf(item) : i)
    );

    const selectedSet = new Set(selectedKeys ?? []);

    const allSelected =
        selectableKeys.length > 0 &&
        selectableKeys.every((k) => selectedSet.has(k));

    const someSelected =
        selectableKeys.some((k) => selectedSet.has(k)) && !allSelected;

    const toggleAll = () => {
        if (!onSelectedKeysChange) return;
        if (allSelected) {
            // bỏ chọn hết các key thuộc trang/data hiện tại
            const next = (selectedKeys ?? []).filter(
                (k) => !selectableKeys.includes(k)
            );
            onSelectedKeysChange(next);
        } else {
            const next = new Set(selectedKeys ?? []);
            selectableKeys.forEach((k) => next.add(k));
            onSelectedKeysChange(Array.from(next));
        }
    };

    const toggleOne = (key: React.Key) => {
        if (!onSelectedKeysChange) return;
        const next = new Set(selectedKeys ?? []);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        onSelectedKeysChange(Array.from(next));
    };

    return (
        <TableContainer
            className="table-scroll"
            ref={containerRef}
            {...containerProps}
            sx={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                boxShadow: "none",
                ...containerProps?.sx,
            }}
            onScroll={(e) => {
                containerProps?.onScroll?.(e);
                handleScroll?.(e);
            }}
        >
            <Table
                stickyHeader
                size="small"
                {...tableProps}
                sx={{
                    "& .MuiTableCell-root": {
                        borderBottom: "1px solid #f0f0f0",
                        py: 1.5,
                    },
                    ...tableProps?.sx,
                }}
            >
                <TableHead>
                    <TableRow>
                        {selectable && (
                            <TableCell
                                padding="checkbox"
                                sx={{
                                    backgroundColor: "#f8fafc",
                                }}
                            >
                                <Checkbox
                                    size="small"
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={toggleAll}
                                    disabled={selectableKeys.length === 0}
                                />
                            </TableCell>
                        )}
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                align={column.align}
                                sx={{
                                    width: column.width,
                                    fontWeight: 600,
                                    color: "#475569",
                                    backgroundColor: "#f8fafc",
                                    px: 1,
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/* Loading */}
                    {isLoading &&
                        Array.from({ length: skeletonCount }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {selectable && (
                                    <TableCell padding="checkbox">
                                        <Skeleton variant="circular" width={20} height={20} />
                                    </TableCell>
                                )}
                                {columns.map((column) => (
                                    <TableCell key={column.key} align={column.align}>
                                        {column.skeleton ?? <Skeleton width="70%" />}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {/* Error */}
                    {isError && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (selectable ? 1 : 0)}
                            >
                                <Box
                                    sx={{
                                        height: 300,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "error.main",
                                    }}
                                >
                                    {errorText}
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Empty */}
                    {!isLoading && !isError && data.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (selectable ? 1 : 0)}
                            >
                                <Box
                                    sx={{
                                        height: "100%",
                                        minHeight: 200,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#94a3b8",
                                        fontSize: 16,
                                    }}
                                >
                                    {emptyText}
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Data */}
                    {!isLoading &&
                        !isError &&
                        data.map((item, index) => {
                            const key = getKey(item, index);
                            const rowDisabled = isRowSelectable
                                ? !isRowSelectable(item)
                                : false;

                            return (
                                <TableRow
                                    key={key}
                                    hover
                                    selected={selectedSet.has(key)}
                                    sx={{
                                        transition: ".2s",
                                        "&:hover": {
                                            backgroundColor: "#f8fafc",
                                        },
                                        ...rowSx,
                                    }}
                                >
                                    {selectable && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                size="small"
                                                checked={selectedSet.has(key)}
                                                disabled={rowDisabled}
                                                onChange={() => toggleOne(key)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
                                    )}
                                    {renderRow(item, index)}
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CommonTable;