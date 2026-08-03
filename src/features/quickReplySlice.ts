import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { quickReplyAPI } from '../apis/quickReply.api.ts'


export const getPagingQuickReply = createAsyncThunk(
    'quick-reply/getPagingQuickReply',
    async (thunkAPI: any) => {
        const response = await quickReplyAPI.getPaging(thunkAPI)
        return response.data
    },
)


interface QuickReplyState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    currentRequestId: string | null,
    data: any[],
    pageIndex?: number,
    limit?: number,
    hasMore: boolean,
}

const initialState = {
    loading: 'idle',
    currentRequestId: null,
    data: [],
    pageIndex: 1,
    limit: 5,
    hasMore: false,

} satisfies QuickReplyState as QuickReplyState

const quickReplySlice = createSlice({
    name: 'quick-reply',
    initialState,
    reducers: {
        removeItem: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(item => item.id !== action.payload);
        },
        insertItem: (state, action: PayloadAction<any>) => {
            // thêm vào đầu danh sách
            state.data.unshift(action.payload);
        },

        updateItem: (state, action: PayloadAction<any>) => {
            const item = action.payload;
            const index = state.data.findIndex(x => x.id === item.id);
            if (index !== -1) {
                state.data[index] = item;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPagingQuickReply.pending, (state, action) => {
                state.loading = "pending";
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(getPagingQuickReply.fulfilled, (state, action) => {

                if (action.meta.arg.pageIndex === 1) {
                    state.data = action.payload.data;
                    state.pageIndex = 1;
                } else {
                    state.data.push(...action.payload.data);
                    state.pageIndex = action.meta.arg.pageIndex;
                }

                state.hasMore = action.payload.hasMore;
                state.limit = action.payload.limit;
                state.loading = "succeeded";
            })
            .addCase(getPagingQuickReply.rejected, (state) => {
                state.loading = "failed";
            })

    },
})

export const { insertItem, removeItem, updateItem } = quickReplySlice.actions;
export const quickReplyReducer = quickReplySlice.reducer;