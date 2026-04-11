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

**Harness Architecture Flow**

The harness architecture operates as a workflow. A user or system trigger initiates an intent or task specification, which may optionally pass through a planner. The planner then feeds a context builder that selects, writes, compresses, and isolates the relevant information. The context builder supplies the LLM call, which may generate tool calls executed by a tool executor.

The tool executor writes to both an observability or trace store and a state or memory store. The state store then feeds back into the context builder for subsequent steps. Observability data is sent to a verifier or evaluator, such as tests, linters, or judges. If verification fails, feedback is routed back to the context builder. If verification succeeds, the system produces the final output and any associated artifacts.

The architecture flow is shown as:

![pic 2](/images/harness-2.jpg "pic 2")

**Key Design Patterns**

* **Progressive Disclosure (“Map Not Manual”)**: Rather than loading a monolithic instruction file into context, treat it as an index into a structured documentation directory. The paper reports that monolithic approaches failed because context is scarce, guidance becomes stale, and it is hard to verify. Instead, teams maintain a “system of record” enforced by linters and documentation-maintenance agents.

* **Guide + Sensor Regulation**: A cybernetic model combining feedforward guides (which steer the model before it acts) and feedback sensors (which check outputs after). Sensors are further divided into computational sensors (fast, deterministic—tests and linters) and inferential sensors (semantic, LLM-based—more expensive but capable of nuanced judgment). Both types are distributed across the lifecycle.

* **Generator–Evaluator Loops**: A three-agent architecture consisting of a planner, a generator, and an evaluator. The evaluator actively tests the running application (for example, via browser automation) and feeds grading criteria back to the generator across multiple iterations until quality thresholds are met.

* **Compaction vs. Context Resets**: Two strategies for managing long-running tasks. Compaction summarizes context in place to preserve key state in a token-efficient form. Context resets start a fresh agent with a structured handoff of essential information. The paper notes these have different trade-offs and that some models exhibit behavioral changes near their context limits.

* **Standardized Session/Event Primitives**: Defining explicit “items” and “turns” with typed lifecycles, enabling robust UI integration, resumability, and consistent timelines across client reconnections.

**How to Implement Harness Engineering**

The most reliable way to implement harness engineering is to treat it like building a production runtime, not a prompt. The recommended approach is to start by documenting the tasks, acceptable error modes, required tools, and stop conditions, then build the harness in layers.

**Implementation Steps**

* **Step 1 — Define Success Criteria and Failure Costs**. Establish measurable targets for accuracy, latency, cost, and risk. Frame the evaluation as an iterative loop: describe the task as an eval, run on test inputs, analyze results, and iterate. This eval-driven approach is positioned as essential for building reliable applications.

* **Step 2 — Choose a Runtime Model Strategy**. Pin specific model versions or snapshots for stability. Plan for upgrades by building evals that can detect regressions when prompts or models change. This prevents unexpected behavior changes when providers update their models.

* **Step 3 — Design the Context Pipeline**. Decide what belongs in system instructions versus retrieved knowledge versus memory versus tool schemas. Implement write, select, compress, and isolate strategies to manage context effectively across steps.

* **Step 4 — Build the Agent Loop Orchestration**. Implement step control, retries, timeouts, and termination criteria. The orchestrator collects model output, runs tools, and feeds tool responses back in a loop until completion. This is the central runtime that connects all other components.

* **Step 5 — Implement Tools with Strong Contracts and Sandboxing**. Tools should be narrow in scope, follow least-privilege principles, and return structured outputs. Execution should be isolated in containers or sandboxes with restricted network access when possible.

* **Step 6 — Add Verification and Feedback**. Layer deterministic checks first (unit tests, linters, schema validators), then add semantic judges if needed. The paper distinguishes between computational sensors (fast, reliable, deterministic) and inferential sensors (semantic, LLM-based) and recommends using both.

* **Step 7 — Add Observability and Traces**. Record prompts, contexts, tool calls, outputs, costs, latency, and failure types. Use traces to analyze agent failure modes at scale and iteratively improve harness configuration. This trace-driven improvement is described as core to the harness engineering practice.

* **Step 8 — Operationalize Artifacts and Knowledge**. Store rules, documentation, and plans in a versioned system of record. Enforce freshness through linters and documentation-maintenance agents rather than relying on static instruction files that rot over time.

**Summary**

Harness engineering is the discipline of building the runtime system around an LLM — including orchestration, context pipelines, tool execution, state management, verification, observability, and governance. With harness engineering, we can ensure the model inference into a reliable, production-grade work process. It extends beyond prompt engineering (what you tell the model) and context engineering (what the model sees) to define how the entire agent system operates end-to-end.

The core idea can be represented with a simple formula:

**Agent = Model + Harness**

The core mechanism is an agent loop where the model proposes actions, the harness manages context, executes tools in controlled environments, evaluates results, and iterates until completion.

In production systems, the harness also provides evaluation frameworks, tracing, safety controls, and lifecycle management — enabling persistence, execution, recovery, and auditability that raw models lack.
