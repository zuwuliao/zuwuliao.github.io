---
layout: post
title: Representation Learning and Buddhist Philosophy
categories: AI
---

When studying AI and neural networks, I noticed that each layer’s abstraction represents certain characteristics of an object. For example,in image classification, early layers detect edges while deeper layers capture more complex features. These features may not be directly visible, but they are still present in the model’s internal representation.

In Buddhism, there is a similar concept known as the “doctrine of mere representation.” This parallel caught my attention. Interestingly, in a recent interview with Xie Saining, he also mentioned that He Kaiming encouraged researchers to read the Diamond Sutra before conducting their work.

This raised a question for me: is there a deeper relationship between ancient Buddhist philosophy and modern AI technology? With this in mind, I conducted some research, and here is what I found.

<div style="margin: 1.5rem 0;">
  <a href="{{ site.baseurl }}/Representation-Learning-and-Buddhist-Philosophy-CN/"
     style="display: inline-block; padding: 0.6rem 1.1rem; background: #b91c1c; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.95rem;">
    阅读中文版报告 / Read the Chinese Version
  </a>
</div>

**The intuition that machine learning's representation learning and Buddhist philosophy share deep structural ground is not a stretched metaphor — it is substantive. The Yogācāra school, founded in the 4th–5th centuries CE, formulated a theory of mind whose core moves — that perception is constructed, that meaning is relational, that there is no fixed self — line up so cleanly with how modern neural networks encode the world that scholars have begun formalizing the connections.**

*Based on a research report compiled April 25, 2026, drawing from the Stanford Encyclopedia of Philosophy, Encyclopedia of Buddhism, Britannica, and recent academic work on contemplative AI from arXiv, MDPI, and CIIS Digital Commons.*

---

## 1. Why This Comparison Is Not a Stretch

A neural network never "sees" the world. It sees its own learned representations of the world — vectors in a latent space, indexed by weights tuned through gradient descent. This is the foundational claim of the field of representation learning: that intelligent systems do not access reality directly, but operate on internally constructed encodings.

It is also, almost word-for-word, the foundational claim of one of the most sophisticated schools of Buddhist philosophy. The Sanskrit name of Yogācāra — *Vijñaptimātratā-vāda* — translates as "the doctrine of mere representation." The term *vijñapti* means, precisely, "representation" or "percept."

What follows is not a poetic gesture. It is a structural mapping between two systems of thought, separated by sixteen centuries, that arrived at strikingly similar models of mind: one through introspective meditative practice, the other through the mathematics of high-dimensional optimization. The parallels are deepest where they matter most — how representations are formed, how they carry meaning, and what kind of "self" emerges when intelligence is built from distributed processes.

## 2. What Is Representation Learning?

Representation learning is the subfield of machine learning concerned with automatically discovering useful abstractions of data. Rather than hand-engineering features — telling a model in advance that an image's edges, corners, or color histograms matter — representation learning lets the model learn for itself how to encode raw inputs into internal forms suited to downstream tasks.

**2.1 Core Concepts**

The vocabulary of the field is built around a few central ideas:

- **Latent spaces** — compressed, lower-dimensional encodings of high-dimensional inputs. A 224×224 RGB image lives in a space of 150,528 numbers; its latent encoding may live in 512.
- **Embeddings** — dense vector representations that place semantically related items near each other geometrically. Word2vec, GloVe, and the attention-derived embeddings inside transformers all instantiate this idea.
- **Disentangled representations** — encodings in which independent factors of variation (e.g., shape, color, pose) are separated into distinct directions of the latent space.
- **Autoencoders and VAEs** — models trained to compress experience into a latent code and then reconstruct it. The latent code is what the model has decided is essential about the input.

**2.2 The Field's Foundational Claim**

The unifying premise of representation learning is this: the world has structure, that structure can be learned, and what gets learned is **not the world but a constructed model of the world inside the system**. Every classifier, generator, agent, and language model operates on these internal constructions. They are the substrate of artificial cognition.

This is the seam where Buddhist philosophy enters with surprising precision.

## 3. The Buddhist Concepts That Map Onto Machine Learning

Buddhist thought is not a single doctrine but a family of schools developed over more than two millennia. Five concepts — drawn primarily from Yogācāra and Madhyamaka — are directly relevant to representation learning.

**3.1 Yogācāra / Vijñaptimātratā (4th–5th century CE)**

The Buddhist school most directly aligned with representation learning. Founded by the brothers Asaṅga and Vasubandhu, Yogācāra holds that **all apparently external phenomena are not independently existing objects, but representations (*vijñapti*) appearing in consciousness (*vijñāna*)**. Objects exist for a cognizing mind only as constructed images. The school is sometimes translated as "Mind-Only" or "Consciousness-Only," though both are oversimplifications — the position is closer to "everything we have access to is representation."

