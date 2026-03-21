---
layout: post
title: Attention Residuals - Teach AI to remmeber better
categories: AI
---

# Teaching AI to Remember Better: What Are Attention Residuals?

**A new technique from the Kimi Team lets each layer of a neural network choose which earlier layers to listen to — instead of being forced to listen to all of them equally.**

*Based on the technical report by the Kimi Team (MoonshotAI) · Published March 2026 on arXiv*

---

## Why Deep Networks Need Residual Connections

Modern AI language models are built by stacking dozens or even hundreds of processing layers on top of each other. Each layer refines the model's understanding a little further — early layers might notice basic word patterns, middle layers might grasp grammar, and late layers might piece together meaning.

But stacking layers creates a serious training problem. During training, the model learns by sending error signals backward through the network — a process called backpropagation. These signals tell each layer how to adjust itself. The trouble is that in a deep network without shortcuts, these signals must pass through every layer's transformations on the way back, and they tend to either shrink toward zero (**vanishing gradients**) or blow up uncontrollably (**exploding gradients**). Either way, the earliest layers — the ones that build the foundation — can't learn effectively. This is why, for years, simply making a network deeper often made it *worse*, not better.

**Residual connections**, introduced by He et al. in 2015, solved this elegantly. The idea: instead of each layer only passing its transformed output forward, it also passes along everything it received *unchanged*, added directly to the output. This creates an "identity highway" — a clean, direct path for both information and error signals to flow through the entire network, bypassing all the transformations in between. No matter how deep the network is, gradients can always travel straight back to the earliest layers through this shortcut.

This breakthrough is the reason modern Transformers (including every major language model) can be trained at depth. Every Transformer block uses residual connections around both its attention and feed-forward sublayers. Without them, training a 100-layer model would be essentially impossible.

![pic 1](/images/attention-residuals-1.jpg "pic 1")

*Left: without residuals, the signal degrades through each layer and error signals fade going backward — early layers can't learn. Right: with residual connections, each layer's input bypasses the transformation via a skip connection and is added back to the output. These local shortcuts chain together, creating an "identity highway" that keeps both forward signals and backward gradients strong at every depth.*

## What Residuals Solved — and What They Left Behind

Residual connections solved the gradient problem brilliantly. But they also define a second role that gets less attention: **how information aggregates across depth**. And here, the standard design has a significant limitation.

Because each layer adds its output with a fixed weight of 1, unrolling the math shows that layer *l* receives the sum of *all* prior layer outputs: the embedding plus every transformation applied so far. Early layer information isn't lost — it's technically all there. But it's mixed into a single, ever-growing, undifferentiated pile. No layer can reach back and selectively retrieve what a specific earlier layer computed. It's like a soup where every cook adds an ingredient — all the flavors are present, but you can't taste any one of them individually, and you certainly can't adjust the recipe after the fact.

This creates three concrete problems:

**Dilution, not loss.** As the sum grows with depth (magnitudes scale roughly proportional to the number of layers), each individual layer's contribution becomes a smaller fraction of the total. The technical term is **PreNorm dilution**. Later layers have to produce increasingly large outputs just to have proportional influence over the accumulated residual — which can destabilize training.

**Gradient imbalance.** With all residual weights fixed at 1, there's no mechanism to regulate how learning signals distribute across depth. In practice, the earliest layers receive disproportionately large gradients while deeper layers get smaller ones. The gradients don't vanish (residuals prevent that), but they're unevenly distributed.

**No selective access.** Different layer types — attention layers versus feed-forward layers, for instance — receive the same blended state, even though they might benefit from very different weightings of earlier representations. And once information is mixed into the sum, there's no way to un-mix it.

Research has shown that in some models, you can remove nearly half the layers with surprisingly little damage, suggesting many of those deeper layers weren't contributing much to begin with. This hints that the uniform accumulation may be preventing the network from fully utilizing its depth.

> **An analogy:** Imagine you're writing a collaborative story. The rule is: every time it's your turn, you must include *every single sentence* written so far, weighted equally, plus your new sentence. By the 50th turn, your new sentence is just 1/50th of the total — barely audible. Nothing is "lost," but everything is diluted. That's the situation inside today's deep networks.

---

## A Key Insight: Depth Is Like Time

The Kimi Team noticed something elegant. The way information flows through layers (depth) is structurally similar to how older AI models called RNNs processed words in a sequence (time). In both cases, you have a chain where each step can only see a single compressed summary of everything before it.

The original Transformer architecture solved the time problem beautifully: instead of compressing all previous words into one summary, it lets each word look back and *selectively attend* to whichever earlier words matter most. This is the famous "attention mechanism" that makes modern AI work so well.

So the team asked: **why not apply the same idea across depth?** Instead of blindly accumulating all layer outputs equally, let each layer attend to previous layers and pick the ones that matter most for the current input.

---

## How Attention Residuals Work

The contrast between the old and new approach is straightforward:

