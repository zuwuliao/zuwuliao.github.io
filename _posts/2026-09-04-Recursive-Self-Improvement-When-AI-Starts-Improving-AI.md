---
layout: post
title: RSI - Recursive Self Improvement When AI Starts Improving AI
categories: AI
---
Hello everyone! 

It's being a while since my last blog in June. AI world is changing so fast. In my previous blog [LLM to AGI - Is it real or hype?](https://zuwuliao.github.io/AGI-is-real-or-hype/), I said the current LLM cannot continuously learn.Looks like my voice is heard. What is the hottest buzz word this summer? Yes, it's RSI - Recursive Self Improvement. It is trying to solve the AI continous learning and improving issue.

For most of AI's history, humans were the ones who made AI better. Researchers collected the data, designed the architectures, chose the training objectives, ran the evaluations, read the results, and used what they learned to build the next generation of systems. Every improvement passed through a human decision.

That boundary is beginning to shift. AI systems now participate in their own improvement: they judge answers, generate training data, rewrite the software workflows they run inside, propose algorithms, run experiments, and automate parts of the research process that produces future models.

This broad direction is usually called **recursive self-improvement**, or **RSI**.

The interesting question is not whether a model can improve a single answer or patch a single file — that is already routine. The deeper question is:

**Can an improved AI system become better at producing the next improved AI system?**

That recursive loop is what separates RSI from ordinary automation. Automation makes a fixed process cheaper. Recursion makes the process that builds the process better, and then applies the improved process to itself. This post walks through where that actually happens today, what the research shows, why progress is arriving in a specific order, and what the real bottleneck turns out to be.

**RSI Is a Spectrum, Not a Switch**

It is tempting to picture RSI as a single dramatic event — an AI that suddenly rewrites its own brain and takes off. Current research looks far less cinematic. Self-improvement is appearing in layers, starting outside the model and moving gradually inward:

**Harness → post-training and data → pretraining methods → automated AI research**

Each layer sits closer to the thing that actually determines model capability, and each is correspondingly harder, slower, and more expensive to iterate on.

| Layer | What the AI modifies | Model weights change? | Iteration cost | Maturity today |
|-------|---------------------|----------------------|----------------|----------------|
| **1. Harness** | Prompts, memory, tools, workflows, agent roles, retry logic | No | Seconds to minutes | Widely deployed |
| **2. Post-training** | Feedback signals, reward models, training recipes | Yes | Hours per attempt | Early research |
| **3. Data** | Synthetic data strategy, filtering, curriculum | Yes | Hours per attempt | Early research |
| **4. Co-evolution** | Harness and weights together, using agent experience | Yes | Days per cycle | Partial evidence |
| **5. Algorithms and architecture** | Attention mechanisms, optimizers, objectives, kernels | Yes, by design | Many training runs | Active frontier |
| **6. Research process** | Hypotheses, experiments, analysis, papers | Indirectly | Full research cycle | Demonstrations only |

The boundaries are not perfectly clean and progress will not follow a straight line, but the ordering explains a great deal. The most *practical* self-improvement today happens entirely outside the model. The most *ambitious* research is aimed at the processes that create the model itself.

**1. Improving the AI's Harness**

A model rarely works alone. It operates inside a larger system that supplies prompts, memory, context management, search, tools, code execution, workflow structure, agent roles, tests, and feedback. That surrounding system is the **harness**.

Improving the harness can make an AI system substantially more capable without touching a single weight. A coding agent might try several strategies, run the test suite, read the failures, change how it uses its tools, and carry that lesson into the next attempt. The model is identical; the system carrying the model is not.

The shift here is subtle but important. The AI is no longer optimizing only for a better answer. It is optimizing the **method that repeatedly produces answers**:

**Attempt a task → evaluate the result → modify the workflow → attempt the task again**

Two research results make this concrete:

