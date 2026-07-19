import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { labelAPI } from '../apis/label.api.ts'
import type { GetPagingLabelQuery, Label } from '../types/label.ts'



// First, create the thunk
export const getPagingLabel = createAsyncThunk(
    'labels/getPagingLabel',
    async (thunkAPI: GetPagingLabelQuery) => {
        const response = await labelAPI.getPaging(thunkAPI)
        return response.data
    },
)



interface LabelsState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    currentRequestId: string | null,
    data: Label[],
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

} satisfies LabelsState as LabelsState

const labelSlice = createSlice({
    name: 'label',
    initialState,
    reducers: {
        removeItem: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(item => item.id !== action.payload);
        },
        insertItem: (state, action: PayloadAction<any>) => {
            // thêm vào đầu danh sách
            state.data.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPagingLabel.pending, (state, action) => {
                state.loading = "pending";
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(getPagingLabel.fulfilled, (state, action) => {

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
            .addCase(getPagingLabel.rejected, (state) => {
                state.loading = "failed";
            });

    },
})

export const { removeItem, insertItem } = labelSlice.actions;
export const labelReducer = labelSlice.reducer;