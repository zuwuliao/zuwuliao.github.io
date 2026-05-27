---
layout: post
title: OAuth 2.0 Authentication Flows Explained
categories: Cloud
---

<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

<style>
.oauth-guide {
  --bg2: #14161a;
  --bg3: #1c1f25;
  --text: #e8e6e0;
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
  --mono: 'DM Mono', ui-monospace, monospace;
  --serif: 'Fraunces', serif;
  --sans: 'DM Sans', sans-serif;

  background: #0e0f11;
  color: var(--text);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.7;
  border-radius: 12px;
  padding: 8px 36px;
  margin-top: 32px;
  margin-bottom: 32px;
  margin-left: max(-220px, calc(370px - 50vw));
  margin-right: max(-220px, calc(370px - 50vw));
  border: 1px solid var(--border);
}
.oauth-guide section {
  padding: 40px 0;
  border-bottom: 1px solid var(--border);
}
.oauth-guide section:last-child { border-bottom: none; }

.oauth-guide .section-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}
.oauth-guide .section-num {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: .08em;
}
.oauth-guide h2 {
  font-family: var(--serif);
  font-size: 26px;
  font-weight: 300;
  color: #f0ede6;
  margin: 0;
  border: none;
  padding: 0;
}
.oauth-guide h3 {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 24px 0 12px 0;
  border: none;
  padding: 0;
}
.oauth-guide p { color: #b8b5ae; margin-bottom: 12px; }
.oauth-guide p:last-child { margin-bottom: 0; }
.oauth-guide em { font-style: italic; color: var(--accent-amber); }
.oauth-guide strong { color: var(--text); font-weight: 500; }

.oauth-guide .eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .14em;
  color: var(--accent-blue);
  text-transform: uppercase;
  margin-bottom: 16px;
}
.oauth-guide .lede {
  font-family: var(--serif);
  font-size: clamp(28px, 3.5vw, 38px);
  font-weight: 300;
  line-height: 1.2;
  color: #f0ede6;
  margin-bottom: 20px;
  border: none;
  padding: 0;
}
.oauth-guide .subtitle {
  color: #b8b5ae;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 14px;
}

.oauth-guide .flow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}
.oauth-guide .flow-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.oauth-guide .flow-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}
.oauth-guide .flow-card.blue::before { background: var(--accent-blue); }
.oauth-guide .flow-card.amber::before { background: var(--accent-amber); }
.oauth-guide .flow-card.teal::before { background: var(--accent-teal); }
.oauth-guide .flow-tag {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 99px;
  display: inline-block;
  margin-bottom: 14px;
}
.oauth-guide .flow-tag.blue { background: var(--accent-blue-dim); color: var(--accent-blue); }
.oauth-guide .flow-tag.amber { background: var(--accent-amber-dim); color: var(--accent-amber); }
.oauth-guide .flow-tag.teal { background: var(--accent-teal-dim); color: var(--accent-teal); }
.oauth-guide .flow-card h4 {
  font-family: var(--serif);
  font-size: 20px;
  font-weight: 300;
  color: #f0ede6;
  margin: 0 0 10px 0;
  border: none;
  padding: 0;
}
.oauth-guide .flow-card p {
  font-size: 13px;
  line-height: 1.65;
  color: var(--muted);
}

.oauth-guide .diagram-wrap {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 24px 20px;
  margin-bottom: 16px;
  overflow-x: auto;
}
.oauth-guide .diagram-title {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 20px;
}

.oauth-guide .insight {
  background: var(--bg3);
  border-left: 2px solid var(--accent-amber);
  border-radius: 0 8px 8px 0;
  padding: 16px 20px;
  margin: 20px 0;
}
.oauth-guide .insight p { font-size: 13px; color: #b8b5ae; margin: 0; }
.oauth-guide .insight strong { color: var(--accent-amber); }

.oauth-guide .note-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
}
.oauth-guide .note-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 12px;
  align-items: start;
  font-size: 13px;
  color: #b8b5ae;
  line-height: 1.65;
  list-style: none;
}
.oauth-guide .note-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
  display: inline-block;
}

.oauth-guide code {
  font-family: var(--mono);
  font-size: 12px;
  background: rgba(255,255,255,0.06);
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--accent-blue);
}

