---
title: JWT Generator — sign HS256/384/512 tokens in the browser
publishedAt: 2026-07-26
tag: New tool
version: 1.12
---

A brand new **JWT Generator** joins the toolkit — pair it with the existing JWT Decoder for a full sign-and-inspect loop.

## What's inside

- **HS256 / HS384 / HS512** signing via the browser's WebCrypto API
- Live editors for **header** and **payload** with instant JSON validation
- One-click **claim helpers**: `iat = now`, `nbf = now`, `exp +15m / +1h / +1d / +30d`, random `jti`
- **Secret encoding** switch — UTF-8, Base64, or Base64URL — plus a "Random 256-bit" generator
- Colour-coded token output with **copy**, **download** and a ready-to-paste **cURL example**
- **Claims summary** panel showing decoded `iss`, `sub`, `aud`, `exp` (with expired badge) and more

Everything runs locally — your secret and generated token never leave the tab.
