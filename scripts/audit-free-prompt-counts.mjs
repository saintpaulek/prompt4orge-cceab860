const origin = process.env.PROMPTFORGE_ORIGIN ?? "https://www.promptforge.com.ng";
const html = await fetch(`${origin}/library?audit=free-counts`).then((response) => {
  if (!response.ok) throw new Error(`Library page returned HTTP ${response.status}`);
  return response.text();
});
const categories = ["SMM", "VA Tasks", "Customer Service", "Automation Logic", "SEO", "Email Marketing", "Sales & Copywriting", "Content Strategy", "Image Generation", "Video & Shorts", "Blogging & Articles", "Ecommerce & Product", "Freelancing & Clients", "Branding & Identity", "Ads & Paid Media", "ChatGPT Productivity", "Business & Strategy", "Education & Learning", "Personal Development", "Finance & Admin", "Banking & Fintech Engagement", "Nigeria Business Growth & WhatsApp", "Email Marketing & Sequences", "SEO & Content Optimization", "Finance, Accounting & Admin", "Personal Development & Productivity", "HR / Recruitment & People Ops", "WhatsApp / Messaging Business", "Legal / Contracts & Compliance", "Real Estate", "Agency / Client Management", "Healthcare / Wellness"];
const counts = [];
for (const category of categories) {
  const input = encodeURIComponent(JSON.stringify({ json: { category, access: "FREE", sort: "NEWEST", limit: 100, offset: 0 } }));
  const response = await fetch(`${origin}/api/trpc/catalog.list?input=${input}`);
  if (!response.ok) throw new Error(`${category}: HTTP ${response.status}`);
  const payload = await response.json();
  const items = payload?.result?.data?.json?.items ?? [];
  const total = Number(payload?.result?.data?.json?.total ?? items.length);
  counts.push({ category, free: total, sample: items.slice(0, 2).map((item) => item.id) });
}
console.log(JSON.stringify({ origin, categoryCount: categories.length, counts }, null, 2));
