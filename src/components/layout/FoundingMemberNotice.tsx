"use client";

import { useCallback, useEffect, useState } from "react";

import { useUserStore } from "@/stores/user";

export default function FoundingMemberNotice() {
  const isFounderMembership = useUserStore((s) => s.isFounderMembership);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (isFounderMembership()) {
      setShowNotice(false);
      return;
    }
    setShowNotice(shouldShowNotice());
  }, [isFounderMembership]);

  const dismissNotice = useCallback(() => {
    setNoticeDismissed();
    setShowNotice(false);
  }, []);

  const handleShowDetails = useCallback(() => {
    window.open(
      "https://earthworm-docs.cuixueshe.com/get-started/founding-member.html",
      "_blank",
    );
  }, []);

  if (!showNotice) return null;

  return (
    <div className="w-full rounded-lg bg-purple-600 px-4 py-1 text-white">
      <div className="flex items-center justify-between">
        <div className="font-bold">
          【邀请函】加入 Earthworm 创始会员 与我们一起成就更好的英语学习平台
        </div>
        <div className="hidden sm:flex sm:space-x-4">
          <button className="text-black" onClick={dismissNotice}>
            不感兴趣
          </button>
          <button
            className="rounded-lg bg-white px-4 font-bold text-purple-600"
            onClick={handleShowDetails}
          >
            查看详情
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-8 sm:hidden">
        <button className="text-black" onClick={dismissNotice}>
          不感兴趣
        </button>
        <button
          className="rounded-lg bg-white px-4 font-bold text-purple-600"
          onClick={handleShowDetails}
        >
          查看详情
        </button>
      </div>
    </div>
  );
}

function setNoticeDismissed(): void {
  const expirationTime = Date.now() + 48 * 60 * 60 * 1000;
  localStorage.setItem("noticeDismissed", expirationTime.toString());
}

function shouldShowNotice(): boolean {
  const dismissedTime = localStorage.getItem("noticeDismissed");
  if (!dismissedTime) return true;
  return Date.now() > parseInt(dismissedTime);
}
