import { useGoogleLogin } from '@react-oauth/google';
import type { FC } from "react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { LoginSocialFacebook } from "reactjs-social-login";
import { ProviderEnum } from '../../utils';
const FB_APP_ID = import.meta.env.VITE_FB_APP_ID;

const Login: FC = () => {
  const { login, loginV1 } = useContext(AuthContext)
  const [form, setForm] = useState<any>({
    email: '',
    password: ''
  })
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      email: e.target.value,
    });
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      password: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email === '' && form.password === '') return toast.warning('Email và mật khẩu không được bỏ trống!')

    login(form);

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const onClickLoginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      const user = await res.json();
      const form = {
        email: user.email,
        full_name: user.name,
        avatar: user.picture,
        provider: ProviderEnum.GOOGLE
      }
      loginV1(form);
    },
  });

  const onClickLoginFacebook = async (data: any) => {
    const form = {
      email: data.data.email,
      full_name: data.data.name,
      avatar: data.data.picture.data.url,
      provider: ProviderEnum.FACEBOOK
    }
    await loginV1(form)
  }
  return <Fragment>
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center text-4xl font-bold text-gray-700" >
            Hệ Thống AI GENT
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Đăng nhập
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">

                <button onClick={() => onClickLoginGoogle()} className=" cursor-pointer w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                      <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                      <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                      <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                    </svg>
                  </div>
                  <span className="ml-4">
                    Đăng nhập với Google
                  </span>
                </button>
                <LoginSocialFacebook
                  className="flex items-center justify-center w-full"
                  appId={FB_APP_ID}
                  onResolve={(response: any) => {
                    onClickLoginFacebook(response)
                  }}
                  onReject={(error: any) => {
                    // console.log(error);
                  }}
                >
                  <button className="cursor-pointer w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-lg mt-5">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
                    </svg>

                    <span className="ml-3">
                      Đăng nhập với Facebook
                    </span>
                  </button>
                </LoginSocialFacebook>

              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign up with e-mail
                </div>
              </div>
              <div className="mx-auto max-w-xs">
                <input
                  onChange={handleChangeEmail}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                />
                <input
                  onChange={handleChangePassword}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onKeyDown={handleKeyDown}
                />
                <button onClick={handleSubmit} className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer ">
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy={7} r={4} />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    Đăng nhập
                  </span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Tôi đồng ý tuân thủ Điều khoản dịch vụ và Chính sách bảo mật của phòng khám
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")' }}>
          </div>
        </div>
      </div>
    </div>

  </Fragment >
}

export default Login