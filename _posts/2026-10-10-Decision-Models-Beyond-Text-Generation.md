---
layout: post
title: "Decision Models - When AI Decides Instead of Generates"
categories: AI
---

Over the past few years, most of us have used large language models (LLMs) for almost everything: writing, coding, summarization, and also a long tail of small decisions inside software. Which team should handle this ticket? Is this prompt an injection attempt? Which agent should take this request? Is this retrieved chunk relevant? We usually solve these with an LLM call, a carefully written prompt, JSON mode, and some parsing code.

This works, but it is wasteful. For a decision like "low, medium, high, or critical", the application does not need an essay. It needs one label and, ideally, a probability it can trust. Generating that answer token-by-token through a frontier model costs latency, money, and reliability, and the "confidence" an LLM writes in text is generally not a calibrated probability.

On September 15, 2026, TypeSafe released **Jev**, its first public "System One Model", and the idea of a **decision model** suddenly became a category. Within a few weeks, Cloudflare, Fastino, Together, and others released open and hosted models around the same interface, and llama.cpp added native support. Then, between October 1 and 9, Perplexity, Liquid AI, OpenAI, and Microsoft each shipped decision-model products, so this is no longer a startup-only category. In this post I summarize what a decision model is, how Jev works, how it compares with LLMs and traditional ML classifiers, where it is useful, and how the ecosystem is shaping up as of October 2026.

---

## What is a Decision Model?

"Decision model" is not yet a standardized ML architecture name. TypeSafe calls its family **System One Models**, inspired by Daniel Kahneman's fast, intuitive System 1 thinking, as opposed to the slow, deliberate System 2 reasoning that LLMs with chain-of-thought try to emulate.

In practical software terms, a decision model is a pretrained model whose output space is a **bounded decision** instead of an arbitrary token sequence:

```
f(state, question, allowed_outcomes) → probability distribution over outcomes

state    = "Production database latency has doubled"
question = "What severity is this incident?"
outcomes = [low, medium, high, critical]

→ {low: 0.01, medium: 0.05, high: 0.72, critical: 0.22}
```

The flow is simple:

1. **Unstructured state** — text, JSON-like objects, lists
2. **Semantic decision model** — understands both the state and the question
3. **Typed probabilities** — a choice, a score, or a yes/no probability that code can consume directly

![pic 1](/images/decision-model-1.jpg "pic 1")

A useful way to characterize it: a decision model is a **general-purpose zero-shot classifier and scorer with a decision-native API**. At the output layer it behaves like a classifier. But unlike a classic classifier, it accepts new tasks and new label taxonomies at inference time, without training a new model for every task.

The innovation is not classification itself, which is decades old. It is the combination of four properties:

- **Zero-shot semantic flexibility** — like an LLM, it understands new questions without retraining
- **Bounded, typed outputs** — like a classifier, it can only return allowed outcomes
- **Probability-oriented decisions** — confidence is a first-class output, not generated prose
- **Cheap inference** — no open-ended autoregressive generation

---

**What is TypeSafe Jev**

TypeSafe describes the Jev stack as having three components:

- A **new proprietary model architecture**
- A **parallel sampler** for efficient inference
- A training method called **Reinforcement Learning for Calibrated Decisions (RLCD)**

Jev intentionally gives up open-ended string generation. In exchange, it returns structured, probabilistic decisions through a hosted API.

---

**How Jev Works: Shared State and Typed Questions**

The API accepts a shared **state**, a **model** name, and a dictionary of named **questions**. All questions refer to the same state, and different question types can be mixed in one request. The original Jev interface centers on three decision primitives: Choice, Score, and Noul. TypeSafe's current API also exposes experimental image/Box capabilities.

The three question primitives are:

**1. Choice** — mutually exclusive multi-class classification

```
Which team?
- billing
- support
- sales
```

Returns the winning choice, its confidence, and probabilities across all choices.

**2. Score** — ordered (ordinal) evaluation against a rubric

```
How urgent?
0 = can wait
1 = this week
2 = today
```

Returns an expected score plus probabilities over each rubric level.

**3. Noul** — probability of a binary proposition

```
Is this prompt injection?
```

Returns a probability of "yes / true". Several Noul questions together can also express multi-label decisions.

**Why shared state matters**

In real systems, one input usually needs several decisions:

