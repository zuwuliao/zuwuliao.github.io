---
layout: post
title: Harness Engineering
categories: AI
---

When working with agentic workflows, have you ever noticed that agents struggle with long-running tasks, even when you are using a top model, well-designed prompts, and strong context engineering? What is missing? The answer is **harness engineering**.

**What is Harness Engineering**

Before we look at Harness Engineering, let's review what prompt engineering and context engineering do and understand why they are not enough. 

Prompt engineering tells the agent what you want. It's the instruction for a single call and for expressing your intention precisely. Context engineering provides the model the right information and data. It includes conversation history, accurate data retrieval, tool calls and memory management. 

Harness engineering is the system level design to ensures that the entire task stays under control, with proper monitoring and constraints. It includes continous observation, orchestration and convergence. If the agent starts to go off track, harness engineering provides the mechanisms to correct and steer it. In other words, harness engineering is about managing how the agent runs: keeping it stable, keeping it on track, and pulling it back when it begins to fail.

![pic 1](/images/harness-1.jpg "pic 1")

**What problems does Harness Engineering solve**

Raw models are not operational systems. By themselves, they cannot maintain state, execute tools, recover from errors, or provide auditable behavior. Harness engineering addresses six key gaps:

* **Reliability over long horizons** — Multi-step agent loops are sensitive to early decisions. Small mistakes compound, and without harness-level controls, performance degrades as tasks grow longer.

* **Context scale and drift** — As tasks run, the context window fills and the model loses track of earlier instructions. Compaction and context resets are harness strategies to manage this.

* **Tool access and execution** — Models can propose tool calls but cannot execute them. The harness provides the orchestrator that runs tools and feeds results back.

* **Reproducibility and change control** — Model behavior varies across versions. The harness enforces snapshot pinning and evals to detect regressions during upgrades.

* **Security and governance** — Tools and retrieval expand the attack surface. The harness implements defense-in-depth: permission gates, output validation, rate limits, and approval workflows.

* **Multi-agent coordination** — Complex tasks require multiple agents working in parallel. Without explicit coordination (spawning, messaging, work isolation), agents conflict and pollute each other's context.


**Core Components of Agent Harness**

| Component                     | Description |
|------------------------------|-------------|
| Agent Loop (Orchestrator)    | Coordinates user input, model steps, tool calls, and termination. The central logic connecting all other components. |
| State & Persistence          | Durable conversation/thread state, work artifacts, and memory that persist across steps and sessions. |
| Tool Registry & Execution    | Filesystem, shell, browser, database, and API tools plus sandboxing for isolated execution. |
| Context Manager              | Compaction, selection, isolation, and progressive disclosure strategies to keep context high-signal. |
| Verification & Feedback      | Tests, linters, self-review, UI-driven checks, and LLM-as-judge evaluations. |
| Observability & Traces       | Capture of inputs/outputs, tool calls, latency, cost, and failure modes for debugging. |
| Human-in-the-Loop            | Approvals, escalation, and policy gates that allow human oversight at critical points. |
| Interface/Protocol Surfaces  | Enabling multiple clients (CLI, IDE, web) to drive the same harness via standardized protocols. |
| Tool Integration (MCP)       | Model Context Protocol—an open standard for connecting agents to external tools and data systems. |
| Multi-Agent Orchestration    | Coordination layer for spawning, communicating with, and managing multiple agents. Includes subagent spawning with isolated context, inter-agent messaging, state machine protocols, autonomous task boards, and work isolation to prevent conflicts. |

**Harness Architecture Flow**

The harness architecture operates as a workflow. A user or system trigger initiates an intent or task specification, which may optionally pass through a planner. The planner then feeds a context builder that selects, writes, compresses, and isolates the relevant information. The context builder supplies the LLM call, which may generate tool calls executed by a tool executor.

The tool executor writes to both an observability or trace store and a state or memory store. The state store then feeds back into the context builder for subsequent steps. Observability data is sent to a verifier or evaluator, such as tests, linters, or judges. If verification fails, feedback is routed back to the context builder. If verification succeeds, the system produces the final output and any associated artifacts.

In addition to the core loop, the LLM call step can spawn work into a multi-agent layer. When the master agent determines that a task benefits from parallelism or delegation, it triggers the subagent spawner, which creates child agents with isolated contexts. These subagents coordinate through inter-agent mailboxes, follow a finite state machine protocol governing their interactions, claim tasks from an autonomous task board, and operate in isolated worktrees to prevent conflicts. Once subagent work completes, results feed back into the context builder of the master agent loop, where they are incorporated into subsequent steps. This multi-agent path runs alongside the main flow—the master agent continues its own loop while subagents execute in parallel, and their results merge back when ready.

