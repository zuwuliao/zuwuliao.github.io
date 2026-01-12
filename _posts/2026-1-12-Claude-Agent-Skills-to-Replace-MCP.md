---
layout: post
title: Claude Agent Skills to Replace MCP
categories: AI
---

Last October, Anthropic introduced Agent Skills. It aims to extend Claude's functionality. Each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant. It is intented to be light weighted and easy to manage packages, also very powerful tool in the same time. Many reseachers says it will replace MCP eventually. Anthropic express it very cauciously and says it's a complementary to MCP as MCP is mainly dealing with external resources and Agent Skills are for internal. 

Is it true? To answer this question, I need to explore and play around it by myself, then I can have my own opinion. In my work, we are using many MCP servers. One of them is MCP server for Neo4j Aura instance. The MCP server is hosted on Azure and using Claude as MCP host and client. The whole infrastructure to support the operation is a little big complicated. Now the question to me is can Agent Skill replace our Neo4j MCP server.

To create a Claude Agent Skill, I use Claude Code. It guide me step-by-step to create a skill in my project. The following are the main steps:

1. Claude Code asked me about Neo4j Operation, Schema and Credential questions

![pic 1](/images/claude-skills-1.png "pic 1")

![pic 2](/images/claude-skills-2.png "pic 2")

![pic 3](/images/claude-skills-3.png "pic 3")

![pic 4](/images/claude-skills-4.png "pic 4")

2. It creates a skill with SKILL.md file and a few other python files for connect, extract_schema and query Neo4j Aura DB and asking for test:

![pic 5](/images/claude-skills-5.png "pic 5")

![pic 6](/images/claude-skills-6.png "pic 6")

3. Once it tested OK, it will ask for permission to package and save it for Claude code to use

![pic 7](/images/claude-skills-7.png "pic 7")

![pic 8](/images/claude-skills-8.png "pic 8")

Now, we should be able to use the skill we just created. Let's ask a question "What movies are acked by Tom Hanks based on Neo4j graph DB?". Claude code found there is a skill called 'neo4j-aura' available and ask for your permission to use it. Once you give the permission, it generate the cipher query and query the Aura instance and got the response back. Then it provides you the final answers based on the response.

![pic 9](/images/claude-skills-9.png "pic 9")

The entire progress is very smooth and easy to build and use. It probably takes me one hour from start to final run. And there isn't any infrastructure to maintain. Compare all the infrastructure we built for Neo4j MCP server, this approach is a big win!


