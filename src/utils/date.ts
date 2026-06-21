import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";

export const formatUnixTime = (
    timestamp: number,
    format = "DD/MM/YYYY HH:mm:ss"
) => {
    if (!timestamp) return "-";

    return dayjs
        .unix(timestamp)
        .tz(DEFAULT_TIMEZONE)
        .format(format);
};

export const formatDate = (
    timestamp: number,
    format = "DD/MM/YYYY"
) => {
    if (!timestamp) return "-";

    return dayjs
        .unix(timestamp)
        .tz(DEFAULT_TIMEZONE)
        .format(format);
};

/**
 * Còn bao nhiêu ngày
 */
export const getRemainingDays = (timestamp: number) => {
    if (!timestamp) return 0;

    const now = dayjs();
    const expired = dayjs.unix(timestamp);

    return expired.diff(now, "day");
};

/**
 * Hiển thị thời gian còn lại
 */
export const getRemainingTime = (timestamp: number) => {
    if (!timestamp) return "-";

    const now = dayjs();
    const expired = dayjs.unix(timestamp);

    if (expired.isBefore(now)) {
        return "Đã hết hạn";
    }

    const days = expired.diff(now, "day");
    const hours = expired.diff(now.add(days, "day"), "hour");
    const minutes = expired.diff(
        now.add(days, "day").add(hours, "hour"),
        "minute"
    );

    return `${days} ngày ${hours} giờ ${minutes} phút`;
};

export const getRemainingDaysText = (timestamp: number) => {
    const days = getRemainingDays(timestamp);

    if (days < 0) return "Đã hết hạn";
    if (days === 0) return "Hết hạn hôm nay";

    return `${days} ngày`;
};