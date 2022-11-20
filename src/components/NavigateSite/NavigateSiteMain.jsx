import { useLogin } from "../../hooks/useLogin";

const NavigateSiteMain = () => {
  const { isLogin } = useLogin();
  if (!isLogin) return null;
  return null;
};

export default NavigateSiteMain;