```
One support ticket / security event / agent request
 │
 ├── intent?
 ├── severity?
 ├── policy violation?
 ├── needs human?
 ├── best agent?
 └── risk score?
```

With a decision model, all of these can be answered in a single API request against the same state. With LLMs, we typically either issue a separate call per decision (duplicating the input each time) or ask for one big JSON object and hope every field is well-formed. Shared state reduces both orchestration overhead and token cost.

![pic 2](/images/decision-model-2.jpg "pic 2")

---

**Why a Decision Model Can Be Fast**

The speed difference becomes clear when we compare the two inference paths.

Generative LLM inference:

```
prompt
  ↓
transformer
  ↓
token 1 → token 2 → token 3 → ... → token N
  ↓
JSON / text parsing
  ↓
application decision
```

Each output token depends on all previously generated tokens, so the output is produced **autoregressively**, one sequential step at a time.

Decision model inference:

```
state + bounded question
  ↓
model
  ↓
probabilities over allowed outcomes
  ↓
application decision
```

No essay or JSON string needs to be composed token-by-token. The main speed contributors are:

| Factor | Why it matters |
|--------|----------------|
| No open-ended autoregressive generation | A bounded decision does not need hundreds of sequential decoding steps |
| Constrained output space | The model evaluates a small finite set of options instead of repeatedly picking from a vocabulary of 100K+ tokens |
| Multiple questions on shared state | Several classifications reuse one request and one context |
| Purpose-built sampler and stack | TypeSafe attributes efficiency to its parallel sampler (vendor claim) |

An independent evaluation of Jev 1.13.0 by Deußer, Sparrenberg & Sifa gives some concrete numbers:

- **346,009 requests** across **37 datasets**
- **217.9M input tokens** processed
- **0.36 s mean client-side latency** at 32 concurrent requests
- **$9.15 total cost** for the entire workload at then-current pricing

TypeSafe's published input price is **$0.042 per million tokens**, or $42 per billion input tokens.

However, we should not overgeneralize "fast". Jev can be dramatically faster and cheaper than asking a frontier LLM to generate an answer for a small decision. But a local, dedicated classifier, such as logistic regression, XGBoost, or a compact fine-tuned encoder, can still have lower latency (sub-millisecond to tens of milliseconds) and near-zero marginal cost.

---

## Decision Model vs Generative LLM

| Dimension | Decision Model / Jev | Generative LLM |
|-----------|----------------------|----------------|
| Primary objective | Choose, score, or estimate probability | Generate arbitrary token sequences |
| Output space | Bounded and typed | Open-ended |
| Typical output | Choice, expected score, probability | Text, code, JSON, reasoning prose |
| Generation path | Decision-native, no string generation | Autoregressive decoding |
| Schema reliability | Native typed response | Structured-output constraints on top of generation |
| Confidence | First-class probability fields | Generated confidence statements are generally not calibrated |
| Reasoning and synthesis | Bounded | Strongest fit |
| Writing and coding | Not the purpose | Strongest fit |
| Small repeated routing decisions | Excellent fit | Works, often wasteful |

---

## Decision Model vs Traditional ML Classifier

This is the more subtle comparison, because both ultimately map inputs to probabilities over outcomes. The key difference is **task flexibility**.

Traditional task-specific classifier:

```
historical tickets + labels
  ↓
train / fine-tune
  ↓
"ticket → support_team" model

New taxonomy or task?
→ collect labels + retrain
```

General decision model:

```
pretrained Jev
  ↓
Runtime question: "Which support team?"
  ↓
Later: "How urgent?"
  ↓
Later: "Which AI agent?"
```

| Dimension | Decision Model / Jev | Traditional Classifier |
|-----------|----------------------|------------------------|
| Per-task training | Usually not required initially | Usually required |
| Label taxonomy | Defined at inference time | Fixed during training |
| New decision task | Change instructions or criteria | Train or fine-tune a new model or head |
| Semantic generality | High zero-shot flexibility | Depends on training data |
| Latency ceiling | Very fast for a hosted semantic model | Can be much faster locally |
| Marginal cost | API usage cost | Near zero after self-hosting |
| Data ownership | Hosted-service considerations | Fully self-hostable |
| Best case | Many changing decisions, little labeled data | Stable, high-volume task with abundant labels |

Sebastian Raschka makes the same practical point in his article on text classification from bag-of-words to Jev: Jev is compelling because it is **much more general** than a special-purpose classifier, not because it must beat a well-trained narrow classifier on that classifier's own fixed task.