| | Standard Residuals | Attention Residuals |
|---|---|---|
| **How layers combine** | Every previous layer's output is added equally into a growing sum | Each layer computes relevance scores and takes a *weighted* average of previous layers |
| **Weights** | Fixed at 1 for all layers, always | Learned and input-dependent — change based on what the model is processing |
| **Result** | A growing pile where new contributions get diluted | A clean, bounded mixture where each layer can emphasize what matters |

The core idea, called **Attention Residuals (AttnRes)**, works like this: every layer gets a small "question" vector (the researchers call it a pseudo-query). When a layer needs to decide what information to start with, it uses this question to look at all previous layer outputs and compute a relevance score for each one. These scores go through a softmax function (the same mechanism used in regular attention) so they sum to 1, creating a clean weighted average rather than an ever-growing pile.

This means Layer 50 might decide: "For this particular input, I mostly care about what Layer 2 and Layer 48 produced, and I can mostly ignore the rest." The weights are *input-dependent* — they change based on what the model is processing, which is exactly how attention works over words in a sentence.

---

## Making It Practical: Block Attention Residuals

There's a catch. Having every layer look back at *every single* previous layer sounds expensive, especially when you're training massive models across many computers. The memory and communication costs add up.

The solution is **Block Attention Residuals**. Instead of attending to each layer individually, you group layers into blocks (roughly 8 blocks works well in practice). Within a block, outputs are summed the traditional way. But between blocks, the model uses attention to selectively pick which block summaries matter most.


![pic 2](/images/attention-residuals-2.jpg "pic 2")

### Full AttnRes vs. Block AttnRes

**Full AttnRes — Maximum Selectivity:** Every layer attends to every previous layer. Best performance, but needs more memory and communication between GPUs during training.

**Block AttnRes — Practical Compromise:** Layers attend to ~8 block summaries instead of hundreds of individual layers. Nearly as good, but far cheaper to run — less than 4% training overhead and under 2% slower at inference.

The clever engineering doesn't stop there. The team developed a two-phase computation strategy: first, batch all the between-block attention queries in parallel (since the query vectors don't depend on the layer's input), then handle within-block dependencies sequentially. They also designed a caching system for multi-GPU training that avoids redundantly sending the same block summaries between machines.

---

## What the Results Show

The team tested Attention Residuals at multiple scales and found consistent improvements.

**1.25× compute advantage.** Block AttnRes matched the baseline model's quality using roughly 25% less computing power — or equivalently, produced a better model with the same budget.

**+7.5 points on GPQA-Diamond**, a graduate-level reasoning benchmark — one of the largest single-benchmark improvements reported.

**< 2% inference overhead.** Running a trained AttnRes model is barely slower than running a standard one, thanks to the two-phase computation strategy.

Beyond raw scores, the training dynamics improved in telling ways. In standard models, the internal representation grows monotonically with depth — a signature of the pile-up problem. With Block AttnRes, the growth is bounded and periodic, resetting at each block boundary. Gradients (the signals that drive learning) also distribute more evenly across layers, suggesting the model makes better use of its full depth.

---

## Why This Matters

This work matters for a few reasons beyond the benchmark numbers.

**It completes a symmetry.** Modern AI already uses learned, selective attention for mixing information across words (the sequence dimension) and across experts (in mixture-of-experts models). But mixing across depth — which layers contribute to which — was still using the same fixed, uniform rule from 2015. Attention Residuals bring depth into the same framework.

**It makes depth more useful.** If layers can selectively retrieve earlier representations, deeper models have less reason to be redundant. The architecture sweep in the paper confirms this: AttnRes shifts the optimal design toward deeper, narrower networks compared to the baseline, suggesting depth is being utilized more effectively.

**It's a drop-in replacement.** AttnRes doesn't require redesigning the rest of the model. It adds one small vector per layer and one normalization operation. The rest is systems engineering to keep overhead low. This makes adoption practical for existing training pipelines.

---

## The Bigger Picture

Attention Residuals sit at the end of a decade-long evolution in how deep networks handle information flow across layers. The original residual connection (2015) was a breakthrough that made deep training possible at all. Highway Networks added gates. Various scaling and normalization tricks pushed depth further. Multi-stream approaches like Hyper-Connections widened the pipeline.

AttnRes takes the next logical step: rather than trying to improve the single-stream recurrence with better gates or scaling, it replaces the recurrence entirely with attention — the same conceptual leap that Transformers made over RNNs for sequence processing. The paper frames this as a formal duality between time and depth, and shows through a unified mathematical analysis that standard residuals and their variants can all be viewed as forms of linear attention over depth, while AttnRes performs full softmax attention.

Whether this specific formulation becomes the new default remains to be seen. But the underlying idea — that depth mixing deserves the same learned, selective treatment as sequence mixing — seems likely to influence how future AI models are designed.

---

*Source: "Attention Residuals" by the Kimi Team (MoonshotAI), arXiv:2603.15031, March 2026. Code available at github.com/MoonshotAI/Attention-Residuals.*

*This article is a non-technical summary. For full details including mathematical formulations, scaling law curves, and ablation studies, see the original paper.*
