import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from '../apis/user.api.ts'
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

    },
    extraReducers: (builder) => {
        builder.addCase(fetchPageId.fulfilled, (state, action) => {
            state.page = action.payload;
            state.loading = 'succeeded';
        });

    },
})

export const { } = fanPagesSlice.actions;
export const fanPagesReducer = fanPagesSlice.reducer;