---

## Confidence, Calibration, and "Hallucination"

**Calibration is operationally valuable**

The real power of a probability output is **selective automation**: act automatically when the model is confident, and escalate or abstain otherwise.

```python
if p_violation >= 0.99:
    deny_request()
elif p_violation >= 0.80:
    send_to_human_review()
else:
    continue_workflow()
```

This only works if the probabilities are **calibrated**. For a well-calibrated model, predictions made at around 80% confidence should be correct roughly 80% of the time across a suitable population. Note that calibration is a population-level property; it does not guarantee that any single 0.80 prediction has exactly an 80% chance of being right.

The independent evaluation reports two notable results:

- **ECE 0.028** for Choice questions across 279,925 predictions. ECE (Expected Calibration Error) measures the gap between predicted confidence and actual accuracy; lower is better, and 0.028 is strong.
- **Threshold tuning matters.** On the UNFAIR-ToS legal dataset, tuning the Noul threshold on training data improved micro-F1 from **0.50 to 0.75** compared with a fixed 0.5 threshold.

**"Zero hallucinations" needs a precise interpretation**

Decision models are sometimes marketed as "hallucination-free". It is more accurate to look at which failure modes are actually removed:

| Failure type | Effect of bounded typed output |
|--------------|-------------------------------|
| Invalid schema or malformed prose | Largely eliminated by the API contract |
| Inventing an out-of-taxonomy category | Eliminated for Choice, since options are explicit |
| Unexpected essay or refusal instead of a label | Eliminated as an output mode |
| Choosing the wrong valid category | Still possible |
| Misunderstanding context | Still possible |
| Overconfident probability under domain shift | Still possible |

A better engineering phrase: a decision model is **schema-safe and output-bounded; it is not truth-safe**.

---

## Where Decision Models Are Useful

Decision models fit anywhere software needs a fast, fuzzy, semantic judgment with a bounded answer:

- **Agent routing** — select among network, cloud, security, coding, or research agents based on a user request (`request → Jev → best agent`)
- **Model routing** — choose a cheap fast model or a stronger reasoning model based on task difficulty and risk (`request → difficulty → model`)
- **Tool selection** — filter a large tool catalog before passing a small relevant subset to an LLM (`80 tools → Jev → top 3`). This connects directly to context engineering: fewer, more relevant tools in context
- **RAG relevance** — score retrieved chunks before including them in the expensive generation context (`50 docs → score → top 8`)
- **Security and policy gateway** — classify sensitive intent, risk, prompt injection, or data type, while deterministic code keeps final authority
- **Incident triage** — estimate severity, blast radius, containment need, or human escalation
- **Customer support** — intent, urgency, churn risk, sentiment, fraud concern, and queue selection
- **Document workflows** — use code for exact arithmetic and IDs, and a decision model for fuzzy checks like consistency or plausibility
- **LLM output verifier** — judge grounding, policy adherence, sensitive-data leakage, tool appropriateness, or quality rubrics

![pic 6](/images/decision-model-6.jpg "pic 6")

**A production case: candidate screening**

On October 7, 2026, TypeSafe published a case study in which Jack & Jill replaced Gemini 3.1 Flash Lite with Jev for a candidate-screening stage. They report similar accuracy, roughly **50% faster** task completion, and **88% lower cost**. This is a vendor/customer case study, not an independent benchmark, but it shows the typical pattern: a small, high-volume decision that was previously done by a "cheap" LLM.

---

## Recommended Architecture: Layered Decisions

The strongest pattern is not "AI decides everything". It is a layered architecture where each component handles the kind of uncertainty it is best at:

| Layer | Responsibility |
|-------|----------------|
| **LLM** | Complex reasoning, synthesis, natural-language and code generation |
| **Decision model** | Fast fuzzy semantic judgments: classify, route, score, gate, rank, verify |
| **Deterministic code** | Facts, arithmetic, exact policy, schema validation, authorization, side effects |
| **Human review** | Low-confidence, high-impact, irreversible, novel, or regulated decisions |

The design rule: **let the model supply probabilistic semantic judgments; let deterministic policy own irreversible authority.**

Here is an example of a security access-policy gateway following this rule:

