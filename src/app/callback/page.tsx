"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/components/common/Loading";
import { fetchCurrentUser } from "@/utils/fetchCurrentUser";
import { handleSignInCallback, getSignInCallback } from "@/services/auth";
import { useUserStore } from "@/stores/user";

export default function CallbackPage() {
  const router = useRouter();
  const initUser = useUserStore((s) => s.initUser);
  const isNewUser = useUserStore((s) => s.isNewUser);
  const setupNewUser = useUserStore((s) => s.setupNewUser);
  const user = useUserStore((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isShowSettingUsernameModal, setIsShowSettingUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoadingFetchUserSetup, setIsLoadingFetchUserSetup] = useState(false);

  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    // Auto redirect after 3 seconds as fallback
    redirectTimerRef.current = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    async function handleCallback() {
      try {
        // Stop auto redirect
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = null;
        }

        await handleSignInCallback(window.location.href);
        const res = await fetchCurrentUser();
        initUser(res);

        // Check if new user needs username setup
        if (!res.username || !res.avatar) {
          setIsShowSettingUsernameModal(true);
          setIsLoading(false);
        } else {
          router.push(getSignInCallback());
        }
      } catch (error) {
        toast.error("登录失败", {
          description: `请清空缓存后重新尝试 报错信息: ${error}`,
          duration: 4000,
          onAutoClose: () => {
            router.push("/");
          },
        });
      }
    }

    handleCallback();
  }, [initUser, router]);

  function checkUsername(): boolean {
    const minLength = 2;
    const errorMessage = {
      empty: "用户名不能为空",
      minLength: `用户名至少输入 ${minLength} 个字符`,
      invalid: "用户名只能包含字母、数字和下划线，且首字符必须是字母或下划线",
    };

    if (!username) {
      toast.error(errorMessage.empty);
      return false;
    }

    if (username.length < minLength) {
      toast.error(errorMessage.minLength);
      return false;
    }

    const regex = /^[A-Za-z_]\w*$/;
    if (!regex.test(username)) {
      toast.error(errorMessage.invalid);
      return false;
    }

    return true;
  }

  async function handleChangeUsername() {
    if (!checkUsername()) return;

    setIsLoadingFetchUserSetup(true);
    await setupNewUser({
      username: username,
      avatar: user?.avatar || "",
    });
    setIsLoadingFetchUserSetup(false);

    router.push(getSignInCallback());
    setIsShowSettingUsernameModal(false);
  }

  return (
    <div className="flex w-full flex-col pt-2">
      {isLoading && !isShowSettingUsernameModal && <Loading />}

      {isShowSettingUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Modal */}
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold">设置用户名</h3>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="请输入用户名"
              className="input input-sm w-full"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleChangeUsername();
              }}
            />
            <div className="modal-action mt-4 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleChangeUsername}
              >
                确定
                {isLoadingFetchUserSetup && (
                  <span className="loading loading-spinner loading-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
