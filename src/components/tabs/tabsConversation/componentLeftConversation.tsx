import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import type { FC } from "react";
import { GrSearch } from "react-icons/gr";
import { PiSortDescending } from "react-icons/pi";
import { useSelector } from "react-redux";
import ConversationItem from "../../../pages/conversation/conversationItem";
import PendingSyncComponent from "../../../pages/conversation/pendingSync";
import SyncFailedComponent from "../../../pages/conversation/syncFailed";
import SyncingComponent from "../../../pages/conversation/syncing";
import type { RootState } from "../../../redux/store";
import { SyncStatus } from "../../../utils";
const ComponentLeftConversation: FC = () => {
    const fanPages = useSelector((state: RootState) => state.fanPages);
    console.log(fanPages);

    return <div>
        <div className="flex items-center gap-2 p-3 w-full">
            <TextField
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
            <ConversationItem />
        )}



    </div>
}

export default ComponentLeftConversation