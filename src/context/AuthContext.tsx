import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../apis/user.api';
type Props = {
    children?: ReactNode;
}

type IAuthContext = {
    authenticated: boolean;
    setAuthenticated: (newState: boolean) => void;
    login: any;
    logout: () => void;
    loginGoogle: any;
    loginFacebook: any
}

const initialValue = {
    authenticated: false,
    setAuthenticated: () => { },
    login: () => { },
    logout: () => { },
    loginGoogle: () => { },
    loginFacebook: () => { },
}

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({ children }: Props) => {
    const [authenticated, setAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleLogin = async (
        apiCall: (data: any) => Promise<any>,
        form: any
    ) => {
        try {
            const result = await apiCall(form);
            if (result?.data?.statusCode === 1) {
                setAuthenticated(true);
                toast.success(result.data.message);
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('startTimeToken', result.data.startTime);
                localStorage.setItem('endTimeToken', result.data.endTime);
                navigate('/');
            }
        } catch (error: any) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || 'Đăng nhập thất bại'
            );
        }
    };

    const login = async (form: any) => {
        await handleLogin(userAPI.login, form);
    }

    const loginGoogle = async (form: any) => {
        await handleLogin(userAPI.loginGoogle, form);
    }

    const loginFacebook = async (form: any) => {
        await handleLogin(userAPI.loginFacebook, form);
    }

    const logout = async () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, login, logout, loginGoogle, loginFacebook }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };
