import { describe, expect, it } from "vitest";
import {
  WHATSAPP_BUSINESS_URL,
  WHATSAPP_LIBRARY_URL,
  WHATSAPP_PHONE_URL,
  WHATSAPP_PRICING_URL,
  WHATSAPP_UNLOCK_MODAL_URL,
} from "./contactLinks";

describe("contact links", () => {
  it("uses the direct WhatsApp business phone URL", () => {
    for (const url of [WHATSAPP_BUSINESS_URL, WHATSAPP_LIBRARY_URL, WHATSAPP_PRICING_URL, WHATSAPP_UNLOCK_MODAL_URL]) {
      expect(url.startsWith(`${WHATSAPP_PHONE_URL}?text=`)).toBe(true);
      expect(new URL(url).hostname).toBe("wa.me");
      expect(new URL(url).pathname).toBe("/2347069573528");
    }
  });

  it("identifies the originating page in each pre-filled message", () => {
    expect(decodeURIComponent(WHATSAPP_BUSINESS_URL)).toContain("Contact page");
    expect(decodeURIComponent(WHATSAPP_LIBRARY_URL)).toContain("Library page");
    expect(decodeURIComponent(WHATSAPP_PRICING_URL)).toContain("Pricing page");
    expect(decodeURIComponent(WHATSAPP_UNLOCK_MODAL_URL)).toContain("Unlock full access button");
  });
});
