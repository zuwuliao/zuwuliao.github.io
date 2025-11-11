---
layout: post
title: DeepSeek OCR - From Read to See
categories: AI
---

DeepSeek newly released paper [DeepSeek OCR](https://www.arxiv.org/pdf/2510.18234) has generated significant buzz in both academia and industry. Many are calling it a revolutionary breakthrough, as it tackles a long-standing challenge in LLMs—efficiently handling long textual sequences, which typically suffer from the quadratic complexity of attention mechanisms.

Even Andrej Karpathy shared his excitement on X, commenting:
“The more interesting part for me (esp as a computer vision at heart who is temporarily masquerading as a natural language person) is whether pixels are better inputs to LLMs than text. Whether text tokens are wasteful and just terrible, at the input.”

Intrigued by the attention it's receiving, I decided to take a closer look:

What exactly is DeepSeek OCR?
How does it differ from traditional OCR systems?
And what can it actually do?

Let’s dive in.

Before diving into DeepSeek OCR, it's important to understand the computational challenges large language models (LLMs) face with long textual contexts.

Modern LLMs are almost universally built on the Transformer architecture, which, while powerful, suffers from a key limitation: the self-attention mechanism scales quadratically with sequence length. In other words, processing a longer input sequence results in exponentially higher computational costs. The standard Transformer Pipeline looks like this:

**Text Input → Tokenizer → Embedding Layer → Self-attention Layer → Output Tokens**

Every step relies on processing raw text and generating attention across all text tokens. The problem is at the self-attention layer. Self-Attention is Quadratic. In transformers (like GPT, BERT, etc.), the core computation is:

Self-Attention, where each token attends to every other token.

This means:

* For N input tokens, the attention matrix is N × N

* Computational cost and memory usage grow as O(N²)

For example:
* If you input 1,000 tokens, the attention matrix is 1,000 × 1,000 = 1 million operations

* If you input 10,000 tokens, it jumps to 100 million operations (!)

Because of the Transformer’s self-attention mechanism, handling long textual context introduces quadratic complexity in both computation and memory. When you feed a large language model (LLM) a lengthy document or maintain an extended conversation history, the number of input tokens increases. Each additional token not only slows down inference but also significantly increases memory usage.

DeepSeek-OCR addresses this challenge at the input stage. Instead of feeding long text directly into an LLM (which is costly and slow), they first turn the text into an image (like a snapshot of a document), and then process that image using fewer "vision tokens." This is called "optical compression." By converting long textual sequences into images, DeepSeek-OCR bypasses the token-based input limitations of Transformers, enabling more scalable handling of large textual inputs.

Here's the trick:

* Vision tokens from images are far fewer than the original text tokens

* Even better, vision transformers (like the encoder used in DeepSeek-OCR) don't scale quadratically in the same way, because:

  * They use techniques like windowed attention or downsampling

  * They are designed to handle high-resolution images efficiently

**DeepSeek OCR Architecture:**

![pic 1](/images/DeepSeek-OCR.jpg "pic 1")


DeepSeek-OCR architecture has two main parts:

**1. DeepEncoder (like a visual compressor):**

  * Converts images of text into compact representations (vision tokens)

  * Designed to support high resolution, multiple image sizes, and low memory use

**2. DeepSeek3B-MoE Decoder:**

  * Converts those vision tokens back into text

What Happens in DeepSeek-OCR?

**1. Text → Image (optical format)**

  * A long text document (say 1000+ tokens) is rendered as an image.

**2. Image → Vision Tokens (via DeepEncoder)**

  * The image is encoded into ~64–800 vision tokens, depending on resolution.

**3. Vision Tokens → Text (via Decoder)**

  * These tokens are decoded back into text using a language model (DeepSeek3B-MoE).

**So instead of processing 1000+ text tokens, the model only processes 100–800 vision tokens.**

That’s a **10× compression**, dramatically reducing the cost of inference. Based on the paper, this method achieves 96%+ OCR decoding precision at 9-10× text compression, ∼90% at 10-12× compression

With DeepSeek OCR, the new Enhanced Pipeline looks like:

**Text Input → Rendered as Image → DeepEncoder → Vision Tokens → Transformer Decoder → Output Tokens**

Now that we understand what DeepSeek OCR is, the next question is: **is it a big deal?**

In my view — it depends.

**On one hand**, DeepSeek OCR introduces a new paradigm for text input. Instead of feeding long text directly into an LLM, this approach converts text into images and lets the model "see" rather than "read." This shift opens up exciting possibilities by moving from token-based language understanding to vision-based encoding.

This can significantly reduce computational complexity in use cases like OCR, document parsing, chart/table/formula extraction, multilingual OCR, and other forms of visual deep parsing. It also eliminates the need for a tokenizer and embedding layer, simplifying the architecture and reducing overhead.

Notably, Andrej Karpathy has voiced strong criticism of tokenizers in his 
[post on X](https://x.com/karpathy/status/1980397031542989305), saying: 

*"Delete the tokenizer (at the input)!! I already ranted about how much I dislike the tokenizer. Tokenizers are ugly, separate, not end-to-end stage. It "imports" all the ugliness of Unicode, byte encodings, it inherits a lot of historical baggage, security/jailbreak risk (e.g. continuation bytes). It makes two characters that look identical to the eye look as two completely different tokens internally in the network. A smiling emoji looks like a weird token, not an... actual smiling face, pixels and all, and all the transfer learning that brings along. The tokenizer must go."*


DeepSeek OCR aligns with this vision by skipping the tokenizer entirely and leveraging raw pixel inputs.

**On the other hand**, DeepSeek OCR is not a full end-to-end LLM. It's an end-to-end OCR system, which means it’s focused on extracting text from visual input—not on understanding or reasoning over that content like a chatbot or language model would.

If you want to use the extracted text for downstream inference, you still need to feed it into a standard Transformer-based LLM. That brings back the same self-attention bottleneck and quadratic scaling with input length. So unless a model can mix visual tokens and text tokens within a shared attention space, the computational savings don’t extend to full LLM inference.

So far, I haven’t seen evidence that DeepSeek OCR (or any current system) allows such hybrid token mixing. That would be a true breakthrough, but it's not yet a reality—at least not based on current public information. 

Even though DeepSeek OCR can’t replace current LLMs for general-purpose reasoning or conversation, its unique approach still provides significant value in several specialized use cases:

| Use Case                       | Description                                      |
|--------------------------------|--------------------------------------------------|
| High-Fidelity OCR              | Convert scanned documents or PDFs to structured text with layout preservation. |
| Document Parsing               | Convert documents into structured formats like Markdown, JSON, or HTML. |
| Chart/Table/Formula Extraction | Extract data from charts, tables, chemical diagrams, and geometry figures (OCR 2.0). |
| Multilingual OCR               | OCR for 100+ languages, including minority and non-Latin scripts. |
| LLM Data Generation            | Massively scale generation of high-quality text data from documents for LLM pretraining. |
| Visual Deep Parsing            | Understand and describe images embedded in documents, including figures and photos. |
| Long Context Compression       | Compress long text histories into image-based memory tokens for efficient context use in LLMs. |

---

**P.S.** Interesting enough, after I posted this blog, another paper came across and addressed the question I have for mix visual and text token at cross-attention layer. This makes visualizing text input for LLM possible. The paper called [Vision-centric Token Compression in Large Language Model](https://arxiv.org/pdf/2502.00791). Simular to DeepSeek OCR, VIST is also using visual encoders to compress low-importance parts of input into dense visual tokens.

**Core Idea**

VIST introduces a slow–fast token compression framework, inspired by how humans read:

  * Fast path: Skims the distant context, renders it as images, encodes with a lightweight vision encoder (e.g., CLIP)

  * Slow path: Processes important nearby text using the LLM directly

Only the most important semantic content from the distant context is passed in as compressed visual tokens to the LLM using cross-attention(see the diagram below)

![pic 2](/images/VIST-1.0.png "pic 2")

**Key Components**

**1. Vision Encoder + Resampler**

  * The vision encoder (frozen CLIP ViT-L/14) processes rendered text images.

  * A Perceiver Resampler compresses these visual features into a fixed number of visual tokens (e.g., 64/image).

**2. PVE (Probability-Informed Visual Enhancement)**

  * A training objective that:

  * Uses token frequency to identify high-value vs. redundant text

  * Masks high-frequency (low-information) tokens

  * Encourages the Resampler to focus on rare, content-rich tokens

  * Bridges the semantic gap between text embeddings and vision embeddings

This mimics skilled readers skipping “the”, “and”, etc., and focusing on content words.
![pic 3](/images/VIST-2.png "pic 3")

**Fusion via Cross-Attention**
The key difference to make VIST a LLM that DeepSeek OCR is at the cross attention layer.
During cross-attention, VIST mixes vision tokens (from the compressed input) with text tokens (from the LLM prompt). Specifically, the vision tokens act as contextual memory, and the text tokens (prompt or current generation) attend to them during inference.

**Step-by-Step: What Happens in VIST**

Let’s walk through the data flow during inference:

**1. Input Partitioning (Slow–Fast Paths)**

VIST splits a long input sequence into two parts:

| Segment                         | Description                                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fast path (distant context)** | The older or less relevant parts of the text → rendered into images → encoded by the **vision encoder** and **Resampler** into compact **visual tokens**. |
| **Slow path (main input)**      | The current or nearby text → processed directly by the **LLM** as normal text tokens.                                                                     |


So we end up with two input streams:

 * Vision tokens (compact semantic embeddings from distant context)

 * Text tokens (normal LLM input / prompt)

**2. Fusion via Cross-Attention**

Inside the LLM, there are cross-attention layers between self-attention blocks.

  * The queries (Q) come from the text tokens (prompt or generated tokens)

  * The keys (K) and values (V) come from the vision tokens

Mathematically:

$$
\text{CrossAttention}(Q_{\text{text}}, K_{\text{vision}}, V_{\text{vision}})
$$

This allows each text token to attend to the semantic information stored in the vision tokens — effectively “looking back” at compressed long context.

The result:
The model reasons over both recent text (in full detail) and older context (in compressed visual form).

**3. Inference-Time Interaction**

At inference:

  1. The LLM processes the text tokens from the main prompt.

  2. Inside each cross-attention layer, it “looks up” relevant information from fixed vision tokens.

  3. The cross-attention outputs are added back into the hidden states, enriching them with long-context semantics.

So yes — the mixing happens through attention weights, not direct concatenation.

**Important Notes**

  * The vision tokens are frozen during inference (no autoregressive update).

  * Only the text tokens evolve as the model generates output.

  * Cross-attention ensures the model can reference visual context at every decoding step.

**Use Cases**

  * Compress long document context before LLM input

  * Open-domain QA with large evidence sets

  * Efficient in-context learning with large numbers of demonstrations

  **Comparison to DeepSeek-OCR**

  | Feature                           | **VIST**                                             | **DeepSeek-OCR**                                  |
| --------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **Goal**                          | Compress long input context for LLMs                 | OCR and context compression via image encoding    |
| **Input**                         | Text (rendered as image)                             | Images or rendered text documents                 |
| **Output**                        | Text tokens via LLM decoding                         | Text output (OCR-style decoding)                  |
| **Compression Target**            | Distant text context (selective compression)         | Entire document input                             |
| **Core Encoder**                  | Frozen CLIP ViT + Perceiver Resampler                | SAM + Convolutional Compressor + CLIP             |
| **Compression Strategy**          | Frequency-based masking + contrastive learning (PVE) | Token count reduction via patch downsampling      |
| **Where Used**                    | As auxiliary input to LLM via cross-attention        | As complete input encoder for VLM                 |
| **Model Role**                    | Visual tokenization for context enhancement          | Full image-to-text decoding pipeline              |
| **Primary Use Case**              | Long-context language modeling & QA                  | Document OCR, chart parsing, data extraction      |
| **Text Token Generation**         | Decoder generates text tokens autoregressively       | Decoder reconstructs full text from vision tokens |
| **Multilingual / Layout Support** | Not the focus                                        | Strong multilingual & layout support              |

Key Difference Summary

| **VIST**                                                                       | **DeepSeek-OCR**                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Augments an LLM with compressed vision tokens for long-text **enhancement**  | Fully replaces text input with vision tokens for **end-to-end decoding** |
| Uses **visual token compression selectively** on less important text context | Uses **vision tokens as the primary input** (OCR image-to-text)          |
| Focuses on **reducing LLM memory cost** for long sequences                   | Focuses on **replacing large text input with fewer vision tokens**       |
| Designed for **text-first workflows**, compressing past context              | Designed for **image-first workflows**, like scanned documents           |

It's interesting to see same concept of using visual token to compress the long textual context input. How useful of the fusion cross-attention is still a question to me.
