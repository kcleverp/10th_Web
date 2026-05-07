import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignIn, type UserSignIninformation } from "../utils/validate";
import { useNavigate, useLocation } from "react-router-dom";

const LogInPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const from = location.state?.from || "/";

  useEffect(() => {

    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [navigate, accessToken, from]);

  const { values, errors, touched, getInputProps } = useForm<UserSignIninformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignIn,
  });

  const handleSubmit = async () => {
    try {
      await login(values);

      navigate(from, { replace: true });
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SEVER_API_URL + "/v1/auth/google/login";
  };

  const isdisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#807bff]"
      >
        ← BACK TO HOME
      </button>

      <div className="flex flex-col gap-4 w-[300px]">
        <div className="flex flex-col gap-2">
          <input
            {...getInputProps("email")}
            type="email"
            placeholder="이메일"
            className="border border-[#ccc] w-full p-[12px] focus:border-[#807bff] outline-none rounded-sm text-sm transition-colors"
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-[11px] px-1">{errors.email}</div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            {...getInputProps("password")}
            type="password"
            placeholder="비밀번호"
            className="border border-[#ccc] w-full p-[12px] focus:border-[#807bff] outline-none rounded-sm text-sm transition-colors"
          />
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-[11px] px-1">{errors.password}</div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isdisabled}
            className="w-full bg-[#807bff] text-white py-3 rounded-sm text-sm font-bold hover:bg-[#6c63ff] transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            SIGN IN
          </button>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-[#ccc] text-gray-600 py-3 rounded-sm text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            CONTINUE WITH GOOGLE
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-2">
          계정이 없으신가요?{" "}
          <span 
            onClick={() => navigate("/signup")}
            className="text-[#807bff] cursor-pointer underline underline-offset-2"
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;