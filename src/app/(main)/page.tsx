"use client";

import { useEffect, useState } from "react";

import Loading from "@/components/common/Loading";
import Home from "@/components/home/Home";
import Landing from "@/components/landing/Landing";
import { fetchCurrentUser } from "@/utils/fetchCurrentUser";
import { checkAuthenticated } from "@/services/auth";
import { useUserStore } from "@/stores/user";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const initUser = useUserStore((s) => s.initUser);

  useEffect(() => {
    async function init() {
      try {
        const authed = await checkAuthenticated();
        setAuthenticated(authed);
        if (authed) {
          const user = await fetchCurrentUser();
          initUser(user);
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [initUser]);

  if (loading) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  if (authenticated) {
    return <Home />;
  }

  return <Landing />;
}
