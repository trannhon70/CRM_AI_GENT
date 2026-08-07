import type { FC } from "react";
import { useOnlineStatus } from "../../context/OnlineStatusContext";

const OfflineBanner: FC = () => {
    const isOnline = useOnlineStatus();
    if (isOnline) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
            <div className="bg-[#4a4a4a] text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 18h.01M8.5 14.5a5 5 0 0 1 7 0M5 11a10 10 0 0 1 14 0M2 7.5a15 15 0 0 1 20 0"
                        stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Không có kết nối Internet
            </div>
        </div>
    );
};

export default OfflineBanner