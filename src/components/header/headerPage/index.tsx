import { useEffect, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserById } from "../../../features/usersSlice";
import { useChatSocket } from "../../../hooks/useChatSocket";
import useZaloNotificationSound from "../../../hooks/useZaloNotificationSound";
import type { AppDispatch, RootState } from "../../../redux/store";
import { SENDER_TYPE } from "../../../utils";
interface IProps {

}
const HeaderComponentUser: FC<IProps> = (props) => {
    const { } = props
    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users);
    const { play } = useZaloNotificationSound();


    const { } = useChatSocket({
        onNewMessage: (msg) => {
            if (msg.senderType === SENDER_TYPE.CUSTOMER) {
                play();
            }
        }
    });

    useEffect(() => {
        dispatch(fetchUserById());
    }, [dispatch])





    return <div className="w-full h-[5vh] bg-[#0f447d] text-[#b0c1d4] flex items-center justify-between  box-border " >
        sadasd
    </div>
}

export default HeaderComponentUser