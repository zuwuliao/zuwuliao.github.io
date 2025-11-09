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

1. DeepEncoder (like a visual compressor):

  * Converts images of text into compact representations (vision tokens)

  * Designed to support high resolution, multiple image sizes, and low memory use

2. DeepSeek3B-MoE Decoder:

  * Converts those vision tokens back into text

What Happens in DeepSeek-OCR?

1. Text → Image (optical format)

  * A long text document (say 1000+ tokens) is rendered as an image.

2. Image → Vision Tokens (via DeepEncoder)

  * The image is encoded into ~64–800 vision tokens, depending on resolution.

3. Vision Tokens → Text (via Decoder)

  * These tokens are decoded back into text using a language model (DeepSeek3B-MoE).

**So instead of processing 1000+ text tokens, the model only processes 100–800 vision tokens.**

That’s a **10× compression**, dramatically reducing the cost of inference.

With DeepSeek OCR, the new Enhanced Pipeline looks like:

**Text Input → Rendered as Image → DeepEncoder → Vision Tokens → Transformer Decoder → Output Tokens**

Now that we understand what DeepSeek OCR is, the next question is: is it a big deal?

In my view — it depends.

On one hand, DeepSeek OCR introduces a new paradigm for text input. Instead of feeding long text directly into an LLM, this approach converts text into images and lets the model "see" rather than "read." This shift opens up exciting possibilities by moving from token-based language understanding to vision-based encoding.

This can significantly reduce computational complexity in use cases like OCR, document parsing, chart/table/formula extraction, multilingual OCR, and other forms of visual deep parsing. It also eliminates the need for a tokenizer and embedding layer, simplifying the architecture and reducing overhead.

Notably, Andrej Karpathy has voiced strong criticism of tokenizers in his 
[post on X](https://x.com/karpathy/status/1980397031542989305), saying: 

"Delete the tokenizer (at the input)!! I already ranted about how much I dislike the tokenizer. Tokenizers are ugly, separate, not end-to-end stage. It "imports" all the ugliness of Unicode, byte encodings, it inherits a lot of historical baggage, security/jailbreak risk (e.g. continuation bytes). It makes two characters that look identical to the eye look as two completely different tokens internally in the network. A smiling emoji looks like a weird token, not an... actual smiling face, pixels and all, and all the transfer learning that brings along. The tokenizer must go."


DeepSeek OCR aligns with this vision by skipping the tokenizer entirely and leveraging raw pixel inputs.

On the other hand, DeepSeek OCR is not a full end-to-end LLM. It's an end-to-end OCR system, which means it’s focused on extracting text from visual input—not on understanding or reasoning over that content like a chatbot or language model would.

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

