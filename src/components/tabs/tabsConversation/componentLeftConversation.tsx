import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useEffect, useMemo, useRef, useState, type FC } from "react";
import { GrSearch } from "react-icons/gr";
import { PiSortDescending } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPaging } from "../../../features/conversationSlice";
import { useDebounce } from "../../../hooks/useDebounce";
import ConversationItem from "../../../pages/conversation/conversationItem";
import PendingSyncComponent from "../../../pages/conversation/pendingSync";
import SyncFailedComponent from "../../../pages/conversation/syncFailed";
import SyncingComponent from "../../../pages/conversation/syncing";
import type { AppDispatch, RootState } from "../../../redux/store";
import { SyncStatus } from "../../../utils";
import { CircularProgress } from "@mui/material";


const ComponentLeftConversation: FC = () => {
    const { id } = useParams();
    const parentRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const fanPages = useSelector((state: RootState) => state.fanPages);
    const { data, pageIndex, limit, loading, hasMore } = useSelector((state: RootState) => state.conversation);
    const [search, setSearch] = useState("");
    const { searchDebounce } = useDebounce(search, 500);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchPaging({ pageIndex: 1, limit: 20, page_id: id, search: searchDebounce }));
    }, [id, searchDebounce, dispatch]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const sortedData = useMemo(() => {
        const arr = [...data].sort((a, b) => b.last_message_at - a.last_message_at);
        return arr;
    }, [data]);


    const rowVirtualizer = useVirtualizer({
        count: sortedData?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 10,
    });


    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            if (distanceToBottom < 50 && hasMore && loading !== "pending") {
                dispatch(fetchPaging({ pageIndex: Number(pageIndex) + 1, limit: limit, page_id: id, search: searchDebounce }));
            }
        },
        [hasMore, loading]
    );

    return <div className="flex flex-col h-full" >
        <div className="flex items-center gap-2 p-3 w-full">
            <TextField
                onChange={handleSearch}
                value={search}
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Tìm kiếm"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                {loading !== "succeeded" ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    <GrSearch size={20} />
                                )}
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ flex: 1 }}
            />

            <Button
                startIcon={<PiSortDescending />}
                variant="contained"
                size="medium"
                sx={{
                    fontSize: '12px',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                }}
            >
                Lọc theo
            </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {fanPages.page.syncStatus === SyncStatus.PENDING && (
                <PendingSyncComponent />
            )}

            {fanPages.page.syncStatus === SyncStatus.SYNCING && (
                <SyncingComponent />
            )}

            {fanPages.page.syncStatus === SyncStatus.FAILED && (
                <SyncFailedComponent />
            )}

            {fanPages.page.syncStatus === SyncStatus.SUCCESS && (
                <div
                    ref={parentRef}
                    className="h-full overflow-auto"
                    onScroll={handleScroll}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            return <div
                                key={virtualRow.key}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <ConversationItem
                                    item={sortedData[virtualRow.index]}
                                />
                            </div>
                        })}
                    </div>
                </div>

            )}
        </div>



    </div>
}

export default ComponentLeftConversation