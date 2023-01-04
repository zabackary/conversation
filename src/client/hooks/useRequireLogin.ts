import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "./useUser";

export default function useRequireLogin() {
  const user = useUser(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate(
        `/login/?next=${encodeURIComponent(
          window.location.pathname +
            window.location.hash +
            window.location.search
        )}`
      );
    }
  }, [user, navigate]);
}
