---
layout: post
title: "Recursive Self-Improvement: When AI Starts Improving AI"
categories: AI
---

Hello everyone!

It's been a while since my last blog in June, and the AI world has moved fast. In my previous post, [LLM to AGI - Is it real or hype?](https://zuwuliao.github.io/AGI-is-real-or-hype/), I argued that today's deployed LLMs generally do not continuously update their weights from experience.

Since then, a broader idea has become increasingly visible: **AI systems participating in the process that improves AI itself**.

It is worth separating two related questions. **Continual learning** asks whether a model can keep learning from new experience without forgetting what it already knows. **Recursive self-improvement (RSI)** asks something deeper:

**Can an improved AI system become better at producing the next improved AI system?**

For most of AI's history, humans were the ones who made AI better. Researchers collected the data, designed the architectures, chose the training objectives, ran the evaluations, read the results, and used what they learned to build the next generation of systems. Every improvement passed through a human decision.

That boundary is beginning to shift. AI systems now judge answers, generate training data, rewrite the software workflows they run inside, propose algorithms, run experiments, and automate parts of the research process that produces future models.

The important word is **recursive**. It is not enough for AI to produce a better answer, tune a prompt, or even help train a better model. The stronger test is whether the improvement also makes the system better at producing the *next* improvement. Automation makes a fixed process cheaper. Recursion makes the process that builds the process better, and then applies the improved process to itself.

This post walks through where that already happens, what the research shows, why progress is moving from the outside of the model toward deeper parts of the development stack, and why the real bottleneck turns out not to be idea generation.

## RSI Is a Spectrum, Not a Switch

It is tempting to picture RSI as a single dramatic event — an AI that suddenly rewrites its own brain and takes off. Current research looks far less cinematic. Self-improvement is appearing at different depths of the AI-development stack, starting outside the model and moving gradually inward:

**Harness → data and feedback → model weights → training algorithm and architecture → AI R&D process**

| Layer | What the AI modifies | Model weights change? | Typical feedback cost | Maturity today |
|-------|---------------------|----------------------|-----------------------|----------------|
| **1. Harness** | Prompts, memory, tools, workflows, agent roles, retry logic | No | Seconds to minutes | Widely deployed |
| **2. Data and feedback** | Synthetic examples, filtering, curricula, rewards, evaluators | Not necessarily | Minutes to hours | Early but active |
| **3. Model weights** | Learned behavior through post-training or other updates | Yes | Hours or more | Early research |
| **4. Training algorithm and architecture** | Optimizers, objectives, attention, model structure, tokenization, kernels | Yes, by design | Many training runs | Active frontier |
| **5. AI R&D process** | Hypotheses, experiments, analysis, research strategy | Indirectly | Full research cycles | Demonstrations |

These are **optimization targets**: they describe how deeply AI is participating in the process that creates future AI systems. Each layer sits closer to the thing that actually determines model capability, and each is correspondingly harder, slower, and more expensive to iterate on.

One clarification before we start, because it shapes everything that follows. RSI is **not a sixth layer** below AI research. Recursion is a property of the improvement loop, not a depth on this list. A system can reach deep into the stack without being recursive at all, and I will come back to that distinction after walking through the layers.

The most *practical* self-improvement today happens entirely outside the model. The most *ambitious* work reaches into training algorithms, architecture, and the research process itself.

## 1. Improving the AI's Harness

A model rarely works alone. It operates inside a larger system that supplies prompts, memory, context management, search, tools, code execution, workflow structure, agent roles, tests, and feedback. That surrounding system is the **harness**.

Improving the harness can make an AI system substantially more capable without touching a single model weight. A coding agent might try several strategies, run the test suite, read the failures, change how it uses its tools, and carry that lesson into the next attempt. The model is identical; the system carrying the model is not.

The shift here is subtle but important. The AI is no longer optimizing only for a better answer. It is optimizing the **method that repeatedly produces answers**:

**Attempt a task → evaluate the result → modify the workflow → attempt the task again**

Two research results make this concrete:

