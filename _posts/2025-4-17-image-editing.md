---
layout: post
title: Is-GPT-4o-AR-Image-Model?
categories: AI
---

Since GPT-4o was released and demostrate the powerful image generation and editing capabilities, most of AI professionals guess it's AutoRegressive image generation model. I also believe so. However, there isn't evidence to prove it. I don't have any data from OpenAI to prove it either. But, I think there is an indirect way to prove it is the AR model. Here is how.

Let's start from how Diffusion Model generates image. Inspired by @MudTechAI's video [Why Diffusion Models Fail at Local Image Editing](https://www.youtube.com/shorts/zYwwt3hIBpk), I summarize the image editting challenge for DM as below:

**The Problem**

Diffusion models often make unintended changes during image editing. For example: I generate an image using Stable Diffision 3.5 running on Azure AI Foundry. The prompt is "generate a picture with a cat watching the fishes in an aquarium tank". Here is the picture:

![pic 1](/images/AR-Model-SD-1.png "pic 1")

Now I want change the cat to a dog. First of all, there isn't direct way to say change some object in the picture. If I put the same prompt and ask it to change the cat to a dog. It generates a totally different picture for cat, without dog in it. It seems the DM dosen't understand the meaning of 'change'. Therefore, I use the picture it just generated, click on 'edit prompt' and change the 'cat' to 'dog'. Then I got this picture:

![pic 2](/images/AR-Model-SD-2.png "pic 2")

You can see it is a totally different picture. It doesn't maintain any infomation from the previous picture from front to background. 

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

Now, let's look at how GPT-4o behavior. I use the same prompt "generate a picture with a cat watching the fishes in an aquarium tank". Here is the picture it generates:

![pic 3](/images/AR-Model-1.png "pic 3")

Then, I ask to change the cat to a dog in the same dialog. This is what I got:

![pic 4](/images/AR-Model-2.png "pic 4")

From the picture, you can tell the backgroud is almost the same. The only change is the object of 'cat'.

Now, I ask GPT-4o to add words 'what are you looking at' at the top of the picture in the dialog. Then I got this:

![pic 5](/images/AR-Model-3.png "pic 5")

The picture remains the same with words "what are you looking at" displayed on it.

Then, I ask it "change the words to be 'what are you thinking of'" in the dialog. Here is what I got:

![pic 6](/images/AR-Model-4.png "pic 6")

You can see how good the GPT-4o maintain the same picture with the very precise change to the object you asked to change. This kind of precise and accuracy isn't DM model can do. From this behavior, I can pretty sure GPT-4o is the AR model, not DM model.

