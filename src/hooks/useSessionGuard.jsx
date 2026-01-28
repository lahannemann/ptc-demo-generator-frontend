import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useSessionGuard() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/session_check`, {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        if (data.status === "connected") {
          setSessionReady(true);
        } else {
          navigate("/");
        }
      } catch (err) {
        navigate("/");
      }
    }

    checkSession();
  }, [navigate]);

  return sessionReady;
}

export default useSessionGuard;