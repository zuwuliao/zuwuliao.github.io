---
layout: page
title: GPU Memory for AI Models
---

**Memory Requirements for model training and inferencing:**
The amount of memory required for model training and inferencing depends on several factors, including the model's size, the precision of the data, and the type of optimizer used: 
 
    * Model size
Larger models require more memory. For example, a 13B parameter model quantized to 8-bit precision (Q8) would need approximately 13GB of VRAM. 
    * Data precision
The memory requirements for a 1 billion parameter model are: 
        ○ 4 GB for float precision 
        ○ 2 GB for BF16 precision 
        ○ 1 GB for int8 precision 
    * Optimizer type
The memory needed for optimizer states depends on the type of optimizer used. For example, the AdamW optimizer requires twice the number of parameters, while the SGD optimizer requires memory equivalent to the number of parameters. 
    * Batch size
The total memory required is proportional to the batch size. For example, if one sample requires 50MB of memory, a batch size of 32 would require 1600MB of memory. 
    * Training vs inference
Training tasks require storing model parameters, gradients, and intermediate states, while in inference tasks, the intermediate states do not need to be saved. 
 
**Calculate GPU memory for serving LLMs**
https://training.continuumlabs.ai/infrastructure/data-and-memory/calculating-gpu-memory-for-serving-llms

**Calculating GPU memory for serving LLMs**
How many GPUs do I need to be able to serve Llama3 70 billion parameter model? 
In order to answer that, you need to know how much GPU memory will be required by the model. The formula is:

$$
M = \left( \frac{P \times 4B}{\left( \frac{32}{Q} \right)} \right) \times 1.2
$$

| Symbol | Description                                                                 |
|--------|-----------------------------------------------------------------------------|
| *M*    | GPU memory expressed in Gigabyte                                            |
| *P*    | The amount of parameters in the model                                       |
| 4B     | 4 bytes, expressing the bytes used for each parameter                       |
| 32     | There are 32 bits in 4 bytes                                                |
| *Q*    | The amount of bits that should be used for loading the model — 16, 8, or 4 bits |
| 1.2    | Represents a 20% overhead of loading additional things in GPU memory        |

![pic 1](/images/GPU-Memory-for-AI-Model-pic1.png "pic 1")

**GPU memory required for serving Llama 70B**
Let's try it out for Llama 70 billion parameter model that we will load in 16 bit number format. 

$$
M = \left( \frac{70 \times 10^9 \times 4\, \text{bytes}}{(32 / 16)} \right) \times 1.2 
= \left( 140 \times 10^9 \, \text{bytes} \right) \times 1.2 = 168\, \text{GB}
$$

To run this model, you would require two NVIDIA A-100 80GB memory models.
A single A100 80GB wouldn't be enough, although 2x A100 80GB should be enough to serve the Llama **How to further reduce GPU memory required for Llama 2 70B?**

**Using FP8 (8-bit floating-point)**
To calculate the GPU memory requirements for training a model like Llama3 with 70 billion parameters using different precision levels such as FP8 (8-bit floating-point), we need to adjust our formula to fit the new context. 
Let's define a general formula first, and then apply it specifically for FP8.
For the FP8 precision:

    * Bytes per parameter (b) is 1 byte
    * Bit width used (Q) is 8 bits
    * 𝑃=70×109- 70 billion parameters
    * 𝑏=1- byte per parameter (since 8 bits = 1 byte)
    * overhead=1.2 - representing a 20% overhead
    * 𝑄= 8 bits

Substitute the values into the formula:

$$
M = \left( \frac{70 \times 10^9 \times 1\, \text{byte}}{(32 / 8)} \right) \times 1.2
$$

Next:

$$
M = \left( \frac{70 \times 10^9\, \text{bytes}}{4} \right) \times 1.2
$$

Next:

$$
M = (17.5 \times 10^9 \, \text{bytes}) \times 1.2
$$

Work out the memory requirements:

$$
\begin{align*}
M &= 21 \times 10^9 \text{ bytes} \\
M &= 21\ \text{GB}
\end{align*}
$$

Therefore, the memory requirement for training the Llama3 model with 70 billion parameters using FP8 precision is a much lower 21 GB.

**General Process**

Determine the number of parameters in the model (P)

    * The model size is often expressed in billions (B) of parameters.
    * For example, a 7B model has 7 billion parameters.

Identify the data type used for the model parameters

    * Common data types include:
    * float (32-bit floating point): 4 bytes per parameter
    * half/BF16 (16-bit floating point): 2 bytes per parameter
    * int8 (8-bit integer): 1 byte per parameter
    * int4 (4-bit integer): 0.5 bytes per parameter

Calculate the storage size of the model (S)

    * Multiply the number of parameters (P) by the size of the data type.
    * For example, a 7B model using BF16 would have a storage size of: S = 7 billion * 2 bytes = 14 billion bytes ≈ 14 GB

Estimate the memory required for inference (M_inf)
    * The memory required for inference is approximately equal to the storage size (S).
    * M_inf ≈ S

Estimate the memory required for training (M_train)

    * Training typically requires 3 to 4 times the memory needed for inference.
    * A conservative estimate is to multiply the inference memory (M_inf) by a factor of 4.
    * M_train ≈ M_inf * 4
    * For example, training a 7B model using float parameters would require: M_train ≈ 7 billion * 4 bytes * 4 = 112 GB

Consider memory requirements for gradients and optimizer states

    * During training, additional memory is needed for gradients and optimiser states.
    * The memory required for gradients is equal to the number of parameters (P).
    * The memory required for optimizer states depends on the optimizer used:
    * AdamW optimizer: 2 * P
    * SGD optimizer: P

Adjust for additional memory overhead

    * Training may require additional memory for intermediate computations and data storage.
    * Add a safety margin of 10-20% to the estimated training memory (M_train).

Consider memory-efficient training techniques

    * Techniques like LoRA (Low-Rank Adaptation) and QLoRA can reduce memory requirements.
    * These techniques involve training a smaller model while running inference on the original model.
    * The total memory used is the sum of the memory required for inference on the original model and the memory needed for training the smaller model.

Here's an example calculation for training a 13B model using float parameters:

    * Number of parameters (P) = 13 billion
    * Data type: float (4 bytes per parameter)
    * Storage size (S) = 13 billion * 4 bytes ≈ 52 GB
    * Inference memory (M_inf) ≈ 52 GB
    * Training memory (M_train) ≈ 52 GB * 4 = 208 GB
    * Additional memory for gradients = 13 billion * 4 bytes ≈ 52 GB
    * Additional memory for AdamW optimizer states = 2 * 13 billion * 4 bytes ≈ 104 GB
    * Total estimated memory for training = 208 GB + 52 GB + 104 GB = 364 GB
    * With a 20% safety margin, the final estimate would be: 364 GB * 1.2 ≈ 437 GB

This framework provides a rough estimate of the memory requirements for training LLMs based on storage usage. However, actual memory usage may vary depending on the specific model architecture, implementation details, and hardware characteristics. It's always a good idea to have some extra memory available to accommodate any additional overhead or unexpected memory usage during training.


