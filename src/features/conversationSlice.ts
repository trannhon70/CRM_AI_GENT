import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { conversationAPI } from '../apis/conversation.api.ts'

// First, create the thunk
export const fetchPaging = createAsyncThunk(
    'conversation/getPaging',
    async (query: any) => {
        const response = await conversationAPI.getPaging(query);
        return response.data
    },
)


interface ConversationActive {
    id: number;
    full_name: string;
    avatar: string; // bạn đang viết "avarta" - typo
    unread_count: number;
    last_message_at: number;
    updated_at: number;
    customer_id?: string;
    page_id?: string;
}

interface conversationState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed',
    search: string;
    data: any,
    limit: number,
    pageIndex: number,
    hasMore: boolean,
    active: ConversationActive;
}

const initialState = {
    loading: 'idle',
    search: '',
    data: [],
    limit: 5,
    pageIndex: 1,
    hasMore: false,
    active: { id: 0, full_name: '', avatar: '', unread_count: 0, last_message_at: 0, updated_at: 0, customer_id: '', page_id: '' },

} satisfies conversationState as conversationState

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setActiveConversation(state, action) {
            state.active = action.payload;
        },
        setNullConversation(state, action) {
            state.data = action.payload;
        },
        updateConversation(state, action) {
            const data = action.payload
            const index = state.data.findIndex((m: any) => m.id === data.id);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...data,
                };
            } else {
                // Chưa tồn tại → thêm vào đầu danh sách
                state.data.unshift(data);
            }
            //cập nhật lại active
            if (state.active) {
                state.active.unread_count = action.payload.unread_count;
            }
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchPaging.pending, (state, action) => {
                state.loading = "pending";
            })
            .addCase(fetchPaging.fulfilled, (state, action) => {
                // if (state.currentRequestId !== action.meta.requestId) {
                //     return; // bỏ qua request cũ
                // }
                if (action.meta.arg.pageIndex === 1) {
                    state.data = action.payload.data;
                } else {
                    state.data = [...action.payload.data, ...state.data];
                }
                state.pageIndex = action.meta.arg.pageIndex;
                state.limit = action.payload.limit;
                state.hasMore = action.payload.hasMore;
                state.loading = 'succeeded';

            })
            .addCase(fetchPaging.rejected, (state, action) => {
                state.loading = "failed";
            })

    },
})

export const { setActiveConversation, updateConversation, setNullConversation } = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;