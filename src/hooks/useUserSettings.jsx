import { useSelector } from "react-redux";

export default function useUserSettings() {
  return useSelector((s) => s.auth.settings);
}
