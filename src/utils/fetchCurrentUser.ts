import type { MembershipType, User } from "@/types";
import { fetchUserInfo } from "@/services/auth";
import { getFetcher } from "@/utils/fetcher";

interface UserApiResponse {
  membership: {
    details: {
      endDate: string;
      type: MembershipType;
      startDate: string;
    } | null;
    isMember: boolean;
  };
}

export async function fetchCurrentUser(): Promise<User> {
  const logtoUserInfo = await fetchUserInfo();
  const extraInfo = await getFetcher<UserApiResponse>("/api/user");

  return {
    ...logtoUserInfo,
    ...extraInfo,
    avatar: logtoUserInfo?.picture || "",
    id: logtoUserInfo?.sub || "",
  } as User;
}
