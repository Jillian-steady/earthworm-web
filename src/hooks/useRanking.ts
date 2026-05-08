"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { ProgressRank, RankingItem, RankingSelf } from "@/types";
import { getFetcher } from "@/utils/fetcher";

const rankingPeriodList = [
  {
    label: "周排行",
    value: "weekly",
  },
  {
    label: "月排行",
    value: "monthly",
  },
  {
    label: "年排行",
    value: "yearly",
  },
];

export function useRanking() {
  const [rankModal, setRankModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState("weekly");
  const [rankingList, setRankingList] = useState<RankingItem[]>([]);
  const [rankingSelf, setRankingSelf] = useState<RankingSelf | null>(null);

  const rankingCacheRef = useRef<Record<string, ProgressRank>>({});

  function updateRankingList(res: ProgressRank) {
    setRankingList(res.list);
    setRankingSelf(res.self);
  }

  const fetchRankingListAsync = useCallback(async (period: string) => {
    setIsLoading(true);
    const res = await getFetcher<ProgressRank>(`/api/rank/progress/${period}`);
    setIsLoading(false);
    return res;
  }, []);

  // Watch currentPeriod changes and fetch ranking data
  const prevPeriodRef = useRef(currentPeriod);
  useEffect(() => {
    if (prevPeriodRef.current === currentPeriod && rankingList.length > 0) return;
    prevPeriodRef.current = currentPeriod;

    const cache = rankingCacheRef.current;

    if (cache[currentPeriod]) {
      updateRankingList(cache[currentPeriod]);
      return;
    }

    fetchRankingListAsync(currentPeriod).then((res) => {
      updateRankingList(res);
      cache[currentPeriod] = res;
    });
  }, [currentPeriod, fetchRankingListAsync]);

  function togglePeriod(period: string) {
    if (currentPeriod === period) {
      return;
    }

    if (isLoading) {
      toast.warning("请等待当前排行榜加载完成", { duration: 1200 });
      return;
    }

    setCurrentPeriod(period);
  }

  async function showRankModal() {
    setRankModal(true);
    rankingCacheRef.current = {};

    const res = await fetchRankingListAsync(currentPeriod);
    updateRankingList(res);
    rankingCacheRef.current[currentPeriod] = res;
  }

  function hideRankModal() {
    setRankModal(false);
  }

  return {
    rankModal,
    isLoading,
    currentPeriod,
    rankingList,
    rankingSelf,
    rankingPeriodList,
    togglePeriod,
    showRankModal,
    hideRankModal,
  };
}
