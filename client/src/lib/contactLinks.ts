export const WHATSAPP_PHONE_URL = "https://wa.me/2347069573528";

export function buildWhatsAppUrl(message: string) {
  return `${WHATSAPP_PHONE_URL}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_BUSINESS_URL = buildWhatsAppUrl(
  "Hello PromptForge, I am contacting you from the Contact page."
);

export const WHATSAPP_LIBRARY_URL = buildWhatsAppUrl(
  "Hello PromptForge, I would like to unlock the prompt library. I clicked from the Library page."
);

export const WHATSAPP_PRICING_URL = buildWhatsAppUrl(
  "Hello PromptForge, I am interested in lifetime access. I clicked from the Pricing page."
);

export const WHATSAPP_UNLOCK_MODAL_URL = buildWhatsAppUrl(
  "Hello PromptForge, I would like to unlock the workshop. I clicked the Unlock full access button."
);
