---
layout: post
title: OAuth 2.0 Authentication Flows Explained
categories: Cloud
---

Almost every modern application I touch — web apps, mobile clients, internal APIs, batch jobs, AI agents — has to answer the same question before it can do anything useful: *who is making this call, and are they allowed to?* OAuth 2.0 is the protocol that most of the industry has settled on to answer it, and once you understand its three main flows, a huge amount of identity and integration work becomes obvious instead of confusing.

The three flows look superficially similar — they all involve a client, an authorization server, and a resource API, and they all end with the client holding an access token. But they exist as separate flows because they answer a deeper question differently: **who is the principal authenticating?** A human user clicking "Sign in with Microsoft" is fundamentally different from a nightly batch job, which is in turn different from an API forwarding a user's identity to a downstream API. Each scenario gets its own flow, with its own trust model and its own credential requirements.

This post is a practical walkthrough of the three flows — Authorization Code, On-Behalf-Of, and Client Credentials — covering how each works mechanically, what credentials are required, when to pick which, and the security insights that explain *why* each flow is shaped the way it is.

<style>
.oauth-post {
  --bg2: #14161a;
  --bg3: #1c1f25;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --muted: #7a7870;
  --accent-blue: #5b9cf6;
  --accent-amber: #f0a843;
  --accent-teal: #3ecf8e;
  --accent-pink: #e86aaa;
  --accent-blue-dim: rgba(91,156,246,0.12);
  --accent-amber-dim: rgba(240,168,67,0.12);
  --accent-teal-dim: rgba(62,207,142,0.12);
}
.oauth-diagram {
  background: #14161a;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 28px 24px 20px;
  margin: 20px 0;
  overflow-x: auto;
}
.oauth-diagram .diagram-title {
  font-family: 'DM Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #7a7870;
  margin-bottom: 20px;
}
.oauth-insight {
  background: #1c1f25;
  border-left: 2px solid #f0a843;
  border-radius: 0 8px 8px 0;
  padding: 16px 20px;
  margin: 20px 0;
  color: #b8b5ae;
  font-size: 14px;
  line-height: 1.65;
}
.oauth-insight strong { color: #f0a843; }
.oauth-insight code {
  font-family: 'DM Mono', ui-monospace, monospace;
  font-size: 12px;
  background: rgba(255,255,255,0.06);
  padding: 1px 6px;
  border-radius: 4px;
  color: #5b9cf6;
}
</style>

<div class="oauth-post"></div>

**The Core Question Behind the Three Flows**

The three OAuth 2.0 flows that show up in 95% of real-world systems are:

* **Authorization Code Flow** — a human user is present and consents interactively.
* **On-Behalf-Of (OBO) Flow** — a middle-tier API needs to call a downstream API while preserving the original user's identity.
* **Client Credentials Flow** — no user is involved; a service authenticates as itself.

The cleanest mental model is to ask: *whose identity is the token going to carry?* If it's a logged-in human's identity, you're in Auth Code territory. If it's a human's identity but needs to flow through additional API hops, you need OBO. If there's no human and the service is the principal, you want Client Credentials.

Everything else — refresh tokens, PKCE, certificates, federated identity — is a refinement of those three answers.

**Authorization Code Flow**

The Authorization Code flow is the most common OAuth flow and the one most developers encounter first. It's what happens behind every "Sign in with Google" or "Login with Microsoft" button. A user is redirected from the application to the authorization server, authenticates there, grants consent, and is redirected back to the app with a short-lived authorization code. The app then exchanges that code — server-to-server, with its own client secret — for an access token and a refresh token.

The reason for the two-step "code, then token" structure is security. The authorization code travels through the browser, which is an untrusted channel: it could be intercepted, logged, or replayed. But by itself, the code is useless. To redeem it for a token, the client must also present its `client_secret`, which never leaves the server. Even if an attacker grabs the code, they can't trade it in.

<div class="oauth-diagram">
  <p class="diagram-title">Sequence — Auth code flow</p>
  <svg width="100%" viewBox="0 0 680 390" role="img" style="display:block;">
    <title>Authorization code flow sequence diagram</title>
    <desc>Shows redirect-based flow between browser, app, auth server, and resource API with code exchange and token issuance</desc>
    <defs><marker id="arr-ac" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <rect x="20" y="16" width="110" height="38" rx="7" fill="#1c1f25" stroke="rgba(255,255,255,0.18)" stroke-width="0.5"/>
    <text x="75" y="38" text-anchor="middle" dominant-baseline="central" fill="#9ca3af" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">User / Browser</text>
    <rect x="180" y="16" width="110" height="38" rx="7" fill="#1c1f25" stroke="rgba(91,156,246,0.5)" stroke-width="0.5"/>
    <text x="235" y="38" text-anchor="middle" dominant-baseline="central" fill="#5b9cf6" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">Client app</text>
    <rect x="340" y="16" width="120" height="38" rx="7" fill="#1c1f25" stroke="rgba(62,207,142,0.5)" stroke-width="0.5"/>
    <text x="400" y="38" text-anchor="middle" dominant-baseline="central" fill="#3ecf8e" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">Auth server</text>
    <rect x="520" y="16" width="130" height="38" rx="7" fill="#1c1f25" stroke="rgba(240,168,67,0.5)" stroke-width="0.5"/>
    <text x="585" y="38" text-anchor="middle" dominant-baseline="central" fill="#f0a843" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">Resource API</text>
    <line x1="75"  y1="54" x2="75"  y2="382" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="235" y1="54" x2="235" y2="382" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="400" y1="54" x2="400" y2="382" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="585" y1="54" x2="585" y2="382" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="75" y1="82" x2="227" y2="82" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="151" y="76" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">1. Login request</text>
    <line x1="235" y1="110" x2="392" y2="110" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="314" y="104" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">2. Redirect to auth server</text>
    <line x1="75" y1="138" x2="392" y2="138" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="234" y="132" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">3. User authenticates + consents</text>
    <line x1="400" y1="166" x2="88" y2="166" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="234" y="160" text-anchor="middle" fill="#3ecf8e" font-size="11" font-family="DM Mono,monospace">4. Auth code returned (redirect)</text>
    <line x1="235" y1="194" x2="392" y2="194" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="314" y="188" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">5. Exchange code + client_secret</text>
    <line x1="400" y1="222" x2="248" y2="222" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="314" y="216" text-anchor="middle" fill="#3ecf8e" font-size="11" font-family="DM Mono,monospace">6. Access token + refresh token</text>
    <line x1="235" y1="258" x2="577" y2="258" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="406" y="252" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">7. API call with access token</text>
    <line x1="585" y1="286" x2="248" y2="286" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-ac)"/>
    <text x="416" y="280" text-anchor="middle" fill="#3ecf8e" font-size="11" font-family="DM Mono,monospace">8. Protected resource</text>
  </svg>
