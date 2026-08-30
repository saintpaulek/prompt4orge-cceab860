import { request } from "node:https";

const input = encodeURIComponent(JSON.stringify({
  0: {
    json: { search: null, category: "ALL", access: "ALL", sort: "NEWEST", limit: 3, offset: 0 },
    meta: { values: { search: ["undefined"] } },
  },
}));
const url = `https://www.promptforge.com.ng/api/trpc/catalog.list?batch=1&input=${input}`;

const response = await new Promise((resolve, reject) => {
  const req = request(url, { headers: { accept: "application/json" } }, (res) => {
    let body = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => { body += chunk; });
    res.on("end", () => resolve({ status: res.statusCode, contentType: res.headers["content-type"], body }));
  });
  req.on("error", reject);
  req.end();
});

const parsed = JSON.parse(response.body);
const result = parsed?.[0]?.result?.data?.json;
console.log(JSON.stringify({
  status: response.status,
  contentType: response.contentType,
  total: result?.total ?? null,
  items: Array.isArray(result?.items) ? result.items.length : null,
  firstId: result?.items?.[0]?.id ?? null,
}));
