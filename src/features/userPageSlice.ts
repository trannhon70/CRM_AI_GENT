import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { userPagesAPI } from '../apis/userPages.api.ts'
import type { GetPagingUserPageQuery } from '../types/userPage.ts'


// First, create the thunk
export const getPagingUserPage = createAsyncThunk(
    'userPage/getPagingUserPage',
    async (thunkAPI: GetPagingUserPageQuery) => {
        const response = await userPagesAPI.getPagingUserPageActive(thunkAPI)
        return response.data
    },
)

interface UserPageState {
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

} satisfies UserPageState as UserPageState

const userPagelice = createSlice({
    name: 'label',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getPagingUserPage.pending, (state, action) => {
                state.loading = "pending";
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(getPagingUserPage.fulfilled, (state, action) => {

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
            .addCase(getPagingUserPage.rejected, (state) => {
                state.loading = "failed";
            });

    },
})

export const { } = userPagelice.actions;
export const userPageReducer = userPagelice.reducer;