---
layout: post
title: Is GPT-4o AR Image Model?
categories: AI
---

Since the release of GPT-4o and its demonstration of powerful image generation and editing capabilities, many AI professionals have speculated that it uses an autoregressive (AR) image generation model. I tend to agree. However, there is currently no direct evidence to confirm this, and I don’t have any internal data from OpenAI to support the claim. Still, I believe there is an indirect way to demonstrate that GPT-4o may indeed use an AR-based approach. Here’s how.

Let’s begin by considering how diffusion models generate images. Inspired by @MudTechAI's video [Why Diffusion Models Fail at Local Image Editing](https://www.youtube.com/shorts/zYwwt3hIBpk), I’ve summarized the main challenge of image editing with diffusion models as follows:


**The Problem**

Diffusion models often make unintended changes during image editing. For example, I generated an image using Stable Diffusion 3.5 running on Azure AI Foundry. The prompt was:
“Generate a picture with a cat watching the fishes in an aquarium tank.”
Here is the result:

![pic 1](/images/AR-Model-SD-1.png "pic 1")

Now, I want to change the cat in the image to a dog. However, there isn’t a direct way to simply tell the model to “change” one object in the picture. If I re-enter the same prompt and ask it to replace the cat with a dog, the model generates an entirely new image—often still featuring a cat, and sometimes with no dog at all. It appears that the diffusion model doesn’t fully understand the concept of changing an element while keeping the rest of the image intact.

To work around this, I used the original image and clicked on “Edit Prompt.” I then changed the word “cat” to “dog” and submitted the updated prompt. Here is the new image I received:

![pic 2](/images/AR-Model-SD-2.png "pic 2")

As you can see, the new image is completely different. It doesn’t preserve any elements from the original—neither the composition nor the background remain the same. From foreground to background, everything has been regenerated. This illustrates a core limitation of diffusion models: they often fail to retain local or structural consistency when editing existing images.

**Why This Happens**

Diffusion models are structurally not designed for local edits. Their process relies on inversion (reverse denoising), which is complex and error-prone.

**Key Concepts**

1. Diffusion Process
    Starts from random noise → progressively denoised → final image.

2. Inversion:
    Given an image, try to reverse it to the original noise seed.

    * Problems:
        * Non-unique: One image could come from many noise seeds.
        * Error-prone: Small inversion errors get amplified during generation.
        * Global influence: Prompts affect the whole image, not just one region.

3. Editing Consequences:
    Even with perfect inversion, any prompt like "change the cat to a dog" may repaint the entire image, not just the cat.

Now, let’s look at how GPT-4o behaves with the same task. I used the identical prompt:
“Generate a picture with a cat watching the fishes in an aquarium tank.”
Here is the image it produced:

![pic 3](/images/AR-Model-1.png "pic 3")

Then, I ask to change the cat to a dog in the same dialog. This is what I got:

![pic 4](/images/AR-Model-2.png "pic 4")

From the image, you can see that the background remains nearly identical to the original. The only noticeable change is the replacement of the cat with a dog. This suggests that GPT-4o is capable of isolating and modifying specific elements in an image while preserving the overall structure—a capability diffusion models struggle with.

Next, I asked GPT-4o to add the phrase “What are you looking at?” as a dialogue caption at the top of the image. Here’s the result:

![pic 5](/images/AR-Model-3.png "pic 5")

The image remained unchanged, except for the addition of the text:
“What are you looking at?”
The composition, colors, and subject stayed exactly the same—GPT-4o simply overlaid the requested phrase at the top of the image.

Next, I asked it to change the text to:
“What are you thinking of?”
Here’s the result:

![pic 6](/images/AR-Model-4.png "pic 6")

As you can see, GPT-4o maintains the image with remarkable consistency, applying only the specific change requested—whether replacing an object or modifying the text. This level of precision and localized control is something that current diffusion models struggle to achieve.

Based on this behavior, I am fairly confident that GPT-4o uses an autoregressive (AR) image generation model, rather than a diffusion-based approach.

