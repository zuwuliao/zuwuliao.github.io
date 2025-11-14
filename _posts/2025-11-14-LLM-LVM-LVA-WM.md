---
layout: post
title: LLM-LVM-LVA-World Model
categories: AI
---

In one of my earlier blog posts, I raised the idea that large language models (LLMs) might not be the best path toward AGI. The real world is way more complex than what words alone can capture.

Take a simple example: if you push a cup off the edge of a table, what happens next? Can an LLM figure that out? It would need to know that gravity pulls the cup down, and depending on what it hits—hardwood, sand, rubber, concrete—the result could be very different. The cup might break, bounce, or just land softly.

To really understand situations like this, an AI needs to perceive the world—it needs to see, to feel, maybe even to interact. Language models just don’t have that kind of sensory input or physical grounding.

So what are researchers doing about it? How are they trying to build systems that go beyond just language? In this post, we’ll take a quick look at where the field is heading and how people like Yann LeCun, Fei-Fei Li, and others are thinking about the next steps toward more general, grounded intelligence. One of the evolution path they believe is like this:

**LLM**->**LVM**->**LVA**->**World Model(WM)**

Let's have a look of each of them to understand what they are.

**LLM**

**What it is**

An LLM is an AI system that takes text input and produces text output, functioning primarily in the language domain.

**Why it matters**

  * Enables fluent human-machine communication: you can ask questions, request summaries or code, get coherent responses.

  * Powers reasoning, planning, summarization and generation across domains (business, science, code, creative work).

  * Forms the cognitive backbone of larger systems, enabling “thinking” in natural language.

**Architectural overview**

1. **Text Encoder/Decoder**: A transformer (e.g., GPT, LLaMA) processes the input tokens.

2. **Generation Module**: The model predicts next-tokens (autoregressive) or mask-tokens (bidirectional) to generate output.

3. **Training Data**: Massive text corpora (books, web pages, code) to provide broad domain coverage.

4. **Fine-tuning / Tool-use**: Often fine-tuned on instructions, can call external tools/agents.

**Example use-cases**

  * Chatbots and virtual assistants (“Explain quantum entanglement”).

  * Code generation, refactoring, commenting (“Write a Python script to monitor Azure AKS GPU usage”).

  * Document summarisation, translation, content generation.

  * Decision-support (“Given these metrics, what actions should our team take?”).

**Challenges & considerations**

  * Hallucinations: Making confident but incorrect statements.

  * Context length: Limited token window; long documents require chaining or retrieval-augmented approaches.

  * Bias & safety: Trained on large web corpora; must be guarded for undesirable output.

  * Scale vs latency: Large models cost compute and require latency/throughput trade-offs.

**LVM**

**What it is**

A VLM is an AI system that ingests visual input (images or video) and textual input, and outputs either text, embeddings, or classification/grounding results that connect vision with language.

**Why it matters**

  * Bridges perception and language: lets the machine “see and talk” about the world.

  * Enables applications such as image captioning, visual question answering, multimodal search, and reasoning about scenes.

  * Serves as a perceptual foundation in more complex systems (e.g., robotics, VLA architectures).

**Architectural overview**

1. **Vision Encoder**: e.g., ViT or ResNet, generates image embeddings.

2. **Language Encoder/Decoder**: e.g., a transformer model processes text.

3. **Cross-modal Fusion**: the model aligns and fuses vision and text features (via cross‐attention).

4. **Heads**: output text, embeddings, classification, etc.

5. **Training Data**: image–text pairs, captions, datasets like COCO, LAION, etc.

**Example use-cases**

  * Describe what’s in an image (“A cat sleeping on a red sofa”).

  * Answer questions about visual scenes (“How many cars are in the photo?”).

  * Ground text in visual reference (“Find the red object in the image”).

  * Multimodal retrieval (“Find images matching this caption”).

**Challenges & considerations**

  * Dataset scale & diversity: Vision–language tasks need large, well-paired data.

  * Alignment quality: Correctly mapping visual regions to language tokens is non-trivial.

  * Generalization: Handling unseen objects or contexts.

  * Latency/compute: Vision encoders are heavy; trade-offs for real-time applications.

**VLA**

**What is a VLA?**

A “Vision-Language-Action” model is an AI system that unifies three modalities:

  * **Vision**: processing images or visual observations

  * **Language**: understanding natural language instructions or queries

  * **Action**: outputting actionable motor commands or trajectories


In other words: given an image (or video) and a textual instruction like “pick up the red block and place it on the green tray”, a VLA model directly maps that input to the action.

**Why it matters**

  * Traditional robotics pipelines often separate perception → planning → control. VLA models aim to collapse those modules into an end-to-end learned model, reducing engineering effort and improving generalization. 

  * They are a key step toward embodied AI — AI systems that don’t just reason abstractly, but perceive and act in the environment. 

  * They allow natural language instructions to be executed by robots, increasing flexibility and human-robot interaction capabilities. 