```
identity + request + resource + context
                 │
                 ▼
        deterministic checks
                 │
                 ▼
        semantic questions
       ┌─────────┼──────────────┐
       │         │              │
  sensitive?   risky?   prompt injection?
       │         │              │
       └─────────┼──────────────┘
                 ▼
         probability vector
                 │
                 ▼
     deterministic policy engine
       │         │         │
     allow     review     deny
```

The decision model never directly grants or denies access. It produces a probability vector, and a deterministic, auditable policy engine turns that vector into an action.

![pic 3](/images/decision-model-3.jpg "pic 3")

---

## API Implementation Pattern

The Jev endpoint is `POST https://api.typesafe.ai/v1/systemone`, and available models are listed at `GET /v1/models`. Below is a support-ticket example that mixes all three question types in one request:

```python
import os
import requests

API_KEY = os.environ["TYPESAFE_API_KEY"]

payload = {
    "model": "jev-latest",
    "state": {
        "ticket": "Production is unavailable for three hours.",
        "customer_tier": "enterprise",
        "region": "us-west"
    },
    "questions": {
        "category": {
            "type": "choice",
            "instructions": "Classify the support request.",
            "criteria": {
                "billing": "Payment or invoice issue",
                "availability": "Service outage",
                "performance": "Performance degradation",
                "configuration": "Configuration question"
            }
        },
        "severity": {
            "type": "score",
            "instructions": "Rate incident severity.",
            "criteria": [
                "Informational",
                "Minor impact",
                "Moderate impact",
                "Major production impact",
                "Critical business outage"
            ]
        },
        "human_escalation": {
            "type": "noul",
            "instructions": "Should this be escalated immediately to a human incident manager?"
        }
    }
}

r = requests.post(
    "https://api.typesafe.ai/v1/systemone",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    },
    json=payload,
    timeout=10
)
r.raise_for_status()
result = r.json()

p_escalate = result["answers"]["human_escalation"]["noul"]

if p_escalate >= 0.95:
    escalate_immediately()
elif p_escalate >= 0.70:
    queue_for_human_review()
else:
    continue_standard_workflow()
```

Note how the `criteria` field changes meaning with the question type: a dictionary of labeled options for Choice, an ordered list of rubric levels for Score, and nothing at all for Noul.

**Production evaluation loop**

Before putting a decision model in production, evaluate it on your own data:

1. Collect historical labeled examples for each decision
2. Run decision model predictions on them
3. Measure per decision:
   - precision, recall, and F1
   - the business cost of false positives vs false negatives
   - Brier score, calibration curve, and ECE
   - latency and cost
4. Choose thresholds based on the real loss function
5. Split traffic into automate, abstain, and human-review
6. Monitor drift and periodically recalibrate

Do not assume 0.5 is the right threshold. The UNFAIR-ToS result above shows how much a tuned threshold can matter.

---

## Limitations and Anti-Use-Cases

**Use something else when:**

- You need generated text, code, translation, or summarization → use an **LLM**
- Exact deterministic rules can answer the question → use **code**
- You already have a stable, high-performing local classifier → **keep it**, unless flexibility brings real value
- The decision is irreversible or regulated → use **deterministic safeguards and human review**

**Weaknesses found in the independent study:**

- Performance degraded on lower-resource languages
- Fine-grained or noisy label taxonomies were harder
- Legal-clause tasks and rubric-based quality judgments were weaker areas
- Noul thresholds could be poorly positioned around a generic 0.5 cutoff

**Benchmark caution:** Jev is proprietary and its training corpus is not public. The evaluation found unusually strong results on some calculation-heavy MMLU questions. The authors ruled out some shallow artifacts but could not rule out exposure to memorized question/answer content.

---

## The Current Decision Model Landscape

The category has grown quickly since Jev's launch. Between October 1 and 9 alone, Perplexity, Liquid AI, OpenAI, and Microsoft each shipped decision-model products. Projects now share a common product idea, bounded semantic decisions with probabilities, while implementing it with very different model families. "Decision model" is becoming an **interface and systems category** more than a single architecture. The emerging convention is:

```
state + typed questions + allowed outcomes → probabilities
```

exposed through a small number of compatible APIs, most commonly the Jev/System One-style `/v1/systemone` endpoint, with OpenAI's `/v1/decisions` as a second dialect.

![pic 4](/images/decision-model-4.jpg "pic 4")

**Four architectural families**

**A. Encoder-native, non-generative models**

