import { useSelector } from "react-redux";

export const useLogin = () => {
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);
  return {
    isLogin: Boolean(token),
    loading,
  };
};
