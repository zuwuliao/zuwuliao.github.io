---
layout: post
title: Diffusion LLM - Dream 7B
categories: AI
---

Universaty of Hongkong and Huawei Noah's Ark Lab recently leased a new LLM model Dream 7B. It caught my eyes not only because it beats other SOTA models like Qwen2.5 7B, LLaMA3 8B, at some times, even the latest DeepSeek V3-0324 671B model, but also more importantly, it's a Diffusion model, not AutoRegressive model.

![pic 1](/images/Diffusion-LLM-pic1.png "pic 1")
![pic 2](/images/Diffusion-LLM-pic2.png "pic 2")

In AI field, the common understanding is AutoRegressive(AR) models are good for processing discret signals like language; and Dissusion models(DM) are good for continous signals like image and video. Therefore, most LLM are AR models and Text-to-Image/Text-to-Video are Diffision models. This new Dream 7B diffusion model breaks this rule. Today, I will dig into diffusion LLM model and explore how it works.

**Difference between AR and Diffusion**

AR model generates the token from left-to-right one by one. It predicts sequences by modeling the conditional probability of each element in the sequence based on previous elements. They typically use architectures like:

* Transformers (GPT series): Rely on self-attention mechanisms to model long-range dependencies.
* Recurrent Neural Networks (RNNs): Traditional AR models often use LSTM or GRU layers (less common nowadays due to efficiency).

Typical Generation Process:
$$
p(x) = \prod_{i=1}^{n} p(x_i \mid x_{<i})
$$

Due to the architecture limitation such as context window and attention mechanism, there are some limitations such as scale, including challenges with complex reasoning, long-term planning, and maintaining coherence across extended contexts.

Diffusion model is using a totaly different mechanism to generate tokens. Unlike AR models that generate tokens sequentially, DMs starts from a noise and dynamically refine the full sequence in parallel from a fully noised state. Diffusion models generate data by reversing a gradual noise-adding (forward) diffusion process. The most popular architecture is the Denoising Diffusion Probabilistic Model (DDPM) and variations like Stable Diffusion.

Key Idea:

* A forward process gradually adds Gaussian noise to data.
* The reverse process (learned) removes noise to reconstruct original data.

Typical Generation Process:
$$
q(x_t \mid x_{t-1}) = \mathcal{N}\left(x_t; \sqrt{1 - \beta_t} \, x_{t-1}, \beta_t I\right)
$$

This fundamental architectural difference unlocks several significant advantages:

*. Bidirectional contextual modeling enables richer integration of information from both directions, substantially enhancing global coherence across the generated text.
*. Flexible controllable generation capabilities arise naturally through the iterative refinement process.
*. Potential for fundamental sampling acceleration through novel architectures and training objectives that enable efficient direct mapping from noise to data.

There are a few other Diffusion Language Model(dLLM) are already on the market such as DiffLlaMA and LLaDA those have scaled diffusion language model to 7B parameters. Inceptionlabs.ai has introduced the first commercial dLLM based code generation model, Mercury Coder. When evaluated on standard coding benchmarks, Mercury Coder achieves excellent quality across numerous benchmarks, often surpassing the performance of speed-optimized autoregressive models like GPT-4o Mini and Claude 3.5 Haiku while being up to 10x faster.

**Comparative Summary**

| Aspect                  | AR Models                             | Diffusion Models                              |
|-------------------------|---------------------------------------|-----------------------------------------------|
| **Quality of Output**   | Good, depends on domain (excellent for text) | Excellent for continuous data (images/audio)  |
| **Inference Speed**     | Slow due to sequential nature         | Moderate to slow (many denoising steps)       |
| **Training Complexity** | Moderate                              | Higher complexity                             |
| **Scalability**         | Scalable but memory-intensive         | Parallelizable but computationally intensive  |
| **Suitability for Modality** | Text/Code, sequential data           | Continuous data (images/audio)                |
| **Error Propagation**   | High (Exposure Bias)                  | Low (iterative refinement reduces errors)     |

Now let's come back to Dream 7B model and see how it is built and performances.

**Dream 7B model training**

Dream 7B is pretrained with a mixture of the aforementioned corpus, totaling 580 billion tokens. The pretraining was done on 96 NVIDIA H800 GPUs for 256 hours. The pretraining process went smoothly overall, with occasional node anomalies, and we did not experience any unrecoverable loss spikes.

![pic 3](/images/Diffusion-LLM-pic3.png "pic 3")

One thing to call out is that the research team found using the weights from the existing autoregressive (AR) model is more effective than training the diffusion language model from scratch. Therefore, Dream 7B is initialized with weights from Qwen2.5 7B. (how to migrate weights from AR model to DM to be researched). During the training process, the team finds the learning rate to be especially important. If it’s set too high, it can quickly wash away the left-to-right knowledge in the initial weights, providing little help in the diffusion training, while if it’s set too low, it can hinder diffusion training.

**Inference Flexibility**
Diffusion models offer more flexible inference compared to AR models in the following two main aspects.

**Arbitrary Order**
Diffusion models are not constrained to sequential (e.g., left-to-right) generation, enabling outputs to be synthesized in arbitrary orders—this allows for more diverse user queries.

*. Completion
![pic 5](/images/Diffusion-LLM-pic5.gif "pic 5")

*. Infilling
![pic 6](/images/Diffusion-LLM-pic6.gif "pic 6")


*. Controlling the decoding behavior

Different queries may have preferences for the order in which the responses are generated. One can also adjust the decoding hyperparameters to control the decoding behavior, shifting it from more left-to-right like an AR model to more random-order generation.
![pic 7](/images/Diffusion-LLM-pic7.gif "pic 7")
