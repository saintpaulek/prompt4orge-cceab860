import { afterEach, describe, expect, it, vi } from "vitest";
import { API_JSON_ERROR, fetchJsonApi } from "./trpcTransport";

describe("fetchJsonApi", () => {
  afterEach(() => vi.restoreAllMocks());

  it("normalizes an HTML fallback response into a JSON API error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<!doctype html><html></html>", {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );

    const response = await fetchJsonApi("/api/trpc/catalog.list");
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body.error.json.message).toBe(API_JSON_ERROR);
  });

  it("passes valid JSON responses through unchanged", async () => {
    const original = new Response('{"result":{"data":[]}}', {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(original);

    const response = await fetchJsonApi("/api/trpc/catalog.list");

    expect(response).toBe(original);
  });
});
