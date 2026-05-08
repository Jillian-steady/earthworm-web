"use client";

import RankingBadge from "./RankingBadge";

interface RankingItemProps {
  rank: number;
  username: string;
  count: number;
}

export default function RankingItem({ rank, username, count }: RankingItemProps) {
  return (
    <div className="flex h-[40px] items-center justify-between border-b border-gray-200 text-sm dark:border-gray-600">
      <RankingBadge className="w-16" rank={rank} />
      <div className="flex-1 truncate text-center">{username || "匿名"}</div>
      <div className="w-16 text-right">{count} 课</div>
    </div>
  );
}