**Architectural overview**

Here’s a typical VLA architecture structure:

1. Vision–Language Encoding

  * A pre-trained vision-language model (VLM) ingests image(s) + instruction text, producing a latent representation. 

2. Action Decoder / Policy Head

  * The latent representation is fed to a module that outputs actions. These actions might be:

    * Discrete tokens (e.g., “move arm to x,y,z; open gripper”) 

    * Continuous trajectories (especially for higher DoF robots) 

3. Training Data

  * Usually large-scale datasets pairing (image, instruction) → action trajectory. Can be from simulators or real robots. 

4. Fine-tuning / Transfer

  * Pre-training on general vision-language data, then fine-tune on robotic action tasks. 

**Example use-cases**

  * A robot in a warehouse: instruction “pick up the blue box behind the yellow one” → VLA model processes camera image + text → outputs motor commands.

  * A home assistant robot: “fetch the green mug from the table” → integrated vision + language + action. 

  * Multi-task robots: generalized across tasks without heavy task-specific programming.

**Challenges & considerations**

  * **Action representation**: Discrete vs continuous — discrete tokenization simplifies output but may reduce fidelity. Continuous outputs require more complex modelling. 

  * **Data scale & diversity**: Need diverse image/instruction/action pairs to generalize well.

  * **Real-world constraints**: Latency, dynamics, safety, environment variability can hamper performance.

  * **Generalization**: Handling unseen objects, environments or instructions is still hard. 

  * **Temporal coherence**: Many tasks require tracking over time rather than single-frame decisions; some models address this. 

**World Model(WM)**

**What it is**

A World Model is a learned representation of environment dynamics: it takes current state and action input and predicts future states (and often rewards), enabling a model of how the world evolves.

**Why it matters**

  * Enables agents to simulate outcomes of actions before executing them — reducing risk and improving planning.

  * Forms the core of model-based RL and embodied AI systems: the agent doesn’t only act, but “imagines” and evaluates.

  * Particularly useful when real-world interactions are expensive or risky (robotics, control systems).

**Architectural overview**

1. **State Encoder**: Converts sensor observations (images, proprioception) into a latent state.

2. **Transition Model**: Predicts next latent state given current state + action.

3. **Decoder (optional)**: Maps latent to visual/state output (e.g., next image).

4. **Reward/Outcome Head**: Predicts reward or other task relevant metrics.

5. **Training Data**: Tuples of (state, action, next_state, reward) typically from simulation or real-world logs.

**Example use-cases**

  * A robot predicting the result of pushing a block (“If I push it left, will it fall off the table?”).

  * Planning ahead in autonomous vehicles (“If I change lanes now, what’s the expected trajectory in 5 s?”).

  * Data-efficient RL: world model reduces needed real interactions by learning a simulator.

  * Safety monitoring: simulate critical sequences and detect potential hazards.

**Challenges & considerations**

  * Model accuracy: Small errors in transition predictions compound over time (model collapse).

  * Representation learning: Choosing latent space vs raw state, balancing detail vs compactness.

  * Reality gap: If trained in simulation, transferring to real world (sim-2-real) is tough.

  * Compute & horizon: Long-horizon predictions require more compute and can degrade reliability.

**Comparative Table (Deep View)**

| **Feature**            | **LLM**             | **VLM**                     | **VLA**                            | **World Model**                   |
| :--------------------- | :------------------ | :-------------------------- | :--------------------------------- | :-------------------------------- |
| **Modality**           | Text                | Vision + Text               | Vision + Text + Action             | Vision + Text + Action + Dynamics |
| **Temporal Reasoning** | Contextual (static) | Minimal                     | Required                           | Central                           |
| **Training Signal**    | Text likelihood     | Cross-modal alignment       | Action imitation / RL              | Predictive dynamics               |
| **Output Space**       | Language tokens     | Text / embeddings           | Action tokens / trajectories       | Predicted next states / rewards   |
| **Core Objective**     | Sequence modeling   | Multimodal alignment        | Behavior generation                | Environment simulation            |
| **Knowledge Type**     | Semantic            | Perceptual                  | Procedural                         | Causal / Physical                 |
| **Example Models**     | GPT-4, LLaMA-3      | CLIP, GPT-4V                | RT-2, PaLM-E                       | Dreamer, Genie, WorldGPT          |
| **Use Case**           | Reasoning, text gen | Captioning, QA              | Robotics, embodied AI              | Planning, simulation, imagination |
| **Analogy**            | “Brain that talks”  | “Brain that sees and talks” | “Brain that sees, talks, and acts” | “Brain that imagines outcomes”    |

