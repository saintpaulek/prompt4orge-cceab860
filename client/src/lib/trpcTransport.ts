const API_JSON_ERROR = "The API returned an unexpected non-JSON response. Please retry.";

export async function fetchJsonApi(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await globalThis.fetch(input, init);
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json") || contentType.includes("application/jsonl")) {
    return response;
  }

  return new Response(
    JSON.stringify({
      error: {
        json: {
          message: API_JSON_ERROR,
          code: "INTERNAL_SERVER_ERROR",
          data: { httpStatus: 502 },
        },
      },
    }),
    {
      status: 502,
      headers: { "content-type": "application/json" },
    },
  );
}

export { API_JSON_ERROR };
