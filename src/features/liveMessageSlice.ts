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
    data: any,
    limit: number,
    lastId: number,
    lastUpdatedAt: number,
    hasMore: boolean,
}

const initialState = {
    loading: 'idle',
    data: [],
    limit: 5,
    lastUpdatedAt: 0,
    lastId: 1,
    hasMore: false,

} satisfies liveMessageState as liveMessageState

const liveMessageSlice = createSlice({
    name: 'liveMessage',
    initialState,
    reducers: {
        updateMessage(state, action) {
            state.data.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPagingLivemessage.fulfilled, (state, action) => {
            console.log(action.meta.arg, 'action.meta.arg');
            if (!action.payload.lastId) {
                // Lần đầu load hoặc search mới → reset
                state.data = action.payload.data;
            }
            else {
                // Scroll load thêm → append
                state.data = [...action.payload.data, ...state.data];
            }
            state.lastId = action.payload.lastId;
            state.limit = action.payload.limit;
            state.lastUpdatedAt = action.payload.lastUpdatedAt;
            state.hasMore = action.payload.hasMore;
            state.loading = 'succeeded';

        });

    },
})

export const { updateMessage } = liveMessageSlice.actions;
export const liveMessageReducer = liveMessageSlice.reducer;