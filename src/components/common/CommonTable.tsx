import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, type SxProps, type TableContainerProps, type TableProps, } from "@mui/material";
import { useCallback, type ReactNode } from "react";
export type LoadingState = | "idle" | "pending" | "succeeded" | "failed";
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
    handleScroll?: any,
    containerRef?: any;
}

function CommonTable<T>({ columns, data, loading = "idle", emptyText = "Không có dữ liệu", errorText = "Có lỗi xảy ra", skeletonCount = 8,
    renderRow, getRowKey, rowSx, tableProps, containerProps, handleScroll, containerRef
}: CommonTableProps<T>) {
    const isLoading = loading === "pending";
    const isError = loading === "failed";


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
                        Array.from({
                            length: skeletonCount,
                        }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        align={column.align}
                                    >
                                        {column.skeleton ?? (
                                            <Skeleton width="70%" />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {/* Error */}
                    {isError && (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
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
                    {!isLoading &&
                        !isError &&
                        data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <Box
                                        sx={{
                                            height: 300,
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
                        data.map((item, index) => (
                            <TableRow
                                key={
                                    getRowKey
                                        ? getRowKey(item, index)
                                        : index
                                }
                                hover
                                sx={{
                                    transition: ".2s",
                                    "&:hover": {
                                        backgroundColor: "#f8fafc",
                                    },
                                    ...rowSx,
                                }}
                            >
                                {renderRow(item, index)}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CommonTable;