---
layout: post
title: Claude Agent Skills to Replace MCP
categories: AI
---

## Can Agent Skills Replace Our Neo4j MCP Server?

Last October, Anthropic introduced Agent Skills, a new feature designed to extend Claude’s functionality. Each skill is a modular package that includes instructions, metadata, and optional resources—such as scripts or templates—that Claude can use automatically when relevant. These skills are intended to be lightweight, easy to manage, and powerful, offering a streamlined way to expand Claude’s capabilities.

Since then, some researchers have speculated that Agent Skills could eventually replace MCP. However, Anthropic has been cautious in how it positions this new feature. According to their documentation, Agent Skills are meant to complement MCP rather than replace it. While MCP is primarily focused on connecting Claude to external resources and services, Agent Skills are more oriented toward enhancing Claude’s internal functionality.

Is it true? To answer that, I need to explore the technology for myself and form my own opinion based on hands-on experience. 

In my current work, we use several MCP servers, including one that connects to a Neo4j Aura instance. This MCP Server is hosted on Azure and serves for Claude MCP Client. The infrastructure supporting this operation is relatively complex, involving multiple services and configurations. That leads me to a practical question: Could an Agent Skill take over the role of our Neo4j MCP server?

To test this, I began experimenting with building a custom Claude Agent Skill using Claude Code, Anthropic’s development interface. It guided me step-by-step through the creation process. Here are the main stages I followed:

## 1. Communicating with Claude Code

Claude Code asked me about Neo4j Operation, Schema and Credential questions  to understand what functions the skill will perform

![pic 1](/images/claude-skills-1.png "pic 1")

![pic 2](/images/claude-skills-2.png "pic 2")

![pic 3](/images/claude-skills-3.png "pic 3")

![pic 4](/images/claude-skills-4.png "pic 4")

## 2. Coding and Testing

It creates a skill with SKILL.md file and a few other python files for connect, extract_schema and query Neo4j Aura DB and asking for test:

![pic 5](/images/claude-skills-5.png "pic 5")

![pic 6](/images/claude-skills-6.png "pic 6")

## 3. Packaging

Once it tested OK, it will ask for permission to package and save it for Claude code to use

![pic 7](/images/claude-skills-7.png "pic 7")

![pic 8](/images/claude-skills-8.png "pic 8")

## 4. Using the skill

Now, we should be able to use the skill we just created. Let's ask a question "What movies are acked by Tom Hanks based on Neo4j graph DB?". Claude code found there is a skill called 'neo4j-aura' available and ask for your permission to use it. Once you give the permission, it generate the cipher query and query the Aura instance and got the response back. Then it provides you the final answers based on the response.

![pic 9](/images/claude-skills-9.png "pic 9")

The entire progress is very smooth and easy to build and use. It probably takes me one hour from start to final run. And there isn't any infrastructure to maintain. Compare all the infrastructure we built for Neo4j MCP server, this approach is a big win!

## Conclusion

Can Claude Agent Skills Replace MCP?

In my opinion, yes—technically, Claude Agent Skills can replace MCP.

At its core, an MCP server is just code running on a workload—typically hosted on a remote server. But why couldn’t that same code run on the local environment Claude uses to execute Agent Skills? After all, MCP is just a set of standardized API calls. If we’re willing to trust Claude to create and run those calls within its own runtime, then in many cases, there’s no technical reason why MCP couldn’t be replaced.

Given the benefits Agent Skills offer—being token-efficient, lightweight, and easy to manage—it makes sense to use them wherever they’re a viable alternative. They simplify deployment, reduce overhead, and offer a more integrated way to extend Claude’s capabilities without relying on complex external infrastructure. On December 18, 2025, Anthropic took a major step forward to publish Agent Skills as an open standard for cross-platform portability(read more [here](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)). Other industry leaders including OpenAI, Google, Microsoft, and AWS are all adopting or aligning with this standard, which significantly increases its competitiveness in the AI ecosystem.

The key word for Agent Skill is ##trust##.

How much do we trust Claude to handle this execution autonomously, without the oversight and safeguards of a verified, externally maintained MCP server? And just as importantly: How secure is the environment in which we allow Claude to run these skills?





