export interface GetPagingLabelQuery {
    pageIndex?: number;
    limit?: number;
    search?: string;
    page_id: string;
    is_deleted?: boolean;
}

export interface Label {
    id: number;
    name: string;
    color: string;
    fanpage_id: number;
    is_deleted: boolean;
    created_at: number;
}