---
layout: post
title: Loop Engineering
categories: AI
---

For two years, the dominant way to work with AI was simple: a human writes a prompt, the model responds, the human reads the response and writes the next prompt. This human-in-the-loop, turn-by-turn workflow had a hard ceiling. It could not scale, it could not run overnight, and it kept the human as the bottleneck in every single cycle. **Loop engineering** is the response to that ceiling — the practice of designing systems that prompt agents, rather than prompting agents yourself.

As Peter Steinberger, creator of OpenClaw, put it on June 7, 2026:

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."

Boris Cherny, Head of Claude Code at Anthropic, describes the same shift from the inside:

> "I don't prompt Claude anymore. I have loops running. They're the ones prompting Claude and figuring out what to do. My job is to write loops."

This post is a synthesis of the early thinking on loop engineering — what it is, the problem it solves, how it works, the risks it introduces, and where it is heading. It draws on primary sources from Steinberger, Addy Osmani, Cherny, Mitchell Hashimoto, and writing from MindStudio, Firecrawl, lushbinary, and Faros AI.

**Why Loop Engineering — the Fourth Paradigm**

Loop engineering is best understood as the latest step up a ladder of abstraction. Each layer wraps and requires the one below it.

| Paradigm | When | Associated with | What you design |
|---|---|---|---|
| **Prompt engineering** | 2023–24 | Early practitioners | Craft instructions for a single call |
| **Context engineering** | Mid-2025 | Karpathy, Lütke, Anthropic | Design everything the model sees |
| **Harness engineering** | Early 2026 | Hashimoto, OpenAI, Fowler | Design the environment agents run inside |
| **Loop engineering** | June 2026 | Steinberger, Osmani, Cherny | Design systems that prompt agents |

The progression matters because each paradigm only became necessary once the one beneath it was solved. Prompt engineering was about the words in a single call. Context engineering widened the frame to everything the model sees — conversation history, retrieved data, tool definitions, memory. Harness engineering widened it again to the environment a single agent runs inside: rules files, sandboxed execution, feedback gates, constraints. Loop engineering wraps all of that and asks the next question — *who keeps the agent running, who checks its work, and who decides what it does next?*

Three properties explain why this layer is worth designing for:

* **Speed** — Loops run 24/7, unattended. A well-designed coding loop can ship 259 PRs in a month — reportedly 100% of contributions in some workflows — while the engineer focuses on higher-order design rather than typing the next instruction.

* **Leverage** — The leverage point moves from crafting individual prompts to designing reusable systems. One well-built loop serves every future instance of a recurring task, instead of a human re-prompting it each time.

* **Iteration** — Loops close the feedback gap. They reason, act, observe, and repeat until done. This is fundamentally different from one-shot generation, and it is what makes loops viable for real-world correctness rather than plausible-looking output.

**The Problem It Solves**

It is tempting to assume loop engineering exists because models got better. It doesn't. AI coding agents can already generate code faster than teams can review it — but more code does not mean better outcomes. The core problems were never about model quality; they were about the *system around the model*. Four gaps stand out.

* **The human bottleneck.** Every agent cycle required a human to read the output, decide what to do, and type the next instruction. The model got faster; the human did not. At scale, AI became limited by human throughput — the exact opposite of the goal.

* **No persistent progress.** Single-session agent runs lost all state when the conversation ended. Long-horizon tasks — a multi-day refactor, a nightly triage sweep — were impossible to structure without a human manually resuming the work and re-supplying context each time.

* **No self-verification.** Agents could generate code but had no built-in mechanism to confirm it worked. Without test execution, error reading, and retry logic, the feedback gap meant the agent was essentially guessing, and the human had to do all of the checking.

* **Harness without orchestration.** Harness engineering (early 2026) solved the single-agent environment problem — constraints, feedback gates, rules files. But it described *one agent run*. It never explained who kicks off the run, who checks it, who spawns more agents, or how work gets discovered automatically in the first place.

As Addy Osmani frames the boundary between the two layers:

