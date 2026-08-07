// contexts/OnlineStatusContext.tsx
import { createContext, useContext, useEffect, useState, type FC, type PropsWithChildren } from "react";
import { networkStatus } from "../utils/networkStatus";

const OnlineStatusContext = createContext<boolean>(true);

export const OnlineStatusProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isOnline, setIsOnline] = useState(networkStatus.isOnline);

    useEffect(() => { networkStatus.subscribe(setIsOnline) }, []);

    return (
        <OnlineStatusContext.Provider value={isOnline}>
            {children}
        </OnlineStatusContext.Provider>
    );
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);