export const STORE = {
    USER_PAGE: "user_page",
    CONVERSATION: "conversation",
    MESSAGE: "message",
    QUICK_REPLY: "quick_reply",
    QUICK_REPLY_CATEGORY: "quick_reply_category",
    TAG: "tag",
    CACHE: "cache",
} as const;

export type StoreName = (typeof STORE)[keyof typeof STORE];