```
state + questions → bidirectional encoder → classification / schema head
```

These score labels directly in one forward pass. They are the smallest and most CPU-friendly members of the landscape, a good fit for high-volume classification, support routing, and on-prem or air-gapped workloads. Examples: **GLiNER2.5-Decide**, **Laya**, and Liquid AI's experimental **d1-omni-600M** (encoder-based, with vision and audio encoders).

**B. Foundation model + dedicated decision head**

```
state + questions → large pretrained backbone → joint schema / decision head
```

A large backbone supplies broad semantic and world knowledge, and a separate head scores only the permitted options instead of generating prose. This brings long context and multimodal potential. Examples: Cloudflare **Clef**, **Clef-Flash**, **Clef-Omni**, **Microsoft-Decision-1**, Perplexity **pplx-decider-v1.1-27b**, and Liquid AI **d1-3B**. The last three are placed here by backbone, since their head designs are not equally documented.

**C. Contrastive state/action models**

```
state encoder + action encoder → embeddings (cached candidates) → similarity → rank / probability
```

State and candidate actions are embedded separately, and decisions come from similarity scores. Since candidate embeddings can be cached, this is a natural fit for recurring tools, actions, and agent routes. Example: **CLM-8B**.

**D. Adaptive reasoning decision models**

```
fast decision pass → uncertainty / difficulty gate → extra compute → typed decision
```

These keep a typed decision interface but spend additional compute when the first pass is uncertain. They blur the line between fast System 1 classification and deeper System 2 reasoning. Example: Fastino **GLiDE**.

**Adjacent: constrained generative classifiers**

Together's **Tev1-4B** is Jev-inspired but keeps an ordinary autoregressive language-model output head to emit a choice token. It is useful and easy to reproduce with existing LLM tooling, but architecturally it is still a generative model, so I do not count it as a fifth core family.

**Hosted, placement not public**

Some products expose a typed decision API but do not disclose enough about the model to place it in a family: TypeSafe **Jev**, OpenAI **GPT-6 Luna Decisions**, and Liquid AI's hosted **d1**. Treat them as black-box decision services and evaluate them on behavior.

**Notable implementations**

| Model | Organization | Architecture / Scale | Modalities | Deployment | Best-fit role |
|-------|--------------|----------------------|------------|------------|---------------|
| Jev | TypeSafe AI | Proprietary; topology and size undisclosed | Structured state / text | Hosted API | Reference commercial implementation; calibrated typed decisions |
| Clef | Cloudflare | Qwen3.8-27B backbone + joint schema head | Text, JSON, image, video | Apache 2.0; Workers AI or self-hosted | High-capability general decision model |
| Clef-Flash | Cloudflare | Qwen3.5-9B backbone + joint schema head | Text, JSON, image, video | Apache 2.0; Workers AI or self-hosted | Low-latency routing, classification, guardrails |
| Clef-Omni | Cloudflare | Qwen3-Omni 30B-A3B MoE + joint schema head (~3B active) | Text, JSON, image, audio, video | Apache 2.0; Workers AI or self-hosted | Multimodal decisions without separate transcription/vision chains |
| GLiNER2.5-Decide | Fastino | ~340M schema-aware encoder, constrained decoding | Text | Apache 2.0; local CPU/GPU or API | Small, private, air-gapped classification |
| Laya | ConvAI Innovations | 421M ModernBERT (multilingual variant on mmBERT) | Text / JSON-like state | Apache 2.0; self-hosted | Compact non-autoregressive decisions, multilingual routing |
| CLM-8B | Contrastive-LM | Frozen Qwen3-8B encoders + ~20M projection heads | Primarily text | Apache 2.0; self-hosted | Agent routing, tool selection, ranking, best-of-N verification |
| GLiDE | Fastino | Adaptive "thinking decision model"; not publicly detailed | Structured / text | Hosted API | Harder multi-hop choices, large action spaces |
| Tev1-4B | Together | Qwen3.5-4B + LoRA/SFT, ordinary LM head | Text | Open recipe / checkpoint | Reproduction and custom fine-tuning |
| GPT-6 Luna Decisions | OpenAI | Built on gpt-6-luna; architecture undisclosed. `predicate` / `choice` / `score` questions with probability and confidence fields | Text, images | Hosted `/v1/decisions` API; $0.10 / M input tokens | Frontier-lab hosted comparator for Jev (released Oct 6) |
| Microsoft-Decision-1 | Microsoft | Qwen3.5-9B post-trained for single-pass decision scoring; head design not detailed | Text only; ~32K context (reported) | Hosted (Microsoft Foundry, OpenRouter); weights not distributed | Managed routing, gating, prioritization, rubric scoring (released Oct 8–9); Microsoft excludes sole-model use for consequential decisions about people |
| d1 / d1-3B / d1-omni-600M | Liquid AI | Hosted d1 undisclosed; d1-3B ~3.1B on LFM2.5-VL-3B; d1-omni-600M (experimental) on LFM2.5-Encoder-350M + vision/audio encoders | d1-3B: text, images. d1-omni-600M: text with images or audio | Hosted d1; open weights for d1-3B and d1-omni-600M under LFM Open License v1.0 (not Apache 2.0) | Edge and on-device multimodal decisions |
| pplx-decider-v1.1-27b | Perplexity | Qwen3.8-27B with LM head replaced by a 255-answer-code readout; noncausal attention in v1.1 | Text, JSON, images | Apache 2.0; Perplexity API, OpenRouter, or self-hosted on SGLang via `/v1/systemone` | Wide option sets (choice up to 255, score up to 10 levels) |