.oauth-guide .compare-wrap {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.oauth-guide .compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin: 0;
}
.oauth-guide .compare-table th {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border2);
  font-weight: 400;
  background: transparent;
}
.oauth-guide .compare-table th:not(:first-child) { text-align: center; }
.oauth-guide .compare-table td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  background: transparent;
}
.oauth-guide .compare-table td:not(:first-child) { text-align: center; }
.oauth-guide .compare-table tr:last-child td { border-bottom: none; }
.oauth-guide .compare-table td:first-child { color: var(--muted); font-size: 12px; }
.oauth-guide .compare-table td.col-blue { color: var(--accent-blue); }
.oauth-guide .compare-table td.col-amber { color: var(--accent-amber); }
.oauth-guide .compare-table td.col-teal { color: var(--accent-teal); }
.oauth-guide .compare-table th.col-blue { color: var(--accent-blue); font-weight: 500; }
.oauth-guide .compare-table th.col-amber { color: var(--accent-amber); font-weight: 500; }
.oauth-guide .compare-table th.col-teal { color: var(--accent-teal); font-weight: 500; }
.oauth-guide .check { font-size: 15px; }
.oauth-guide .col-blue .check, .oauth-guide td.col-blue .check { color: var(--accent-blue); }
.oauth-guide .col-amber .check, .oauth-guide td.col-amber .check { color: var(--accent-amber); }
.oauth-guide .col-teal .check, .oauth-guide td.col-teal .check { color: var(--accent-teal); }
.oauth-guide .cross { opacity: .4; font-size: 15px; }

.oauth-guide .cred-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.oauth-guide .cred-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}
.oauth-guide .cred-card h4 {
  font-family: var(--serif);
  font-size: 17px;
  font-weight: 300;
  color: #f0ede6;
  margin: 0 0 14px 0;
  border: none;
  padding: 0;
}
.oauth-guide .cred-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
}
.oauth-guide .cred-row:last-child { border-bottom: none; }
.oauth-guide .cred-label { color: var(--muted); font-family: var(--mono); font-size: 11px; white-space: nowrap; }
.oauth-guide .cred-val { color: var(--text); text-align: right; }
.oauth-guide .cred-val.yes { color: var(--accent-teal); }
.oauth-guide .cred-val.opt { color: var(--accent-amber); }
.oauth-guide .cred-val.no { color: var(--muted); opacity: .5; }

.oauth-guide .decision-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 8px;
}
.oauth-guide .decision-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}
.oauth-guide .decision-q {
  color: #b8b5ae;
  margin-bottom: 12px;
  font-family: var(--serif);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.5;
  font-style: italic;
}
.oauth-guide .decision-a {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 99px;
  display: inline-block;
  margin-bottom: 10px;
}
.oauth-guide .decision-a.blue { background: var(--accent-blue-dim); color: var(--accent-blue); }
.oauth-guide .decision-a.amber { background: var(--accent-amber-dim); color: var(--accent-amber); }
.oauth-guide .decision-a.teal { background: var(--accent-teal-dim); color: var(--accent-teal); }
.oauth-guide .decision-note { font-size: 12px; color: var(--muted); line-height: 1.6; margin: 0; }

.oauth-guide .summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 8px;
}

@media (max-width: 740px) {
  .oauth-guide {
    padding: 8px 16px;
    margin-left: 0;
    margin-right: 0;
  }
  .oauth-guide .flow-grid,
  .oauth-guide .cred-grid,
  .oauth-guide .decision-grid,
  .oauth-guide .summary-grid { grid-template-columns: 1fr; }
  .oauth-guide .compare-table { font-size: 12px; }
  .oauth-guide .compare-table th,
  .oauth-guide .compare-table td { padding: 8px 10px; }
}
</style>

<div class="oauth-guide" markdown="0">

<section id="intro">
  <p class="eyebrow">OAuth 2.0 — Practical Guide</p>
  <h2 class="lede">Authentication <em>flows</em> explained</h2>
  <p class="subtitle">Almost every modern application — web apps, mobile clients, internal APIs, batch jobs, AI agents — has to answer the same question before it can do anything useful: <em>who is making this call, and are they allowed to?</em> OAuth 2.0 is the protocol most of the industry has settled on to answer it, and once you understand its three main flows, a huge amount of identity and integration work becomes obvious instead of confusing.</p>
  <p class="subtitle">The three flows look superficially similar — they all involve a client, an authorization server, and a resource API, and they all end with the client holding an access token. But they exist as separate flows because they answer a deeper question differently: <strong>who is the principal authenticating?</strong> A human user clicking "Sign in with Microsoft" is fundamentally different from a nightly batch job, which is in turn different from an API forwarding a user's identity to a downstream API.</p>
  <p class="subtitle">This guide is a practical walkthrough of all three flows — Authorization Code, On-Behalf-Of, and Client Credentials — covering how each works mechanically, what credentials are required, when to pick which, and the security insights that explain <em>why</em> each flow is shaped the way it is.</p>