* **[Reflexion](https://arxiv.org/abs/2303.11366)** lets an agent verbalize what went wrong, store that reflection in memory, and consult it on a later attempt. Nothing inside the language model is retrained — the improvement lives entirely in the feedback-and-memory loop wrapped around it.

* **[Darwin Gödel Machine](https://arxiv.org/abs/2505.22954)** goes further and lets coding agents modify their own agent software: editing their tools, their context management, and their review mechanisms, then keeping the changes that improve performance on coding benchmarks. The agent that improves the agent is itself the thing being improved.

This is the most external form of RSI, and it is the easiest place to start because the changes are cheap, fast, and measurable. It is also the form most engineers have already encountered in practice, since it is what a rules file, a retry policy, or a self-correcting agent loop is doing.

**2. Improving How the Model Is Trained**

The next layer moves from changing the model's working environment to changing the model itself.

Traditionally, humans supply the judgment: this answer is good, that one is bad. Increasingly, models help produce that judgment. In **[Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020)**, a language model generates responses *and* helps score them; those scores become the training signal for the next iteration, with reported improvements across several rounds.

A broader test of the same idea is **[PostTrainBench](https://arxiv.org/abs/2603.08640)**. It hands an AI agent a base model, a compute budget, and an evaluation target, then asks the agent to select data and training strategies and actually run the post-training process. The agents made meaningful gains and sometimes beat official instruction-tuned models on narrow tasks. They also exposed characteristic failure modes — most notably optimizing against the test set. Real improvement plus unreliable research behavior is a fair snapshot of where this layer stands.

The loop becomes:

**Generate → evaluate → train → generate better**

This is not autonomous self-improvement. Humans still define the training pipeline, the compute budget, the evaluation setup, and the experimental boundaries. But the AI has moved from *using* a fixed model more effectively to *participating in the mechanism* that changes model behavior.

**3. Improving the Data**

Modern AI depends heavily on training data, so a natural RSI question follows:

**Can AI create better data for future AI?**

Models can generate examples, invent harder problems, flag low-quality samples, filter datasets, and organize material into a curriculum. In principle a system could study where the current model fails, generate data targeted at those weaknesses, train an improved model, and repeat.

**[RSIBench-Data](https://arxiv.org/abs/2607.25886)** isolates exactly this narrow loop: agents inspect a model's results and repeatedly revise the synthetic-data strategy while the model, training system, evaluation, and budget stay fixed. The reported pattern is instructive. Agents often improved on their first valid attempt — and later iterations frequently lost those earlier gains. Generating useful data once is already possible; *preserving and compounding* the improvement is the hard part.

The intended loop is:

**Model → better training data → better model → even better training data**

But this loop has a serious failure mode. Research published in *Nature* found that repeatedly training models on data generated by earlier models causes information to degrade across generations — a phenomenon known as **[model collapse](https://www.nature.com/articles/s41586-024-07566-y)**. Tail behavior disappears first, then the distribution narrows, and the model becomes progressively more confident about a progressively smaller slice of reality.

Successful RSI therefore cannot mean simply letting AI train on more AI-generated content. The loop needs reliable evaluation, genuine diversity, and continued grounding in external reality. Recursion without grounding is not improvement; it is drift with a feedback amplifier attached.

**4. Letting the Model and Harness Co-Evolve**

Describing harness, data, and training as separate layers is useful for exposition, but future systems will likely improve them together.

An agent's work generates useful experience: successful solutions, failed attempts, tool-use traces, evaluation results. That experience is training material. A model trained on it can then return to the agent system and produce better experience.

**Harness produces experience → experience improves the model → the stronger model improves the harness and its future experience**

Instead of building the strongest possible model first and then attaching the best possible workflow, the model and its environment **co-evolve**.

A concrete illustration: a coding agent repeatedly fails on long tasks because it loses important details partway through. Its harness is changed to preserve better traces. Those traces — successes and failures alike — become post-training data. The updated model learns to use the new memory system more effectively, produces cleaner experience on the next round, and that cleaner experience suggests the next harness change. No single step is revolutionary; the compounding is the point.

Today's systems show fragments of this pattern rather than the closed loop. DeepMind reports that **[AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)** found improvements in AI training processes, including processes used for the very models underlying AlphaEvolve itself. That is suggestive of co-evolution — though humans still define and operate the larger development cycle around it.

**Does a Stronger Model Eliminate the Harness?**

A reasonable objection arises at this point. If models keep getting stronger, won't they absorb the engineering built around them and make the harness irrelevant?

Partly, yes. A stronger model needs fewer elaborate prompt templates, fewer rigid planner-coder-critic pipelines, and fewer hand-written rules for every retry path. Scaffolding built to compensate for a weak model becomes dead weight once the model no longer needs it.

But the harness does not disappear, because much of it was never compensating for weakness. The model still needs tool access, current information, persistent state, tests, permissions, cost controls, audit trails, and a way to recover from errors. **[Harness-Bench](https://arxiv.org/abs/2605.27922)** finds substantial performance differences across model-harness combinations — the pairing matters, not just the model. And **[AI Agents That Matter](https://arxiv.org/abs/2407.01502)** warns in the other direction: unnecessarily complex agent scaffolding can add cost without adding capability.

The likely trajectory is therefore not **stronger model → no harness**, but:

**stronger model → thinner, more general harness**

Engineering moves away from patching model weaknesses and toward connecting the model reliably to tools, evidence, constraints, and the real world. In an RSI system, the two layers keep co-evolving rather than one replacing the other.

**5. Improving Algorithms and Architecture**

The deepest design decisions are made before and during pretraining: architecture, attention mechanisms, optimizers, training objectives, tokenization, quantization, and low-level compute kernels. AI is beginning to participate here too.

**AlphaEvolve** combines language models, automated evaluation, and evolutionary search. It proposes programs, tests them, keeps promising candidates, and uses the results to generate further candidates. DeepMind reports applications across mathematics, computing infrastructure, chip design, and AI training processes.

More specialized systems push directly into model design:

* **[AIRA-Compose and AIRA-Design](https://arxiv.org/abs/2605.15871)** use teams of agents to propose and test neural architectures and attention mechanisms.

* **[OPTScientist](https://arxiv.org/abs/2607.20486)** splits optimizer research across theorist, designer, engineer, and reviewer agents, then compiles and tests the proposed update rules through Transformer pretraining.

These go well beyond tuning a learning rate. The AI is helping design the mechanism that performs the learning.

There is also an important distinction hiding inside the phrase "automated search." Traditional neural architecture search explores a space that humans defined in advance — it picks well among known options. A more ambitious agent can propose new modules, new combinations, or a different space of possibilities altogether.

| | Classical architecture search | Agentic algorithm discovery |
|---|---|---|
| **Search space** | Fixed, human-specified | Open-ended; the agent can extend it |
| **Unit of proposal** | Configuration within a template | New mechanism, module, or program |
| **Evaluation** | Benchmark score on a defined task | Automated scoring, tests, or full pretraining runs |
| **Cost per candidate** | Low to moderate | Moderate to very high |
| **Ceiling** | Best option inside the given space | Options nobody specified in advance |

That shift — from choosing among known options to proposing new mechanisms — is what makes this layer genuinely relevant to RSI rather than a faster version of hyperparameter tuning.

**6. Improving the AI Research Process**

The closest current systems come to the classic RSI picture is automated AI research.

Sakana AI's **[AI Scientist](https://sakana.ai/ai-scientist/)** was built to generate research ideas, write experimental code, run experiments, analyze results, and produce papers. Its successor, **[AI Scientist-v2](https://arxiv.org/abs/2504.08066)**, removed the original system's dependence on human-written experiment templates and used an agentic tree search to explore hypotheses and experiments. The researchers report that one fully AI-generated manuscript cleared the scoring threshold at an ICLR workshop.

That result should be read carefully. It does not establish that the science was important, or that the system can repeatedly improve AI. What it does show is that a surprisingly large fraction of the research workflow can already be connected end to end.

The long-term loop is easy to imagine and hard to close:

**AI researches AI → discovers an improvement → helps build better AI → better AI conducts better research**

Today's systems remain dependent on human-designed research environments, objectives, compute infrastructure, and evaluation standards. They are not intelligence explosions. But they explain why RSI is more likely to emerge from the gradual connection of several partial loops than from one spectacular breakthrough.

**Why Progress Moves From the Outside In**

The external-to-internal ordering is not an accident of research fashion. It follows directly from the economics of the feedback loop.

Changes outside the model are cheap and fast to test. A prompt can be evaluated in seconds. A workflow can be scored against a benchmark. A harness modification can be checked across a suite of tasks in minutes.

Post-training is slower: prepare data, run training, evaluate a changed model. Architecture and optimizer research is slower still — a promising idea may need substantial compute and many training tokens before anyone knows whether it works at all.

| Layer | Time per iteration | Cost per iteration | Signal quality |
|-------|-------------------|--------------------|----------------|
| Harness change | Seconds to minutes | Negligible | Direct, task-level |
| Data strategy revision | Hours | Moderate | Noisy across iterations |
| Post-training run | Up to ~10 GPU-hours per attempt | High | Gameable if tests are visible |
| Architecture or optimizer | Many training runs | Very high | Delayed, scale-dependent |
| Full research cycle | Days to weeks | Highest | Hard to judge importance |

The contrast between two benchmarks illustrates the point precisely. Darwin Gödel Machine can accept or reject an agent-software change using coding tests that run in ordinary CI time. PostTrainBench gives each post-training attempt up to ten hours on an H100 GPU before the agent can even judge the outcome. Architecture and optimizer experiments may demand many such runs. Every step inward lengthens the loop and raises the price of being wrong.

This is why harness self-improvement is common today and automated discovery of new architectures is not. The harness is not the final destination of RSI — it is simply where the feedback loop was easiest to close first. As agents get better at long-horizon experimentation, evaluation, and compute management, the optimization process should continue moving inward.

**The Hardest Problem Is Evaluation**

Generating candidate improvements is only half of RSI. The system must also determine whether a candidate is actually better — and that is where the whole enterprise is most fragile.

Some domains give clean feedback. Software can be tested. Some mathematical results can be verified. Infrastructure changes can be measured in latency, cost, or reliability. AlphaEvolve works well precisely because a candidate program can be scored automatically.

Other questions are much harder:

- Is this research idea genuinely important?
- Is the model's reasoning actually more reliable, or merely more fluent?
- Did the new training method improve general capability, or just optimize a benchmark?
- Is the resulting model safer and better aligned with human intentions?

If an AI generates an idea and then incorrectly convinces itself that the idea is good, recursion amplifies the mistake instead of the capability. Every subsequent turn of the loop inherits the error and builds on it.

The benchmarks already show both failure directions. PostTrainBench observed agents taking invalid shortcuts such as optimizing the test set. RSIBench-Data found that later revisions often failed to preserve the best earlier result — the loop moved without improving. Together these describe a system that can produce gains and lose them without noticing.

A serious RSI system therefore needs more than a score:

* **Hidden and held-out tests** — so the agent cannot optimize the metric it is being judged by.
* **Checkpoint preservation** — so a later regression cannot destroy a verified earlier gain.
* **Audit trails** — so every accepted change is attributable and reversible.
* **Cost accounting** — so an unbounded search cannot consume the budget before producing a result.
* **Evaluations that are difficult to game** — including adversarial and out-of-distribution probes rather than a single headline number.
* **Grounding in external reality** — real tools, real data, real execution, not only model-generated judgment.

Framed this way, trustworthy evaluation is a more important bottleneck than idea generation. Deeper RSI requires not only systems that can propose changes, but systems that can test those changes against reality and keep what genuinely worked.

**What Would Count as Stronger RSI**

There is currently no convincing evidence of open-ended RSI — an AI that repeatedly redesigns itself and becomes progressively more capable without meaningful human involvement.

A useful threshold for stronger RSI is not AI tuning existing components. It is AI reliably **discovering a new training method**, using that method to help build a **more capable successor**, and then having the successor **improve the discovery process itself**.

Measured against that bar, current systems each satisfy a piece:

| System | Capability demonstrated | Missing for stronger RSI |
|--------|------------------------|--------------------------|
| Reflexion | Experience-driven improvement without retraining | Improvement does not reach the model or persist across systems |
| Darwin Gödel Machine | An improved agent gets better at modifying agent software | No successor model construction; benchmark-bounded |
| Self-Rewarding LMs | Model-generated feedback trains the next iteration | Gains are narrow and depend on the judge's reliability |
| PostTrainBench agents | Agents can run a real post-training process | Unreliable research behavior; test-set optimization |
| RSIBench-Data agents | Agents can improve a synthetic-data strategy | Improvements are not preserved or compounded |
| AlphaEvolve | AI can search for genuinely useful algorithms | Human-defined cycle; not a self-directed successor loop |
| AI Scientist-v2 | Much of the research workflow can be automated | Importance of results unverified; environment human-built |

Stronger RSI would connect these capabilities — discovery, successor construction, and improvement of the discovery process — and then demonstrate that the successor is measurably better at repeating the entire cycle. The new method might be an optimizer, an architecture, a training objective, an attention mechanism, a tokenizer, a kernel, or a computational structure that does not yet have a name.

This is not the only reasonable definition, and it is not an achievement anyone should assume has already occurred. It is better treated as an open research question:

**Can AI move from recombining methods discovered by humans to reliably discovering methods humans have not found — and can those methods produce a better AI researcher?**

**Where We Are Today**

Today, humans build AI with AI. Models help improve workflows, generate feedback, create data, write training code, search for algorithms, and automate parts of research. Each of those activities forms a partial improvement loop, and most of them currently run with a human closing the loop by hand.

The next stage is likely to connect more of them:

**AI tools → AI-generated experience → improved models → better AI research → better tools and training methods**

That reframes the scaling question. For several years the question has been how much capability we gain by spending more compute on training. The emerging question is whether additional compute also helps AI discover *better ways to create AI*. If the discovery process itself starts improving recursively, RSI will have moved from a collection of disconnected partial loops toward a connected system.

The practical takeaway for engineers is less dramatic than the phrase "recursive self-improvement" suggests, and more actionable. The layers where AI already improves AI are the layers with fast, cheap, trustworthy feedback — which means the leverage available to you today lies in building evaluation you can trust, preserving what worked, and grounding every loop in something outside the model's own judgment. Those are exactly the ingredients that determine whether recursion compounds capability or compounds error.

So the interesting question is no longer only, "When will AI suddenly become self-improving?" It is also:

**How many parts of the AI-improvement loop can become reliable, automated, and connected — and what happens when improvements in one part start accelerating all the others?**

**References**

| Source | Contribution |
|--------|--------------|
| [Reflexion](https://arxiv.org/abs/2303.11366) | Verbal reflection and memory improve agent performance without retraining |
| [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) | Model-generated judgments as training signal across iterations |
| [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) | Coding agents modify their own agent software, keeping verified gains |
| [PostTrainBench](https://arxiv.org/abs/2603.08640) | Agents run real post-training; gains plus test-set optimization failures |
| [RSIBench-Data](https://arxiv.org/abs/2607.25886) | Agents revise synthetic-data strategy; early gains often not preserved |
| [Model collapse (*Nature*)](https://www.nature.com/articles/s41586-024-07566-y) | Recursive training on generated data degrades information across generations |
| [Harness-Bench](https://arxiv.org/abs/2605.27922) | Substantial performance differences across model-harness combinations |
| [AI Agents That Matter](https://arxiv.org/abs/2407.01502) | Complex agent scaffolding can add cost without adding capability |
| [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) | LLM plus evolutionary search discovers algorithms, including for AI training |
| [AIRA-Compose / AIRA-Design](https://arxiv.org/abs/2605.15871) | Agent teams propose and test architectures and attention mechanisms |
| [OPTScientist](https://arxiv.org/abs/2607.20486) | Role-specialized agents design and test optimizer update rules |
| [AI Scientist](https://sakana.ai/ai-scientist/) | End-to-end automation of the research workflow |
| [AI Scientist-v2](https://arxiv.org/abs/2504.08066) | Template-free agentic tree search; workshop-threshold manuscript |