</div>

<div class="oauth-insight"><strong>Key security insight:</strong> The authorization code travels through the browser (untrusted channel), but the token exchange happens server-to-server with the client secret. Even if the code is intercepted, it's useless without the secret.</div>

The token that comes back from this flow is a *delegated* token — its permissions are scoped to what the signed-in user can do, not what the app can do globally. The app can only do things the user has consented to, and only against resources that user has access to.

A few properties are worth pinning down:

* **PKCE variant.** Single-page apps and mobile apps are "public clients" — they can't safely store a `client_secret` because the secret would end up in the JavaScript bundle or mobile binary, both of which are inspectable. PKCE (Proof Key for Code Exchange) replaces the static secret with a cryptographic challenge/verifier pair generated fresh for each authorization attempt. The flow still has two legs, but the second leg is bound to the first by something only the legitimate client knows.

* **Refresh tokens.** The access token is short-lived (typically 1 hour). The refresh token, returned alongside it, lets the app obtain a new access token silently — without prompting the user again. This is what makes "stay signed in" work without compromising on token lifetime.

* **Typical use cases.** Any user-facing application: web apps, native mobile clients, single-page apps, desktop apps. "Login with Google/Microsoft/Okta", calling Microsoft Graph as the signed-in user, accessing the user's GitHub repos, posting to the user's Slack — all of these are Auth Code flow.

**On-Behalf-Of Flow**

OBO is the flow that confuses people the most, because at first glance it looks like the system should "just forward the user's token." It does not, and the reason it does not is the heart of the entire flow.