</section>

<section id="overview">
  <div class="section-header">
    <span class="section-num">01</span>
    <h2>The core question</h2>
  </div>
  <p>OAuth 2.0's three main flows exist because they answer the same question differently: <strong>who is the principal authenticating?</strong></p>
  <div class="flow-grid">
    <div class="flow-card blue">
      <span class="flow-tag blue">Auth code</span>
      <h4>A human user is present</h4>
      <p>The app acts on behalf of a logged-in person who consents interactively via a browser redirect.</p>
    </div>
    <div class="flow-card amber">
      <span class="flow-tag amber">On-behalf-of</span>
      <h4>User identity must travel deeper</h4>
      <p>A middle-tier API needs to call a downstream API while preserving the original user's identity.</p>
    </div>
    <div class="flow-card teal">
      <span class="flow-tag teal">Client credentials</span>
      <h4>No user — service is the principal</h4>
      <p>A daemon or service authenticates as itself. No browser, no redirect, no user context.</p>
    </div>
  </div>
</section>

<section id="authcode">
  <div class="section-header">
    <span class="section-num">02</span>
    <h2>Authorization code flow</h2>
  </div>
  <p>The most common OAuth flow. A user is redirected to the auth server to authenticate and grant consent. The app receives an authorization code via the browser, then exchanges it server-to-server for tokens — keeping secrets off the browser entirely.</p>
  <div class="diagram-wrap">
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
  <div class="insight">
    <p><strong>Key security insight:</strong> The authorization code travels through the browser (untrusted channel), but the token exchange happens server-to-server with the client secret. Even if the code is intercepted, it's useless without the secret.</p>
  </div>
  <h3>Key properties</h3>
  <ul class="note-list">
    <li class="note-item"><span class="note-dot" style="background: #5b9cf6"></span><span>Token is <strong>delegated</strong> — scoped to what the logged-in user is allowed to do, not what the app can do globally.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #5b9cf6"></span><span><strong>PKCE variant</strong>: For SPAs and mobile apps (public clients) that cannot safely store a <code>client_secret</code>, PKCE replaces it with a cryptographic challenge-verifier pair.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #5b9cf6"></span><span>Produces <strong>refresh tokens</strong> for silent renewal without re-prompting the user.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #5b9cf6"></span><span><strong>Use cases:</strong> Any user-facing app — web, mobile, SPA. "Login with Google/Microsoft", calling Microsoft Graph as the signed-in user.</span></li>
  </ul>
</section>

<section id="obo">
  <div class="section-header">
    <span class="section-num">03</span>
    <h2>On-behalf-of flow</h2>
  </div>
  <p>OBO extends auth code flow — it doesn't replace it. Phase 1 is always auth code flow (the user logs in and API A gets a user token). Phase 2 is the OBO exchange, which happens entirely server-side when API A needs to call a downstream API B as the same user.</p>
  <div class="diagram-wrap">
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
  <div class="insight">
    <p><strong>Critical detail:</strong> The token at step 09 is <em>not</em> the same token from step 06. The original token's <code>aud</code> is API A — API B would correctly reject it. The OBO exchange re-issues a brand-new token scoped for API B, while carrying through the same user identity claims.</p>
  </div>
  <h3>Key properties</h3>
  <ul class="note-list">
    <li class="note-item"><span class="note-dot" style="background: #f0a843"></span><span>Primarily a <strong>Microsoft / Azure AD pattern</strong>. The generic IETF equivalent is RFC 8693 token exchange.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #f0a843"></span><span>Middle-tier API must authenticate itself with its own <code>client_id</code> + <code>client_secret</code> (or certificate) — there is no PKCE escape hatch.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #f0a843"></span><span>Simply <strong>forwarding the original token</strong> downstream is an anti-pattern and will fail — the audience mismatch is intentional.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #f0a843"></span><span><strong>Use cases:</strong> Multi-tier APIs where downstream services need to apply user-level authorization. e.g. a REST API calling Microsoft Graph on behalf of the signed-in user.</span></li>
  </ul>
</section>