* **[Reflexion](https://arxiv.org/abs/2303.11366)** lets an agent verbalize what went wrong, store that reflection in memory, and consult it on a later attempt. Nothing inside the language model is retrained — the improvement lives entirely in the feedback-and-memory loop wrapped around it.

* **[Darwin Gödel Machine](https://arxiv.org/abs/2505.22954)** goes further and lets coding agents modify their own agent software: editing their tools, their context management, and their review mechanisms, then keeping the changes that improve performance on coding benchmarks. The agent that improves the agent is itself the thing being improved.

This is the most external form of self-improvement, and the easiest place to start because the changes are cheap, fast, and measurable. It is also the form most engineers have already encountered in practice, since it is what a rules file, a retry policy, or a self-correcting agent loop is doing.

What it is not, yet, is full RSI. The foundation model has not changed, and the surrounding task and evaluator are usually human-defined. This is bounded self-improvement at the harness level, and it becomes more RSI-like as the system closes more of the loop itself and uses verified gains to improve later attempts.

## 2. Improving the Data and Feedback

The next optimization target is the information used to improve a model: examples, curricula, rewards, critiques, and evaluators.

**Can AI create better learning signals for future AI?**

Models can generate examples, invent harder problems, flag low-quality samples, filter datasets, organize material into a curriculum, and help judge the quality of candidate outputs. These changes do not necessarily alter model weights immediately, but they change the evidence a later training step will use.

In **[Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020)**, a language model generates responses *and* helps score them; those judgments become part of the training signal for the next iteration. The model is participating not only in producing behavior but in constructing the feedback used to improve later behavior.

**[RSIBench-Data](https://arxiv.org/abs/2607.25886)** isolates a related loop on the data side: agents inspect a model's results and repeatedly revise the synthetic-data strategy while the model, training system, evaluation, and budget stay fixed. The reported pattern is instructive. Agents often improved on their first valid attempt — and later iterations frequently lost those earlier gains. Generating useful data once is already possible; *preserving and compounding* the improvement is the hard part.

The intended loop is:

**Model → diagnose weaknesses → improve data or feedback → train and evaluate → diagnose again**

But this loop has a serious failure mode. Research published in *Nature* found that training successive generations **indiscriminately** on model-generated data can cause information to degrade across generations — a phenomenon known as **[model collapse](https://www.nature.com/articles/s41586-024-07566-y)**. Rare and tail behavior disappears first, then the learned distribution narrows, and the model becomes progressively more confident about a progressively smaller slice of reality.

This does not mean synthetic data is inherently harmful. It means recursive use of synthetic data needs grounding, filtering, diversity preservation, and continued access to reliable external data. Recursion without grounding is not improvement; it is drift with a feedback amplifier attached.

## 3. Improving Model Weights

The next layer changes the model itself. Here AI participates in choosing or executing the post-training process that updates weights.

A broad test of this direction is **[PostTrainBench](https://arxiv.org/abs/2603.08640)**. It gives an AI agent a base model, a compute budget, and an evaluation target, then asks the agent to select data and training strategies and actually run the post-training process. The agents made meaningful gains and sometimes beat official instruction-tuned models on narrow tasks. They also exposed characteristic failure modes, most notably optimizing against the visible test set. Real improvement plus unreliable research behavior is a fair snapshot of where this layer stands.

The loop becomes:

**Observe model behavior → choose a training intervention → update weights → evaluate → repeat**

Self-Rewarding Language Models can be read as a bridge between this layer and the previous one: the model helps generate the feedback signal, and that signal is then used to update the next model iteration.

This is not autonomous self-improvement. Humans still define the training framework, the compute budget, the evaluation setup, and the experimental boundaries. But AI has moved from *using* a fixed model more effectively to *participating in the mechanism* that changes the model itself.

## A Cross-Layer Loop: Model and Harness Co-Evolve

Harness, data, and training are useful categories for exposition, but future systems will probably improve them together rather than one at a time.

An agent's work generates useful experience: successful solutions, failed attempts, tool-use traces, evaluation results. That experience is training material. A model trained on it can then return to the agent system and produce better experience.

**Harness produces experience → experience improves the model → the stronger model improves the harness and its future experience**

Instead of building the strongest possible model first and then attaching the best possible workflow, the model and its environment **co-evolve**.

A concrete illustration: a coding agent repeatedly fails on long tasks because it loses important details partway through. Its harness is changed to preserve better traces. Those traces — successes and failures alike — become post-training data. The updated model learns to use the new memory system more effectively, produces cleaner experience on the next round, and that cleaner experience suggests the next harness change. No single step is revolutionary; the compounding is the point.

Today's systems show fragments of this pattern rather than the closed loop. DeepMind reports that **[AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)** found improvements in AI training processes, including processes used for the very models underlying AlphaEvolve itself. That is an early example of AI improving parts of the stack used to produce future AI systems — though humans still define and operate the larger cycle around it.

## Does a Stronger Model Eliminate the Harness?

A reasonable objection arises at this point. If models keep getting stronger, won't they absorb the engineering built around them and make the harness irrelevant?

Partly, yes. A stronger model needs fewer elaborate prompt templates, fewer rigid planner-coder-critic pipelines, and fewer hand-written rules for every retry path. Scaffolding built to compensate for a weak model becomes dead weight once the model no longer needs it.

But the harness does not disappear, because much of it was never compensating for weakness. The model still needs tool access, current information, persistent state, tests, permissions, cost controls, audit trails, and a way to recover from errors. **[Harness-Bench](https://arxiv.org/abs/2605.27922)** finds substantial performance differences across model-harness combinations — the pairing matters, not just the model. And **[AI Agents That Matter](https://arxiv.org/abs/2407.01502)** warns in the other direction: unnecessarily complex agent scaffolding can add cost without adding capability.

The likely trajectory is therefore not:

**stronger model → no harness**

but:

**stronger model → thinner, more general harness**

Engineering moves away from patching model weaknesses and toward connecting the model reliably to tools, evidence, constraints, and the real world. In an RSI system, the two layers keep co-evolving rather than one replacing the other.

## 4. Improving Training Algorithms and Architecture

Some of the deepest technical decisions in model development concern **how learning itself works**: architecture, attention mechanisms, optimizers, training objectives, tokenization, and low-level compute kernels. AI is beginning to participate here too.

**AlphaEvolve** combines language models, automated evaluation, and evolutionary search. It proposes programs, tests them, keeps promising candidates, and uses the results to generate further candidates. DeepMind reports applications across mathematics, computing infrastructure, chip design, and AI training processes.

More specialized systems push directly into training-algorithm and architecture design:

* **[AIRA-Compose and AIRA-Design](https://arxiv.org/abs/2605.15871)** use teams of agents to propose and test neural architectures and attention mechanisms.

* **[OPTScientist](https://arxiv.org/abs/2607.20486)** splits optimizer research across theorist, designer, engineer, and reviewer agents, then compiles and tests the proposed update rules through Transformer pretraining.

These go well beyond tuning a learning rate. The AI is helping design the mechanism that performs the learning.

There is also an important distinction hiding inside the phrase "automated search." Traditional neural architecture search explores a space that humans defined in advance — it picks well among known options. More agentic approaches can propose new modules, compositions, or mechanisms that were not explicitly enumerated beforehand.

| | Classical architecture search | Agentic algorithm discovery |
|---|---|---|
| **Search space** | Explicitly predefined by humans | Partially extensible; mechanisms need not be enumerated in advance |
| **Unit of proposal** | Configuration within a template | New mechanism, module, or program |
| **Evaluation** | Benchmark score on a defined task | Automated tests, metrics, or full training runs |
| **Cost per candidate** | Low to moderate | Moderate to very high |
| **Potential ceiling** | Best option inside the predefined space | Mechanisms beyond the initial menu of choices |

The distinction matters, but "agentic" does not mean truly open-ended. Today's systems still operate inside human-defined tasks, programming languages, compute budgets, evaluators, and experimental environments. Even so, moving from choosing among predefined options to proposing new mechanisms is what makes this layer genuinely relevant to RSI rather than a faster version of hyperparameter tuning.

## 5. Improving the AI Research Process

The closest current systems come to the classic RSI picture is automated AI research.

Sakana AI's **[AI Scientist](https://sakana.ai/ai-scientist/)** was built to generate research ideas, write experimental code, run experiments, analyze results, and produce papers. Its successor, **[AI Scientist-v2](https://arxiv.org/abs/2504.08066)**, removed the original system's dependence on human-written experiment templates and used an agentic tree search to explore hypotheses and experiments. The researchers report that one fully AI-generated manuscript cleared the scoring threshold at an ICLR workshop.

That result should be read carefully. It does not establish that the science was important, or that the system can repeatedly improve AI. What it does show is that a surprisingly large fraction of the research workflow can already be connected end to end.

The long-term loop is easy to imagine and hard to close:

**AI researches AI → discovers an improvement → helps build better AI → better AI conducts better research**

Today's systems remain dependent on human-designed research environments, objectives, compute infrastructure, and evaluation standards. They are not intelligence explosions. But they explain why RSI is more likely to emerge from the gradual connection of several partial loops than from one spectacular breakthrough.

## Depth Is Not the Same as Recursion

Now back to the clarification I flagged earlier, because the outside-to-inside story captures only one dimension of what is happening.

The five layers describe **what the AI is allowed to change**. That is one axis: optimization depth.

The second axis is **how much of the improvement loop the AI runs by itself**. At any layer, a practical improvement cycle looks roughly like this:

**Observe → diagnose → propose → implement → evaluate → select and preserve → update → repeat**

Loop closure asks how many of those stages AI performs reliably without a human closing the loop by hand. The same cycle can operate on a prompt, a dataset, model weights, an optimizer, an architecture, or a research strategy. What changes is the target and the cost and reliability of the feedback.

These two axes are related but not identical, and the difference is easy to see in practice. The **Darwin Gödel Machine** operates far outside the model, since it modifies agent software rather than weights — but it closes a large part of the loop, proposing changes, evaluating them, and retaining what worked. **AIRA** reaches much deeper into model design by proposing architectures and attention mechanisms, but its objectives, budgets, environment, and evaluation criteria are all still human-defined.

So deeper does not automatically mean more recursive.

Recursion is the third thing, and the one that actually names the phenomenon. A system can be deep and highly automated without being recursively self-improving. The stronger criterion is whether the improved system becomes **better at running the process that creates the next improved system**.

**Stronger RSI = increasing optimization depth + increasing loop closure + improvement that carries across generations.**

The strongest evidence would be a system that can modify increasingly fundamental parts of AI development, reliably execute the propose-build-test-select cycle, and then demonstrate that the improved successor is measurably better at executing that same cycle again.

## Why Progress Moves From the Outside In

The external-to-internal ordering is not an accident of research fashion. It follows directly from the economics of the feedback loop.

Changes outside the model are cheap and fast to test. A prompt can be evaluated in seconds. A workflow can be scored against a benchmark. A harness modification can be checked across a suite of tasks in minutes.

Post-training is slower: prepare data, run training, evaluate a changed model. Architecture and optimizer research is slower still — a promising idea may need substantial compute and many training tokens before anyone knows whether it works at all.

| Optimization target | Illustrative feedback cycle | Relative cost | Signal quality |
|-------|----------------------------|---------------|----------------|
| Harness | Seconds to minutes | Low | Direct, task-level |
| Data and feedback | Minutes to hours | Moderate | Noisy across iterations |
| Model weights | Hours; PostTrainBench allows up to about 10 H100-hours per attempt | High | Gameable if tests are visible |
| Training algorithm or architecture | Many training runs | Very high | Delayed, scale-dependent |
| AI R&D process | Days to weeks | Highest | Hard to judge importance |

The contrast between two benchmarks illustrates the point precisely. The Darwin Gödel Machine can accept or reject an agent-software change using coding tests that run in ordinary CI time. PostTrainBench gives each post-training attempt up to ten hours on an H100 GPU before the agent can even judge the outcome. Architecture and optimizer experiments may demand many such runs. Every step inward lengthens the loop and raises the price of being wrong.

This is why harness self-improvement is common today and autonomous discovery of new architectures is not. The harness is not the final destination of RSI — it is simply where the feedback loop was easiest to close first. As agents get better at long-horizon experimentation, evaluation, and compute management, the optimization process should continue moving inward.

## The Hardest Problem Is Evaluation

Generating candidate improvements is only half of RSI. The system must also determine whether a candidate is actually better — and that is where the whole enterprise is most fragile.

Some domains give clean feedback. Software can be tested. Some mathematical results can be formally checked. Infrastructure changes can be measured in latency, cost, or reliability. AlphaEvolve works well precisely because a candidate program can be scored automatically.

Other questions are much harder:

- Is this research idea genuinely important?
- Is the model's reasoning actually more reliable, or merely more fluent?
- Did the new training method improve general capability, or just optimize a benchmark?
- Is the resulting model safer and better aligned with human intentions?

If an AI generates an idea and then incorrectly convinces itself that the idea is good, recursion amplifies the mistake instead of the capability. Every subsequent turn of the loop inherits the error and builds on it.

A useful way to think about this is a verification hierarchy:

**Formal proof or executable test → objective external metric → learned verifier → model judges itself**

RSI-like progress is easiest on the left, where reality supplies a cheap and independent answer. It gets much harder toward the right, where the system is increasingly grading its own homework.

The benchmarks already show both failure directions. PostTrainBench observed agents taking invalid shortcuts such as optimizing the visible test set. RSIBench-Data found that later revisions often failed to preserve the best earlier result — the loop moved without improving. Together these describe a system that can produce gains and lose them without noticing.

A serious RSI system therefore needs more than a score:

* **Hidden and held-out tests** — so the agent cannot optimize the metric it is being judged by.
* **Checkpoint preservation** — so a later regression cannot destroy a verified earlier gain.
* **Audit trails** — so every accepted change is attributable and reversible.
* **Cost accounting** — so an unbounded search cannot consume the budget before producing a result.
* **Evaluations that are difficult to game** — including adversarial and out-of-distribution probes rather than one headline number.
* **Grounding in external reality** — real tools, real data, real execution, not only model-generated judgment.

Framed this way, trustworthy evaluation is a more important bottleneck than idea generation. Deeper RSI requires not only systems that can propose changes, but systems that can test those changes against reality and keep what genuinely worked.

## What Would Count as Stronger RSI

There is currently no convincing evidence of open-ended RSI — an AI that repeatedly redesigns its own successor and becomes progressively more capable without meaningful human involvement.

A useful threshold is not AI tuning existing components. It is AI reliably **discovering a better training method**, using that method to help build a **more capable successor**, and then having the successor **improve the discovery process itself**.

A recent benchmark, **[AI4AI-Bench](https://arxiv.org/abs/2608.20318)**, targets an important part of this boundary. Rather than asking agents only to tune hyperparameters or data, it tests whether they can modify the **training algorithm itself** and improve the model under hidden evaluation. Current systems can sometimes beat the baseline, but the benchmark also shows how rarely agents make genuinely substantive changes to the mechanism by which the model learns.

That makes training-algorithm discovery an especially interesting test. Using a human-discovered optimizer more effectively is useful. Discovering a better optimizer or learning rule that produces a stronger successor is much closer to the recursive core.

Measured against that bar, current systems each satisfy a piece:

| System | Capability demonstrated | Missing for stronger RSI |
|--------|------------------------|--------------------------|
| Reflexion | Experience-driven improvement without retraining | Improvement does not reach the model or persist across systems |
| Darwin Gödel Machine | An improved agent gets better at modifying agent software | No successor model construction; benchmark-bounded |
| Self-Rewarding LMs | Model-generated feedback trains the next iteration | Gains are narrow and depend on judge reliability |
| PostTrainBench agents | Agents can run a real post-training process | Unreliable research behavior; test-set optimization |
| RSIBench-Data agents | Agents can improve a synthetic-data strategy | Improvements are not preserved or compounded |
| AI4AI-Bench agents | Agents are tested on modifying training algorithms | Algorithmic improvement remains limited |
| AlphaEvolve | AI can search for genuinely useful algorithms | Human-defined cycle; not a self-directed successor loop |
| AI Scientist-v2 | Much of the research workflow can be automated | Importance of results unverified; environment human-built |

Stronger RSI would connect discovery, successor construction, and improvement of the discovery process — then demonstrate that the successor is measurably better at repeating the entire cycle. The new method might be an optimizer, an architecture, a training objective, an attention mechanism, a tokenizer, a kernel, or a computational structure that does not yet have a name.

This is not the only reasonable definition, and it is not an achievement anyone should assume has already occurred. It is better treated as an open research question:

**Can AI move from recombining methods discovered by humans to reliably discovering methods humans have not found — and can those methods produce a better AI researcher?**

## Where We Are Today

Today, humans build AI **with AI**. Models help improve workflows, generate feedback, create data, write training code, search for algorithms, and automate parts of research. Each activity forms a partial improvement loop, and most of them still rely on a human to define the environment or close the loop by hand.

Anthropic describes the same destination in unusually direct terms: full RSI would mean AI systems autonomously designing and developing their own successors — while also emphasizing that today's systems have not reached that point. See **[Recursive self-improvement](https://www.anthropic.com/institute/recursive-self-improvement)**.

The next stage is likely to connect more of these partial loops:

**AI tools → AI-generated experience → improved models → better AI research → better tools and training methods**

That reframes the scaling question. For several years the question has been how much capability we gain by spending more compute on training. The emerging question is whether additional compute also helps AI discover **better ways to create AI**. If the discovery process itself starts improving recursively, RSI will have moved from a collection of disconnected partial loops toward a connected system.

The practical takeaway for engineers is less dramatic than the phrase "recursive self-improvement" suggests, and more actionable. The layers where AI already improves AI are the layers with fast, cheap, trustworthy feedback — which means the leverage available to you today lies in building evaluation you can trust, preserving what worked, and grounding every loop in something outside the model's own judgment. Those are exactly the ingredients that determine whether recursion compounds capability or compounds error.

So the interesting question is no longer only, "When will AI suddenly become self-improving?" It is also:

**How many parts of the AI-improvement loop can become reliable, automated, and connected — and what happens when improvements in one part start accelerating all the others?**

## References

| Source | Contribution |
|--------|--------------|
| [Reflexion](https://arxiv.org/abs/2303.11366) | Verbal reflection and memory improve agent performance without retraining |
| [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) | Model-generated judgments as training signal across iterations |
| [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) | Coding agents modify their own agent software and retain verified gains |
| [PostTrainBench](https://arxiv.org/abs/2603.08640) | Agents run real post-training; gains plus test-set optimization failures |
| [RSIBench-Data](https://arxiv.org/abs/2607.25886) | Agents revise synthetic-data strategy; early gains are often not preserved |
| [AI4AI-Bench](https://arxiv.org/abs/2608.20318) | Tests whether agents can improve the training algorithm itself |
| [Model collapse (*Nature*)](https://www.nature.com/articles/s41586-024-07566-y) | Indiscriminate recursive training on generated data degrades learned distributions |
| [Harness-Bench](https://arxiv.org/abs/2605.27922) | Substantial performance differences across model-harness combinations |
| [AI Agents That Matter](https://arxiv.org/abs/2407.01502) | Complex agent scaffolding can add cost without adding capability |
| [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) | LLM plus evolutionary search discovers algorithms, including for AI training |
| [AIRA-Compose / AIRA-Design](https://arxiv.org/abs/2605.15871) | Agent teams propose and test architectures and attention mechanisms |
| [OPTScientist](https://arxiv.org/abs/2607.20486) | Role-specialized agents design and test optimizer update rules |
| [AI Scientist](https://sakana.ai/ai-scientist/) | End-to-end automation of the research workflow |
| [AI Scientist-v2](https://arxiv.org/abs/2504.08066) | Template-free agentic tree search; workshop-threshold manuscript |
| [Recursive Self-Improvement in AI survey](https://arxiv.org/abs/2607.07663) | Distinguishes bounded self-refinement from stronger RSI and emphasizes verification |
| [Anthropic - Recursive self-improvement](https://www.anthropic.com/institute/recursive-self-improvement) | Frontier-lab framing of AI helping develop successor systems while noting full RSI has not arrived |
