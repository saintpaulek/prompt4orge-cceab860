import { describe, expect, it } from "vitest";
import { consumeGoogleAuthPending, getGoogleAvatarUrl, getGooglePostAuthPath, markGoogleAuthPending } from "./googleAuth";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } as unknown as Storage;
}

describe("Google sign-in helpers", () => {
  it("marks and consumes a pending OAuth callback once", () => {
    const target = storage();
    markGoogleAuthPending(target);
    expect(consumeGoogleAuthPending(target)).toBe(true);
    expect(consumeGoogleAuthPending(target)).toBe(false);
  });

  it("accepts Google avatar metadata and rejects unsafe values", () => {
    expect(getGoogleAvatarUrl({ user_metadata: { picture: "https://lh3.googleusercontent.com/avatar" } })).toBe("https://lh3.googleusercontent.com/avatar");
    expect(getGoogleAvatarUrl({ user_metadata: { avatar_url: "javascript:alert(1)" } })).toBeUndefined();
    expect(getGoogleAvatarUrl({ user_metadata: {} })).toBeUndefined();
  });

  it("routes completed Google sign-ins to the account dashboard", () => {
    expect(getGooglePostAuthPath()).toBe("/account");
  });
});
