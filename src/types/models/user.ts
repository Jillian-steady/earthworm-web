import type { MembershipType } from "./membership";

export interface SetupUser {
  avatar: string;
  username: string;
}

export type User = {
  sub?: string;
  name?: string;
  username?: string;
  picture?: string;
  email?: string;
  avatar: string;
  id: string;
  membership: {
    details: {
      endDate: string;
      type: MembershipType;
      startDate: string;
    } | null;
    isMember: boolean;
  };
};
