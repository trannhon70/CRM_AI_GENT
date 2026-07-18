import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { labelAPI } from '../apis/label.api.ts'
import type { GetPagingLabelQuery } from '../types/label.ts'



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
    data: any,
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

    },
    extraReducers: (builder) => {
        builder
            .addCase(getPagingLabel.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(getPagingLabel.fulfilled, (state, action) => {
                const { pageIndex } = action.meta.arg;

                if (pageIndex === 1) {
                    state.data = action.payload.data;
                } else {
                    state.data = [
                        ...state.data,
                        ...action.payload.data,
                    ];
                }

                state.pageIndex = pageIndex;
                state.limit = action.payload.limit;
                state.hasMore = action.payload.hasMore;
                state.loading = "succeeded";
            })
            .addCase(getPagingLabel.rejected, (state) => {
                state.loading = "failed";
            });

    },
})

export const { } = labelSlice.actions;
export const labelReducer = labelSlice.reducer;