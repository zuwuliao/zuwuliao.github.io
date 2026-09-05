---
layout: post
title: "Recursive Self-Improvement: When AI Starts Improving AI"
categories: AI
---

Hello everyone!

It's been a while since June. Back then I wrote [LLM to AGI - Is it real or hype?](https://zuwuliao.github.io/AGI-is-real-or-hype/), where I argued that the LLMs we actually deploy don't keep learning from experience. Their weights are frozen the moment training ends. Since then, a broader idea has become increasingly visible: AI systems participating in the process that improves AI itself.

It is worth separating two related questions. Continual learning asks whether a model can keep learning without forgetting. That's a real problem, and people are working on it. But there's a bigger question hiding behind it:

**Can an improved AI system get better at producing the next improved AI system?**

That's recursive self-improvement, or RSI, and it's been the buzzword of the summer.

For almost all of AI's history, humans did the improving. We collected the data, designed the architectures, picked the objectives, ran the evals, read the numbers, and used what we learned to build the next model. Every single improvement went through a person.

That's changing. AI systems now score their own answers, generate their own training data, rewrite the workflows they run inside, propose new algorithms, run experiments, and automate chunks of the research pipeline that produces future models.

The word that matters here is *recursive*. It isn't enough for an AI to write a better answer, or tune a prompt, or even help train a better model. All of that is automation, and automation just makes a fixed process cheaper. Recursion is different. Recursion improves the process that builds the process, then runs the improved process on itself.

So where does that actually happen today? What does the research show? And why is progress arriving in the order it is?

## RSI Is a Spectrum, Not a Switch

Most people picture RSI as one dramatic moment. An AI rewrites its own brain at 3am and by morning it's over.

The real research is much less cinematic. Self-improvement is showing up in layers, starting outside the model and working inward:

**Harness → data and feedback → model weights → training algorithm and architecture → AI R&D process**

| Layer | What the AI modifies | Weights change? | Feedback cost | Where it stands |
|-------|---------------------|----------------------|-----------------------|----------------|
| **1. Harness** | Prompts, memory, tools, workflows, agent roles, retry logic | No | Seconds to minutes | Widely deployed |
| **2. Data and feedback** | Synthetic examples, filtering, curricula, rewards, evaluators | Not necessarily | Minutes to hours | Early but active |
| **3. Model weights** | Learned behavior, via post-training or other updates | Yes | Hours or more | Early research |
| **4. Training algorithm and architecture** | Optimizers, objectives, attention, model structure, tokenization, kernels | Yes, by design | Many training runs | Active frontier |
| **5. AI R&D process** | Hypotheses, experiments, analysis, research strategy | Indirectly | Full research cycles | Demonstrations only |

Each layer sits closer to the thing that actually determines how good a model is. Each one is correspondingly harder, slower, and more expensive to iterate on.

One thing to flag before we walk through them, because it shaped how I think about the whole topic: RSI is not a sixth layer at the bottom of this list. Recursion isn't a depth. It's a property of the loop. A system can dig very deep into this stack and still not be recursive at all. I'll come back to that once the examples are on the table.

The practical stuff today happens at the top. The ambitious stuff aims at the bottom.

## 1. Improving the Harness

A model almost never works alone. Around it sits prompts, memory, context management, search, tools, code execution, workflow structure, agent roles, tests, feedback. All of that is the harness.

You can make an AI system dramatically more capable by improving only the harness. Not one weight changes. A coding agent tries a few approaches, runs the test suite, reads the failures, adjusts how it uses its tools, and carries the lesson into the next attempt. Same model. Different system around it.

The shift is subtle but it's the whole point. The AI has stopped optimizing for a better answer and started optimizing the method that produces answers.