Picture this architecture: a user logs into a web app (Phase 1 — that's just Auth Code flow). The app calls API A with the user's access token. API A now needs to call API B downstream — say, Microsoft Graph — *as that same user*, so that Graph applies the user's own permissions, not the API's. Here's the catch: the token the app sent to API A has an `aud` (audience) claim of API A. If API A simply forwards that token to API B, API B will look at the audience, see "not for me", and reject it. As it should — that's the audience check working correctly.

OBO solves this with a server-side token exchange. API A takes the user's inbound token, presents it to the authorization server along with its own `client_id` and `client_secret`, and asks for a *new* token scoped for API B but still carrying the same user identity. API B accepts that token because the audience now matches, and applies the user's permissions normally.

<div class="oauth-diagram">
  <p class="diagram-title">Sequence — On-behalf-of flow (both phases)</p>
  <svg width="100%" viewBox="0 0 680 510" role="img" style="display:block;">
    <title>OBO full flow showing auth code phase then OBO phase</title>
    <desc>Phase 1 is auth code flow where the user logs in and API A gets a user token. Phase 2 is OBO where API A exchanges that token to call API B as the user.</desc>
    <defs><marker id="arr-obo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <rect x="10" y="66" width="660" height="188" rx="8" fill="rgba(91,156,246,0.07)" stroke="rgba(91,156,246,0.15)" stroke-width="0.5"/>
    <rect x="10" y="266" width="660" height="222" rx="8" fill="rgba(240,168,67,0.07)" stroke="rgba(240,168,67,0.15)" stroke-width="0.5"/>
    <text x="24" y="84" fill="#5b9cf6" font-size="10" font-family="DM Mono,monospace" letter-spacing="0.08em">PHASE 1 — AUTH CODE FLOW (user logs in)</text>
    <text x="24" y="282" fill="#f0a843" font-size="10" font-family="DM Mono,monospace" letter-spacing="0.08em">PHASE 2 — ON-BEHALF-OF FLOW (API A calls API B)</text>
    <rect x="14"  y="18" width="96"  height="36" rx="7" fill="#1c1f25" stroke="rgba(255,255,255,0.18)" stroke-width="0.5"/>
    <text x="62"  y="36" text-anchor="middle" dominant-baseline="central" fill="#9ca3af" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">User / browser</text>
    <rect x="154" y="18" width="96"  height="36" rx="7" fill="#1c1f25" stroke="rgba(91,156,246,0.5)" stroke-width="0.5"/>
    <text x="202" y="36" text-anchor="middle" dominant-baseline="central" fill="#5b9cf6" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">Client app</text>
    <rect x="294" y="18" width="96"  height="36" rx="7" fill="#1c1f25" stroke="rgba(62,207,142,0.5)" stroke-width="0.5"/>
    <text x="342" y="36" text-anchor="middle" dominant-baseline="central" fill="#3ecf8e" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">Auth server</text>
    <rect x="434" y="18" width="80"  height="36" rx="7" fill="#1c1f25" stroke="rgba(240,168,67,0.5)" stroke-width="0.5"/>
    <text x="474" y="36" text-anchor="middle" dominant-baseline="central" fill="#f0a843" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">API A</text>
    <rect x="556" y="18" width="110" height="36" rx="7" fill="#1c1f25" stroke="rgba(232,106,170,0.5)" stroke-width="0.5"/>
    <text x="611" y="36" text-anchor="middle" dominant-baseline="central" fill="#e86aaa" font-size="11" font-family="DM Sans,sans-serif" font-weight="500">API B</text>
    <line x1="62"  y1="54" x2="62"  y2="500" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="202" y1="54" x2="202" y2="500" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="342" y1="54" x2="342" y2="500" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="474" y1="54" x2="474" y2="500" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="611" y1="54" x2="611" y2="500" stroke="rgba(255,255,255,0.07)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="62" y1="102" x2="194" y2="102" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="128" y="96" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">1. User clicks login</text>
    <line x1="202" y1="122" x2="334" y2="122" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="272" y="116" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">2. Redirect to auth server</text>
    <line x1="62" y1="142" x2="334" y2="142" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="196" y="136" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">3. Authenticate + consent</text>
    <line x1="342" y1="162" x2="75" y2="162" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="204" y="156" text-anchor="middle" fill="#3ecf8e" font-size="10" font-family="DM Mono,monospace">4. Auth code (redirect)</text>
    <line x1="202" y1="182" x2="334" y2="182" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="268" y="176" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">5. Exchange code + secret</text>
    <line x1="342" y1="202" x2="215" y2="202" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="278" y="196" text-anchor="middle" fill="#3ecf8e" font-size="10" font-family="DM Mono,monospace">6. User access token (aud=API A)</text>
    <line x1="202" y1="236" x2="466" y2="236" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="334" y="230" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">7. Request + user token → API A</text>
    <line x1="474" y1="304" x2="354" y2="304" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="414" y="298" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">8. OBO: token + secret + scope(B)</text>
    <line x1="342" y1="330" x2="462" y2="330" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="402" y="324" text-anchor="middle" fill="#3ecf8e" font-size="10" font-family="DM Mono,monospace">9. New token (same user, aud=API B)</text>
    <line x1="474" y1="362" x2="603" y2="362" stroke="rgba(255,255,255,0.3)" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="538" y="356" text-anchor="middle" fill="#7a7870" font-size="10" font-family="DM Mono,monospace">10. Call API B + new token</text>
    <line x1="611" y1="390" x2="487" y2="390" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="548" y="384" text-anchor="middle" fill="#3ecf8e" font-size="10" font-family="DM Mono,monospace">11. Response</text>
    <line x1="474" y1="420" x2="215" y2="420" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-obo)"/>
    <text x="344" y="414" text-anchor="middle" fill="#3ecf8e" font-size="10" font-family="DM Mono,monospace">12. Final response to client app</text>
    <rect x="248" y="444" width="276" height="40" rx="6" fill="rgba(240,168,67,0.1)" stroke="rgba(240,168,67,0.3)" stroke-width="0.5"/>
    <text x="386" y="460" text-anchor="middle" fill="#f0a843" font-size="10" font-family="DM Mono,monospace">Token at step 9 ≠ token at step 6</text>
    <text x="386" y="476" text-anchor="middle" fill="#f0a843" font-size="10" font-family="DM Mono,monospace">Re-issued for API B's audience</text>
  </svg>