> "The harness equips a single agent run; the loop is what keeps poking agents on a schedule, spawning helpers, and feeding itself."

**How Loop Engineering Works**

A loop is a repeating cycle that replaces the human turn-by-turn prompter with an orchestrating system. The canonical cycle has six stages:

1. **Discover** — A scheduler triggers on a timer or an event. The loop scans a backlog — failing tests, open issues, stale reports — and picks the next task to work on.

2. **Assign** — The orchestrator hands the task to the most appropriate sub-agent (coding, research, review) with the right context and tools for the job.

3. **Execute** — The sub-agent runs inside a harness: rules files, sandboxed execution, tool access. It acts, observes feedback, and iterates.

4. **Verify** — A separate verifier agent checks the output against a rubric or test suite. "Done" must mean something beyond the agent saying so.

5. **Persist** — Results, costs, and state are written to persistent memory. The loop always knows what it has already tried and what it currently owns.

6. **Decide** — The orchestrator reads the state and decides what happens next: pick the next task, escalate to a human, or terminate because the goal is met or the budget is exceeded.

![pic 1](/images/loop-engineering-cycle.jpg "pic 1")

**The two types of loops**

Loops fall into two broad categories depending on how they decide "done."

| | Deterministic loop | Non-deterministic loop |
|---|---|---|
| **Verification** | Fixed test suite, binary pass/fail | Verifier agent scoring against a rubric |
| **Cost** | Cheapest, most predictable | Costlier, more open-ended |
| **Behavior** | Same prompt, fresh start each task; terminates when all tests pass | Maker and checker are separate agents; repeats until rubric passes or budget is hit |
| **Best for** | Code tasks with clear pass/fail criteria | Subjective criteria — brand voice, UI quality, architecture review |
| **Example** | The "ralph loop" — feed spec, implement, pass tests, repeat until done | Writer agent + verifier agent → repeat until the rubric passes or the budget is spent |

Use a deterministic loop wherever the success condition can be reduced to a test that exits fast and cheaply. Reach for a non-deterministic loop only when the goal genuinely resists binary checks — and accept that you are trading predictability and cost for the ability to evaluate quality that no unit test can capture.

**Five building blocks**

Whatever its type, a robust loop is built from five non-negotiable components:

1. **Clear termination condition.** A loop must know what "done" looks like. Vague goals produce infinite loops. Specific, testable exit conditions — all tests pass, rubric score above a threshold, budget exhausted — are first-class design requirements, not afterthoughts.

2. **Tool set with real feedback.** The loop only learns from actions it can observe. Code execution, test runners, file system access, shell commands. Without tools that return real-world state, the loop is guessing in the dark.

3. **Context management across iterations.** Each iteration generates more context. Without compaction and structured memory, the model loses track of what it already tried. Good loops maintain a log of attempted approaches, outcomes, and current state.

4. **Error handling and strategy change.** Retrying the exact same failed action is not learning. A well-designed loop detects repeated failure, varies its strategy, and escalates to a human or halts when stuck — rather than spinning forever.

5. **Maker / checker separation.** The agent that generates output should not be the same agent that verifies it. Separating the maker and verifier sub-agents is what makes the loop's "done" signal meaningful, rather than the agent simply agreeing with itself.

**Risks and Concerns**

Loop engineering does not reduce risk — it shifts and amplifies it. The same feedback cycle that makes loops powerful makes them dangerous when designed poorly. Problems that were visible with a human in the loop become invisible until they compound. As the lushbinary loop engineering guide warns:

> "A loop running unattended is also a loop making mistakes unattended. Three problems actually get sharper as the loop gets better, not easier."

The major failure modes, with their mitigations:

* **Token cost explosion (High).** Unattended loops spend money unattended. A non-deterministic loop with a loose verification rubric can run for hours, accumulating cost with no human watching the meter. *Mitigation:* set hard iteration caps and dollar budgets; prefer deterministic loops with tight test gates, which stop fast and cheaply.