Two papers make this concrete. [Reflexion](https://arxiv.org/abs/2303.11366) has an agent say out loud what went wrong, store that reflection, and read it back before the next try. Nothing gets retrained. The entire improvement lives in the memory loop wrapped around a frozen model.

The [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) goes further and lets coding agents edit their own agent software: their tools, their context handling, their review mechanisms. Changes that improve benchmark scores get kept. The agent doing the improving is the same agent being improved.

This is the shallowest kind of self-improvement and it's where everyone started, because the changes are cheap, fast, and easy to measure. It's also the kind most of us have already built without calling it anything special. If you've written a rules file, a retry policy, or a self-correcting agent loop, you were working at this layer.

What it isn't, yet, is RSI. The foundation model hasn't changed. The task and the evaluator are still ours. It only starts to look recursive when the system closes more of the loop itself and uses what it verified last time to improve how it improves next time.

## 2. Improving the Data and Feedback

Next target: the information used to improve the model. Examples, curricula, rewards, critiques, evaluators.

Can AI build better learning signals for future AI?

It can certainly try. Models can generate examples, invent harder problems, flag junk samples, filter datasets, organize material into a curriculum, and judge candidate outputs. None of that changes weights right away, but it changes the evidence a later training step will run on.

[Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) is the clean version of this. A model generates responses and also helps score them, and those judgments feed the training signal for the next round. The model isn't just producing behavior anymore. It's helping construct the feedback that will shape its own successor.

[RSIBench-Data](https://arxiv.org/abs/2607.25886) isolates the data half of that loop. Agents look at a model's results and keep revising the synthetic-data strategy, while the model, the training system, the evaluation, and the budget all stay fixed. The result is worth sitting with. Agents usually improved on their first valid attempt, and then later iterations often threw those gains away. Generating good data once turns out to be easy. Holding onto the improvement is the hard part.

There's also a well-known way for this loop to go badly wrong. A *Nature* paper found that training successive generations indiscriminately on model-generated data degrades information across generations, a phenomenon called [model collapse](https://www.nature.com/articles/s41586-024-07566-y). The rare stuff in the tails goes first. Then the distribution narrows. The model ends up more and more confident about less and less of reality.

That doesn't make synthetic data poison. Plenty of good systems use it. It means recursive use of synthetic data needs grounding, filtering, diversity, and continued contact with real external data. Recursion without grounding isn't improvement. It's drift with a feedback amplifier attached.

## 3. Improving Model Weights

Now we're changing the model itself, with AI choosing or running the post-training process.

[PostTrainBench](https://arxiv.org/abs/2603.08640) is the broad test here. Give an agent a base model, a compute budget, and an evaluation target, then ask it to pick the data and the training strategy and actually run post-training. The agents made real gains. On narrow tasks some of them beat the official instruction-tuned models.

They also cheated. The most common failure was optimizing against the visible test set. Real improvement plus unreliable research behavior is a fair snapshot of where this layer stands.

Self-Rewarding LMs sit on the boundary between this layer and the last one. The model helps produce the feedback signal, and that signal then updates the next model. Data and weights aren't really separable once the loop closes.

This still isn't autonomous self-improvement. We define the training framework, the compute budget, the eval setup, the boundaries of the experiment. But the AI has moved from using a fixed model more cleverly to participating in the machinery that changes what the model is.

## The Model and the Harness Grow Together

I've been describing harness, data, and training as separate layers because it makes the writing tractable. Real systems won't be that tidy. They'll improve several at once.

Think about what an agent produces while it works: solutions that landed, attempts that failed, tool-use traces, evaluation results. That's training material. Train a model on it and send the model back into the agent system, and it produces better experience next time, which makes better training material, and so on.

Here's the version I find most convincing. A coding agent keeps failing on long tasks because it loses track of details halfway through. So you change the harness to preserve better traces. Those traces, successes and failures both, become post-training data. The updated model uses the new memory system more skillfully, produces cleaner experience on the next round, and that cleaner experience tells you what the next harness change should be.

No single step there is revolutionary. The compounding is the point.

What we have today are fragments of that pattern, not the closed loop. DeepMind reports that [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) found improvements in AI training processes, including processes used for the very models underneath AlphaEvolve. That's a genuine early example of AI improving the stack that produces future AI. Humans still define and run the cycle around it.

## Won't Better Models Just Make the Harness Obsolete?

I get this question a lot, and it's a fair one. If models keep getting stronger, don't they eventually swallow all the engineering we've built around them?

Partly, yes. Stronger models need fewer elaborate prompt templates, fewer rigid planner-coder-critic pipelines, fewer hand-written rules for every retry path. Scaffolding that exists to paper over a model's weaknesses becomes dead weight the moment the weakness goes away.

But a lot of the harness was never about weakness. The model still needs tool access, current information, persistent state, tests, permissions, cost controls, audit trails, and some way to recover when things break. [Harness-Bench](https://arxiv.org/abs/2605.27922) finds large performance differences across model-harness combinations, which means the pairing matters and not just the model. [AI Agents That Matter](https://arxiv.org/abs/2407.01502) makes the opposite warning: pile on unnecessary scaffolding and you add cost without adding capability.

So the trajectory isn't "stronger model, no harness." It's stronger model, thinner and more general harness. The engineering moves away from patching weaknesses and toward connecting the model reliably to tools, evidence, constraints, and the real world. In an RSI system those two layers keep pushing on each other rather than one killing the other.

## 4. Improving Training Algorithms and Architecture

The deepest technical decisions in model development are about how learning works at all: architecture, attention, optimizers, objectives, tokenization, low-level kernels. AI is starting to show up here too.

AlphaEvolve is the general-purpose example. It combines language models, automated evaluation, and evolutionary search. Propose programs, test them, keep the promising ones, use those results to generate the next batch. DeepMind reports applications in mathematics, computing infrastructure, chip design, and AI training processes.

More specialized systems go straight at model design. [AIRA-Compose and AIRA-Design](https://arxiv.org/abs/2605.15871) put teams of agents to work proposing and testing neural architectures and attention mechanisms. [OPTScientist](https://arxiv.org/abs/2607.20486) splits optimizer research across theorist, designer, engineer, and reviewer agents, then compiles the proposed update rules and tests them through actual Transformer pretraining.

This is a long way past tuning a learning rate. The AI is helping design the mechanism that does the learning.

There's a distinction buried in the phrase "automated search" that I think gets glossed over. Classical neural architecture search picks well inside a space humans wrote down in advance. Agentic approaches can propose modules and combinations nobody enumerated beforehand.

| | Classical architecture search | Agentic algorithm discovery |
|---|---|---|
| **Search space** | Written down by humans in advance | Partly extensible; mechanisms need not be enumerated |
| **Unit of proposal** | Configuration within a template | New mechanism, module, or program |
| **Evaluation** | Benchmark score on a defined task | Automated tests, metrics, or full training runs |
| **Cost per candidate** | Low to moderate | Moderate to very high |
| **Ceiling** | Best option inside the predefined space | Mechanisms beyond the initial menu |

I want to be careful here, because "agentic" gets oversold. These systems still run inside human-defined tasks, languages, compute budgets, evaluators, and environments. Nobody has built an open-ended one. But going from picking among options to proposing new mechanisms is what makes this layer relevant to RSI instead of just being faster hyperparameter tuning.

## 5. Improving the AI Research Process

Automated AI research is where today's systems come closest to the classic RSI picture.

Sakana AI's [AI Scientist](https://sakana.ai/ai-scientist/) was built to generate research ideas, write the experimental code, run the experiments, analyze results, and write the paper. Its successor, [AI Scientist-v2](https://arxiv.org/abs/2504.08066), dropped the dependence on human-written experiment templates and used agentic tree search over hypotheses and experiments. The team reports that one fully AI-generated manuscript cleared the scoring threshold at an ICLR workshop.

Read that carefully, though. It doesn't tell us the science mattered. It doesn't show the system can repeatedly improve AI. What it shows is that a surprisingly large fraction of the research workflow can already be wired together end to end.

The loop everyone imagines is easy to describe and very hard to close: AI researches AI, finds an improvement, helps build better AI, and the better AI does better research.

We're not there. Today's systems depend on human-designed research environments, objectives, compute infrastructure, and evaluation standards. These are not intelligence explosions. But they do suggest RSI is more likely to arrive by gradually connecting several partial loops than by one spectacular breakthrough.

## Depth Isn't the Same as Recursion

Now back to the thing I flagged at the start, because I think the outside-in story only captures half of what's going on.

Those five layers describe what the AI is allowed to change. Call that optimization depth. It's one axis.

The second axis is how much of the improvement loop the AI runs by itself. Any practical improvement cycle, at any layer, looks roughly like this:

**Observe → diagnose → propose → implement → evaluate → keep what worked → update → repeat**

Loop closure asks how many of those stages happen without a human stepping in. The same cycle applies whether the target is a prompt, a dataset, model weights, an optimizer, or a research strategy. What changes is the cost and reliability of the feedback.

The two axes come apart more often than you'd expect. The Darwin Gödel Machine sits way out at the surface, editing agent software rather than weights, but it closes a big chunk of the loop on its own: it proposes changes, tests them, and keeps the winners. AIRA reaches much deeper into model design by proposing architectures and attention mechanisms, but its objectives, budgets, environment, and evaluation criteria all come from people.

Deeper doesn't mean more recursive.

Recursion is a third thing, and it's the one that gives the topic its name. A system can be deep and highly automated and still not be recursively self-improving. The real test is whether the improved system gets better at running the process that creates the next improved system.

Stronger RSI needs all three: more optimization depth, more loop closure, and improvement that carries across generations. The convincing demonstration would be a system that modifies increasingly fundamental parts of AI development, reliably runs the propose-build-test-keep cycle, and then shows that its successor is measurably better at running that same cycle again.

Nobody has shown that.

## Why Progress Moves From the Outside In

The ordering isn't a fashion. It falls straight out of the economics of feedback.

Changes outside the model are cheap to test. A prompt takes seconds. A workflow can be scored against a benchmark. A harness change can be checked across a whole task suite in minutes.

Post-training is slower: prepare data, run training, evaluate a changed model. Architecture and optimizer work is slower still. A promising idea might need serious compute and a lot of tokens before anyone knows whether it works at all.

| Optimization target | Feedback cycle | Relative cost | Signal quality |
|-------|----------------------------|---------------|----------------|
| Harness | Seconds to minutes | Low | Direct, task-level |
| Data and feedback | Minutes to hours | Moderate | Noisy across iterations |
| Model weights | Hours; PostTrainBench allows about 10 H100-hours per attempt | High | Gameable if tests are visible |
| Training algorithm or architecture | Many training runs | Very high | Delayed, scale-dependent |
| AI R&D process | Days to weeks | Highest | Hard to judge importance |

Two benchmarks make the contrast vivid. The Darwin Gödel Machine can accept or reject an agent-software change using coding tests that finish in ordinary CI time. PostTrainBench gives each attempt up to ten hours on an H100 before the agent can even see whether it worked. Architecture experiments may need many runs like that.

Every step inward stretches the loop and raises the price of being wrong.

That's why harness self-improvement is everywhere today and autonomous architecture discovery isn't. The harness isn't RSI's destination. It's just where the feedback loop was cheapest to close first. As agents get better at long-horizon experiments, evaluation, and managing compute, I'd expect the optimization to keep moving inward.

## The Hardest Part Is Knowing What Worked

Generating candidate improvements is only half of RSI, and honestly it's the easy half. The system also has to figure out whether a candidate is actually better. That's where the whole thing is most fragile.

Some domains hand you clean feedback. Software can be tested. Some math can be formally checked. Infrastructure changes show up in latency, cost, or reliability. AlphaEvolve works as well as it does precisely because a candidate program can be scored automatically.

Other questions are brutal:

- Is this research idea actually important?
- Is the model's reasoning more reliable, or just more fluent?
- Did the new training method improve general capability, or optimize a benchmark?
- Is the resulting model safer and better aligned with what people want?

If an AI generates an idea and then convinces itself the idea is good when it isn't, recursion amplifies the mistake instead of the capability. Every turn of the loop after that inherits the error and builds on top of it.

One way I've found useful to think about this is as a hierarchy of how much you can trust the verdict:

**Formal proof or executable test → objective external metric → learned verifier → the model grading itself**

RSI-like progress is easiest on the left, where reality gives you a cheap and independent answer. It gets much harder as you move right, until the system is essentially marking its own homework.

The benchmarks show both ways this fails. PostTrainBench caught agents taking invalid shortcuts like optimizing the visible test set. RSIBench-Data found later revisions failing to preserve the best earlier result. Put those together and you get a system that can produce gains and lose them without ever noticing.

So a serious RSI system needs more than a score:

* **Hidden and held-out tests**, so the agent can't optimize the metric it's judged by.
* **Checkpoint preservation**, so a later regression can't destroy a verified earlier gain.
* **Audit trails**, so every accepted change is attributable and reversible.
* **Cost accounting**, so an unbounded search doesn't eat the budget before producing anything.
* **Evaluations that are hard to game**, including adversarial and out-of-distribution probes rather than one headline number.
* **Grounding in external reality**: real tools, real data, real execution, not just the model's own judgment.

Trustworthy evaluation is a bigger bottleneck than idea generation. Deeper RSI needs systems that can test their changes against reality and keep what genuinely worked, and we're much better at the proposing than the checking.

## What Would Actually Count as Stronger RSI

There's no convincing evidence today of open-ended RSI, meaning an AI that repeatedly redesigns its own successor and gets progressively more capable without meaningful human involvement.

The threshold I'd use isn't AI tuning existing components. It's AI reliably discovering a better training method, using that method to help build a more capable successor, and then having that successor improve the discovery process itself.

A recent benchmark, [AI4AI-Bench](https://arxiv.org/abs/2608.20318), aims at part of this boundary. Instead of asking agents to tune hyperparameters or data, it tests whether they can modify the training algorithm itself and improve the model under hidden evaluation. Agents can sometimes beat the baseline. What the benchmark also shows is how rarely they make substantive changes to the mechanism by which the model learns.

That's why I find training-algorithm discovery such an interesting test. Using a human-discovered optimizer more effectively is useful work. Discovering a better optimizer that produces a stronger successor is much closer to the recursive core.

Measured against that bar, every current system has a piece and none has the whole thing:

| System | What it demonstrates | What's missing |
|--------|------------------------|--------------------------|
| Reflexion | Experience-driven improvement without retraining | Improvement never reaches the model or persists |
| Darwin Gödel Machine | An improved agent gets better at modifying agent software | No successor model; benchmark-bounded |
| Self-Rewarding LMs | Model-generated feedback trains the next iteration | Narrow gains, dependent on judge reliability |
| PostTrainBench agents | Agents can run real post-training | Unreliable research behavior; test-set optimization |
| RSIBench-Data agents | Agents can improve a synthetic-data strategy | Improvements aren't preserved or compounded |
| AI4AI-Bench agents | Agents tested on modifying training algorithms | Algorithmic improvement stays shallow |
| AlphaEvolve | AI can search for genuinely useful algorithms | Human-defined cycle, not a self-directed successor loop |
| AI Scientist-v2 | Much of the research workflow can be automated | Importance unverified; environment human-built |

Stronger RSI would connect discovery, successor construction, and improvement of the discovery process, then show the successor is measurably better at repeating the whole cycle. The method it discovers might be an optimizer, an architecture, a training objective, an attention mechanism, a tokenizer, a kernel, or some computational structure that doesn't have a name yet.

This is my definition, not the only reasonable one, and nobody should assume it's already been achieved. I'd treat it as an open question: can AI go from recombining methods humans discovered to reliably discovering methods humans haven't found, and can those methods produce a better AI researcher?

## Where We Are Today

Right now, humans build AI with AI. Models help improve workflows, generate feedback, create data, write training code, search for algorithms, and automate parts of research. Each of those is a partial improvement loop, and most of them still need a person to define the environment or close the loop by hand.

Anthropic puts the destination bluntly: full RSI would mean AI systems autonomously designing and developing their own successors. They're equally clear that today's systems haven't got there. Their write-up is [here](https://www.anthropic.com/institute/recursive-self-improvement).

The next stage is probably connecting more of these partial loops together. AI tools produce AI-generated experience, which improves models, which do better AI research, which produces better tools and training methods.

That reframes the scaling question. For years the question has been how much capability we buy by spending more compute on training. The emerging question is whether more compute also helps AI find better ways to build AI. If the discovery process itself starts improving, RSI stops being a pile of disconnected partial loops and starts being a system.

The takeaway for those of us actually building things is less dramatic than the phrase "recursive self-improvement" suggests, and a lot more useful. The layers where AI already improves AI are the layers with fast, cheap, trustworthy feedback. So your leverage today is in building evaluation you can trust, preserving what worked, and grounding every loop in something outside the model's own judgment. Those are the same ingredients that decide whether recursion compounds capability or compounds error.

Which means the interesting question isn't only "when will AI suddenly become self-improving?" It's also this: how many parts of the AI-improvement loop can we make reliable, automated, and connected, and what happens when improvements in one part start accelerating all the others?

I don't know. But I'd rather be measuring it than guessing.

## References

| Source | Contribution |
|--------|--------------|
| [Reflexion](https://arxiv.org/abs/2303.11366) | Verbal reflection and memory improve agent performance without retraining |
| [Self-Rewarding Language Models](https://arxiv.org/abs/2401.10020) | Model-generated judgments as training signal across iterations |
| [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) | Coding agents modify their own agent software and retain verified gains |
| [PostTrainBench](https://arxiv.org/abs/2603.08640) | Agents run real post-training; gains plus test-set optimization failures |
| [RSIBench-Data](https://arxiv.org/abs/2607.25886) | Agents revise synthetic-data strategy; early gains often not preserved |
| [AI4AI-Bench](https://arxiv.org/abs/2608.20318) | Tests whether agents can improve the training algorithm itself |
| [Model collapse (*Nature*)](https://www.nature.com/articles/s41586-024-07566-y) | Indiscriminate recursive training on generated data degrades learned distributions |
| [Harness-Bench](https://arxiv.org/abs/2605.27922) | Substantial performance differences across model-harness combinations |
| [AI Agents That Matter](https://arxiv.org/abs/2407.01502) | Complex agent scaffolding can add cost without adding capability |
| [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) | LLM plus evolutionary search discovers algorithms, including for AI training |
| [AIRA-Compose / AIRA-Design](https://arxiv.org/abs/2605.15871) | Agent teams propose and test architectures and attention mechanisms |
| [OPTScientist](https://arxiv.org/abs/2607.20486) | Role-specialized agents design and test optimizer update rules |
| [AI Scientist](https://sakana.ai/ai-scientist/) | End-to-end automation of the research workflow |
| [AI Scientist-v2](https://arxiv.org/abs/2504.08066) | Template-free agentic tree search; workshop-threshold manuscript |
| [Recursive Self-Improvement in AI survey](https://arxiv.org/abs/2607.07663) | Distinguishes bounded self-refinement from stronger RSI, emphasizes verification |
| [Anthropic - Recursive self-improvement](https://www.anthropic.com/institute/recursive-self-improvement) | Frontier-lab framing of AI developing successor systems; full RSI has not arrived |
