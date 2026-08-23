import { describe, expect, it } from "vitest";
import { WHATSAPP_BUSINESS_URL } from "./contactLinks";

describe("contact links", () => {
  it("uses the direct WhatsApp Business product page", () => {
    expect(WHATSAPP_BUSINESS_URL).toBe("https://wa.me/p/28447341561540526/2347069573528");
  });
});
