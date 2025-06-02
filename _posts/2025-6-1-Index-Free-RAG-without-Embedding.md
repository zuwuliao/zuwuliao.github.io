---
layout: post
title: Index-Free RAG without Embedding
categories: AI
---

During my research, I came across an interesting article. The article is titled '[Practical Guide for Model Selection for Real‑World Use Cases](https://cookbook.openai.com/examples/partners/model_selection_guide/model_selection_guide#model-guide)' which is published by OpenAI. It aims to explain when to use what model. In the section '3A. Use Case: Long-Context RAG for Legal Q&A', the guide introduces a novel Long-Context Agentic RAG implementation. The key message is **No Embedding**. Yes, you read that correctly—this version of RAG is **index-free**.

The following table is from the article:

| **Layer**          | **Choice**                                              | **Utility**                                                                 |
|--------------------|----------------------------------------------------------|------------------------------------------------------------------------------|
| Chunking           | Sentence-aware Splitter                                 | Splits document into 20 equal chunks, respecting sentence boundaries.       |
| Routing            | `gpt-4.1-mini`                                           | Uses natural language understanding to identify relevant chunks without embedding index. |
| Path Selection     | `select(ids=[...])` and `scratchpad(text="...")`        | Records reasoning while drilling down through document hierarchy.           |
| Citation           | Paragraph-level                                          | Balances precision with cost; provides meaningful context for answers.      |
| Synthesis          | `gpt-4.1` (Structured Output)                            | Generates answers directly from selected paragraphs with citations.         |
| Verification       | `o4–mini` (LLM-as-Judge)                                 | Validates factual accuracy and citation correctness.                         |

How does the index-free RAG work? Let's dive into it.

Basically, it's using Agentic RAG flow. The overall approach is:

1. Load the entire document into the context window
2. Split into 20 chunks that respect sentence boundaries
3. Ask the model which chunks might contain relevant information
4. Drill down into selected chunks by splitting them further
5. Repeat until we reach paragraph-level content
6. Generate an answer based on the selected paragraphs
7. Verify the answer for factual accuracy

The following diagram illustrates the workflow:

![pic 1](/images/index-free-rag-1.png "pic 1")

Traditional RAG systems rely on embedding to convert text into vector representations (indices), which are then compared using vector similarity to retrieve semantically relevant content. But without embeddings, how does this new RAG approach retrieve relevant information?

According to the diagram, the key component is the LLM router, which selects the relevant chunks and sub-chunks directly. The mechanism behind this is a scratchpad, which allows the model to track decision criteria and reasoning over time.

As described in the guide:
“Maintaining a scratchpad allows the model to track decision criteria and reasoning over time. This implementation uses a two-pass approach with GPT-4.1-mini: first requiring the model to update the scratchpad via a tool call (tool_choice='required'), then requesting structured JSON output for chunk selection. This approach provides better visibility into the model's reasoning process while ensuring consistent structured outputs for downstream processing.”

In other words, instead of using vector search, the system relies on a reasoning process guided by the LLM, structured over multiple steps, to identify relevant content.

Then, what is scratchpad? I researched it again and found this paper '[Show Your Work: Scratchpads for Intermediate Computation with Language Models](https://arxiv.org/abs/2112.00114)'

Index-free RAG presents an alternative paradigm to traditional embedding-based retrieval, emphasizing structured reasoning over vector similarity. But can it replace conventional RAG approaches entirely? The answer is **No**—it offers distinct advantages, but also comes with tradeoffs.

**Benefits**

**Zero-ingest latency**: Answer questions from new documents immediately, with no preprocessing.

**Dynamic navigation**: Mimics human reading patterns by focusing on promising sections.

**Cross-section reasoning**: Model can find connections across document sections that might be missed by independent chunk retrieval, potentially increasing accuracy of generated answers and saving time on optimizing retrieval pipelines.

**Tradeoffs**

**Higher per-query cost**: Requires more computation for each question compared to embedding-based retrieval.

**Increased latency**: Hierarchical navigation takes longer to process than simple vector lookups.

**Limited scalability**: May struggle with extremely large document collections where preprocessing becomes more efficient.

