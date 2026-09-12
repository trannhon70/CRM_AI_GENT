import Button from "@mui/material/Button";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import { fanPagesAPI } from "../../../apis/fanpage.api";
import appCake from "../../../assets/images/appcake.png";
import LoadingLayout from "../../loadingLayout";
import chatPlugin from "../../../assets/images/chat-plugin.png";
import { CiImageOn } from "react-icons/ci";
import { IoIosHelpCircleOutline } from "react-icons/io";


const TabChatPlugin: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [connectionName, setConnectionName] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleCreateChatPlugin = async () => {
        if (!connectionName.trim()) {
            toast.error("Vui lòng nhập tên kết nối!");
            return;
        }
        if (!displayName.trim()) {
            toast.error("Vui lòng nhập tên hiển thị!");
            return;
        }

        setLoading(true);
        const form = new FormData();
        form.append("connection_name", connectionName);
        form.append("display_name", displayName);
        if (logoFile) form.append("logo", logoFile);

        // fanPagesAPI
        //     .createChatPlugin(form)
        //     .then((_res: any) => {
        //         toast.success("Tạo Chat Plugin thành công!");
        //         setLoading(false);
        //     })
        //     .catch((_err: any) => {
        //         toast.error("Lỗi khi tạo Chat Plugin!");
        //         setLoading(false);
        //     });
    };

    if (loading) return <LoadingLayout />;

    return (
        <div className="flex flex-col h-[60vh]">
            <div className="border-b p-3 border-[#F2F4F7] text-black font-medium text-lg shrink-0">
                Thêm tài khoản Chat Plugin
            </div>

            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto items-center py-8 px-4">
                {/* Icons row: Pancake logo -> sync -> chat bubble */}
                <div className="flex items-center gap-2.5">
                    <img
                        src={appCake}
                        alt="Pancake"
                        width={50}
                        height={50}
                        className="shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15)] rounded-2xl"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1677FF" viewBox="0 0 256 256"><path d="M24,128A72.08,72.08,0,0,1,96,56H204.69L194.34,45.66a8,8,0,0,1,11.32-11.32l24,24a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L204.69,72H96a56.06,56.06,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56.06,56.06,0,0,1-56,56H51.31l10.35-10.34a8,8,0,0,0-11.32-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.32-11.32L51.31,200H160a72.08,72.08,0,0,0,72-72A8,8,0,0,0,224,120Z"></path></svg>
                    <div className="w-[50px] h-[50px] rounded-2xl bg-[#6C5CE7] shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15)] flex items-center justify-center">
                        <img src={chatPlugin} alt="Chat Plugin" className="w-full h-full object-cover rounded-2xl" />
                    </div>
                </div>

                <div className="mt-5 text-xl font-medium text-black text-center">
                    Tạo Chat Plugin cho website của bạn
                </div>
                <div className="text-center mt-2 text-sm text-gray-500 max-w-md">
                    Gắn Chat Plugin lên website giúp bạn chat trực tiếp với khách hàng
                    trên website qua Pancake.
                </div>

                {/* Form */}
                <div className="mt-6 w-full max-w-md flex items-center gap-4 ">
                    <label
                        htmlFor="chat-plugin-logo"
                        className="shrink-0 w-[70px] h-[70px] rounded-full border-2 border-dashed border-[#B8C0FF] flex flex-col items-center justify-center cursor-pointer text-[#4F7CFF] overflow-hidden"
                    >
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <>
                                <CiImageOn size={20} />
                                <span className="text-[11px] mt-1">Ảnh Logo</span>
                            </>
                        )}
                        <input
                            id="chat-plugin-logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                        />
                    </label>

                    <div className="flex-1 flex flex-col gap-3">
                        <div>
                            <div className="flex items-center justify-end gap-1 mb-1">
                                <span className="text-sm text-gray-700">Tên kết nối</span>
                                <IoIosHelpCircleOutline size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={connectionName}
                                onChange={(e) => setConnectionName(e.target.value)}
                                placeholder="VD: pancakevietnam"
                                className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4F7CFF] placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-end gap-1 mb-1">
                                <span className="text-sm text-gray-700">Tên hiển thị</span>
                                <IoIosHelpCircleOutline size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="VD: Công ty Pancake Việt Nam"
                                className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4F7CFF] placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 w-full max-w-md">
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreateChatPlugin}
                        sx={{
                            backgroundColor: "#7B8AB8",
                            textTransform: "none",
                            fontWeight: 700,
                            py: 1.2,
                            borderRadius: "8px",
                            "&:hover": { backgroundColor: "#697aa8" },
                        }}
                    >
                        Tạo Chat Plugin
                    </Button>
                </div>

                <div className="mt-2 flex items-center gap-1 text-sm">
                    <IoIosHelpCircleOutline size={18} className="text-gray-400" />
                    <a href="#" className="text-[#4F7CFF] underline">
                        Hướng dẫn kết nối
                    </a>
                </div>

                <div className="mt-5 text-xs text-gray-400 text-center">
                    *Mỗi Chat Plugin tương đương 2 trang trong gói cước
                </div>
            </div>
        </div>
    );
};

export default TabChatPlugin;