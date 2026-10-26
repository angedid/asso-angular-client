# Smart Trade Platform — Angular Client

Web interface prototype for **Smart Trade Platform (STP)**, a project designed to support supplier credit tracking in informal retail trade across sub-Saharan Africa.

**Project lead:** NKALLA EHAWE Didier Junior  
**Status:** prototype under development; not intended for production use in its current state.

## Why this project exists

In many markets, wholesalers supply goods on credit to vendors, who repay them after selling the goods. Stock issued, product returns and repayments are often recorded on paper. Errors and lost records can lead to disputes and make it difficult for each party to understand their commitments.

STP aims to make these transactions easier to track. Over time, a reliable trading history could help vendors and wholesalers demonstrate their business activity to financial institutions. Lending decisions remain with those institutions; the platform does not guarantee access to credit.

This repository provides a starting point for the web client. Its original technical name, `asso-angular-client`, is still used in `package.json`, configuration files and Angular output paths. Introducing the STP product name does not mean that the technical project has already been renamed.

## Product vision and prototype status

| Audience | Planned STP capabilities | Available in this repository |
| --- | --- | --- |
| Wholesalers | Goods issued on credit, credit limits per vendor, repayments, returns, alerts and dashboards | Not implemented |
| Vendors | Tracking debts, repayments, returns and payment deadlines | Not implemented |
| Banks and financial institutions | Authorized access to trading history and information supporting creditworthiness assessment | Not implemented |
| Web client users | Sign-in and access to a personal area | OAuth/PKCE flow started, but still incomplete |

Trading history, creditworthiness assessment, payments and financial data sharing are roadmap items. The prototype does not provide them yet. The STP executive summary describes the product vision rather than capabilities already delivered.

## Current scope

The code currently includes:

- a landing page and public navigation toolbar;
- routes for sign-in, registration, the OAuth callback, the user home page and a not-found page;
- an initial manual implementation of the OAuth 2.0 Authorization Code flow with PKCE (since we are using Angular in public context);
- standalone components and a basic unit test suite.

The registration, OAuth callback and user home screens remain incomplete. Although `angular-oauth2-oidc` is listed as a dependency, the active authentication flow is primarily implemented in `AuthService`.

## Technology stack

Angular 21, TypeScript 5.9, Angular Material, Bootstrap, RxJS and Vitest. Resolved dependency versions are recorded in `package-lock.json`.

## Prerequisites

- A Node.js version compatible with the locked dependencies: `^20.19.0`, `^22.12.0` or `>=24.0.0` for Angular.
- npm; the project manifest declares `npm@11.6.4`.
- To test authentication against a real provider, an OAuth server compatible with the endpoints described below. That server is not included.

The reference commit was checked using Node.js `24.22.1` and npm `11.9.0`.

## Installation and development server

```bash
npm ci
npm start
```

The application is available at `http://localhost:4200/`.

To reproduce the exact installation command verified during the reference commit review:

```bash
npm ci --ignore-scripts --no-audit --no-fund
```

This variant does not run dependency lifecycle scripts. Installation with `npm ci` without `--ignore-scripts` still needs to be checked separately and was not validated during that review.

## Current OAuth configuration

At the reference commit, authentication settings are hard-coded in `src/app/auth.service.ts`. There is no centralized environment configuration for this flow yet.

| Setting | Current value or location |
| --- | --- |
| Authorization endpoint | `http://localhost:9001/oauth/authorize` |
| Token endpoint | `http://localhost:9001/oauth/token` |
| Redirect URI | `http://localhost:4200/oauth/callback` |
| Public client identifier | The `client_id` field in `AuthService`; adapt it to your development server |
| Flow | `authorization_code` with the PKCE `S256` challenge method |

To test the flow against your development provider:

1. Start your development OAuth server.
2. Register a public client with the exact redirect URI shown above. Do not embed a client secret in the Angular application.
3. Update the service URLs and `client_id`. Some values are repeated across methods; check every active path until configuration is centralized.
4. Configure the server to allow requests from the development client's origin where required for token endpoint calls.
5. Start Angular and open `/login` using a test account.

The local HTTP URLs are for development only. The server, its migrations, user accounts and production configuration are not provided. Do not assume that adding a `.env` file will configure Angular automatically: no such loading mechanism is configured in this repository.

## Verification commands

```bash
npm run build
npm test -- --watch=false
```

## Relevant source files

| Path under `src/app/` | Purpose |
| --- | --- |
| `auth.service.ts` | Current OAuth and PKCE logic |
| `login.service.ts` | Additional legacy authentication service |
| `app.routes.ts` | Public and user routes |
| `app.config.ts` | Application provider configuration |
| `login/` | Sign-in initiation |
| `authorization-callback/` | OAuth callback handling |
| `home/` | Minimal user home screen |
| `guest-toolbar/` | Public navigation |
| `register/` | Minimal registration screen |

## Next development step

Make the OAuth/PKCE transaction reliable: generate `state` independently from `code_verifier`, validate the callback, wait for the actual HTTP result, handle errors and prevent transaction reuse. Full session management and protected-route access are subsequent steps.

Existing console logs may expose authentication material. Use development data and accounts only, and remove those logs as part of the authentication improvements.


## License

Original code for which the copyright holder owns the relevant rights is proposed under the MIT License; see [LICENSE](LICENSE). Dependencies and third-party content remain subject to their respective licenses. This license does not authorize the use of real personal data or transfer rights belonging to third parties.

## Product background

The product vision is based on “Smart Trade Platform — Executive Summary,” version 1.0, August 2026, by Didier Junior NKALLA EHAWE. The future capabilities described above are development goals.