</div>

<div class="oauth-insight"><strong>Critical detail:</strong> The token at step 9 is <em>not</em> the same token from step 6. The original token's <code>aud</code> is API A — API B would correctly reject it. The OBO exchange re-issues a brand-new token scoped for API B, while carrying through the same user identity claims.</div>

A few properties of OBO that are worth internalizing:

* **It extends Auth Code, it does not replace it.** Phase 1 is always Auth Code — somebody had to log in for a user token to exist in the first place. Phase 2 is the token exchange. People sometimes describe OBO as a stand-alone flow, but mechanically it always sits on top of an earlier user login.

* **It is primarily a Microsoft / Azure AD pattern.** The IETF generalization is RFC 8693 token exchange (`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer`), which is a superset of OBO. Other identity providers (Auth0, Okta, Keycloak) increasingly support token exchange too, but the OBO name and ergonomics are Microsoft-shaped.

* **The middle-tier API is a confidential client — no PKCE escape hatch.** Because the OBO exchange is server-side, the middle-tier API must authenticate to the auth server with its own `client_id` plus a `client_secret` or certificate. There is no public-client variant of OBO.

* **Don't forward tokens; exchange them.** A surprising number of bugs come from teams who try to "save a round trip" by passing the inbound user token straight through to a downstream API. It will not work, and the audience check is what protects every API from being used as a confused-deputy stepping stone.

**Use cases:** Multi-tier API architectures where downstream services need to enforce user-level authorization. A REST API calling Microsoft Graph for the logged-in user, a BFF calling internal microservices, an AI agent backend that calls user-scoped data APIs.

**Client Credentials Flow**

Client credentials is the simplest of the three flows because it strips away everything user-related. No browser, no redirect, no consent dialog, no refresh token. The service authenticates directly to the authorization server using its own credentials, receives an access token, and uses that token to call APIs.

