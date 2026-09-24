import { timingSafeEqual } from "node:crypto";
import type { Express, Request, Response } from "express";
import { listPrompts } from "./db";
import { invokeLLM } from "./_core/llm";

const TELEGRAM_API = "https://api.telegram.org";
const MAX_MESSAGE_LENGTH = 3900;

type TelegramMessage = { chat?: { id?: number | string }; text?: string; from?: { id?: number | string } };
type TelegramUpdate = { update_id?: number; message?: TelegramMessage };

function configured(name: string) { return process.env[name]?.trim() ?? ""; }

function isValidSecret(received: string | undefined, expected: string) {
  if (!received || !expected) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function splitMessage(text: string) {
  if (text.length <= MAX_MESSAGE_LENGTH) return [text];
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += MAX_MESSAGE_LENGTH) chunks.push(text.slice(i, i + MAX_MESSAGE_LENGTH));
  return chunks;
}

async function sendTelegramMessage(chatId: number | string, text: string) {
  const token = configured("TELEGRAM_BOT_TOKEN");
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  for (const chunk of splitMessage(text)) {
    const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: chunk, disable_web_page_preview: true }),
    });
    if (!response.ok) throw new Error(`Telegram sendMessage failed with HTTP ${response.status}`);
  }
}

async function generatePrompt(idea: string) {
  const result = await invokeLLM({
    messages: [
      { role: "system", content: "You are PromptForge, a practical prompt-engineering assistant. Turn rough ideas into concise, production-ready AI prompts. Return plain text with headings: ROLE, TASK, CONTEXT, OUTPUT, CONSTRAINTS. Do not mention internal systems." },
      { role: "user", content: idea },
    ],
    maxTokens: 900,
  });
  const content = result.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(part => "text" in part ? part.text : "").join(" ").trim();
  return "I could not forge that prompt right now. Please try again.";
}

async function handleTelegramMessage(message: TelegramMessage) {
  const chatId = message.chat?.id;
  const text = message.text?.trim() ?? "";
  if (chatId === undefined || !text) return;

  if (text === "/start" || text === "/help") {
    await sendTelegramMessage(chatId, "Welcome to PromptForge.\n\nUse /forge followed by a rough idea to create a production-ready prompt.\nUse /search followed by a topic to find Library prompts.\nUse /connect to link this Telegram account to PromptForge.\n\nExample:\n/forge Create a WhatsApp campaign for a Lagos fashion brand");
    return;
  }

  if (text.startsWith("/forge")) {
    const idea = text.replace(/^\/forge\s*/i, "").trim();
    if (!idea) { await sendTelegramMessage(chatId, "Tell me what you want to make after /forge. Example: /forge a launch post for a fintech app"); return; }
    await sendTelegramMessage(chatId, "Forging your prompt…");
    try { await sendTelegramMessage(chatId, await generatePrompt(idea)); } catch (error) { console.error("[Telegram] generation failed", error); await sendTelegramMessage(chatId, "I could not reach the prompt engine right now. Please try again shortly."); }
    return;
  }

  if (text.startsWith("/search")) {
    const search = text.replace(/^\/search\s*/i, "").trim();
    if (!search) { await sendTelegramMessage(chatId, "Tell me what to search for after /search. Example: /search WhatsApp"); return; }
    try {
      const prompts = await listPrompts({ search, limit: 5, offset: 0, access: "FREE", sort: "POPULAR" });
      if (!prompts.length) { await sendTelegramMessage(chatId, `No free Library prompts matched “${search}”. Try a broader topic.`); return; }
      const lines = prompts.map((prompt, index) => `${index + 1}. ${prompt.title} — ${prompt.category}`);
      await sendTelegramMessage(chatId, `Free PromptForge Library matches for “${search}”:\n\n${lines.join("\n")}\n\nOpen PromptForge to use the full Library.`);
    } catch (error) { console.error("[Telegram] search failed", error); await sendTelegramMessage(chatId, "The Library is temporarily unavailable. Please try again shortly."); }
    return;
  }

  if (text === "/connect") {
    await sendTelegramMessage(chatId, "Account linking is ready for the next step. Open PromptForge, sign in, and choose Connect Telegram from your Account page to receive a one-time confirmation code.");
    return;
  }

  await sendTelegramMessage(chatId, "I can help you forge a prompt or search the Library. Try /forge, /search, /connect, or /help.");
}

export function registerTelegramWebhookRoutes(app: Express) {
  app.post("/api/telegram/webhook", async (req: Request, res: Response) => {
    const secret = configured("TELEGRAM_WEBHOOK_SECRET");
    if (!isValidSecret(req.header("x-telegram-bot-api-secret-token"), secret)) { res.status(401).json({ error: "Unauthorized" }); return; }
    res.status(200).json({ ok: true });
    try { await handleTelegramMessage(req.body as TelegramUpdate | undefined ? (req.body as TelegramUpdate).message ?? {} : {}); }
    catch (error) { console.error("[Telegram] webhook handling failed", error); }
  });

  app.get("/api/telegram/health", (_req, res) => {
    res.json({ configured: Boolean(configured("TELEGRAM_BOT_TOKEN") && configured("TELEGRAM_WEBHOOK_SECRET")) });
  });
}

export const telegramInternals = { isValidSecret, splitMessage };
