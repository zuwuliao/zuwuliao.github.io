---
layout: post
title: Databricks Custom MCP Server with Claude
categories: Data
---

MCP server becomes a common and popular way for Agent to connect to the service and data. This blog introduces how to build custom MCP server and host on Databricks as an app. Then we will talk about how to enable authentication for Claude MCP client. 

In this blog, we will use Neo4j MCP server as an example.

##Deploy mcp-neo4j-cypher as a Databricks App

**Context**

You want to run the mcp-neo4j-cypher MCP server as a Databricks App (the Databricks Apps platform feature), connecting to a Neo4j Aura cloud instance. This will let you expose the Cypher query tools (read/write queries + schema inspection) as an HTTP-based MCP server within your Databricks workspace.

**Key Constraint**

Databricks Apps must bind to 0.0.0.0 on the port from the DATABRICKS_APP_PORT environment variable. The existing server already supports. HTTP transport and configurable host/port via env vars — we just need a thin wrapper to bridge DATABRICKS_APP_PORT into the server's config.

**Steps**

1. Create the Databricks App project folder

    Create a new folder (e.g., databricks-neo4j-mcp/) inside or alongside the repo with these files:

    databricks-app/

    ├── app.py              # Entry point

    ├── app.yaml            # Databricks Apps config

    └── requirements.txt    # Dependencies

2. Create app.py — Entry point

    A thin wrapper that:
    - Reads DATABRICKS_APP_PORT and passes it as the server port
    - Sets transport to http, host to 0.0.0.0
    - Reads Neo4j connection details from environment variables (injected via Databricks secrets)
    - Calls the existing server.main() from mcp_neo4j_cypher
    ```python
        import os
        import asyncio
        from mcp_neo4j_cypher.server import main

        asyncio.run(
            main(
            db_url=os.environ["NEO4J_URI"],
            username=os.environ["NEO4J_USERNAME"],
            password=os.environ["NEO4J_PASSWORD"],
            database=os.environ.get("NEO4J_DATABASE", "neo4j"),
            transport="http",
            host="0.0.0.0",
            port=int(os.environ.get("DATABRICKS_APP_PORT", "8000")),
            path="/api/mcp/",
            namespace=os.environ.get("NEO4J_NAMESPACE", ""),
            )
        )
    ```
3. Create app.yaml — Runtime config

    command: ['python', 'app.py']
    env:
    - name: NEO4J_URI
        valueFrom: neo4j-uri        # Databricks secret resource
    - name: NEO4J_USERNAME
        valueFrom: neo4j-username
    - name: NEO4J_PASSWORD
        valueFrom: neo4j-password
    - name: NEO4J_DATABASE
        value: 'neo4j'

4. Create requirements.txt

    neo4j>=5.26.0

    fastmcp>=2.10.5

    pydantic>=2.10.1

    (FastAPI/uvicorn are pre-installed in Databricks Apps runtime)

5. Set up Databricks Secrets

    Before deploying, create secrets in Databricks:

    databricks secrets create-scope neo4j-mcp
    databricks secrets put-secret neo4j-mcp neo4j-uri      # e.g. neo4j+s://92f1fb01.databases.neo4j.io
    databricks secrets put-secret neo4j-mcp neo4j-username  # e.g. neo4j
    databricks secrets put-secret neo4j-mcp neo4j-password


6. Deploy to Databricks

    **Sync files to workspace**

    databricks sync databricks-neo4j-mcp/
    /Workspace/Users/<your-email>/mcp-neo4j-cypher-app

    ```powershell
    PS C:\Users\kevinl\code\databricks-neo4j-mcp> databricks sync . "/Workspace/Users/kevin.liao@gatesfoundation.org/mcp-neo4j-cypher-app"
    Warn: Failed to read git info: CreateFile C:\.git: The system cannot find the file specified.
    Action: PUT: .claude/settings.local.json, app.py, app.yaml, mcp_neo4j_cypher/__init__.py, mcp_neo4j_cypher/server.py, mcp_neo4j_cypher/utils.py, requirements.txt
    Uploaded mcp_neo4j_cypher
    Uploaded .claude
    Uploaded requirements.txt
    Uploaded app.yaml
    Uploaded mcp_neo4j_cypher/utils.py
    Uploaded mcp_neo4j_cypher/server.py
    Uploaded .claude/settings.local.json
    Uploaded mcp_neo4j_cypher/__init__.py
    Uploaded app.py
    Initial Sync Complete
    ```

    **Create the app (first time)**

    databricks apps create mcp-neo4j-cypher

    ```powershell    
    PS C:\Users\kevinl\code\databricks-neo4j-mcp> databricks apps create mcp-neo4j-cypher                                                                               
    {
        "app_status": {
        "message":"App has status: App has not been deployed yet. Run your app by deploying source code",
        "state":"UNAVAILABLE"
        },
        "compute_status": {
        "message":"App compute is running.",
        "state":"ACTIVE"
        },
        "create_time":"2026-02-25T20:58:06Z",
        "creator":"***@abc.com",
        "description":"",
        "effective_user_api_scopes": [
        "iam.current-user:read",
        "iam.access-control:read"
        ],
        "id":"5a6a837b-f70e-4c2b-893f-9a785df1cf98",
        "name":"mcp-neo4j-cypher",
        **"oauth2_app_client_id":"14ba9166-5d6c-4fcd-a432-06d9b3157d43",**
        "oauth2_app_integration_id":"14ba9166-5d6c-4fcd-a432-06d9b3157d43",
        "service_principal_client_id":"5a6a837b-f70e-4c2b-893f-9a785df1cf98",
        "service_principal_id":147298485860538,
        "service_principal_name":"app-56taa7 mcp-neo4j-cypher",
        "update_time":"2026-02-25T20:59:55Z",
        "updater":"***@abc.com",
        "url":"https://mcp-neo4j-cypher-***.4.azure.databricksapps.com"
    }
    ```

    **Add secret resources via Databricks UI:**

    #   neo4j-uri     -> scope: neo4j-mcp, key: neo4j-uri
    #   neo4j-username -> scope: neo4j-mcp, key: neo4j-username
    #   neo4j-password -> scope: neo4j-mcp, key: neo4j-password

    **Deploy**

    databricks apps deploy mcp-neo4j-cypher --source-code-path /Workspace/Users/<your-email>/mcp-neo4j-cypher-app

    On Databricks GUI, you should see the app is deployed and running.

    ![pic 3](/images/dbx-mcp-claude-3.jpg "pic 3")