<div class="oauth-diagram">
  <p class="diagram-title">Sequence — Client credentials flow</p>
  <svg width="100%" viewBox="0 0 680 280" role="img" style="display:block;">
    <title>Client credentials flow sequence diagram</title>
    <desc>Service authenticates directly to auth server with its own credentials, receives a token, and calls the API — no user in the loop</desc>
    <defs><marker id="arr-cc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <rect x="30"  y="16" width="160" height="38" rx="7" fill="#1c1f25" stroke="rgba(91,156,246,0.5)" stroke-width="0.5"/>
    <text x="110" y="35" text-anchor="middle" dominant-baseline="central" fill="#5b9cf6" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">Service / Daemon</text>
    <rect x="270" y="16" width="140" height="38" rx="7" fill="#1c1f25" stroke="rgba(62,207,142,0.5)" stroke-width="0.5"/>
    <text x="340" y="35" text-anchor="middle" dominant-baseline="central" fill="#3ecf8e" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">Auth server</text>
    <rect x="490" y="16" width="160" height="38" rx="7" fill="#1c1f25" stroke="rgba(240,168,67,0.5)" stroke-width="0.5"/>
    <text x="570" y="35" text-anchor="middle" dominant-baseline="central" fill="#f0a843" font-size="12" font-family="DM Sans,sans-serif" font-weight="500">Resource API</text>
    <rect x="30" y="76" width="160" height="26" rx="5" fill="rgba(232,106,170,0.08)" stroke="rgba(232,106,170,0.25)" stroke-width="0.5"/>
    <text x="110" y="89" text-anchor="middle" dominant-baseline="central" fill="#e86aaa" font-size="10" font-family="DM Mono,monospace">No user interaction needed</text>
    <line x1="110" y1="54" x2="110" y2="272" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="340" y1="54" x2="340" y2="272" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="570" y1="54" x2="570" y2="272" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="4 4"/>
    <line x1="110" y1="130" x2="332" y2="130" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-cc)"/>
    <text x="221" y="124" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">1. client_id + secret + scope</text>
    <line x1="340" y1="160" x2="123" y2="160" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-cc)"/>
    <text x="226" y="154" text-anchor="middle" fill="#3ecf8e" font-size="11" font-family="DM Mono,monospace">2. Access token (app permissions)</text>
    <line x1="110" y1="200" x2="562" y2="200" stroke="rgba(255,255,255,0.35)" stroke-width="1" marker-end="url(#arr-cc)"/>
    <text x="336" y="194" text-anchor="middle" fill="#7a7870" font-size="11" font-family="DM Mono,monospace">3. API call with access token</text>
    <line x1="570" y1="230" x2="123" y2="230" stroke="#3ecf8e" stroke-width="1" marker-end="url(#arr-cc)"/>
    <text x="346" y="224" text-anchor="middle" fill="#3ecf8e" font-size="11" font-family="DM Mono,monospace">4. Response</text>
  </svg>
</div>

<div class="oauth-insight"><strong>Key insight:</strong> The token carries <em>application permissions</em> (roles), not delegated user scopes. These must be explicitly granted by an admin — there is no user consent dialog. The service can only do what it has been administratively authorized to do.</div>

The simplicity is what makes Client Credentials both powerful and dangerous. Because there is no user, there is no user-level access control on the API call. The service can do anything its application permissions allow, against any data the API exposes — typically across the entire tenant. A misconfigured nightly batch job with the wrong Graph scope can read every email in an organization. This is why application permissions almost always require explicit admin consent: the user consent dialog that exists in Auth Code flow has no equivalent here, so an administrator must approve the trust relationship up front.

Some practical notes:

* **Refresh tokens aren't needed.** The service has its own credentials, so it can simply request a new access token whenever the current one expires. The whole concept of a refresh token exists to avoid re-prompting a user — there's no user to re-prompt here.

* **Credential types matter in production.** A `client_secret` works, but a string in an environment variable is a liability — it leaks into logs, dumps, git history, and second-shift on-call pages. X.509 certificates are preferred: the private key never leaves the service, you sign a JWT locally, and you send that JWT as a *client assertion* instead of a shared secret. Federated identity (Azure Managed Identity, GitHub Actions OIDC, AWS IAM Roles for Service Accounts) is the next step up — no stored credential at all; the hosting platform vouches for the service.

* **Application permissions, not delegated scopes.** Tokens from this flow do not carry a user's identity. APIs that expect a user context — anything that reads "my mailbox" or "my calendar" — usually won't accept these tokens at all, or will require completely different endpoints for application-level access.

**Use cases:** Nightly batch jobs, CI/CD pipelines, data ingestion workers, microservice-to-microservice calls inside a trust boundary, AI agents running unattended, webhook backends, infrastructure automation.

**Side-by-side Comparison**

Lining the three flows up against the same set of dimensions makes the trade-offs explicit.

| Dimension | Auth Code | On-Behalf-Of | Client Credentials |
|-----------|-----------|--------------|--------------------|
| Who initiates? | Human user | Middle-tier API | Service / daemon |
| User present? | Yes | Identity only | No |
| Token type | Delegated | Delegated (re-issued) | Application |
| Browser redirect? | Yes | No | No |
| Requires client secret? | Yes (or PKCE) | Yes — always | Yes — always |
| Refresh tokens? | Yes | Yes | Not needed |
| Token audience | Resource API | Downstream API (re-scoped) | Resource API |
| Typical scenario | User logs into web app | API calls another API as user | Nightly batch job |

