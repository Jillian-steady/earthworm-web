import { beforeEach, describe, expect, it } from "vitest";

import { useUserStore } from "../user";

function generateUserInfo() {
  return {
    userId: "123",
    username: "JohnDoe",
    avatar: "",
    membership: { isActive: false },
  };
}

describe("user", () => {
  beforeEach(() => {
    useUserStore.setState({ user: undefined });
  });

  it("should login user", () => {
    useUserStore.getState().initUser(generateUserInfo() as any);

    expect(useUserStore.getState().user).toMatchInlineSnapshot(
      `
      {
        "avatar": "",
        "membership": {
          "isActive": false,
        },
        "userId": "123",
        "username": "JohnDoe",
      }
    `,
    );
  });
});