**Tradeoffs by family**

| Family | Main advantage | Main tradeoff | Where to test it first |
|--------|----------------|---------------|------------------------|
| Encoder-native | Smallest footprint, one pass, CPU/on-prem | Less world knowledge; shorter context | Support routing, moderation, private workflows |
| Foundation + head | Broad pretrained semantics without generation | Large GPU footprint when self-hosted | Agent routing, multimodal policy, complex classification |
| Contrastive | Cached candidate embeddings; natural ranking | Probabilities are relative to the candidate set | Tool selection, next action, rerankers |
| Adaptive reasoning | Extra compute only when needed | Less predictable latency and cost; more proprietary | High-stakes or multi-hop bounded choices |
| Constrained generative | Easy to build from existing LLM stacks | Still autoregressive | Experiments, custom fine-tuning |

**Ecosystem signals**

- **API convergence** — Cloudflare Clef and CLM expose Jev/System One-compatible request shapes, which lowers the switching cost between providers.
- **Local runtime support** — llama.cpp added a `/v1/systemone` endpoint for supported decision models in October 2026, a sign the interface is moving beyond a single vendor.
- **Multimodality** — Clef-Omni makes decisions directly on text, image, audio, and video, so "decision model" no longer means only text classification.
- **Frontier labs and platforms enter** — OpenAI's Decisions API (Oct 6) and Microsoft-Decision-1 (Oct 8–9) arrived within days of each other, alongside Perplexity and Liquid AI.
- **Two request dialects, one vocabulary** — Jev and Perplexity use `noul` / `choice` / `score` (and `/v1/systemone` on SGLang), while OpenAI uses `predicate` / `choice` / `score` on `/v1/decisions`. Gateways such as Vercel AI Gateway already serve both Jev and OpenAI decision models.
- **Edge and on-device decisions** — Liquid AI's d1-3B and d1-omni-600M target edge hardware, with a vendor-reported ~8 ms per short question on an RTX 4090 and 16–50 ms on NVIDIA Jetson devices.

**A practical benchmark set for enterprise evaluation**

Rather than picking a winner from vendor benchmarks, compare models on the same private workload and thresholds. A useful baseline, with optional additions for the October entrants:

```
Jev               → hosted proprietary reference
Clef-Flash        → open-weight general decision model
GLiNER2.5-Decide  → compact local / CPU-friendly baseline
CLM-8B            → agent/action-ranking specialist
GLiDE (optional)  → harder decisions that may benefit from adaptive reasoning
```

Optional additions:

```
Microsoft-Decision-1  → head-to-head with Clef-Flash (both Qwen3.5-9B-based)
pplx-decider-v1.1-27b → head-to-head with Clef (both Qwen3.8-27B-based); wide option sets up to 255
d1-3B / d1-omni-600M  → edge and multimodal tier, beside GLiNER2.5-Decide and Laya
GPT-6 Luna Decisions  → frontier-lab hosted comparator against Jev
```

Vendors such as Liquid AI and Perplexity publish their own "Decision Index" scores on vendor-chosen comparison sets, so those numbers are a reason to test, not a ranking.

