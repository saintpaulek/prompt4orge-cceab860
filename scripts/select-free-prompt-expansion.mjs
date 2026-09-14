const origin = process.env.PROMPTFORGE_ORIGIN ?? "https://www.promptforge.com.ng";
const targets = [
  ["SMM", 5], ["VA Tasks", 5], ["Customer Service", 5], ["Automation Logic", 5], ["SEO", 5], ["Email Marketing", 5], ["Sales & Copywriting", 5], ["Content Strategy", 5], ["Image Generation", 5], ["Video & Shorts", 5], ["Blogging & Articles", 5], ["Freelancing & Clients", 5], ["Branding & Identity", 5], ["Ads & Paid Media", 5], ["ChatGPT Productivity", 5], ["Business & Strategy", 5], ["Personal Development", 5], ["Finance & Admin", 5], ["Banking & Fintech Engagement", 4]
];
const selected = [];
for (const [category, needed] of targets) {
  const input = encodeURIComponent(JSON.stringify({ json: { category, access: "LOCKED", sort: "OLDEST", limit: needed, offset: 0 } }));
  const response = await fetch(`${origin}/api/trpc/catalog.list?input=${input}`);
  if (!response.ok) throw new Error(`${category}: HTTP ${response.status}`);
  const payload = await response.json();
  const items = payload?.result?.data?.json?.items ?? [];
  if (items.length !== needed) throw new Error(`${category}: expected ${needed} locked rows, received ${items.length}`);
  selected.push({ category, ids: items.map((item) => String(item.id)) });
}
console.log(JSON.stringify({ origin, selected }, null, 2));
