# Srichandrasekharam — bookstore

A public-facing storefront for the author's books. This repository contains only the website source and catalogue metadata.

**Privacy boundary:** Original book PDFs and the private `Mybooks/` folder are deliberately excluded. No manuscript, full book, payment credential, or buyer information is stored in this public repository.

## Cloudflare Pages

Connect this repository to Cloudflare Pages with:

- Production branch: `main`
- Root directory: `/`
- Build command: leave blank
- Build output directory: `/`

The site is a static HTML/CSS/JavaScript preview. Book-cover images, approved prefaces, reading previews, pricing, and secure purchase/delivery are not yet configured. Cover placeholders are intentional; do not add the PDFs to this public repository.

## Before accepting orders

1. Add approved cover images that do not reveal the full book.
2. Add the approved preface text for each title.
3. Set prices in INR.
4. Integrate a payment provider using server-side order creation and verified payment webhooks.
5. Store original PDFs in private object storage and issue controlled download links only after verified payment.

Never put payment secrets or private PDFs in browser JavaScript or this public repository.
