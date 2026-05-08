"use client";

import { isAuthenticated } from "@/services/auth";
import type { RankingSelf } from "@/types";
import RankingBadge from "./RankingBadge";

interface RankingTipProps {
  isLoading: boolean;
  rankingSelf: RankingSelf | null;
}

export default function RankingTip({ isLoading, rankingSelf }: RankingTipProps) {
  const renderContent = () => {
    if (isLoading) {
      return <span>数据正在向你飞奔而来......</span>;
    }

    if (!isAuthenticated()) {
      return <span>登录后和小伙伴们一决高下!</span>;
    }

    if (rankingSelf && rankingSelf.rank !== -1) {
      return (
        <>
          <RankingBadge rank={rankingSelf.rank} className="min-w-6" />
          <span className="mx-2">/</span>
          <span>{rankingSelf.count} 课</span>
        </>
      );
    }

    return <span>先去刷一课再来看看!</span>;
  };

  return (
    <div className="flex h-12 w-full flex-col items-center justify-center border-t border-gray-200 dark:border-gray-600">
      <div className="flex items-center text-sm">
        <span className="font-bold">我的排名：</span>
        {renderContent()}
      </div>
    </div>
  );
}