The clearest separator is the **token type** row. Delegated tokens carry a user's identity and are bounded by what that user can do; application tokens carry only the service's identity and are bounded by what an admin has granted to the service principal. OBO is the only flow that re-issues a delegated token, swapping the audience while preserving the user identity.

**Credential Requirements**

Every OAuth client — across all three flows — always has a `client_id`. It identifies *which app* is talking to the auth server. The `client_id` itself is not secret; it's a public identifier that often appears in URLs. What proves the app's identity is the `client_secret`, certificate, or PKCE verifier.

| Flow | client_id | client_secret | PKCE | Certificate |
|------|-----------|---------------|------|-------------|
| Auth Code | Always required | Confidential clients | Public clients (SPA/mobile) | Replaces secret |
| On-Behalf-Of | Always required | Always required | Not applicable | Replaces secret |
| Client Credentials | Always required | Always required | Not applicable | Preferred in production |

Some implications worth pulling out:

* **Auth Code with PKCE is the only public-client flow.** PKCE replaces the static secret with a per-request cryptographic binding. It is the only OAuth flow where a `client_secret` can legitimately be omitted, and it exists specifically because SPAs and mobile apps cannot safely store a secret.

* **OBO and Client Credentials are always confidential.** Both happen entirely server-side and both require the client to prove its identity strongly. There is no PKCE-style accommodation for either.

* **Certificates beat secrets in production.** With a secret, the proof of identity is a shared string that has to be transmitted on every token request. With a certificate, the private key never leaves the service — the service signs a short-lived JWT locally and sends that as a *client assertion*. The auth server validates the signature using the corresponding public key. Compromise of the auth server's logs no longer exposes a long-lived shared secret.

* **Federated identity is the modern answer for cloud services.** Managed Identity (Azure), IAM Roles for Service Accounts (AWS/GCP), and Workload Identity Federation eliminate the stored credential entirely. The service proves its identity via a platform-issued token that the auth server already trusts. Nothing to rotate, nothing to leak.

**Decision Guide**

In practice the right flow is almost always determined by who initiates the call.

* **"A human user is logging in and the app calls APIs on their behalf."** → **Authorization Code Flow.** Use PKCE if the client is a SPA or mobile app without a secure back-end. Use a `client_secret` (or, better, a certificate) if you have a server-side component.

* **"My API receives a user token, but needs to call another API as that same user."** → **On-Behalf-Of Flow.** Phase 1 is still Auth Code (the user has to have logged in somewhere). Phase 2 is OBO — your API exchanges the inbound user token for a new one scoped to the downstream API. Do not forward the original token.

* **"A background job, scheduled task, or microservice needs to call an API — no user is involved."** → **Client Credentials Flow.** The service authenticates as itself. Make sure an administrator has granted the required application permissions (roles) to the service principal in advance, since there is no interactive consent step.

When a flow is ambiguous — for instance, a service that *sometimes* runs unattended and *sometimes* acts on behalf of a user — split it. Use Auth Code (and OBO if needed) for the user-driven path, and Client Credentials for the background path. Trying to make one flow cover both leads to over-broad application permissions, which is exactly the kind of attack surface OAuth is designed to minimize.

**Summary**

OAuth 2.0's three flows are not three implementations of the same idea; they are three answers to three different identity questions.

* **Authorization Code** says: there's a user, they're here, they've consented — give the app a token scoped to what they can do.
* **On-Behalf-Of** says: there's a user, they're not on this hop, but their identity has to travel — exchange the user's token for a new one with the right audience.
* **Client Credentials** says: there's no user — the service is the principal, here are its credentials, give it a token scoped to what an admin has granted.

The mechanics — codes vs. assertions, browser redirects vs. server posts, refresh tokens vs. re-fetches — all fall out of those three answers. Once you have the principal/audience model in your head, every OAuth conversation in every identity provider's documentation starts reading like the same conversation, and decisions about which flow to use stop feeling like guessing.

In modern systems, the right defaults are: **Auth Code with PKCE** for user-facing apps, **OBO** for API-to-API hops that need to carry user identity, and **Client Credentials with certificates or federated identity** for everything unattended. With those three patterns wired correctly, the rest of an identity architecture has somewhere stable to stand on.