Measure task accuracy, per-class precision/recall, calibration and Brier score, abstention quality, p50/p95 latency, throughput, infrastructure cost, context limits, privacy requirements, and behavior under taxonomy changes. For routing or authorization, evaluate the full application loss function, not model accuracy alone.

---

## Which Technology Should You Choose?

A simple rule is to choose the simplest technology that fits the task, by asking four questions in order:

1. **Do you need to generate text or code?** → **Generative LLM** (reasoning, authoring, summarization, coding)
2. **Can deterministic rules decide it?** → **Code / rules** (most reliable, cheapest, easiest to audit)
3. **Is it a stable task with lots of labeled data?** → **Traditional ML classifier** (specialized, high-throughput prediction)
4. **Is the answer bounded (choice, score, yes/no, route, rank)?** → **Decision model** (zero-shot semantic decisions without generation)

If the answer to question 4 is no, the output is open-ended, and you are back to an LLM.

![pic 5](/images/decision-model-5.jpg "pic 5")

| | Traditional ML | Decision Model | LLM |
|---|---|---|---|
| Task flexibility | Low | High | Very high |
| Task-specific training | Usually yes | No, initially | No |
| Output | Label / probability | Typed decision / probability | Generated tokens |
| Generation | No | No | Yes |
| Typical raw latency | Lowest | Very low for semantic decisions | Higher |
| Best role | Stable specialized predictor | Software decision layer | Reasoner / author |

---

## Summary

Decision models fill a gap that has existed since LLMs became the default tool for everything: the many small, semantic, bounded decisions inside software that do not need generation at all.

Key takeaways:

- A decision model maps **state + question + allowed outcomes** to **probabilities**, instead of generating text.
- Its value comes from combining **LLM-like zero-shot flexibility** with **classifier-like bounded outputs**, usable probabilities, and much lower inference cost.
- It is **schema-safe, not truth-safe**: it cannot invent a label, but it can still pick the wrong one.
- **Calibration and threshold tuning** are what turn probabilities into reliable selective automation.
- The best architecture is **layered**: LLMs reason and write, decision models judge, deterministic code holds authority, and humans handle the uncertain and irreversible.
- Jev started the category, but it is now one member of a fast-forming **ecosystem**, reinforced by October entries from OpenAI, Microsoft, Liquid AI, and Perplexity. The interface (`/v1/systemone`, plus OpenAI's `/v1/decisions`) spans encoder-native, foundation-plus-head, contrastive, and adaptive-reasoning designs.

This space is very new and moving fast. Vendor benchmarks are a starting point, but always re-benchmark candidate models on your own workloads before adopting them in production.

## References

- [TypeSafe AI — Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe API — OpenAPI / ReDoc](https://api.typesafe.ai/redoc)
- [Deußer, Sparrenberg & Sifa — Evaluating and Benchmarking Jev (arXiv:2609.37647)](https://arxiv.org/abs/2609.37647)
- [Sebastian Raschka — Language Models for Text Classification: From Bag-of-Words to Jev](https://magazine.sebastianraschka.com)
- [TypeSafe AI — Jack & Jill & Jev case study](https://typesafe.ai/blog/jack-jill-jev-case-study)
- [Cloudflare — Introducing Clef](https://blog.cloudflare.com/clef-decision-models)
- [Cloudflare — Clef model card](https://huggingface.co/Cloudflare/clef)
- [Fastino — GLiNER2.5-Decide and GLiDE](https://fastino.ai)
- [Laya — Hugging Face model card](https://huggingface.co/convaiinnovations/laya)
- [Contrastive-LM — CLM](https://github.com/Contrastive-LM/CLM)
- [Together Computer — Tev1](https://github.com/togethercomputer/tev1)
- [llama.cpp / GGML — Decision Models in llama.cpp](https://huggingface.co/blog/ggml-org/decision-models-in-llamacpp)
- [OpenAI Developers — Decisions API guide](https://developers.openai.com/api/docs/guides/decisions)
- [Microsoft-Decision-1 — secondary summary](https://www.productbuilder.net/models/microsoft-decision-1)
- [Liquid AI — d1-3B model card](https://huggingface.co/LiquidAI/d1-3b)
- [Perplexity pplx-decider-v1.1-27b — SGLang cookbook (secondary)](https://docs.sglang.io/cookbook/autoregressive/Perplexity/PPLX-Decider-v1.1-27B)
