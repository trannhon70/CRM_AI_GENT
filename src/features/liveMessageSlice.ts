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
    pageSize: number,
    pageIndex: number,
    total: number,
    totalPages: number,
}

const initialState = {
    loading: 'idle',
    data: [],
    pageSize: 5,
    pageIndex: 1,
    total: 0,
    totalPages: 0,

} satisfies liveMessageState as liveMessageState

const liveMessageSlice = createSlice({
    name: 'liveMessage',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchPagingLivemessage.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.pageSize = action.payload.pageSize;
            state.pageIndex = action.payload.pageIndex;
            state.total = action.payload.total;
            state.totalPages = action.payload.totalPages;
            state.loading = 'succeeded';

        });

    },
})

export const { } = liveMessageSlice.actions;
export const liveMessageReducer = liveMessageSlice.reducer;