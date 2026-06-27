import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useEffect, useState, type FC } from "react";
import { GrSearch } from "react-icons/gr";
import { PiSortDescending } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import ConversationItem from "../../../pages/conversation/conversationItem";
import PendingSyncComponent from "../../../pages/conversation/pendingSync";
import SyncFailedComponent from "../../../pages/conversation/syncFailed";
import SyncingComponent from "../../../pages/conversation/syncing";
import type { AppDispatch, RootState } from "../../../redux/store";
import { SyncStatus } from "../../../utils";
import { useParams } from "react-router-dom";
import { fetchPaging } from "../../../features/conversationSlice";
import { useDebounce } from "../../../hooks/useDebounce";
const ComponentLeftConversation: FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const fanPages = useSelector((state: RootState) => state.fanPages);
    const { data, total } = useSelector((state: RootState) => state.conversation);
    const [search, setSearch] = useState("");
    const searchDebounce = useDebounce(search, 500);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchPaging({ pageIndex: 1, pageSize: 100, page_id: id, search: searchDebounce }));
    }, [id, searchDebounce, dispatch]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    return <div>
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
                                <GrSearch />
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
            data.map((item: any) => {
                return <ConversationItem item={item} key={item.id} />
            })

        )}



    </div>
}

export default ComponentLeftConversation