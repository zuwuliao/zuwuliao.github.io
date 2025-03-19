---
layout: post
title: "Test-to-Image Challenges"
date: 2023-10-01
---
You probably found the AI generated text in the image are usually incorrect and poor quality. It could contain misspelled or garbled words, jumbled or mispositioned letters, missing or extra characters, misaligned letters, inconsistent font/style in a word, etc. Why does the powerful image generation AI model can generate high quality beautiful image, but not be able to get the word correct? What makes the correct text so hard to generate? Let’s try to understand it today.

Text-to-image models primarily use three main architectures: 

Autoregressive (AR) Models
Autoregressive models generate images sequentially, predicting each image token based on previous tokens, similar to how language models generate text. They divide images into discrete code tokens and generate them in order.

Example Models:

DALL-E (Original, v1) – Used a discrete VQVAE (Vector Quantized Variational Autoencoder) to tokenize images and generate them sequentially using a Transformer.

ImageGPT – Adapted the GPT-style transformer for pixel-by-pixel image generation.

Diffusion Models
Diffusion models generate images by progressively refining noise into a coherent image. They work iteratively, learning to denoise random noise to match a target image distribution.

Example Models:

DALL-E 2 – Uses a CLIP-based text encoder and diffusion decoder to generate images from text.

Stable Diffusion – Uses a Latent Diffusion Model (LDM) that generates images in a compressed latent space, making it more efficient.

Imagen (by Google) – Uses a large T5 text encoder combined with a diffusion-based image decoder for high-fidelity generation.

Generative Adversarial Networks (GANs)
GAN-based models use two neural networks: a generator that creates images and a discriminator that evaluates their realism. Though less common in modern text-to-image generation, they were influential in early developments.

Example Models:

AttnGAN – Uses an attention mechanism to refine image details step by step.

StyleGAN with Text Embeddings – Some variations integrate text conditions into StyleGAN for guided generation.

Hybrid Architectures
Some models combine elements of these approaches for improved performance.

Example Models:

Parti (Google) – Uses an autoregressive Transformer to generate image tokens but applies diffusion-like refinement.

Muse (Google) – Uses a masked token-based diffusion approach, blending transformer and diffusion techniques.

