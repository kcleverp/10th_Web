export type UserSignIninformation = {
    email:string,
    password:string
}

function validateUser(values:UserSignIninformation){
    const errors = {
        email:"",
        password:""
    }
    if(!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email)){
        errors.email = "올바른 이메일 형식이 아닙니다"
    }
    if (!(values.password.length >= 6)){
        errors.password = "비밀번호는 최소 6자 이상이여야 합니다."
    }
    return errors
}

function validateSignIn(values:UserSignIninformation){
    return validateUser(values)
}

export {validateSignIn}