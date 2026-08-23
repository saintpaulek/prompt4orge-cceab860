export const platformOptions: Record<string, string[]> = {
  "Social Media": ["Instagram", "TikTok", "X / Twitter", "LinkedIn", "Facebook", "Threads", "Pinterest", "YouTube Community", "Snapchat", "Reddit", "Telegram", "WhatsApp Channels"],
  "Writing & Content": ["Blog / Website", "Medium", "Substack", "Ghost", "LinkedIn Articles", "Google Docs", "Notion", "Newsletter", "Ebook", "Press release", "Case study", "White paper"],
  "Marketing": ["Landing page", "Email campaign", "Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads", "Product page", "Marketing brief", "Campaign deck", "Webinar", "Lead magnet", "Sales funnel"],
  "Code & Development": ["VS Code", "GitHub", "GitLab", "Stack Overflow", "Postman", "Replit", "Cursor", "Jira", "Linear", "Technical docs", "API reference", "Code review"],
  "Image Generation": ["Midjourney", "DALL·E", "Flux", "Stable Diffusion", "Adobe Firefly", "Ideogram", "Leonardo AI", "Canva", "Krea", "Playground AI", "Gemini Imagen", "ChatGPT Images"],
  "Video Generation": ["YouTube", "TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "Vimeo", "Kling", "Runway", "Pika", "HeyGen", "Luma", "Google Flow"],
  "Business & Strategy": ["Notion", "Google Docs", "Google Sheets", "Google Slides", "Airtable", "Asana", "Trello", "ClickUp", "Slack", "Microsoft Teams", "Miro", "Strategy memo"],
  "Customer Service": ["Email support", "Live chat", "WhatsApp", "Instagram DM", "Facebook Messenger", "Zendesk", "Intercom", "Help Scout", "Freshdesk", "Phone script", "FAQ page", "Review response"],
  "Sales & Copywriting": ["Sales page", "Cold email", "Follow-up email", "LinkedIn DM", "WhatsApp pitch", "Product description", "Proposal", "Case study", "Brochure", "Sales deck", "Call script", "Checkout page"],
  "SEO & Blogging": ["WordPress", "Webflow", "Shopify", "Medium", "Ghost", "Google Search", "Ahrefs", "Semrush", "Surfer SEO", "Bing", "Blog brief", "Pillar page"],
  "Automation & Workflows": ["Zapier", "Make", "n8n", "Airtable", "Notion", "Google Sheets", "Slack", "Microsoft Teams", "HubSpot", "Webhooks", "API workflow", "SOP"],
  "Freelancing & Clients": ["Upwork", "Fiverr", "Contra", "LinkedIn", "Email", "WhatsApp", "Zoom", "Google Meet", "Notion", "Proposal PDF", "Client portal", "Discovery call"],
  "Education & Learning": ["Google Classroom", "Canvas", "Moodle", "Teachable", "Thinkific", "YouTube", "Notion", "Google Docs", "Quiz", "Lesson plan", "Workshop", "Course module"],
  "Personal Productivity": ["Notion", "Todoist", "TickTick", "Google Calendar", "Microsoft To Do", "Apple Notes", "Obsidian", "Evernote", "Trello", "Daily plan", "Weekly review", "Personal system"],
};

export const projectTypesByCategory: Record<string, string[]> = {
  "Social Media": ["A launch post", "A carousel sequence", "A short-form video script", "A content calendar", "A community engagement post", "A social campaign concept"],
  "Writing & Content": ["A blog article", "A newsletter issue", "A thought-leadership essay", "A case study", "A white paper outline", "A long-form content brief"],
  "Marketing": ["A campaign brief", "A landing page", "An email campaign", "A lead magnet", "A product launch plan", "A conversion funnel"],
  "Code & Development": ["A code feature", "An API integration", "A debugging plan", "A technical specification", "A test suite", "A code review"],
  "Image Generation": ["A product image prompt", "A brand illustration prompt", "A social graphic prompt", "A cinematic concept prompt", "A character design prompt", "A visual moodboard prompt"],
  "Video Generation": ["A short-form video script", "A product demo video", "A talking-head video", "A storyboard", "A video ad concept", "A YouTube episode outline"],
  "Business & Strategy": ["A strategy memo", "A market-entry plan", "A quarterly roadmap", "A decision brief", "A business case", "A meeting action plan"],
  "Customer Service": ["A customer reply", "A support macro", "An escalation response", "An FAQ entry", "A service recovery message", "A help-centre article"],
  "Sales & Copywriting": ["A sales page", "A cold outreach sequence", "A follow-up message", "A product description", "A sales proposal", "A discovery call script"],
  "SEO & Blogging": ["A keyword-led article", "A topic cluster", "A pillar page", "A meta title and description", "An SEO content brief", "An internal-linking plan"],
  "Automation & Workflows": ["An automation workflow", "A no-code integration", "A webhook specification", "A standard operating procedure", "A lead-routing system", "A process audit"],
  "Freelancing & Clients": ["A client proposal", "A discovery call plan", "A project scope", "A freelance profile", "A client update", "A testimonial request"],
  "Education & Learning": ["A lesson plan", "A course module", "A learner activity", "A quiz", "A workshop outline", "A study guide"],
  "Personal Productivity": ["A weekly plan", "A daily focus system", "A decision framework", "A meeting-notes workflow", "A habit plan", "A personal review"],
  "Banking & Fintech Engagement": ["A KYC onboarding sequence", "A payment reminder campaign", "A fraud-alert response", "A financial-literacy series", "A product cross-sell campaign", "A customer-retention journey"],
};

export const projectTypes = Object.values(projectTypesByCategory).flat();
