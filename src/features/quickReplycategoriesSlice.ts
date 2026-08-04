import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { quickReplyCategoriessAPI } from '../apis/quickReplyCategories.api.ts'
import type { GetPagingQuickReplyCategoriesQuery, QuickReplyCategories } from '../types/quickReplyCategories.ts'


export const getPagingQuickReplycategories = createAsyncThunk(
    'quick-reply-categories/getPagingQuickReplycategories',
    async (thunkAPI: GetPagingQuickReplyCategoriesQuery) => {
        const response = await quickReplyCategoriessAPI.getPaging(thunkAPI);
        return response.data
    },
)

export const getAllQuickReplycategories = createAsyncThunk(
    'quick-reply-categories/getAllQuickReplycategories',
    async (thunkAPI: any) => {
        const response = await quickReplyCategoriessAPI.getAll(thunkAPI)
        return response.data
    },
)

interface QuickReplyCategoriesState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    currentRequestId: string | null,
    data: QuickReplyCategories[],
    dataAll: QuickReplyCategories[],
    pageIndex?: number,
    limit?: number,
    hasMore: boolean,
}

const initialState = {
    loading: 'idle',
    currentRequestId: null,
    data: [],
    dataAll: [],
    pageIndex: 1,
    limit: 5,
    hasMore: false,

} satisfies QuickReplyCategoriesState as QuickReplyCategoriesState

const quickReplyCategoriesSlice = createSlice({
    name: 'quick-reply-categories',
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
            .addCase(getPagingQuickReplycategories.pending, (state, action) => {
                state.loading = "pending";
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(getPagingQuickReplycategories.fulfilled, (state, action) => {

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
            .addCase(getPagingQuickReplycategories.rejected, (state) => {
                state.loading = "failed";
            })
            .addCase(getAllQuickReplycategories.fulfilled, (state, action) => {
                state.dataAll = action.payload;
            })

    },
})

export const { insertItem, removeItem, updateItem } = quickReplyCategoriesSlice.actions;
export const quickReplyCategoriesReducer = quickReplyCategoriesSlice.reducer;