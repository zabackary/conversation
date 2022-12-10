import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "./useUser";

export default function useRequireLogin() {
  const user = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
}