<section id="cc">
  <div class="section-header">
    <span class="section-num">04</span>
    <h2>Client credentials flow</h2>
  </div>
  <p>The simplest flow. No user, no browser, no redirect. The service authenticates directly as itself using its own credentials and receives an access token carrying application permissions.</p>
  <div class="diagram-wrap">
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
  <div class="insight">
    <p><strong>Key insight:</strong> The token carries <em>application permissions</em> (roles), not delegated user scopes. These must be explicitly granted by an admin — there is no user consent dialog. The service can only do what it has been administratively authorized to do.</p>
  </div>
  <h3>Key properties</h3>
  <ul class="note-list">
    <li class="note-item"><span class="note-dot" style="background: #3ecf8e"></span><span>Access tokens are typically <strong>short-lived but easily re-fetched</strong> — refresh tokens are unnecessary since the service can get a new token anytime with its credentials.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #3ecf8e"></span><span>Credential types: <strong>client secret</strong> (simple, must be rotated), <strong>X.509 certificate</strong> (preferred — private key never leaves the service), or <strong>federated identity</strong>.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #3ecf8e"></span><span><strong>Use cases:</strong> Scheduled batch jobs, CI/CD pipelines, background workers, microservice-to-microservice calls, daemons with no interactive session.</span></li>
  </ul>
</section>

<section id="comparison">
  <div class="section-header">
    <span class="section-num">05</span>
    <h2>Side-by-side comparison</h2>
  </div>
  <div class="compare-wrap">
    <table class="compare-table">
      <thead>
        <tr>
          <th>Dimension</th>
          <th class="col-blue">Auth code</th>
          <th class="col-amber">On-behalf-of</th>
          <th class="col-teal">Client credentials</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Who initiates?</td><td class="col-blue">Human user</td><td class="col-amber">Middle-tier API</td><td class="col-teal">Service / daemon</td></tr>
        <tr><td>User present?</td><td class="col-blue"><span class="check">✓</span> Yes</td><td class="col-amber">Identity only</td><td class="col-teal"><span class="cross">✗</span> No</td></tr>
        <tr><td>Token type</td><td class="col-blue">Delegated</td><td class="col-amber">Delegated (re-issued)</td><td class="col-teal">Application</td></tr>
        <tr><td>Browser redirect?</td><td class="col-blue"><span class="check">✓</span> Yes</td><td class="col-amber"><span class="cross">✗</span> No</td><td class="col-teal"><span class="cross">✗</span> No</td></tr>
        <tr><td>Requires client secret?</td><td class="col-blue">Yes (or PKCE)</td><td class="col-amber">Yes — always</td><td class="col-teal">Yes — always</td></tr>
        <tr><td>Refresh tokens?</td><td class="col-blue"><span class="check">✓</span> Yes</td><td class="col-amber"><span class="check">✓</span> Yes</td><td class="col-teal">Not needed</td></tr>
        <tr><td>Token audience</td><td class="col-blue">Resource API</td><td class="col-amber">Downstream API (re-scoped)</td><td class="col-teal">Resource API</td></tr>
        <tr><td>Typical scenario</td><td class="col-blue">User logs into web app</td><td class="col-amber">API calls another API as user</td><td class="col-teal">Nightly batch job</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section id="credentials">
  <div class="section-header">
    <span class="section-num">06</span>
    <h2>Credential requirements</h2>
  </div>
  <p>All three flows always require a <code>client_id</code> — it identifies <em>which app</em> is talking to the auth server. The <code>client_secret</code> (or equivalent) is what <em>proves</em> the app's identity.</p>
  <div class="cred-grid">
    <div class="cred-card">
      <h4>Auth code flow</h4>
      <div class="cred-row"><span class="cred-label">client_id</span><span class="cred-val yes">Always required</span></div>
      <div class="cred-row"><span class="cred-label">client_secret</span><span class="cred-val opt">Confidential clients</span></div>
      <div class="cred-row"><span class="cred-label">PKCE</span><span class="cred-val opt">Public clients (SPA/mobile)</span></div>
      <div class="cred-row"><span class="cred-label">Certificate</span><span class="cred-val opt">Replaces secret</span></div>
    </div>
    <div class="cred-card">
      <h4>On-behalf-of flow</h4>
      <div class="cred-row"><span class="cred-label">client_id</span><span class="cred-val yes">Always required</span></div>
      <div class="cred-row"><span class="cred-label">client_secret</span><span class="cred-val yes">Always required</span></div>
      <div class="cred-row"><span class="cred-label">PKCE</span><span class="cred-val no">Not applicable</span></div>
      <div class="cred-row"><span class="cred-label">Certificate</span><span class="cred-val opt">Replaces secret</span></div>
    </div>
    <div class="cred-card">
      <h4>Client credentials</h4>
      <div class="cred-row"><span class="cred-label">client_id</span><span class="cred-val yes">Always required</span></div>
      <div class="cred-row"><span class="cred-label">client_secret</span><span class="cred-val yes">Always required</span></div>
      <div class="cred-row"><span class="cred-label">PKCE</span><span class="cred-val no">Not applicable</span></div>
      <div class="cred-row"><span class="cred-label">Certificate</span><span class="cred-val opt">Preferred in production</span></div>
    </div>
  </div>
  <div class="insight" style="margin-top: 20px;">
    <p><strong>Public vs. confidential clients:</strong> Auth code with PKCE is the only flow where a <code>client_secret</code> can be omitted — for SPAs and mobile apps that cannot safely store secrets. OBO and client credentials are always confidential client flows with no public-client variant.</p>
  </div>
  <ul class="note-list" style="margin-top: 16px;">
    <li class="note-item"><span class="note-dot" style="background: #7a7870"></span><span><code>client_id</code> is never secret — it's a public identifier. Only the secret or certificate proves identity.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #7a7870"></span><span>X.509 certificates are preferred over secrets in production: the private key never leaves the service — you sign a JWT locally and send that as a <em>client assertion</em> instead of transmitting a shared secret.</span></li>
    <li class="note-item"><span class="note-dot" style="background: #7a7870"></span><span>Federated identity (e.g. workload identity federation) is an emerging alternative: no stored credential at all — the service proves identity via a token from its hosting platform (Azure Managed Identity, GitHub Actions OIDC, etc.).</span></li>
  </ul>
