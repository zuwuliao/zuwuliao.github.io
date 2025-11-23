---
layout: post
title: MCP and DCR
categories: AI
---

I'm recently working on MCP in my recent projects. DCR caused a lot of trouble especially with Claude. Today, we will talk about what is DCR and what problem it brings. 

**Back Ground of OAuth**

In OAuth 2.0 / 2.1, clients (apps that use OAuth to get tokens) must be registered with the authorization server before they can request tokens. Traditionally, this registration was manual and static — someone would fill out a form or call an admin API to register a client with metadata like: client_name, redirect_uris, grant_types, scope, logo_uri, etc. If you are using Entra ID, this is called App Registration. From there, you can add client_id, client_secrect, redirect_url, scope, api permission, etc.

**OAuth Authorization Flow**

![pic 1](/images/DCR-OAuth-flow.jpg "pic 1")

This flow requires a few steps to be performed to acquire an access token:

1. The client directs the user to an authorization UI provided by the authorization server

2. The authorization server displays a consent screen to the user

3. User approves client access and the authorization server redirects the user back to the client with an access code

4. Client exchanges the access code for a set of tokens, which are cached locally

5. Client uses the access token to access the MCP server

To be able to initiate this flow, however, the authorization server first needs some basic information about the client that is kicking off the authorization process:

1. **Client name:** Human readable text to display in the consent screen to help the user decide whether they want to grant access.

2. **Redirect URL:** The destination to send the authorization code back to if the user consents.
In order to prevent a malicious client from tricking a user into granting access they didn’t intend to grant, the authorization server must be able to trust the client information it has.

For example, a malicious client could claim to be Claude Desktop on the consent screen while actually being owned by someone not affiliated with Claude Desktop developers. Seeing the client information on the consent screen, users might grant access thinking they’re authorizing the legitimate Claude Desktop, not realizing that some malicious client now has access to their account.

This approach works well in closed ecosystems (e.g., a company’s internal IdP), but fails to scale in open or federated systems (like Model Context Protocol(MCP) servers or public API platforms). Why is it not scale with MCP? This is because clients and servers don’t have a pre-existing relationship - we can’t assume that we will always know which MCP clients will connect to which MCP servers. This design highlights two challenges that need to be addressed:

  * Operational issues with managing client IDs via Dynamic Client Registration (DCR)

  * Preventing client impersonation

**DCR(Dynamic Client Registration)**

**Dynamic Client Registration (DCR) RFC 7591** was designed to solve that scalability issue.

**DCR’s Purpose**

1. Automate client onboarding

   * Allow clients to register themselves automatically via a standard /register endpoint.

2. Eliminate manual pre-approval

   * The authorization server can create a new client_id (and optional client_secret) dynamically for any app that calls /register.

3. Enable large, open ecosystems

   * Open identity providers (like OpenID Connect, Solid, or MCP servers) can accept new clients on the fly — no admin bottleneck.

In short, DCR lets OAuth servers accept and recognize new clients programmatically instead of requiring prior manual registration.

**Main Problems of DCR in Practice**

While conceptually well-designed, DCR introduces several operational and security headaches, especially in open environments like the Model Context Protocol.

1. **Unbounded Growth of Client Records**

   * Each registration creates a new row in the authorization server’s client table.

   * Since clients can re-register freely, you get “client ID sprawl” — millions of short-lived, near-duplicate entries.

   * There’s no good expiry or lifecycle management built into the DCR spec.

2. **No Natural Expiry or Cleanup**

   * The OAuth spec doesn’t define when (or how) a dynamic registration becomes invalid.

   * Servers must build their own expiry, cleanup, and rotation logic — which becomes messy in distributed setups.

3. **Instance-based Duplication**

   * Each client instance (e.g., each desktop install or cloud deployment) needs its own client_id.

   * That means hundreds of client_ids for the same app, just because each user or machine registered separately.

4. **Open Attack Surface (Public /register Endpoint)**

   * The /register endpoint is typically unauthenticated by design — any app can hit it.

   * This opens the door to abuse, DoS attacks, and spurious registrations.

   * You need extra rate limiting, validation, and sometimes CAPTCHA-like checks.

5. **Extra Client State to Manage**

   * A client must store and reuse its assigned client_id (and possibly client_secret) for subsequent use.

   * If it loses this state or moves machines, it must re-register — creating more duplicates.

6. **Operational Overhead for Authorization Servers**

   * Authorization servers must handle:

     * Persistent storage

     * Schema migration

     * Rate limiting

     * Metadata validation

     * Maintenance of a giant registration dataset

   * This undermines the “simple and stateless” ethos of OAuth.

Additionally, if you are using Entra ID as Idp, there is a bigger trouble you have to deal. That is, as of now, Entra ID doesn't support DCR feature. That means when client is trying to register the app to Entra ID, you must find another middleware to handle it. One of the solution on Azure is API Management. API Management can play a role as Auth Server for clients and then uses on-behalf-of flow to exchange it for a token that can be used with Microsoft Graph. The example of deployment can be found [here](https://github.com/localden/remote-auth-mcp-apim-py)

However, this approach brings a lot of complexity and extra resource to manage. It also introduce some security risk with all the token stored and mapped at API Management. Are there any better solutions to solve this lack of DCR feature issue on Entra ID and avoid all the DCR operational pain points? The answer is 'Yes'. There are two proposed solutions that are waiting for ratifying to become the standards that are tracked as SEP-991 (CIMD) and SEP-1032 (software statements); discussions happen in the auth working group. [ref](https://blog.modelcontextprotocol.io/posts/client_registration/). Note - SEP stands for 'Specification Enhancement Proposals'.

**Solution 1: Client ID Metadata Documents (CIMD)**

CIMD (Client ID Metadata Document) is proposed as a replacement for Dynamic Client Registration (DCR) in most cases.

  * DCR requires clients to register dynamically at the authorization server via /register, which adds operational overhead and database sprawl.

  * CIMD instead uses an HTTPS URL as the client_id, hosting a static oauth.json document with metadata.

  * This removes the need for registration endpoints or persistent client records.

  * So: CIMD replaces DCR for new deployments, but DCR is still retained for backward compatibility.

**CIMD Authorization Flow**

![pic 2](/images/DCR-CIMD-flow.jpg "pic 2")

Use an HTTPS URL as the client_id (e.g., https://app.com/oauth.json). The auth server fetches trusted metadata (name, redirect_uris) at auth time. Benefits: no DB growth, no expiry management, one ID per app, and no write-exposed register endpoint. Cost: host a small metadata file.

**Solution 2: Software Statements for Desktop Applications**

Software Statements are an add-on (an extension) for extra trust, mainly for desktop and localhost clients.

  * These statements are short-lived signed JWTs issued by a trusted backend to prove that a particular app instance is legitimate.

  * They can be combined with either DCR or CIMD.

  * The intent is to mitigate client impersonation attacks, not to handle registration.

Signed software statements for desktop apps is a proposed fix for impersonation. Backend hosts a JWKS, authenticates the user, issues a short-lived signed JWT attesting to the client, and the client presents it during OAuth; the auth server verifies against the JWKS. Works with both DCR and CIMD.

**Summary Table:**

| Purpose                      | Mechanism               | Relationship                                   |
| ---------------------------- | ----------------------- | ---------------------------------------------- |
| Register clients             | **CIMD**                | Replaces DCR for simpler, safer registration   |
| Authenticate legitimate apps | **Software Statements** | Adds on top of CIMD or DCR to strengthen trust |


