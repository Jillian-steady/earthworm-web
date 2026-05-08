import { create } from "zustand";

import type { User } from "@/types";
import { MembershipType } from "@/types";
import { postFetcher } from "@/utils/fetcher";

interface UserState {
  user: User | undefined;
  initUser: (val: User) => void;
  isNewUser: () => boolean;
  setupNewUser: (info: { username: string; avatar: string }) => Promise<void>;
  isFounderMembership: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: undefined,

  initUser: (val: User) => {
    set({ user: val });
  },

  isNewUser: () => {
    const { user } = get();
    return !user?.username || !user?.avatar;
  },

  setupNewUser: async (info: { username: string; avatar: string }) => {
    const { user } = get();
    if (!user) return;

    const res = await postFetcher<{ username: string; avatar: string }>("/api/user/setup", {
      username: info.username,
      avatar: info.avatar,
    });

    set({
      user: { ...user, username: res.username, avatar: res.avatar },
    });
  },

  isFounderMembership: () => {
    const { user } = get();
    return user?.membership.details?.type === MembershipType.FOUNDER;
  },
}));
