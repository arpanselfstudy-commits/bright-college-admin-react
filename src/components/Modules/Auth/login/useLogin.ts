import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import AuthApi from "../../../../service/apis/Auth.api";
import { LoginRequest } from "../../../../types/authTypes";
import { useDispatch } from "react-redux";
import { login } from "../../../../store/auth.store";

const initialValues: LoginRequest = {
  email: "",
  password: "",
};

const loginSchema = Yup.object().shape({
  email: Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formMethods = useForm<LoginRequest>({
    defaultValues: initialValues,
    resolver: yupResolver(loginSchema) as any,
    mode: "onTouched",
  });

  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    setLoading(true);
    try {
      const response = await AuthApi.login(data);
      if (response.success || response.code === 200) {
        dispatch(login(response.data));
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { formMethods, loading, onSubmit: handleSubmit(onSubmit) };
};

export default useLogin;
