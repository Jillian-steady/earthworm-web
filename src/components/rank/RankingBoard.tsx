"use client";

import { useEffect, useCallback } from "react";
import { useRanking } from "@/hooks/useRanking";
import RankingItem from "./RankingItem";
import RankingTip from "./RankingTip";

export default function RankingBoard() {
  const rankingStore = useRanking();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        rankingStore.hideRankModal();
      }
    },
    [rankingStore],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleEscape]);

  if (!rankingStore.rankModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-[90vw] max-w-[500px] flex-col rounded-lg bg-white py-5 dark:bg-gray-800" style={{ height: "80vh", maxHeight: "600px" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-lg font-semibold">排行榜</h3>
          <button
            className="btn btn-ghost btn-sm"
            onClick={rankingStore.hideRankModal}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-grow flex-col overflow-y-auto overflow-x-hidden">
          {/* Tabs */}
          <div role="tablist" className="tabs tabs-lift tabs-md">
            {rankingStore.rankingPeriodList.map((period) => (
              <a
                key={period.value}
                role="tab"
                className={`tab dark:[--tab-bg:gray-800] dark:[--tab-border-color:gray] ${
                  period.value === rankingStore.currentPeriod
                    ? "tab-active text-orange-500"
                    : ""
                }`}
                onClick={() => rankingStore.togglePeriod(period.value)}
              >
                {period.label}
              </a>
            ))}
          </div>

          {rankingStore.isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <span className="loading loading-dots loading-md"></span>
            </div>
          ) : rankingStore.rankingList.length > 0 ? (
            <div className="my-1 h-full flex-1 overflow-y-auto px-4 py-2">
              {rankingStore.rankingList.map((item, index) => (
                <RankingItem
                  key={`${item.username}-${index}`}
                  username={item.username}
                  rank={index + 1}
                  count={item.count}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              还没有小伙伴上榜哦，快来霸榜吧!
            </div>
          )}
        </div>

        {/* Tip */}
        <RankingTip
          isLoading={rankingStore.isLoading}
          rankingSelf={rankingStore.rankingSelf}
        />
      </div>
    </div>
  );
}
