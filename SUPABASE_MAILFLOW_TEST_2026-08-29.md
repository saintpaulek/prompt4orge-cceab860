# Supabase Signup-Confirmation Mailflow Test

Date: 2026-08-29

## Test request

A fresh Supabase Auth signup was submitted against the configured PromptForge Supabase project using the disposable Gmail plus-address `saintpaulek+supabase-test-20260829@gmail.com`. The redirect target supplied was `https://www.promptforge.com.ng/auth`.

## Supabase result

The Auth API returned HTTP 200 and created a new user with:

- User ID: `aa0ee2cf-9ef3-4910-aaef-6bfc06e3d62f`
- `confirmation_sent_at`: `2026-08-29T15:07:59.697275798Z`
- `email_verified`: `false`

This confirms that Supabase accepted the signup and generated a confirmation email request.

## Inbox result

The connected `saintpaulek@gmail.com` Gmail inbox contains two confirmation messages addressed to the test alias. Both have subject `Confirm your email address` and the expected confirmation-email snippet.

The messages were received from:

`Supabase Auth <noreply@mail.app.supabase.io>`

## Resend result

The Resend sending log did not contain a message for the test alias. Therefore, this test confirms Supabase’s signup-confirmation flow and inbox delivery through Supabase’s shared mailer, but it does **not** confirm delivery through the branded Resend SMTP transport.

## Interpretation

The current project is still using Supabase’s default shared mailer for Auth confirmation messages, or the custom SMTP configuration is not active for this project. The Resend DNS domain remains pending, so a branded sender such as `no-reply@promptforge.com.ng` should not be tested until Resend marks `promptforge.com.ng` as Verified and custom SMTP is enabled/saved in this exact Supabase project.

## Next step

After Resend verification, confirm Supabase custom SMTP settings for project `rupzljrpzdfrehgvbwdt`, set the sender to `no-reply@promptforge.com.ng`, save the settings, then repeat the same unique-alias signup test. The expected sender should be `no-reply@promptforge.com.ng`, and the message should appear in Resend’s sending log.
