import fs from "node:fs";

const free = [
  ["Free WhatsApp opt-in welcome flow", "WhatsApp, Banking, Fintech, Free"],
  ["Free SMS payment reminder", "SMS, Banking, Fintech, Free"],
  ["Free KYC checklist explainer", "KYC, Banking, Fintech, Free"],
  ["Free fraud alert confirmation flow", "Fraud, WhatsApp, Banking, Free"],
  ["Free financial education short", "AI Video, Education, Banking, Free"],
];
const paid = [
  ["Loan application status journey", "Lending, WhatsApp, Banking"], ["EMI reminder escalation flow", "Collections, WhatsApp, Banking"], ["KYC document recovery sequence", "KYC, SMS, Banking"], ["Fraud case human hand-off", "Fraud, WhatsApp, Fintech"], ["Credit card onboarding campaign", "Onboarding, Marcom, Banking"], ["Salary account activation plan", "Onboarding, SMS, Banking"], ["Savings goal education series", "Education, AI Video, Banking"], ["Personal loan cross-sell journey", "Cross-sell, WhatsApp, Banking"], ["Dormant account reactivation flow", "Retention, SMS, Banking"], ["Customer consent audit brief", "Compliance, Automation, Banking"], ["Secure link CTA message pack", "WhatsApp, Security, Banking"], ["Opt-out and HELP response library", "Compliance, SMS, Banking"], ["WhatsApp template approval brief", "WhatsApp, Compliance, Fintech"], ["Interactive button menu design", "WhatsApp, Automation, Fintech"], ["Chatbot intent and fallback map", "Chatbot, Automation, Banking"], ["Agent escalation playbook", "Customer Service, WhatsApp, Banking"], ["Mobile app download campaign", "Acquisition, SMS, Fintech"], ["First transaction activation flow", "Onboarding, WhatsApp, Fintech"], ["Card delivery update sequence", "Operations, SMS, Banking"], ["Account opening nurture series", "Onboarding, Marcom, Banking"], ["Digital banking feature launch", "Product Marketing, AI Video, Banking"], ["Financial literacy Reels brief", "AI Video, Marcom, Banking"], ["Festive savings creative brief", "AI Video, Marcom, Banking"], ["Credit score education campaign", "Education, SMS, Fintech"], ["Buy now pay later onboarding", "Lending, WhatsApp, Fintech"], ["Merchant settlement notification flow", "Payments, SMS, Fintech"], ["Wallet funding reminder sequence", "Payments, WhatsApp, Fintech"], ["Failed payment recovery journey", "Payments, Automation, Banking"], ["Chargeback status communications", "Operations, SMS, Banking"], ["Subscription payment reminder pack", "Payments, SMS, Fintech"], ["Customer NPS engagement plan", "Retention, Marcom, Banking"], ["Complaint resolution update flow", "Customer Service, WhatsApp, Banking"], ["Branch appointment reminder flow", "Operations, SMS, Banking"], ["Relationship manager hand-off flow", "Customer Service, WhatsApp, Banking"], ["High-value customer education plan", "Marcom, Banking, Fintech"], ["Microfinance onboarding sequence", "Onboarding, SMS, Fintech"], ["Insurance add-on engagement plan", "Cross-sell, WhatsApp, Banking"], ["Investment education campaign", "Education, AI Video, Banking"], ["Remittance transaction update flow", "Payments, WhatsApp, Banking"], ["International transfer FAQ flow", "Customer Service, WhatsApp, Fintech"], ["Cashback offer compliance brief", "Marcom, Compliance, Banking"], ["Referral campaign message matrix", "Acquisition, SMS, Fintech"], ["Product comparison explainer video", "AI Video, Marcom, Banking"], ["Responsible lending content plan", "Education, Compliance, Banking"], ["Data privacy notice campaign", "Compliance, SMS, Banking"], ["Consent renewal journey", "Compliance, Automation, Fintech"], ["Account security education series", "Security, AI Video, Banking"], ["Phishing awareness campaign", "Security, Marcom, Banking"], ["Payment holiday information flow", "Collections, WhatsApp, Banking"], ["Delinquency prevention journey", "Collections, SMS, Banking"], ["Credit limit review campaign", "Lending, WhatsApp, Banking"], ["Overdraft education sequence", "Education, SMS, Banking"], ["Open banking feature launch", "Product Marketing, Marcom, Fintech"], ["API partner onboarding brief", "Partnerships, Automation, Fintech"], ["Fintech product launch campaign", "Marcom, AI Video, Fintech"], ["30-day omnichannel retention plan", "Marcom, WhatsApp, SMS, Banking"], ["30-day onboarding engagement plan", "Marcom, WhatsApp, SMS, Fintech"], ["AI creative asset production plan", "AI Video, Creative, Banking"], ["Regulated campaign KPI dashboard", "Analytics, Marcom, Banking"], ["Compliance review checklist pack", "Compliance, Banking, Fintech"],
];

