# About and Contact verification

The local `/contact` route rendered the direct email, phone, WhatsApp card, Chat on WhatsApp CTA, contact form, response-time note, and floating WhatsApp action. The form’s empty submission was exercised in-browser; native required-field validation prevented an external submission. Validated mutation success and service-error behavior are covered by `server/contact.submit.test.ts` with the notification channel mocked.

Desktop and mobile full-page previews were captured for `/about` and `/contact`. The About page stacked cleanly on mobile, and the Contact page kept the contact cards, form, WhatsApp CTA, and floating action readable and reachable.