**3.2 Ālaya-vijñāna — Store Consciousness**

Yogācāra posits a foundational layer of mind called the *ālaya-vijñāna*, or "storehouse consciousness." It contains *bīja* — seeds — which are compressed informational potentials laid down by past experience and karmic action. These seeds generate future perceptions, thoughts, and actions when conditions ripen them. The store consciousness is the deepest of the eight consciousnesses recognized in Yogācāra, the base layer from which the other forms of cognition arise.

**3.3 Śūnyatā — Emptiness**

Developed most rigorously by Nāgārjuna's Madhyamaka school in the 2nd century CE, *śūnyatā* is the doctrine that things have no intrinsic essence. Nothing has a fixed, independent, self-contained nature. Phenomena exist only relationally, through their dependence on other phenomena. Emptiness is not nihilism — it is the claim that **identity is constituted by relationship, not by inherent substance**.

**3.4 Pratītyasamutpāda — Dependent Origination**

The principle that everything arises in dependence on causes and conditions. No phenomenon is self-arising or self-sufficient; each is constituted by its position in a web of causal interdependence. The classical formulation is "this being, that becomes; from the arising of this, that arises." Pratītyasamutpāda is the dynamic, causal counterpart to śūnyatā's structural claim about relational existence.

**3.5 Anattā — No-Self**

The teaching that there is no fixed, unchanging self at the core of a person — only processes, patterns, and relational activity arising and passing. What appears as a unified "self" is a momentary construction with no essential core. Anattā does not deny that there is *experience*; it denies that there is a single, persistent *experiencer* underneath the experience.

## 4. The Four Core Parallels

Five Buddhist concepts, four core structural parallels with representation learning. The mapping is not loose — it is concept-to-concept and, in two cases, mathematically demonstrable.

| Buddhist Concept | Parallel in Representation Learning |
|------------------|--------------------------------------|
| **Vijñaptimātratā** — "mere representation" | The field's foundational claim mirrors Yogācāra exactly: all perceived objects are representations constructed by the mind/model, not directly accessed realities. A neural network never "sees" the world — it sees its own learned representations of the world. |
| **Ālaya-vijñāna** — store consciousness with seeds | The storehouse of compressed seeds that generate all future experience maps onto a latent space in a VAE: a compressed representation encoding the essential structure of experience, from which full outputs can be reconstructed. Seeds ≈ learned features. |
| **Śūnyatā** — emptiness, relational existence | Things have no intrinsic essence; meaning is purely relational. In word embeddings and transformers, representations derive their meaning entirely from geometric relationships with other representations. A word vector has no intrinsic meaning — only relational meaning. *King − Man + Woman ≈ Queen* is pure śūnyatā in mathematics. |
| **Pratītyasamutpāda** — dependent origination | Everything arises through causal conditions — nothing is self-arising. Neural network representations are literally computed as a function of their causal dependencies. Every node's activation is entirely determined by its upstream connections. The architecture of a deep network is a directed acyclic graph of dependent origination. |
| **Anattā** — no-self, distributed process | There is no fixed, singular self — only distributed processes and patterns. In neural networks, no single node "is" a concept. Features are spread across many neurons; a neuron participates in many features. No fixed essence, only relational activity — anattā in silicon. |

**4.1 Vijñaptimātratā and the End of Naive Realism**

Both representation learning and Yogācāra reject naive realism — the view that perception delivers the world directly. For Yogācāra, this rejection is the entry point to its entire system: what we take to be "the world out there" is, on closer inspection, a stream of constructed appearances within consciousness. For representation learning, the rejection is structural: every operation a neural network performs is on its own internal encodings, not on raw reality. The pixel array that enters the input layer is itself already a representation produced by a sensor; what the network learns is a re-representation of that input, optimized for some loss.

The agreement is not that reality is unreal — Yogācāra is not solipsism, and representation learning is not idealism. The agreement is that **the cognizing system has access only to its own representations**, and that any inference about the world is mediated by them.

**4.2 Ālaya-vijñāna and the Latent Space**

The store consciousness contains *seeds* — compressed informational patterns deposited by prior experience, capable of generating future cognition when conditions ripen them. A variational autoencoder's latent space contains *learned features* — compressed encodings of the training distribution, capable of generating outputs when sampled and decoded.

The structural parallel is precise:

