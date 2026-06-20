import type { FC } from "react";
import appCake from "../../../assets/images/appcake.png";
import facebook from "../../../assets/images/facebook.png";
import Button from "@mui/material/Button";
const VITE_FB_APP_CONNECT = import.meta.env.VITE_FB_APP_CONNECT;
import { LoginSocialFacebook } from "reactjs-social-login";
import { fanPagesAPI } from "../../../apis/fanpage.api";
import { toast } from "react-toastify";
import { ProviderEnum } from "../../../utils";

const TabFaceBook: FC = () => {

    const handleConnectFacebook = async (response: any) => {

        const res = await fetch(
            'https://graph.facebook.com/v25.0/me/accounts?fields=id,name,category,category_list,tasks,picture.type(large),cover,access_token',
            {
                headers: {
                    Authorization: `Bearer ${response.data.accessToken}`,
                },
            }
        );
        const fanpages = await res.json();
        const pages = fanpages?.data?.map((item: any) => ({
            id: item.id,
            access_token: item.access_token,
            name: item.name,
            url: item.picture?.data?.url,
            provider: ProviderEnum.FACEBOOK,
        }));
        fanPagesAPI.create(pages).then((_res: any) => {
            toast.success('Kết nối thành công!')
        }).catch((_err: any) => {
            toast.error('Lỗi khi kết nối!')
        })

    }
    return <div className="flex flex-col h-[60vh]" >
        <div className="border-b p-3  border-[#F2F4F7] text-black font-medium text-lg shrink-0" >
            Thêm tài khoản Facebook
        </div>
        <div className=" flex flex-col flex-1 min-h-0 items-center justify-center " >
            <div className="flex items-center gap-2.5" >
                <img src={appCake} alt="..." width={50} height={50} className="shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15)] rounded-2xl" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1677FF" viewBox="0 0 256 256"><path d="M24,128A72.08,72.08,0,0,1,96,56H204.69L194.34,45.66a8,8,0,0,1,11.32-11.32l24,24a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L204.69,72H96a56.06,56.06,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56.06,56.06,0,0,1-56,56H51.31l10.35-10.34a8,8,0,0,0-11.32-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.32-11.32L51.31,200H160a72.08,72.08,0,0,0,72-72A8,8,0,0,0,224,120Z"></path></svg>
                <img className="rounded-2xl shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15)]" src={facebook} alt="..." width={50} height={50} />
            </div>
            <div className="mt-5 text-xl font-medium text-black" >
                Kết nối Pancake với trang Facebook
            </div>
            <div className="text-center mt-3 text-sm text-gray-500" >
                Sử dụng Pancake để mở khoá mục tiêu mua hàng qua <br /> tin nhắn trên Ads Manager, tự động tối ưu quảng cáo <br /> Facebook với CAPI
            </div>
            <div className="mt-4" >
                <LoginSocialFacebook
                    className="flex items-center justify-center w-full"
                    appId={VITE_FB_APP_CONNECT}
                    scope="pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement"
                    onResolve={(response: any) => {
                        handleConnectFacebook(response)
                    }}
                    onReject={(error: any) => {
                        // console.log(error);
                    }}
                >
                    <Button variant="outlined" className="flex items-center gap-2.5" >
                        <img className="rounded-2xl shadow-[0px_3px_8px_0px_rgba(0,0,0,0.15)]" src={facebook} alt="..." width={20} height={20} />
                        Kết nối lại với Facebook
                    </Button>
                </LoginSocialFacebook>
            </div>
        </div>
    </div>
}

export default TabFaceBook