const esc = (value) => value.replaceAll("\\", "\\\\").replaceAll("'", "''").replaceAll("\n", "\\n");
const body = (title, tags, access) => `ROLE: You are a senior banking and fintech customer-engagement strategist with expertise in ${tags.toLowerCase()}.

TASK: Create a production-ready ${title.toLowerCase()} for [specific use-case] and [campaign goal].

AUDIENCE: [target customer segment] with documented consent where required.

PLATFORM / FORMAT: [preferred channel or format].

TONE / VOICE: Clear, reassuring, inclusive, concise, and useful.

PRIMARY GOAL: [campaign goal].

DELIVERABLES:
1. A ready-to-use sequence, brief, or engagement asset with clear variables.
2. Personalization logic for [customer segment] and [customer stage].
3. Timing, CTA, measurement, and human hand-off recommendations.
4. Channel-specific copy for ${tags}.
5. Compliance review notes and an approval checklist.

CONSTRAINTS: Use only consented outreach, minimize personal data, mask identifiers, never request full card numbers, PINs, PANs, or passwords, avoid guaranteed outcomes, include opt-out and HELP handling, use secure authenticated links for sensitive actions, and provide human escalation.`;

const rows = [...free.map((row, i) => ({ id: String(3101 + i), title: row[0], tags: row[1], access: "FREE" })), ...paid.map((row, i) => ({ id: String(3201 + i), title: row[0], tags: row[1], access: "LOCKED" }))];
if (free.length !== 5 || paid.length !== 60) throw new Error(`Expected 5 free and 60 paid; received ${free.length} and ${paid.length}`);
const values = rows.map(row => `('${row.id}','${esc(row.title)}','Banking & Fintech Engagement','a senior banking and fintech customer-engagement strategist','${esc(row.tags)}','${row.access}','${esc(body(row.title, row.tags, row.access))}')`).join(",\n");
const sql = `INSERT INTO prompts (id, title, category, role, tags, access, prompt_body) VALUES\n${values}\nON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), role=VALUES(role), tags=VALUES(tags), access=VALUES(access), prompt_body=VALUES(prompt_body);\n`;
fs.writeFileSync("/home/ubuntu/promptforge/scripts/banking_expansion.sql", sql);
for (let batch = 0; batch < 3; batch += 1) {
  const slice = rows.slice(batch * 22, (batch + 1) * 22);
  if (!slice.length) continue;
  const batchValues = slice.map(row => `SELECT '${row.id}' AS id, '${esc(row.title)}' AS title, '${esc(row.tags)}' AS tags, '${row.access}' AS access`).join(" UNION ALL ");
  const promptSql = `CONCAT('ROLE: You are a senior banking and fintech customer-engagement strategist with expertise in ', LOWER(tags), '.\\n\\nTASK: Create a production-ready ', LOWER(title), ' for [specific use-case] and [campaign goal].\\n\\nAUDIENCE: [target customer segment] with documented consent where required.\\n\\nPLATFORM / FORMAT: [preferred channel or format].\\n\\nTONE / VOICE: Clear, reassuring, inclusive, concise, and useful.\\n\\nPRIMARY GOAL: [campaign goal].\\n\\nDELIVERABLES:\\n1. A ready-to-use sequence, brief, or engagement asset with clear variables.\\n2. Personalization logic for [customer segment] and [customer stage].\\n3. Timing, CTA, measurement, and human hand-off recommendations.\\n4. Channel-specific copy for the tagged channels.\\n5. Compliance review notes and an approval checklist.\\n\\nCONSTRAINTS: Use only consented outreach, minimize personal data, mask identifiers, never request full card numbers, PINs, PANs, or passwords, avoid guaranteed outcomes, include opt-out and HELP handling, use secure authenticated links for sensitive actions, and provide human escalation.')`;
  fs.writeFileSync(`/home/ubuntu/promptforge/scripts/banking_expansion_${batch + 1}.sql`, `INSERT INTO prompts (id, title, category, role, tags, access, prompt_body) SELECT id, title, 'Banking & Fintech Engagement', 'a senior banking and fintech customer-engagement strategist', tags, access, ${promptSql} FROM (${batchValues}) AS batch ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), role=VALUES(role), tags=VALUES(tags), access=VALUES(access), prompt_body=VALUES(prompt_body);\\n`);
}
console.log(JSON.stringify({ free: free.length, paid: paid.length, total: rows.length, file: "/home/ubuntu/promptforge/scripts/banking_expansion.sql", batches: [1, 2, 3] }));