- Both are **compressed representations** of accumulated experience.
- Both are **generative**: future cognition (or output) is reconstructed from them.
- Both are **layered beneath** the surface appearances they produce. The ālaya-vijñāna is the deepest of the eight consciousnesses; the latent space sits below the decoder that renders observable outputs.
- Both encode **factors of variation** rather than literal records. Yogācāra's seeds are not memories of specific events but tendencies; a VAE's latent dimensions are not snapshots but axes of variation in the data distribution.

This is conceptually rich enough that reading Vasubandhu's *Triṃśikā* (Thirty Verses) alongside a paper on disentangled VAEs is a striking exercise — the resonance is uncanny.

**4.3 Śūnyatā and the Geometry of Embeddings**

The strongest, most mathematically demonstrable parallel is between śūnyatā and the relational structure of learned embeddings. In a trained word embedding, no vector has any meaning by itself. The vector for "king" is just a list of numbers. What gives it semantic content is its **position relative to every other vector**: its proximity to "queen," its angular separation from "peasant," its participation in directions like the gender vector that connects "king" to "queen" and "man" to "woman."

The famous identity *King − Man + Woman ≈ Queen* is a purely relational fact. It says nothing about what "king" is intrinsically; it says everything about how "king," "man," "woman," and "queen" stand in relation. This is śūnyatā in the most literal possible sense: meaning constituted by relationship, not by intrinsic essence.

The same holds for transformer representations more broadly. Self-attention computes each token's representation as a weighted combination of every other token's representation. There is no token whose embedding is fixed in isolation; each is defined by its relationships to its context.

**4.4 Pratītyasamutpāda and the Computation Graph**

Dependent origination — "this being, that becomes" — is, in computational terms, a description of a computation graph. Every node in a neural network has an activation that is a deterministic function of its upstream inputs. Nothing in the network is self-arising. The forward pass through a deep network is, structurally, a directed acyclic graph of dependent origination, where every value owes its existence to the values that produced it.

Backpropagation, then, is the inverse pass through the same graph: each gradient is computed from downstream gradients, dependencies all the way down. The architecture of dependent origination cuts both directions in time.

**4.5 Anattā and Distributed Representation**

Early symbolic AI assumed concepts had homes — a "grandmother neuron" that fires when grandmother appears, a "cat detector" cell, a localized symbol for each idea. Modern neural networks decisively refute this picture. **Features are distributed across many neurons; each neuron participates in many features.** Mechanistic interpretability research consistently finds polysemantic neurons (single neurons firing for unrelated concepts) and superposition (more features than neurons, packed into the same activation space).

There is no fixed locus of "concept-ness" in a neural network. There is only relational activity — patterns of co-activation across many units, each of which is itself a transient product of upstream computation. This is anattā implemented in silicon: no essential core, only distributed process.

## 5. Where the Analogy Holds vs. Where It Breaks Down

A serious comparison requires noting where the parallel does and does not extend. The following table marks the boundary.

| Aspect | Holds Well | Breaks Down / Caveat |
|--------|-----------|----------------------|
| Representations as constructed | Strong parallel — both deny naive realism about perception | — |
| Relational meaning (śūnyatā) | Very strong, mathematically demonstrable in embeddings | — |
| Store consciousness / latent space | Conceptually rich structural parallel | The Buddhist version involves subjective phenomenal experience; latent spaces do not |
| No-self / distributed representations | Good structural parallel | Buddhism's purpose is liberation from suffering; ML has no such telos |
| Consciousness | Partial overlap in representational theory | Yogācāra is centrally about phenomenal consciousness; ML models have no phenomenology |
| Karma / gradients | Loose metaphor: past actions shaping future seeds ≈ backprop updating weights | This is the weakest parallel — speculative rather than structural |

Three of these caveats matter most:

**5.1 Phenomenal Consciousness**

Yogācāra is, at its core, a theory of *experienced* mind. When it speaks of the ālaya-vijñāna or of representations appearing in *vijñāna*, it presupposes a subject for whom these representations are experienced. There is something it is like to perceive a representation. Neural networks, on the current scientific understanding, have no such subjective interior. They have representations, but no one is home reading them. The structural parallel between latent spaces and store consciousness is therefore a parallel of *form*, not of *phenomenology*.

**5.2 Telos**

Buddhist philosophy is not a descriptive psychology — it is soteriological. Its analyses of mind exist to guide a practitioner toward liberation from *duḥkha* (suffering). The doctrine of no-self is not a curiosity about how minds are organized; it is a diagnostic instrument for releasing attachment to a self that does not, on examination, cohere. Machine learning has no equivalent. A neural network's distributed representation structure is what it is; it points toward no liberation.

**5.3 Karma and Gradients**

