import { zodResolver } from "@hookform/resolvers/zod";
import {useForm, type SubmitHandler} from "react-hook-form"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {z} from "zod"
import { signup } from "../apis/auth";
const schema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다" }),
    password: z
    .string()
    .min(6, { 
        message: "비밀번호는 6자 이상이어야 합니다",
    }),
    passwordCheck:z
    .string()
    .min(6, { 
        message: "비밀번호는 6자 이상이어야 합니다",
    }),
    name: z
    .string()
    .min(1, {message:"이름을 입력해 주세요"})   
})
.refine((data) => data.password === data.passwordCheck, {
        message:"비밀번호가 일치하지 않습니다.",
        path:["passwordCheck"]}) 

type FormFields = z.infer<typeof schema>

const SignUpPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<FormFields>({
        defaultValues: { email: "", name: "", password: "", passwordCheck: "" },
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const nextStep = async (fields: Array<keyof FormFields>) => {
        const isValid = await trigger(fields);
        if (isValid) setStep((prev) => prev + 1);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const { passwordCheck, ...rest } = data;
        const response = await signup(rest);
        console.log(response);
        if(response) navigate("/login"); // 성공 시 이동
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <button onClick={() => step > 1 ? setStep(step - 1) : navigate("/")} className="mb-8">
                ← {step > 1 ? "이전으로" : "뒤로가기"}
            </button>

            <div className="flex flex-col gap-3">
                {step === 1 && (
                    <>
                        <input {...register("email")} type="email" placeholder="이메일" className="border w-[300px] p-[10px]" />
                        {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
                        <button type="button" onClick={() => nextStep(["email"])} className="bg-blue-600 text-white py-3 rounded-md">다음</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <input {...register("password")} type="password" placeholder="비밀번호" className="border w-[300px] p-[10px]" />
                        {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
                        <input {...register("passwordCheck")} type="password" placeholder="비밀번호 확인" className="border w-[300px] p-[10px]" />
                        {errors.passwordCheck && <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>}
                        <button type="button" onClick={() => nextStep(["password", "passwordCheck"])} className="bg-blue-600 text-white py-3 rounded-md">다음</button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <input {...register("name")} type="text" placeholder="이름" className="border w-[300px] p-[10px]" />
                        {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
                        <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-green-600 text-white py-3 rounded-md">
                            회원가입 완료
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignUpPage;