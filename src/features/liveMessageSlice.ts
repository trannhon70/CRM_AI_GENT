import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LiveMessageAPI } from '../apis/liveMessage.api.ts'

// First, create the thunk
export const fetchPagingLivemessage = createAsyncThunk(
    'live-message/getPaging',
    async (query: any) => {
        const response = await LiveMessageAPI.getPaging(query)
        return response
    },
)


interface liveMessageState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    currentRequestId: string | null,
    data: any,
    pageIndex: number,
    limit: number,

    hasMore: boolean,
}

const initialState = {
    loading: 'idle',
    currentRequestId: null,
    data: [],
    pageIndex: 1,
    limit: 5,

    hasMore: false,

} satisfies liveMessageState as liveMessageState

const liveMessageSlice = createSlice({
    name: 'liveMessage',
    initialState,
    reducers: {
        updateMessage(state, action) {
            state.data.push(action.payload);
        },
        sendMessage(state, action) {
            state.data.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPagingLivemessage.pending, (state, action) => {
            state.currentRequestId = action.meta.requestId;
        });
        builder.addCase(fetchPagingLivemessage.fulfilled, (state, action) => {
            if (state.currentRequestId !== action.meta.requestId) {
                return; // bỏ qua request cũ
            }
            if (action.meta.arg.pageIndex === 1) {
                state.data = action.payload.data;
            } else {
                state.data = [...action.payload.data, ...state.data];
            }
            state.pageIndex = action.meta.arg.pageIndex;
            state.limit = action.payload.limit;
            state.hasMore = action.payload.hasMore;
            state.loading = 'succeeded';

        });

    },
})

export const { updateMessage, sendMessage } = liveMessageSlice.actions;
export const liveMessageReducer = liveMessageSlice.reducer;