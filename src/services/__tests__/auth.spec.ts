import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSignInCallback } from "../auth";

// We don't need to mock LogtoClient for testing signIn callback logic
// which only uses sessionStorage

describe("auth", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should get signIn callback and consume callback", () => {
    // Simulate what signIn() does: stores callback in sessionStorage
    sessionStorage.setItem("callback", "/game/pack1/1");

    const callback = getSignInCallback();

    expect(callback).toBe("/game/pack1/1");

    // Second call should return default "/"
    const callback2 = getSignInCallback();
    expect(callback2).toBe("/");
  });

  it("should get default callback when no callback stored", () => {
    const callback = getSignInCallback();

    expect(callback).toBe("/");
  });
});
