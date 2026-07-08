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


interface ConversationActive {
    id: number;
    full_name: string;
    avatar: string; // bạn đang viết "avarta" - typo
    unread_count: number;
    last_message_at: number;
    updated_at: number;
}

interface conversationState {
    loading: 'idle' | 'pending' | 'succeeded' | 'failed',
    search: string;
    data: any,
    limit: number,
    lastId: number,
    lastUpdatedAt: number,
    hasMore: boolean,
    active: ConversationActive;
}

const initialState = {
    loading: 'idle',
    search: '',
    data: [],
    limit: 5,
    lastUpdatedAt: 0,
    lastId: 1,
    hasMore: false,
    active: { id: 0, full_name: '', avatar: '', unread_count: 0, last_message_at: 0, updated_at: 0 }

} satisfies conversationState as conversationState

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setActiveConversation(state, action) {
            state.active = action.payload;
        },
        updateConversation(state, action) {
            const data = action.payload
            const index = state.data.findIndex((m: any) => m.id === data.id);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...data,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPaging.fulfilled, (state, action) => {
            const currentSearch = action.meta.arg.search ?? '';
            if (state.search !== currentSearch) {
                state.data = action.payload.data;
            }
            else if (!action.payload.lastId) {
                // Lần đầu load hoặc search mới → reset
                state.data = action.payload.data;
            } else {
                // Scroll load thêm → append
                state.data = [...state.data, ...action.payload.data];
            }
            state.search = currentSearch;
            state.lastId = action.payload.lastId;
            state.limit = action.payload.limit;
            state.lastUpdatedAt = action.payload.lastUpdatedAt;
            state.hasMore = action.payload.hasMore;
            state.loading = 'succeeded';

        });

    },
})

export const { setActiveConversation, updateConversation } = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;