* **Goodhart's law in the loop (High).** A loop satisfies the verification gate you gave it, not the goal you meant. If your tests are weak, the loop ships code that passes weak tests — it optimizes for the proxy, not the intent. *Mitigation:* invest as heavily in writing verifier rubrics as in writing the loop itself, and separate the maker and checker agents so neither can validate its own output.

* **Comprehension debt (Medium).** If the agent ships code while you sleep, you wake up owning code you have not read. Two engineers can run the same loop and get opposite outcomes depending on whether they use it to accelerate understanding or to avoid it. *Mitigation:* build review gates, require the loop to emit human-readable changelogs, and treat the loop as an accelerator for your judgment rather than a replacement for it.

* **Runaway multi-agent loops (High).** AutoGPT's failure mode, scaled up. Without explicit no-progress detection, loops with sub-agents can spawn workers, consume resources, and make compounding mistakes — all unattended. *Mitigation:* implement no-progress detection; if the same error recurs across iterations without a strategy change, escalate or halt. Never let a loop retry the identical approach indefinitely.

* **Security and scope creep (High).** Loops with file system, network, and tool access that run unattended have a wide blast radius. A mistake in the loop policy can cause irreversible side effects in production. *Mitigation:* apply the harness layer rigorously — sandbox execution environments, use minimal permissions, implement audit logging, and require human approval for irreversible actions.

* **Intent drift (Medium).** The original goal specified at loop creation can be reinterpreted by sub-agents over many iterations, especially as context accumulates and gets compressed. *Mitigation:* re-inject the original goal specification at each major iteration, and maintain a structured goal log that is immune to context compression.

**Future Directions**

Loop engineering is less than two weeks old as a named discipline. The current tooling — Claude Code's `/loop`, cron scheduling, sub-agent hooks — is only the first generation. Several directions are already visible along the current trajectory.

* **Self-improving loops (Near-term).** Loops that modify their own harness based on observed failure patterns. Instead of a human updating `CLAUDE.md` after an agent error, the loop itself proposes and commits harness improvements — seeding recursive capability growth.

* **Multi-loop orchestration (Near-term).** Multiple specialized loops — a coding loop, a research loop, a deployment loop — coordinated by a meta-orchestrator. Each loop owns a domain; the meta-loop routes work between them and manages shared state. This is the organizational layer above the current multi-agent loop.

* **Loop marketplaces (Mid-term).** Reusable, audited loop templates for common workflows — triage bot, nightly code review, report generation — distributed as composable components. Engineering leverage shifts from writing loops to selecting, configuring, and composing them.

* **Formal loop verification (Mid-term).** Before a loop runs in production, it is formally verified against a specification for termination guarantees, resource bounds, and correctness properties. Safety-critical domains — finance, healthcare, infrastructure — will demand this before autonomous loops touch production.

* **Goal-level programming (Long-term).** The next abstraction above loop engineering: engineers specify outcomes and constraints, and the system designs its own loops to achieve them. The engineer's role becomes goal architecture and constraint specification rather than loop design.

* **Cross-organizational loops (Long-term).** Loops that span organizational boundaries — a supplier's loop feeding into a customer's loop via standardized agent protocols such as A2A and MCP. The unit of economic production shifts from the employee or team to the inter-enterprise loop network.

**The Deeper Shift**

Each paradigm shift — prompt → context → harness → loop — has been a move up the abstraction ladder. The engineer's job evolves from "what words do I use?" toward "what goals, constraints, and systems do I specify?" If that trajectory continues, the layer above loop engineering may be one where engineers work entirely at the level of desired outcomes, and the system designs its own loops, harnesses, and context pipelines to achieve them.

Loop engineering is not the destination — it is the current frontier of a longer journey toward programming by intent. The takeaway for practitioners today is concrete: stop optimizing the next prompt, and start designing the system that writes the prompts for you. Build the termination condition first, give the loop real tools and real verification, separate the maker from the checker, and put hard budgets and audit trails around anything that runs while you sleep. The loop is only as good as the discipline you encode into it.
