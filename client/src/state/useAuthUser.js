import { useAtom } from "jotai";
import { userAtom } from "./userAtom";

export function useAuthUser() {
  const [user] = useAtom(userAtom);
  return user;
}