</section>

<section id="decision">
  <div class="section-header">
    <span class="section-num">07</span>
    <h2>Decision guide</h2>
  </div>
  <p>Pick the flow that matches your actual scenario. The relationship between flows and user context is the clearest separator.</p>
  <div class="decision-grid">
    <div class="decision-card">
      <p class="decision-q">"A human user is logging in and the app calls APIs on their behalf."</p>
      <span class="decision-a blue">Auth code flow</span>
      <p class="decision-note">Use PKCE if the client is a SPA or mobile app without a secure back-end. Use a client secret if you have a server-side component.</p>
    </div>
    <div class="decision-card">
      <p class="decision-q">"My API receives a user token, but needs to call another API as that same user."</p>
      <span class="decision-a amber">On-behalf-of flow</span>
      <p class="decision-note">Phase 1 is still auth code (user logged in). Phase 2 is OBO — your API exchanges the inbound token for a new one scoped to the downstream API.</p>
    </div>
    <div class="decision-card">
      <p class="decision-q">"A background job, scheduled task, or microservice needs to call an API — no user involved."</p>
      <span class="decision-a teal">Client credentials</span>
      <p class="decision-note">The service authenticates as itself. Ensure an admin has granted the required application permissions (roles) to the service principal in advance.</p>
    </div>
  </div>
</section>

<section id="summary">
  <div class="section-header">
    <span class="section-num">08</span>
    <h2>Summary</h2>
  </div>
  <p>OAuth 2.0's three flows are not three implementations of the same idea — they are three answers to three different identity questions. The mechanics (codes vs. assertions, browser redirects vs. server posts, refresh tokens vs. re-fetches) all fall out of those three answers. Once the principal/audience model is in your head, every identity provider's documentation starts reading like the same conversation.</p>
  <div class="summary-grid">
    <div class="flow-card blue">
      <span class="flow-tag blue">Auth code</span>
      <h4>There's a user, they're here</h4>
      <p>They've consented — give the app a token scoped to what they can do. Use PKCE for SPAs and mobile clients.</p>
    </div>
    <div class="flow-card amber">
      <span class="flow-tag amber">On-behalf-of</span>
      <h4>The user isn't on this hop</h4>
      <p>Their identity has to travel — exchange the user's token for a new one with the right audience. Don't forward.</p>
    </div>
    <div class="flow-card teal">
      <span class="flow-tag teal">Client credentials</span>
      <h4>No user — the service is the principal</h4>
      <p>Give the service a token scoped to what an admin has granted. Prefer certificates or federated identity over secrets.</p>
    </div>
  </div>
  <div class="insight" style="margin-top: 24px;">
    <p><strong>Modern defaults:</strong> Auth Code with PKCE for user-facing apps, OBO for API-to-API hops that carry user identity, and Client Credentials with certificates or federated identity for everything unattended. With those three patterns wired correctly, the rest of an identity architecture has somewhere stable to stand on.</p>
  </div>
</section>

</div>
