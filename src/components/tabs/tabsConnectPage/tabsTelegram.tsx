
import { Alert, Box, Button, Link, Typography } from "@mui/material";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState, type FC } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { MdHelpOutline, MdOutlineQrCode2, MdPhoneIphone } from "react-icons/md";
import { toast } from "react-toastify";
import { telegramAPI } from "../../../apis/telegram.api";
import telegram from '../../../assets/images/telegram.png';

const TabsTelegram: FC = () => {
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);

    // Poll trạng thái mỗi 2s (giảm từ 30s xuống)
    useEffect(() => {
        if (!sessionId || status !== 'waiting') return;

        const interval = setInterval(async () => {
            try {
                const res: any = await telegramAPI.getQrStatus(sessionId);
                setStatus(res.status);

                if (res.status === 'success') {
                    clearInterval(interval);
                    toast.success('Kết nối Telegram thành công!');
                }

                if (res.status === 'expired') {
                    clearInterval(interval);
                    handleGenerateQr(); // im lặng tạo QR mới, không cần toast warning nữa
                }

                if (res.status === 'need_password') {
                    clearInterval(interval);
                    toast.info('Tài khoản có bật xác thực 2 bước, cần nhập mật khẩu.');
                }

                if (res.status === 'error' || res.status === 'not_found') {
                    clearInterval(interval);
                    toast.error('Đăng nhập Telegram thất bại, vui lòng thử lại.');
                }
            } catch (err) {
                // lỗi mạng tạm thời, cứ để interval thử lại lần sau
            }
        }, 20000); // <-- đổi từ 30000 xuống 2000

        return () => clearInterval(interval);
    }, [sessionId, status]);

    // + MỚI: tự động refresh QR ngay khi tới giờ hết hạn, không đợi polling phát hiện
    useEffect(() => {
        if (!expiresAt || status !== 'waiting') return;

        const msLeft = expiresAt - Date.now();
        if (msLeft <= 0) {
            handleGenerateQr();
            return;
        }

        const timer = setTimeout(() => {
            handleGenerateQr();
        }, msLeft);

        return () => clearTimeout(timer);
    }, [expiresAt, status]);

    const handleGenerateQr = async () => {
        const newSessionId = crypto.randomUUID();
        setLoading(true);
        telegramAPI.createQr({ sessionId: newSessionId }).then((res: any) => {
            setSessionId(res.sessionId);
            setQrUrl(res.qrUrl);
            setExpiresAt(res.expiresAt); // + lưu lại để tự set timer refresh
            setStatus('waiting');
        }).catch((_res: any) => {
            toast.error(_res.response?.data?.message || 'Lỗi khi kết nối!');
        }).finally(() => {
            setLoading(false);
        });
    };

    return <div className="flex flex-col h-[60vh]" >
        <div className="border-b p-3  border-[#F2F4F7] text-black font-medium text-lg shrink-0" >
            Thêm tài khoản Telegram
        </div>
        <Alert onClose={() => { }} severity="warning">Bạn chỉ nên sử dụng tài khoản đã có ít nhất 3 hội thoại, mỗi hội thoại phải có đủ cả tin gửi và nhận để tránh vi phạm chính sách của Telegram.</Alert>
        <div className=" flex flex-col flex-1 min-h-0 items-center justify-center " >
            <Box sx={{ display: "flex", alignItems: "center", gap: 6, p: 4 }}>
                <Box sx={{ position: "relative", width: 240, height: 240, flexShrink: 0 }}>
                    {[
                        { top: 0, left: 0, borderTop: 2, borderLeft: 2, borderTopLeftRadius: 12 },
                        { top: 0, right: 0, borderTop: 2, borderRight: 2, borderTopRightRadius: 12 },
                        { bottom: 0, left: 0, borderBottom: 2, borderLeft: 2, borderBottomLeftRadius: 12 },
                        { bottom: 0, right: 0, borderBottom: 2, borderRight: 2, borderBottomRightRadius: 12 },
                    ].map((pos, i) => (
                        <Box key={i}
                            sx={{ position: "absolute", width: 28, height: 28, borderColor: "primary.main", borderStyle: "solid", ...pos }}
                        />
                    ))}

                    <Box sx={{ position: "absolute", inset: 24, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 1, }}  >
                        {!qrUrl && (
                            <Button
                                onClick={handleGenerateQr}
                                disabled={loading}
                                size="small"
                                variant="contained"
                                loading={loading}
                            >
                                Tạo mã QR
                            </Button>
                        )}
                        {qrUrl && sessionId && (
                            <div className="relative inline-block">
                                <QRCodeSVG value={qrUrl} size={192} level="H" includeMargin />
                                <img
                                    src={telegram}
                                    alt="Telegram"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1"
                                    style={{ width: 40, height: 40 }}
                                />
                            </div>
                        )}
                    </Box>
                </Box>

                <Box sx={{ maxWidth: 340 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Quét QR để đăng nhập Telegram
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            1. Mở ứng dụng Telegram <FaTelegramPlane style={{ fontSize: 18, color: "#29a9eb" }} /> trên di động
                        </Typography>
                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                            2. Ở mục&nbsp;<b>Cài đặt</b>, chọn thiết bị <MdPhoneIphone style={{ fontSize: 18 }} />
                        </Typography>
                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                            3. Nhấn Link Desktop Device <MdOutlineQrCode2 style={{ fontSize: 18 }} /> và quét QR để đăng nhập
                        </Typography>
                    </Box>

                    <Box sx={{ borderTop: "1px solid #eee", mt: 2, pt: 1.5 }}>
                        <Link
                            href="#"
                            // onClick={(e) => {
                            //     e.preventDefault();
                            //     onHelpClick?.();
                            // }}
                            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 14 }}
                        >
                            <MdHelpOutline style={{ fontSize: 16 }} />
                            Hướng dẫn kết nối
                        </Link>
                    </Box>
                </Box>
            </Box>
        </div>
    </div>
}

export default TabsTelegram