---
layout: page
title: Test-to-Image AI Challenges
---

You probably found the AI generated text in the image are usually incorrect and poor quality. It could contain misspelled or garbled words, jumbled or mispositioned letters, missing or extra characters, misaligned letters, inconsistent font/style in a word, etc. Why does the powerful image generation AI model can generate high quality beautiful image, but not be able to get the word correct? What makes the correct text so hard to generate? Let’s try to understand it today.

## Text-to-image models primarily use three main architectures: 

**Autoregressive (AR) Models**
Autoregressive models generate images sequentially, predicting each image token based on previous tokens, similar to how language models generate text. They divide images into discrete code tokens and generate them in order.

**Example Models:**

**DALL-E (Original, v1)** – Used a discrete VQVAE (Vector Quantized Variational Autoencoder) to tokenize images and generate them sequentially using a Transformer.

**ImageGPT** – Adapted the GPT-style transformer for pixel-by-pixel image generation.

**Diffusion Models**
Diffusion models generate images by progressively refining noise into a coherent image. They work iteratively, learning to denoise random noise to match a target image distribution.

**Example Models:**

**DALL-E 2** – Uses a CLIP-based text encoder and diffusion decoder to generate images from text.

**Stable Diffusion** – Uses a Latent Diffusion Model (LDM) that generates images in a compressed latent space, making it more efficient.

**Imagen (by Google)** – Uses a large T5 text encoder combined with a diffusion-based image decoder for high-fidelity generation.

**Generative Adversarial Networks (GANs)**
GAN-based models use two neural networks: a generator that creates images and a discriminator that evaluates their realism. Though less common in modern text-to-image generation, they were influential in early developments.

**Example Models:**

**AttnGAN** – Uses an attention mechanism to refine image details step by step.

**StyleGAN** with Text Embeddings – Some variations integrate text conditions into StyleGAN for guided generation.

**Hybrid Architectures**
Some models combine elements of these approaches for improved performance.

**Example Models:**

**Parti (Google)** – Uses an autoregressive Transformer to generate image tokens but applies diffusion-like refinement.

**Muse (Google)** – Uses a masked token-based diffusion approach, blending transformer and diffusion techniques.

## Reasons:
No matter what architecture the AI image generation model is, there is the text generation challenge. There are many reasons to cause it hard to do. The main reasons are below:

**Model Architecture and Operation:**

Text-to-image models struggle with text rendering because they operate in a continuous latent space, which represents images as a mix of features rather than discrete symbols like letters. This causes models to treat text as a visual pattern rather than a structured sequence of characters, leading to merged or distorted letters.

Additionally, compression techniques like Variational Autoencoders (VAEs) further degrade fine details, making it even harder for the model to form letters accurately.  Without a clear concept of the alphabet internally, these models tend to produce text that looks almost right but often ends up being misspelled or poorly structured.

Diffusion models face their own set of challenges when it comes to consistency in text generation. Their step-by-step denoising process can mess with small structured elements, like letters. Unlike how humans write, ensuring distinct letter shapes, diffusion models refine noise through multiple iterations, which typically results in characters that vary or appear deformed. Since these models focus on making images look realistic rather than ensuring text accuracy, they don't have the best methods to keep letter shapes uniform, causing inconsistencies within the same word and resulting in text that’s hard to read.

AR models create images one piece at a time using discrete code tokens, but they often miss the details of letter sequences, leading to common misspellings. Plus, AR models that generate images pixel by pixel can accumulate small errors, which may eventually distort the text.

Transformer-based diffusion models rely on pretrained language encoders like CLIP or T5, which convert text prompts into high-level semantic tokens rather than focusing on specific letter representations. Because of this, the text embeddings lack a spatial structure, making it tricky to align words with individual letter shapes—this often results in missing or extra characters in the output.

**Attention:**

Transformer struggle with generating sequential text in image because their attention mechanism doesn't enforce letter-by-letter order. Rather than processing text in a sequential manner, image models distribute their attention across pixels or patches, resulting in a lack of understanding of how text should flow.

**Tokenization:**

When a word is treated as a single token, the model attempts to render it as a whole, often leading to jumbled or disordered letters. Without a structured constraint for character placement, the model prioritizes text appearance over precise spelling, resulting in inconsistencies like swapped, missing, or misaligned letters.

**Dataset:**

 Most training datasets rarely include clear, labeled text. Typically, they consist of images that have incidental or illegible text, which prevents models from learning how to form characters properly. Instead, they tend to see text more as a decorative element than as informative content. Since captions usually describe objects rather than detailing the exact words in the images, this leads to generating text-like scribbles instead of actual words. What's more, the variety of fonts, languages, and styles can further complicate text consistency. Without precise, labeled training data focused on text, models will prioritize the overall visuals over correct spelling, resulting in low text fidelity in generated images.

## Potential Solutions for Better Text Rendering in AI-Generated Images
Researchers are looking into different ways to enhance text accuracy in text-to-image models:

1. **Character-Level Representations** – By breaking words down into individual letters instead of treating them as complete tokens, models can focus on each character to improve letter positioning and accuracy. It would also be beneficial to incorporate specialized text-drawing modules for precise lettering.

2. **Two-Stage Text Rendering Models** – Splitting text generation from the image creation process leads to better fidelity. One model is dedicated to producing the right letters, while another integrates these letters into the overall image. There are already some tools that use this method, generating an image first and then overlaying it with properly spelled text.

3. **Training on Text-Rich Data** – Feeding models with datasets that include a larger number of images with transcribed text can enhance both recognition and generation. Using synthetic datasets with a range of fonts, scripts, and structured text allows models to learn accurate character formations more effectively.

4. **OCR-Guided Training** – By employing Optical Character Recognition (OCR) as feedback during training, we can ensure that the generated text is legible. If OCR struggles to read the generated text, the model gets adjusted accordingly, leading to better text clarity.

5. **Enhanced Attention and Constraints** – Maintaining a structured text order, such as through grids or sequential constraints, helps keep letter placement in check and avoids messy text output. Adding a small language model for spelling checks could also boost overall accuracy.

6. **User-Guided and Post-Processing Fixes** – AI-driven editing tools let users tweak text after generation by adjusting the letters while keeping the style intact. Hybrid approaches, like letting users overlay their own text, ensure top-notch accuracy.

These strategies are all about narrowing the gap between the structured nature of text and the free-flowing style of image generation, eventually leading to better text rendering in AI-generated images.

## Conclusion: 
Rendering text in images is a complex task for AI because it requires bridging two domains – vision and language – that current models treat very differently. Issues stemming from latent representations, diffusion dynamics, tokenization, attention, and data all contribute to garbled outputs. 