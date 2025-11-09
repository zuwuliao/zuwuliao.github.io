---
layout: post
title: DeepSeek OCR - From Read to See
categories: AI
---

DeepSeek newly released paper [DeepSeek OCR](https://www.arxiv.org/pdf/2510.18234) caught a lot of attention from the acdemic and industry. A lot of people says it's a revolution which solves the long standing challenge of long textual context due to quadratic scaling with sequence length. Even Andrej Karpathy is excited about DeepSeek OCR approach. He said on X 'The more interesting part for me (esp as a computer vision at heart who is temporarily masquerading as a natural language person) is whether pixels are better inputs to LLMs than text. Whether text tokens are wasteful and just terrible, at the input.' 

It is so popular that I decided to spend a little time to research on it. What is DeepSeek OCR? What is the difference from other OCR? Is it a bit deal and what can DeekSeek OCR do? Let's dive into it.

Before we talk about DeepSeek OCR, let's see why LLMs have long textual context computational challenge. Today's LLMs are all using Transformer architecture. Standard Transformer Pipeline looks like this:

Text Input → Tokenizer → Embedding Layer → Self-attention Layer → Output Tokens

Every step relies on processing raw text and generating attention across all text tokens. The problem is at the self-attention layer. Self-Attention is Quadratic. In transformers (like GPT, BERT, etc.), the core computation is:

Self-Attention, where each token attends to every other token.

This means:

* For N input tokens, the attention matrix is N × N

* Computational cost and memory usage grow as O(N²)

For example:
* If you input 1,000 tokens, the attention matrix is 1,000 × 1,000 = 1 million operations

* If you input 10,000 tokens, it jumps to 100 million operations (!)

So the long textual context cause the operation complexity increases quatratically. When you want to give an LLM a long document, or maintain long conversation history, you're increasing input tokens — and each added token slows down inference and increases memory use.

DeepSeek-OCR is trying to solve this problem at text input step. It's a system that compresses long text into visual format (images) and later decodes it back into text using AI. This helps overcome the limits of how much text current large language models (LLMs) can handle.

The smart part of DeepSeek-OCR is, instead of feeding long text directly into an LLM (which is costly and slow), they first turn the text into an image (like a snapshot of a document), and then process that image using fewer "vision tokens." This is called "optical compression."

Here's the trick:

* Vision tokens from images are far fewer than the original text tokens

* Even better, vision transformers (like the encoder used in DeepSeek-OCR) don't scale quadratically in the same way, because:

  * They use techniques like windowed attention or downsampling

  * They are designed to handle high-resolution images efficiently

##DeepSeek OCR Architecture:

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

##Now, we know what DeepSeek OCR is. Is it a big deal?

My opinion is - it depends. Why?

On side, it introduced a new paradim of text input. In stead of feeding LLMs long text, we can convert texts to vision. This is so great. This approach makes LLM from 'Read' to 'See'. It would significantly reduce the computational complexity for some use case such as OCR, Document Parsing, Chart/Table/Formula Extraction, Multilingual OCR and Visual Deep Parsing.

The other side, it's not an end-to-end LLM. It is just an end-to-end OCR. That means it is not a chatbot which can answer your questions. If we want to use the extracted texts for inferencing, all the text tokens need to feed in to Transformer with sel-attention mechnism. That still does not reduce any computational complexity. Unless, we can mix vision tokens and text tokens in self-attention. That is something I don't find anywhere says possible. 

Even we can't use DeepSeek OCR to replace current LLM, this new approach is still very useful in the following use cases:

| Use Case                       | Description                                      |
|--------------------------------|--------------------------------------------------|
| High-Fidelity OCR              | Convert scanned documents or PDFs to structured text with layout preservation. |
| Document Parsing               | Convert documents into structured formats like Markdown, JSON, or HTML. |
| Chart/Table/Formula Extraction | Extract data from charts, tables, chemical diagrams, and geometry figures (OCR 2.0). |
| Multilingual OCR               | OCR for 100+ languages, including minority and non-Latin scripts. |
| LLM Data Generation            | Massively scale generation of high-quality text data from documents for LLM pretraining. |
| Visual Deep Parsing            | Understand and describe images embedded in documents, including figures and photos. |
| Long Context Compression       | Compress long text histories into image-based memory tokens for efficient context use in LLMs. |

