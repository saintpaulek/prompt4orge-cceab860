import { request } from "node:https";

const routes = ["/", "/library", "/about", "/contact"];
const userAgent = "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 Chrome/128.0 Mobile Safari/537.36";

async function fetchRoute(route) {
  return await new Promise((resolve, reject) => {
    const req = request(`https://www.promptforge.com.ng${route}`, { headers: { "user-agent": userAgent, accept: "text/html" } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({ route, status: res.statusCode, contentType: res.headers["content-type"], hasPromptForge: body.includes("PromptForge"), hasLibraryShell: route === "/library" ? body.includes("Start with a proven brief") : null }));
    });
    req.on("error", reject);
    req.end();
  });
}

const results = [];
for (const route of routes) results.push(await fetchRoute(route));
console.log(JSON.stringify(results));