The architecture flow is shown as:

![pic 2](/images/harness-2A.jpg "pic 2")

**Key Design Patterns**

* **Progressive Disclosure (“Map Not Manual”)**: Rather than loading a monolithic instruction file into context, treat it as an index into a structured documentation directory. The monolithic approaches failed because context is scarce, guidance becomes stale, and it is hard to verify. Instead, teams maintain a “system of record” enforced by linters and documentation-maintenance agents.

* **Guide + Sensor Regulation**: A cybernetic model combining feedforward guides (which steer the model before it acts) and feedback sensors (which check outputs after). Sensors are further divided into computational sensors (fast, deterministic—tests and linters) and inferential sensors (semantic, LLM-based—more expensive but capable of nuanced judgment). Both types are distributed across the lifecycle.

* **Generator–Evaluator Loops**: A three-agent architecture consisting of a planner, a generator, and an evaluator. The evaluator actively tests the running application (for example, via browser automation) and feeds grading criteria back to the generator across multiple iterations until quality thresholds are met.

* **Compaction vs. Context Resets**: Two strategies for managing long-running tasks. Compaction summarizes context in place to preserve key state in a token-efficient form. Context resets start a fresh agent with a structured handoff of essential information. They have different trade-offs and some models exhibit behavioral changes near their context limits.

* **Standardized Session/Event Primitives**: Defining explicit “items” and “turns” with typed lifecycles, enabling robust UI integration, resumability, and consistent timelines across client reconnections.

**How to Implement Harness Engineering**

The most reliable way to implement harness engineering is to treat it like building a production runtime, not a prompt. The recommended approach is to start by documenting the tasks, acceptable error modes, required tools, and stop conditions, then build the harness in layers.

**Implementation Steps**

* **Step 1 — Define Success Criteria and Failure Costs**. Establish measurable targets for accuracy, latency, cost, and risk. Frame the evaluation as an iterative loop: describe the task as an eval, run on test inputs, analyze results, and iterate. This eval-driven approach is positioned as essential for building reliable applications.

* **Step 2 — Choose a Runtime Model Strategy**. Pin specific model versions or snapshots for stability. Plan for upgrades by building evals that can detect regressions when prompts or models change. This prevents unexpected behavior changes when providers update their models.

* **Step 3 — Design the Context Pipeline**. Decide what belongs in system instructions versus retrieved knowledge versus memory versus tool schemas. Implement write, select, compress, and isolate strategies to manage context effectively across steps.

* **Step 4 — Build the Agent Loop Orchestration**. Implement step control, retries, timeouts, and termination criteria. The orchestrator collects model output, runs tools, and feeds tool responses back in a loop until completion. This is the central runtime that connects all other components.

* **Step 5 — Implement Tools with Strong Contracts and Sandboxing**. Tools should be narrow in scope, follow least-privilege principles, and return structured outputs. Execution should be isolated in containers or sandboxes with restricted network access when possible.

* **Step 6 — Add Verification and Feedback**. Layer deterministic checks first (unit tests, linters, schema validators), then add semantic judges if needed. It distinguishes between computational sensors (fast, reliable, deterministic) and inferential sensors (semantic, LLM-based) and recommends using both.

* **Step 7 — Add Observability and Traces**. Record prompts, contexts, tool calls, outputs, costs, latency, and failure types. Use traces to analyze agent failure modes at scale and iteratively improve harness configuration. This trace-driven improvement is described as core to the harness engineering practice.

* **Step 8 — Operationalize Artifacts and Knowledge**. Store rules, documentation, and plans in a versioned system of record. Enforce freshness through linters and documentation-maintenance agents rather than relying on static instruction files that rot over time.

* **Step 9 — Implement Multi-Agent Orchestration (when needed)**. For complex tasks that benefit from parallelism or specialization, add a multi-agent layer. This includes implementing subagent spawning with isolated contexts, inter-agent communication channels, a state machine protocol governing agent interactions, task distribution mechanisms, and work isolation to prevent concurrent modification conflicts. Start with simple delegation (one parent spawning focused child agents) before evolving toward peer-to-peer autonomous patterns.

**Claude Code with Harness Engineering**

Let’s examine a real example of harness engineering in practice. Claude Code stands out as a leading agent workflow because it is built on a comprehensive harness engineering stack. Its design illustrates many of the techniques we’ve been discussing.

