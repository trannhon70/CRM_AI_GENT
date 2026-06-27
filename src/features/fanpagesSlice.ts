import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fanPagesAPI } from '../apis/fanpage.api.ts'



// First, create the thunk
export const fetchPageId = createAsyncThunk(
    'fanPages/getFanPagesId',
    async (thunkAPI: any) => {
        const response = await fanPagesAPI.getPagesId(thunkAPI)

        return response.data
    },
)



interface FanpagesState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
    page: any,
}

const initialState = {
    loading: 'idle',
    page: {},
} satisfies FanpagesState as FanpagesState

const fanPagesSlice = createSlice({
    name: 'fanPages',
    initialState,
    reducers: {
        updateSyncStatus(state, action) {
            const { page_id, syncStatus } = action.payload;
            if (state.page.page_id === page_id) {
                state.page.syncStatus = syncStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPageId.fulfilled, (state, action) => {
            state.page = action.payload;
            state.loading = 'succeeded';
        });

    },
})

export const { updateSyncStatus } = fanPagesSlice.actions;
export const fanPagesReducer = fanPagesSlice.reducer;