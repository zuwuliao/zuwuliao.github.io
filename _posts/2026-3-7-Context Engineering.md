---
layout: post
title: Context Engineering
categories: AI
---

As AI evolves from simple chatbots to complex agents, prompt engineering alone is no longer sufficient to ensure high-quality outputs. As the tasks we expect AI to perform grow more complex, the “magic wording” of a prompt matters less than whether the system has access to the right files, tools, and structured inputs. Failures often occur not because the model is “dumb,” but because it was given poorly formatted or irrelevant context—classic “garbage in, garbage out.” Context engineering addresses this challenge by treating the model’s limited attention as a finite resource that must be deliberately allocated to high-signal information.

**Context Engineering**

Context engineering is the broader discipline of designing, curating, and managing the entire information ecosystem that a Large Language Model (LLM) accesses during its operation. While earlier AI work focused on phrasing instructions, context engineering focuses on the "knowledge substrate"—ensuring the model has the right data, tools, and memory at the right time to solve a task. 

**Core Components of Context Engineering**

Context engineering moves beyond a single text string to a dynamic system that manages several layers of information: 

* **External Data (RAG)**: Dynamically retrieving relevant documents, databases, or real-time web data to ground the model's responses.

* **Memory Systems**: Managing conversation history (short-term) and persistent user preferences or past project states (long-term) to maintain continuity.

* **Tool Orchestration**: Deciding which tools (e.g., search, calculators, APIs) to provide and how to format their outputs for the model.

* **Context Curation**: Actively pruning or summarizing information to prevent "context rot," where model accuracy degrades as the context window becomes bloated with irrelevant tokens.

**Key Techniques**

Context engineering techniques are primarily focused on the dynamic selection, organization, and compression of data to fit within the limited "RAM" of an LLM's context window. 



The key techniques are generally categorized into four core strategies: Write, Select, Compress, and Isolate. 

**1. Context Selection (Retrieval & Filtering)**

    Instead of providing all available data, these methods identify the most relevant pieces for a specific task. 

  * **Retrieval-Augmented Generation (RAG)**: The most common technique, using vector databases to retrieve only relevant document snippets based on semantic similarity.

  * **Hybrid Search**: Combines semantic search with keyword matching (like BM25) to capture both conceptual meaning and exact terminology.

  * **Re-ranking**: A two-stage process where a large set of potentially relevant chunks is retrieved and then a more powerful model re-orders them to ensure the top 3–5 are the most useful.

  * **Just-in-Time Retrieval**: Agents maintain "lightweight references" (like file paths or IDs) and only load the full data into context when they determine it is needed during a workflow. 

**2. Context Compression (Token Optimization)**

    These techniques reduce the size of information without losing essential signals to stay within token limits. 

  * **Summarization**: Periodically condensing long conversation histories or bulky documents into concise, fact-preserving summaries.

  * **Context Trimming/Pruning**: Actively dropping the least relevant or oldest information (e.g., clearing raw tool outputs once their result has been used).

  * **Incremental Delta Updates**: Instead of regenerating the entire context, only the changes or "deltas" from the previous turn are merged into the existing state. 

**3. Context Ordering (Strategic Placement)**

    The position of information affects model performance due to the "lost-in-the-middle" phenomenon, where LLMs attend more to the beginning and end of a prompt. 

  * **Priority Placement**: Critical rules, security requirements, and system instructions should be placed at the very beginning.

  * **Recency Bias**: The immediate task and most recent user request are placed at the end to leverage the model's natural focus on the most recent tokens. 

**4. Context Isolation (Specialization)**

    For complex tasks, splitting information across specialized components prevents "context poisoning" or confusion. 

  * **Multi-Agent Architectures**: Dividing a task among multiple sub-agents, each with a focused context window containing only the tools and data relevant to their specific sub-role.

  * **Structured State Objects**: Storing complex data (like large JSON tool outputs) in an external state object and only exposing a summary or specific field to the LLM. 

**5. Persistent Memory Systems**

  * **Scratchpads**: Temporary "note-taking" spaces where an agent can record its reasoning or intermediate steps outside the main conversation history.

  * **Long-Term Memory**: Storing user preferences, past decisions, and recurring facts in external storage (e.g., Redis) to be retrieved across different sessions

**Prompt Engineering vs Context Engineering**

While prompt engineering focuses on how to ask a question, context engineering focuses on what information the model has available when it answers. 

| Feature        | Prompt Engineering                                      | Context Engineering                                      |
|---------------|----------------------------------------------------------|-----------------------------------------------------------|
| Primary Focus | Phrasing and word choice (how to ask).                  | Information architecture (what is known).                |
| Scope         | A single interaction or instruction string.             | The entire ecosystem (data, memory, tools).              |
| Nature        | Often tactical, manual, or "art-like".                  | Systemic, automated, and architectural.                  |
| Goal          | Get a specific response from one prompt.                | Ensure consistent performance across long sessions.      |
| Analogy       | Asking a brilliant question.                            | Building the library and opening the right book.         |