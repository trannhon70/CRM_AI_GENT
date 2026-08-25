
import { Alert, Box, Button, Link, Typography } from "@mui/material";
import { QRCodeSVG } from 'qrcode.react';
import { useState, type FC } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { MdHelpOutline, MdOutlineQrCode2, MdPhoneIphone } from "react-icons/md";
import telegram from '../../../assets/images/telegram.png';

const TabsTelegram: FC = () => {
    const [link, setLink] = useState('');
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGenerateQr = async () => {

    }
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
                        {!link && (
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
                        {link && !connected && (
                            <div className="relative inline-block">
                                <QRCodeSVG value={link} size={220} level="H" />
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