---
layout: post
title: Is-GPT-4o-AR-Image-Model?
categories: AI
---

Since GPT-4o was released and demostrate the powerful image generation and editing capabilities, most of AI professionals guess it's AutoRegressive image generation model. I also believe so. However, there isn't evidence to prove it. I don't have any data from OpenAI to prove it either. But, I think there is an indirect way to prove it is the AR model. Here is how.

Let's start from how Diffusion Model generates image. Inspired by @MudTechAI's video [Why Diffusion Models Fail at Local Image Editing](https://www.youtube.com/shorts/zYwwt3hIBpk), I summarize the image editting challenge for DM as below:

The Problem
    Diffusion models often make unintended changes during image editing. For example:
    I generate an image using Stable Diffision 3.5 running on Azure AI Foundry. The prompt is "generate a picture with a cat watching the fishes in an aquarium tank". Here is the picture:
    ![pic 1](/images/AR-Model-SD-1.png "pic 1")

    Now I want change the cat to a dog. First of all, there isn't direct way to say change some object in the picture. If I put the same prompt and ask it to change the cat to a dog. It generates a totally different picture for cat, without dog in it. It seems the DM dosen't understand the meaning of 'change'. Therefore, I use the picture it just generated, click on 'edit prompt' and change the 'cat' to 'dog'. Then I got this picture:
    ![pic 2](/images/AR-Model-SD-2.png "pic 2")

Why This Happens
    Diffusion models are structurally not designed for local edits. Their process relies on inversion (reverse denoising), which is complex and error-prone.

Key Concepts
    1. Diffusion Process:
    Starts from random noise → progressively denoised → final image.
    2. Inversion:
    Given an image, try to reverse it to the original noise seed.
        ○ Problems:
            *§* Non-unique: One image could come from many noise seeds.
            *§* Error-prone: Small inversion errors get amplified during generation.
            *§* Global influence: Prompts affect the whole image, not just one region.
    3. Editing Consequences:
    Even with perfect inversion, any prompt like "turn a horse into a zebra" may repaint the entire image, not just the horse.
