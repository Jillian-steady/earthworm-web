export interface RankingSelf {
  username: string;
  count: number;
  rank: number;
}

export interface RankingItem {
  username: string;
  count: number;
}

export interface ProgressRank {
  list: RankingItem[];
  self: RankingSelf | null;
  period: string;
}
