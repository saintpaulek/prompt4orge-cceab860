import { describe, expect, it } from "vitest";
import { bankingChannels, bankingGoals, bankingUseCases } from "./Home";

describe("Banking & Fintech Builder variables", () => {
  it("provides fillable use-case and campaign-goal choices", () => {
    expect(bankingUseCases).toContain("KYC document collection");
    expect(bankingGoals).toContain("Increase compliant engagement");
  });

  it("covers the supplied engagement channels", () => {
    expect(bankingChannels).toEqual(expect.arrayContaining(["WhatsApp Business API", "SMS campaign", "AI video + social", "Omnichannel campaign"]));
  });
});