7. Verify

    - The app will be accessible at
    https://<workspace>.databricksapps.com/mcp-neo4j-cypher/api/mcp/
    - Test with a POST request containing a JSON-RPC call to read_neo4j_cypher
    - Check Databricks App logs if connection to Neo4j Aura fails (may need network
    policy allowlisting for *.neo4j.io)

**Network Note**

Databricks Apps can reach Neo4j Aura over the public internet by default. If your workspace has restrictive network policies, ask your admin to allowlist *.databases.neo4j.io.

**Files to Create**

![pic 1](/images/dbx-mcp-claude-1.png "pic 1")

**Verification**

1. After deploy, check app status: databricks apps get mcp-neo4j-cypher

2. Test the MCP endpoint with curl or an MCP client pointing to the app URL

3. Confirm schema retrieval works: call get_neo4j_schema tool via MCP

4. Confirm read queries work: call read_neo4j_cypher with a simple MATCH (n) RETURN count(n)

## Authentication

Authentication is a big challenge with Claude due to Dynamic Client Registration(DCR) support. In this test, we are using client ID to bypass DCR. Notice the "oauth2_app_client_id" highlighed in Deploy to Databricks steps. That is the client ID we will use. 

However, the system created OAuth2 client ID doesn't allow you to make change to two important parameters - Access Scopes and Client secret, those enable Claude to connect. Let's create a new OAuth2 client ID.

We need to set the following parameters:

**Redirect URLs**

* http://localhost:8080/callback # for claude code

* http://localhost:6274/oauth/callback # for MCP Inspector

* http://localhost:6274/oauth/callback/debug # for MCP Inspector

* https://mcp-neo4j-cypher-***.4.azure.databricksapps.com/.auth/callback  # for app itself

**Access Scopes**

* Check 'All APIs'

**Client Secret**

* Uncheck 'Generate a client secret'


The app connection looks like this:

![pic 2](/images/dbx-mcp-claude-2.jpg "pic 2")

**App Permission**

There is another important permission setting which caught us. It's 'Can Use'. Set 'Can Use' for user or user groups in App.

![pic 4](/images/dbx-mcp-claude-4.png "pic 4")



Now it's time to verify from MCP Client

1. Use MCP Inspector

* Set transport type as 'Streamable HTTP'

* URL is app URL + /api/mcp/. Make sure the trailing '/' is included

* Client_ID is OAuth App Client ID which is manually created in App Connection

![pic 5](/images/dbx-mcp-claude-5.png "pic 5")

2. Use Claude Code

Add MCP Server configuration as the following in .mcp.json file:

```json
	"dbx-neo4j-cypher": {    
	      "type": "http",
	      "url": "https://mcp-neo4j-cypher-***.4.azure.databricksapps.com/api/mcp/",                                                              
	      "oauth": {
	        "clientId": "******",
	        "callbackPort": 8080
	      }
    }
```

![pic 6](/images/dbx-mcp-claude-6.png "pic 6")

3. Use Claude Desktop

Claude Destop configuration is a little bit treacky. It's because the json format of passing client_id value.

* Make a json file to store client_id configuration:
	
    ```powershell
	PS C:\Users\kevinl\code> '{"client_id":"******"}' | Out-File -FilePath "C:\Users\<username>\oauth-client-info.json" -Encoding utf8

    ```
	
* Configure DBX MCP server in claude_desktop_config.json like this:
	
	```json
	"dbx-neo4j-cypher": {
	      "command": "npx",
	      "args": [
	        "-y",
	        "mcp-remote@latest",
	        "https://mcp-neo4j-cypher-***.4.azure.databricksapps.com/api/mcp/",
	        "--static-oauth-client-info",
	        "@C:\\Users\\<username>\\oauth-client-info.json",
	        "--callback-port",
	        "8080"
	      ]
	    }
    ```