![pic 3](/images/harness-3.jpg "pic 3")

The table below maps Claude Code to the core components of harness engineering.

| Claude Code Architecture Component | Report Core Component  | Notes |
|-----------------------------------|------------------------------------|-------|
| **Input Layer** | | |
| User Interface (CLI, IDE, CI/CD pipeline) | Interface / Protocol Surfaces | Multiple client types driving the same harness |
| Session Manager (Resume, Fork, Persist) | Interface / Protocol Surfaces | Session lifecycle management with resumability |
| Permission Gate (Deny, Allow, Approve) | Human-in-the-Loop | YAML-based 3-tier policy enforcement; also covered in Appendix A.2 as optional |
| **Knowledge Layer** | | |
| Skill Registry (On-demand injection) | Context Manager | Implements the "progressive disclosure" pattern |
| Context Compressor (3-layer, 92% threshold) | Context Manager | Production implementation of compaction strategy |
| Task Graph (Dependencies, Priorities) | Context Manager | Dependency tracking for multi-step planning |
| Memory Store (Cross-session persistence) | State & Persistence | Durable memory across sessions |
| **Master Agent Loop** | | |
| Master Agent Loop (Perception → Action → Observation) | Agent Loop (Orchestrator) | Direct 1:1 mapping; central coordination cycle |
| **Execution Layer** | | |
| Tool Dispatch (Typed registry, one handler per tool) | Tool Registry & Execution | bash, read, write, grep, glob, revert |
| Streaming Runtime (Real-time, parallel execution) | Tool Registry & Execution | Parallel tool execution capability |
| Prompt Cache (Stable prefix reuse, 10% cost) | *(Not in core components)* | Optional |
| **Integration Layer** | | |
| MCP Runtime (Auto-discover, mcp_server_tool) | Tool Integration (MCP) | Auto-discovery of available MCP servers |
| External Servers (Filesystem, Git, Custom) | Tool Integration (MCP) | Concrete tool endpoints connected via MCP |
| **Observability Layer** | | |
| Event Bus (Hooks, Lifecycle events, Intercept) | Observability & Traces | Event-driven architecture for trace capture |
| Background Executor (Daemon threads, Non-blocking) | Observability & Traces | Non-blocking execution for observability tasks |
| **Multi-Agent Layer** | | |
| Subagent Spawner (Isolated context, Clean delegation) | Multi-Agent Orchestration | Child agents with context isolation |
| Teammate Mailboxes (Redis pub/sub, Instant delivery) | Multi-Agent Orchestration | Inter-agent communication infrastructure |
| FSM Protocol (IDLE→REQUEST→WAIT→RESPOND) | Multi-Agent Orchestration | Formal state machine for agent interactions |
| Autonomous Board (Self-assign, Atomic lock) | Multi-Agent Orchestration | Decentralized task distribution |
| Worktree Isolator (Per-task branch, Zero conflicts) | Multi-Agent Orchestration | Concurrent work isolation |
| **Output Layer** | | |
| Task Result (Verified output, Memory updated) | Verification & Feedback + Final Output | Combines verified completion with memory write-back |

**Summary**

Harness engineering is the discipline of building the runtime system around an LLM — including orchestration, context pipelines, tool execution, state management, verification, observability, and governance. With harness engineering, we can ensure the model inference into a reliable, production-grade work process. It extends beyond prompt engineering (what you tell the model) and context engineering (what the model sees) to define how the entire agent system operates end-to-end.

The core idea can be represented with a simple formula:

**Agent = Model + Harness**

The core mechanism is an agent loop where the model proposes actions, the harness manages context, executes tools in controlled environments, evaluates results, and iterates until completion.

In production systems, the harness also provides evaluation frameworks, tracing, safety controls, and lifecycle management — enabling persistence, execution, recovery, and auditability that raw models lack.

**References**

Anthropic Harness Design - [here](https://www.anthropic.com/engineering/harness-design-long-running-apps)

LangChain The Anatomy of an Agent Harness - [blog](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)

Meta-Harness: End-to-End Optimization of Model Harnesses - [paper](https://arxiv.org/abs/2603.28052)

OpenAI Harness engineering: leveraging Codex in an agent-first - [here](https://openai.com/index/harness-engineering/)

Building Claude Code with Harness Engineering - [blog](https://medium.com/gitconnected/building-claude-code-with-harness-engineering-d2e8c0da85f0)

And Thanks to many vlogs on YouTube and Xhs!