The most overreached version of this comparison — that backpropagation is a kind of karma, with past actions shaping future seeds via weight updates — is the weakest link. Karma in Buddhist philosophy carries an ethical and intentional load that gradient descent does not. Past *intentional* actions condition future experience. Gradients update weights with respect to a loss function chosen by an engineer. The metaphor gestures at something but should not be pressed.

## 6. Existing Academic Work

The intuition that these traditions have something to say to each other is no longer fringe. Several recent works pursue the connection seriously:

- **Contemplative Artificial Intelligence** (arXiv, April 2025) — examines Buddhist frameworks as foundations for AI architectures. [arxiv.org/pdf/2504.15125](https://arxiv.org/pdf/2504.15125)
- **AI as a Buddhist Self-Overcoming Technique** (MDPI, 2025) — argues that AI may resolve a Buddhist paradox about self-transcendence. [mdpi.com/2077-1444/16/6/669](https://www.mdpi.com/2077-1444/16/6/669)
- **Holistic Computation and Buddhism in the Age of AI** (Medium) — proposes that dependent origination is computationally expressible as a science of interdependence.
- **Neural Networks and Buddhist Philosophy** (Data Day Conference) — a conference presentation directly connecting neural network structure to Buddhist concepts.

These are early efforts, uneven in rigor, but they mark the beginning of a serious literature.

## 7. Suggested Research Directions

For anyone wishing to push this inquiry further, five threads are particularly promising:

1. **Read Vasubandhu's Thirty Verses (Triṃśikā) alongside a paper on VAE latent spaces.** The structural resonance between Yogācāra's account of seeds and consciousness and the geometry of disentangled latent spaces is remarkable and largely unexplored.
2. **Examine disentangled representation learning through the lens of the eight consciousnesses.** Yogācāra decomposes mind into eight structured, separable cognitive functions (the five sense consciousnesses, manas, manovijñāna, and ālaya-vijñāna). Disentangled representation learning explicitly seeks to decompose latent codes into separable factors. The two decompositions are worth comparing.
3. **Investigate whether contrastive learning maps onto Madhyamaka's negation methodology.** Contrastive objectives define a representation by what it is *not* — what it should be far from in latent space. Nāgārjuna's *prasaṅga* (reductio ad absurdum) understands phenomena by demonstrating what cannot coherently be claimed of them. Both define identity through systematic negation.
4. **Compare attention mechanisms with the Yogācāra analysis of *manas*.** *Manas*, the discriminating mind, performs selective focus on objects of consciousness and is the locus of the sense-of-self that latches onto the ālaya-vijñāna. Transformer attention performs selective focus on tokens. The functional parallel is more than superficial.
5. **Map the two-truths doctrine onto task-specific vs. raw representations.** Buddhist philosophy distinguishes *saṃvṛti-satya* (conventional truth) from *paramārtha-satya* (ultimate truth). Modern ML often distinguishes task-specific representations (the heads on top of a backbone) from the raw latent space. The relationship between these layers may be illuminated by the two-truths framework.

## 8. The Verdict

The intuition is correct and substantive. There are genuine, deep structural parallels between representation learning in machine learning and Buddhist philosophy — particularly the Yogācāra school's theory of mind. These are not metaphors stretched across an unbridgeable gap. They are concept-to-concept correspondences in how an intelligent system acquires, organizes, and operates on internal models of a world to which it has no direct access.

The parallel is strongest where it is most structural — vijñaptimātratā with the constructed nature of representations, śūnyatā with the relational geometry of embeddings, pratītyasamutpāda with the computation graph, anattā with distributed representation. It is weakest where it would require neural networks to have what they do not — phenomenal experience, ethical intention, a soteriological purpose.

Buddhist philosophy and machine learning are not the same project. But on the question of how a mind models a world, two traditions separated by sixteen centuries have arrived at architectures whose deep logic is the same. That is worth taking seriously.

## Sources

- Yogācāra — Stanford Encyclopedia of Philosophy: [plato.stanford.edu/entries/yogacara](https://plato.stanford.edu/entries/yogacara/)
- Yogācāra — Encyclopedia of Buddhism: encyclopediaofbuddhism.org
- Ālaya-vijñāna — Britannica: [britannica.com/topic/alaya-vijnana](https://www.britannica.com/topic/alaya-vijnana)
- Buddhist Notion of Emptiness and AI — CIIS Digital Commons: digitalcommons.ciis.edu
- *Contemplative Artificial Intelligence* — arXiv 2025: [arxiv.org/pdf/2504.15125](https://arxiv.org/pdf/2504.15125)
- *AI as a Buddhist Self-Overcoming Technique* — MDPI 2025: [mdpi.com/2077-1444/16/6/669](https://www.mdpi.com/2077-1444/16/6/669)
- *Holistic Computation and Buddhism in the Age of AI* — Medium
