# Srichandrasekharam — bookstore

A public-facing storefront for the author's books. This repository contains the website source and catalogue metadata.

**Privacy boundary:** Original book PDFs and the private `Mybooks/` folder are deliberately excluded. No manuscript, full book, payment credential, or buyer information is stored in this public repository.

## Cloudflare Pages

Connect this repository to Cloudflare Pages with:

- Production branch: `main`
- Root directory: `/`
- Build command: leave blank
- Build output directory: `/`

The site is a static HTML/CSS/JavaScript storefront. Book covers and catalogue descriptions are public; original PDFs remain private and must not be added to this repository.

## Reader feedback

The feedback form is anonymous. It does not ask for a name or email and does not store visitor IP addresses. Feedback is saved privately in Cloudflare D1 with a pending status. A reader's optional permission checkbox allows their comment to be considered for publication; it does not publish it automatically.

To enable submissions on Cloudflare Pages:

1. In the Cloudflare dashboard, open **Workers & Pages → D1 SQL Database** and create a database named `srichandrasekharam-feedback`.
2. Open that database's **Console** and run the SQL in `migrations/0001_create_feedback.sql`.
3. Open **Workers & Pages → your Pages project → Settings → Functions → D1 database bindings**.
4. Add a binding with variable name `FEEDBACK_DB` and select `srichandrasekharam-feedback`.
5. Save the binding and trigger a new Pages deployment.

Until the D1 database is created and bound, the form will safely report that submissions are not available yet.

### Reviewing feedback

In the D1 database Console, review new submissions with:

```sql
SELECT id, message, permission_to_feature, created_at
FROM feedback
WHERE status = 'pending'
ORDER BY created_at DESC;
```

Only comments with `permission_to_feature = 1` may be considered for the public **Readers’ Reflections** section. Review the wording and remove any identifying details before publication. Mark a reviewed item after deciding:

```sql
UPDATE feedback SET status = 'approved' WHERE id = 1;
```

To reject a submission, use `status = 'rejected'`. The public site does not read or display the feedback database. To publish a testimonial, add the approved wording and a generic attribution (for example, “A reader”) to the `approvedReflections` array in `app.js`. This is a manual editorial step; no submission is ever published automatically.

## Anonymous visitor analytics

Cloudflare Web Analytics is privacy-focused and can be enabled from the Cloudflare dashboard for the Pages site. Create a Web Analytics token for the live site, then add Cloudflare's generated beacon snippet to `index.html` immediately before `</body>`. The token is a public site identifier, not a secret. Do not invent or reuse a token from another website.

## Before accepting book requests

1. Finalise prices in INR.
2. Keep personal UPI details out of this public repository; show payment instructions only at the agreed request stage.
3. Store original PDFs in private object storage and issue controlled download links only after manual payment verification.
4. Never put payment secrets or private PDFs in browser JavaScript or this public repository.
