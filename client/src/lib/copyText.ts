export type CopyTextResult = "copied" | "unavailable";

export async function copyText(value: string): Promise<CopyTextResult> {
  if (typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function") {
    try { await navigator.clipboard.writeText(value); return "copied"; } catch { /* try the browser fallback */ }
  }
  if (typeof document !== "undefined" && typeof document.execCommand === "function") {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();
    return copied ? "copied" : "unavailable";
  }
  return "unavailable";
}
