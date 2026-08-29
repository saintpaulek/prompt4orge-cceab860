export type RefineAction = "shorter" | "formal" | "creative" | "examples" | "simplify" | "constraints";
export type OptimizationTarget = "ChatGPT" | "Claude" | "Gemini" | "Grok" | "Midjourney" | "Flux";
export type PromptExportFormat = "md" | "txt" | "json" | "notion";

const variablePattern = /\[([^\[\]]+)\]|\{\{\s*([\w.-]+)\s*\}\}/g;

export function extractPromptVariables(prompt: string) {
  const values = new Set<string>();
  Array.from(prompt.matchAll(variablePattern)).forEach((match) => values.add((match[1] ?? match[2]).trim()));
  return Array.from(values);
}

export function replacePromptVariables(prompt: string, values: Record<string, string>) {
  return prompt.replace(variablePattern, (full, square, moustache) => {
    const key = String(square ?? moustache).trim();
    return values[key]?.trim() ? values[key].trim() : full;
  });
}

const qualityDimensions = [
  { label: "role", pattern: /\bROLE\b|\byou are\b/i, suggestion: "Add a specific expert role and point of view." },
  { label: "context", pattern: /\bCONTEXT\b|background|current situation/i, suggestion: "Add the situation, source facts, and relevant background." },
  { label: "task", pattern: /\bTASK\b|create|draft|audit|design|write/i, suggestion: "State one concrete task with a clear verb." },
  { label: "audience", pattern: /audience|customer|learner|reader|user/i, suggestion: "Name the intended audience and their level or needs." },
  { label: "format", pattern: /format|platform|channel|structure|deliverable/i, suggestion: "Specify the channel, format, or required structure." },
  { label: "goal", pattern: /goal|objective|outcome|success/i, suggestion: "Define the desired outcome and how success will be recognized." },
  { label: "constraints", pattern: /constraint|must|avoid|limit|privacy|compliance/i, suggestion: "Add constraints, exclusions, or safety boundaries." },
  { label: "outputs", pattern: /OUTPUT|deliverables|checklist|steps|table|include/i, suggestion: "List the exact deliverables and output order." },
  { label: "examples", pattern: /example|reference|sample|variation/i, suggestion: "Add a reference example, counterexample, or desired style cue." },
  { label: "next action", pattern: /next action|owner|handoff|experiment|review/i, suggestion: "Add an owner, review step, or next action." },
] as const;

export function scorePrompt(prompt: string) {
  const checks = qualityDimensions.map((dimension) => ({ label: dimension.label, passed: dimension.pattern.test(prompt) }));
  const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
  return { score, checks, suggestions: qualityDimensions.filter((_, index) => !checks[index].passed).map((dimension) => dimension.suggestion) };
}

export function refinePrompt(prompt: string, action: RefineAction | "none") {
  if (action === "none") return prompt;
  const instructions: Record<RefineAction, string> = {
    shorter: "Rewrite the response in the fewest words that preserve the requirements. Remove repetition and filler.",
    formal: "Use a precise, professional tone. Avoid slang, hype, unsupported claims, and vague intensifiers.",
    creative: "Offer two fresh angles, stronger sensory or conceptual detail where appropriate, and one deliberate contrast.",
    examples: "Include one good example and one brief counterexample. Label assumptions and keep examples fictional unless facts are supplied.",
    simplify: "Use plain language, short sections, and a clear numbered sequence suitable for a first-time user.",
    constraints: "Strengthen guardrails, privacy boundaries, approval points, exclusions, and an explicit escalation path.",
  };
  return `${prompt}\n\nREFINEMENT INSTRUCTION\n${instructions[action]}`;
}

export function optimizePromptForPlatform(prompt: string, target: OptimizationTarget | "none") {
  if (target === "none") return prompt;
  const guidance: Record<OptimizationTarget, string> = {
    ChatGPT: "Use explicit role, context, constraints, output schema, and a final self-check.",
    Claude: "Prefer rich context, clearly separated instructions, careful uncertainty handling, and a polished long-form structure.",
    Gemini: "Use a concise brief, source-grounded assumptions, multimodal or Google-workspace context when relevant, and labelled outputs.",
    Grok: "Use a direct brief, current-context caveat where needed, strong point of view, and clearly separated factual versus creative output.",
    Midjourney: "Translate the brief into subject, composition, camera or lens, lighting, materials, mood, aspect ratio, and a negative prompt.",
    Flux: "Translate the brief into a precise visual description with subject hierarchy, typography instructions if needed, lighting, composition, and exclusions.",
  };
  return `${prompt}\n\nPLATFORM OPTIMIZATION / ${target.toUpperCase()}\n${guidance[target]}`;
}

export function formatPromptExport(prompt: string, format: PromptExportFormat, title = "PromptForge prompt") {
  if (format === "json") return { content: JSON.stringify({ title, prompt, variables: extractPromptVariables(prompt) }, null, 2), mime: "application/json", extension: "json" };
  if (format === "notion") return { content: `# ${title}\n\n## Prompt\n\n${prompt}\n\n## Variables\n\n${extractPromptVariables(prompt).map((variable) => `- ${variable}`).join("\n") || "- None detected"}\n\n## Review checklist\n\n- [ ] Confirm facts and assumptions\n- [ ] Confirm audience and channel\n- [ ] Confirm privacy and approval constraints\n`, mime: "text/markdown", extension: "md" };
  if (format === "md") return { content: `# ${title}\n\n${prompt}\n`, mime: "text/markdown", extension: "md" };
  return { content: prompt, mime: "text/plain", extension: "txt" };
}
