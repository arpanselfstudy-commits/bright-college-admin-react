import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { LoginRequest } from "../../../../types/authTypes";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../../../store/auth.store";
import { AppDispatch, RootState } from "../../../../store/store";

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
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.authSlice.loading);

  const formMethods = useForm<LoginRequest>({
    defaultValues: initialValues,
    resolver: yupResolver(loginSchema) as any,
    mode: "onTouched",
  });

  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      toast.success("Logged in successfully");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error((result.payload as string) || "Login failed. Please try again.");
    }
  };

  return { formMethods, loading, onSubmit: handleSubmit(onSubmit) };
};

export default useLogin;
