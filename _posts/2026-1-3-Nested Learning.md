---
layout: post
title: Nested Learning - LLM Continual Learning
categories: AI
---

In my previous blog post [AGI-is-real-or-hype](https://zuwuliao.github.io/AGI-is-real-or-hype/), I questioned LLM may not lead us to AGI, partly because they lack the ability to learn continuously like humans do. Interestingly, in December 2025, Google released a paper ["Nested Learning: The Illusion of Deep Learning Arch"](https://arxiv.org/abs/2512.24695). The paper introduces the concept of nested learning, which aims to address one of the key limitations of LLMs: the inability to learn and adapt over time. Let’s explore how Nested Learning (NL) could enable LLMs to develop continuous learning capabilities.

**Executive Summary**

Nested Learning (NL) redefines the architecture of large language models by introducing learning mechanisms that operate across multiple timescales, enabling models to continue learning during inference instead of remaining static after training. It replaces the Transformer’s single feed-forward (MLP) block with the Continuum Memory System (CMS), a hierarchy of memory modules that update at different frequencies and store knowledge at varying persistence levels. NL also embeds optimizer-like update rules directly inside the model’s architecture, transforming optimizers from external training algorithms into internal learning components that run during inference. Finally, NL incorporates self-modifying modules—such as Titans and Hope—that learn how to update their own internal states and learning rules, forming a recursive learning structure that allows models to adapt dynamically. Together, these innovations give NL the ability to perform continual learning, stabilize long-term memory, and improve reasoning across long contexts.

**Innovation 1: Continuum Memory System (CMS)**

The first major innovation in Nested Learning is the Continuum Memory System (CMS), which replaces the Transformer’s traditional single MLP block with a hierarchy of memory modules that operate at different update frequencies. Instead of a static feed-forward layer that never changes during inference, CMS introduces fast, mid, and slow memory components that learn and update at different timescales. Fast memory captures moment-to-moment information, mid-memory consolidates patterns across short sequences or tasks, and slow-memory absorbs only stable, repeated signals that are safe to store as long-term knowledge. This structure enables NL to perform continual learning during inference while preserving stability and preventing catastrophic forgetting.

![pic 1](/images/NL-1.jpg "pic 1")

To visualize this, imagine CMS as a system of interconnected gears: the small gear (fast memory) spins rapidly and reacts to every input, the medium gear (mid-memory) turns more slowly as consistent patterns emerge, and the large gear (slow memory) moves only when strong, repeated signals push through—storing durable long-term knowledge. This “gear train” captures exactly how CMS filters, stabilizes, and transfers information across memory levels.

![pic 2](/images/NL-2.gif "pic 2")

**Innovation 2: Optimizer-as-Architecture**

In standard deep learning, the optimizer (e.g., Adam or SGD) is an external process used only during training. NL transforms this paradigm by embedding optimizer-like update logic inside the model architecture, allowing learning to occur during inference. Gradient-like signals, delta-rule updates, momentum-style accumulators, or learned update rules operate internally at different timescales across CMS levels. Fast levels learn rapidly but transiently; slow levels apply consolidation rules similar to low-frequency optimization steps. This integration means the model is no longer a static function with frozen parameters—it becomes a continual learner that actively updates its internal memories and selected parameters as it processes new data. NL effectively merges the responsibilities of the architecture and optimizer, making learning an intrinsic part of the model’s forward pass rather than an external training loop.

**Innovation 3: Hope Architecture and the Titan Self-Modifying Module**

The third major innovation in Nested Learning is the introduction of Hope, the first full model architecture that operationalizes NL’s multi-timescale learning principles. Hope integrates the Continuum Memory System (CMS) with a self-modifying sequence module called Titan, which serves as the fast-learning engine of the architecture. Titan dynamically generates its own update rules, modifies internal states during inference, and acts as a meta-learner that governs how information flows into CMS. CMS then applies multi-frequency consolidation across fast, mid, and slow memory levels, enabling stable long-term knowledge retention. Together, Titan and CMS form the Hope architecture, a unified system capable of rapid adaptation, continual learning, and self-directed updates that go far beyond the fixed and stateless computation patterns of conventional Transformers.

The Hope Archietcture:

<div style="text-align: center;">
<pre style="display: inline-block; text-align: left;">
┌───────────────────────────────────────────┐
│                 INPUT                     │
└───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│                   TITAN MODULE                           │
│  (Self-Modifying Fast Learner / Meta-Optimizer)          │
│                                                          │
│  • Learns update rules dynamically                       │
│  • Generates fast-memory updates                         │
│  • Controls information passed to CMS                    │
└──────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────---───┐
│       CONTINUUM MEMORY SYSTEM (CMS)                                       │
│  Multi-Timescale Memory Implemented Using Multiple MLPs                   │
│                                                                           │
│   ┌──────────────────────────┬────────────────────────────┬───────-────┐  │
│   │   FAST MEMORY LEVEL      │    MID MEMORY LEVEL        │ SLOW MEMORY│  |
│   │   (updates every token)  │ (updates per episode/task) │  (updates  │  |
│   │                          │                            │ infrequently) │
│   ├──────────────────────────┼────────────────────────────┼──────────-─┤  │
│   │ • Highly plastic         │ • Consolidates patterns    │ • Stores   │  │
│   │ • Short-term state       │   across contexts          │   long-term│  │
│   │ • Works with Titan       │ • Filters noise            │   knowledge│  │
│   │                          │                            │ • Weight   │  │
│   │                          │                            │   updates  │  │
│   └──────────────────────────┴────────────────────────────┴────────-───┘  │
└─────────────────────────────────────────────────────────────────────---───┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│             CONSOLIDATION & UPDATE LOGIC                │
│   • Determines what information enters slow memory      │
│   • Prevents catastrophic forgetting                    │
│   • Ensures stable long-term storage                    │
└─────────────────────────────────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────┐
│                 OUTPUT                    │
└───────────────────────────────────────────┘

</pre>
</div>

**Challenges**

Based on the above innovations, LLMs can update the knowledge overtime during the inference. But challenges remain in achieving true human-like continual learning. I want to raise a key questions:**How does the model determine whether an input represents reliable knowledge worth remembering?** Humans rely on reasoning, grounding, intuition, and meta-cognition to evaluate the truthfulness or trustworthiness of new information; NL, by contrast, predominantly uses statistical consistency across fast, mid, and slow memory levels. As a result, the model is skilled at filtering out noisy or inconsistent information, but it cannot perform truth evaluation or semantic judgment in the human sense.

This limitation introduces a new and important challenge. That is the **risk of exploiting continual learning mechanisms to inject malicious or incorrect information** into the model’s memory. Since NL updates knowledge during inference without a built-in mechanism for truth verification, it relies on statistical consistency rather than semantic judgment. This opens the door for adversaries to repeatedly present coherent but false inputs that may eventually be consolidated into long-term memory. While CMS’s multi-timescale design helps filter out noise, it does not fully prevent slow, targeted poisoning—highlighting the need for additional safeguards in real-world deployments.

Another related challenge concerns **the nature and speed of updating slow memory**, which corresponds to long-term knowledge in the NL framework. In humans, once we determine that new information is correct—especially if it clearly contradicts an old belief—we can replace the outdated knowledge immediately. CMS, however, updates slow memory only after a long chain of reinforcement: many fast-memory updates must align, several mid-memory consolidations must agree, and the information must persist through multiple stability checks. This cautiousness protects the system from being poisoned by malicious or accidental misinformation, but it also means NL cannot instantly overwrite old beliefs the way humans can. Ultimately, this results in a slower, safer—but less flexible—form of continual learning.

**Summary**

Nested Learning successfully addresses one of the fundamental limitations of today’s large language models: their knowledge is static and fixed at training time. By introducing CMS, embedding optimizer-like updates into the architecture, and developing the Hope architecture with self-modifying Titan modules, NL transforms the model into a system capable of updating its internal knowledge during inference. This is a major conceptual leap beyond the Transformer paradigm.

However, NL is not yet equivalent to human continual learning. It lacks mechanisms for explicit truth evaluation, rapid belief revision, and semantic reasoning-based memory updates. While NL introduces multi-timescale learning and stable consolidation, its slow-memory mechanisms behave more like biological synaptic consolidation than human cognitive updating. Therefore, while NL represents significant progress toward making LLMs adaptive and dynamic, there is still a substantial journey ahead before models can match the richness, safety, flexibility, and immediacy of human continual learning.