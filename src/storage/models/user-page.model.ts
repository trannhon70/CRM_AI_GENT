export interface UserPageModel {
    id: string;
    user_id: string | number;
    provider: string;
    fanpage_id: string;
    page: {
        page_id: string;
        page_name: string;
        page_avatar: string;
        access_token: string;
        data_access_expires_at: string | number;
        [key: string]: any;
    };
    [key: string]: any; // giữ linh hoạt vì API có thể trả thêm field khác
}