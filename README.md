# Shopee Affiliate Link Converter (Vercel starter)

A Vietnamese single-link converter UI and serverless API skeleton.

## Current behavior

- Serves a mobile-friendly UI from `public/`.
- Validates that input is HTTPS and uses one of the explicitly allowed Shopee domains.
- Keeps all API credentials on the server.
- Does **not** pretend to create an affiliate link before the official Shopee Affiliate Open API integration is confirmed.
- Returns a clear `503` until the API adapter is implemented and tested.

## Deploy to Vercel

1. Put this folder in a Git repository.
2. Import the repository into Vercel.
3. Keep the default Node.js runtime; API files in `/api` become Functions.
4. In Project Settings -> Environment Variables, add `SHOPEE_API_ENABLED` with value `false`.
5. Deploy and test the interface. It should report that API access is not configured.
6. After confirming official Open API access and the exact current authentication/signature instructions, implement the API adapter in `api/convert.js` or `lib/shopee.js`.
7. Only then add the credentials that Shopee actually issued/required, set `SHOPEE_API_ENABLED=true`, and redeploy.

## Security checklist before public launch

- Add shared rate limiting (e.g. a Redis/Upstash-compatible store or another supported service); per-instance in-memory counters are not sufficient for serverless.
- Consider CAPTCHA / bot protection.
- Review allowed Shopee domains against official link formats in use. Do not blindly follow or fetch user-submitted URLs.
- Avoid logging raw input URLs if they may contain tracking information.
- Never expose secrets in frontend code, public Git repositories, or `NEXT_PUBLIC_*` variables.
- Verify terms and permission for a public conversion tool using your Affiliate account.
- Test API errors, rate limits, and key rotation.

## Important

The API is intentionally not implemented with guessed credentials, endpoints, or signatures. The official Shopee Affiliate Open API documentation and the user's account permissions must be confirmed first.
