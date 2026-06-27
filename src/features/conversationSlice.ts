import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { conversationAPI } from '../apis/conversation.api.ts'

// First, create the thunk
export const fetchPaging = createAsyncThunk(
    'conversation/getPaging',
    async (query: any) => {
        const response = await conversationAPI.getPaging(query)
        return response
    },
)



interface conversationState {
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


} satisfies conversationState as conversationState

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchPaging.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.pageSize = action.payload.pageSize;
            state.pageIndex = action.payload.pageIndex;
            state.total = action.payload.total;
            state.totalPages = action.payload.totalPages;
            state.loading = 'succeeded';

        });

    },
})

export const { } = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;