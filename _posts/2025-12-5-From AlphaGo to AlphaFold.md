---
layout: post
title: From AlphaGo to AlphaFold - This Is What AI Should Be
categories: AI
---

AI has had a significant impact on human society—some of it positive, some negative. Many jobs have been replaced or reshaped by AI technologies, leading us to question what role AI should play in our future.

DeepMind offered one possible answer. In 2016, it created AlphaGo, which stunned the world by defeating Go champion Lee Sedol using deep neural networks. It's a historic moment that demonstrated AI's potential to surpass human intelligence in complex tasks. If you haven't watch the AlphaGo movie, I would recommend you to watch it - [AlphaGo](https://www.youtube.com/watch?v=WXuK6gekU1Y&t=17s). Then, in 2020, OpenAI introduced ChatGPT, introducing a global AI revolution. But these breakthroughs raise a deeper question: Is this the kind of AI we want? Or should AI be designed to serve a greater good for all of humanity?

In my opinion, AlphaFold provides the best answer. By solving the grand challenge of predicting protein structures, AlphaFold achieved in short time what scientists have been working towards for over six decades. Across that time, all scientists around the world found about 150,000 protein structures. Then in one fell swoop, AlphaFold came in and unveiled over 200 million of them with near-perfect accuracy. This is almost all known proteins in nature. This is a powerful example of how AI can be used not to replace humans, but to unlock new possibilities for human progress.

---

**AlphaFold**

AlphaFold is an AI system developed by Google DeepMind that predicts a protein’s 3D structure from its amino acid sequence with high accuracy. Proteins are crucial to all biological life. Their 3D shapes determine what they do — from fighting infections to breaking down food. Knowing these shapes helps:

  * Understand how diseases work.

  * Design new drugs.

  * Engineer new enzymes or treatments.

But experimentally figuring out protein structures is slow and expensive.

AlphaFold discovers structure by learning these statistical couplings and geometric constraints using deep neural networks. How AlphaFold Works

AlphaFold uses:

  * A deep neural network trained on existing protein data.

  * Patterns learned from evolutionary sequences and known protein shapes.

  * A transformer-based architecture that models relationships between amino acids.

It outputs both:

  * The 3D coordinates of atoms.

  * A confidence score for each part of the structure.

The methods to construct predictions of protein structures look like:

![pic 1](/images/AlphaFold-1.jpg "pic 1")

The below picture shows the comparison between ground truth structure and AlphaFold generated structure. It shows how close the generated structure is to the true one.

![pic 2](/images/AlphaFold-2.gif "pic 2")

---

**AlphaFold Network**

AlphaFold predicts protein structures with high accuracy by using a custom deep learning architecture that combines ideas from evolution, physics, and geometry. This customed Transformer based neural network is the key to AlphaFold's success.

It works in two main stages. First, the Evoformer processes evolutionary information from multiple sequence alignments (MSAs) and relationships between amino acid pairs, learning both biological and spatial patterns through attention-based mechanisms. Then, the structure module takes this processed data and builds a 3D model by assigning each residue a position and orientation in space. This module refines the structure iteratively using a technique called recycling, where the model reuses its own outputs to improve predictions further. Key innovations include a novel architecture for reasoning over sequences and residue pairs, a geometry-aware attention mechanism, and a loss function that encourages accurate orientations. Together, these components enable AlphaFold to predict protein structures with atomic-level precision.

**AlphaFold Network Architecture**

![pic 3](/images/AlphaFold-Network.jpg "pic 3")

**Summary**

After all we learned from AlphaFold, I want to say this is the kind of AI we should aim for: not one that simply competes with us, but one that helps us solve humanity’s most complex challenges.

---

**Reference:**

  * AlphaFold Paper - [Highly accurate protein structure prediction with AlphaFold](https://www.nature.com/articles/s41586-021-03819-2)

  * Google Deepmind Blog - [methods to construct predictions of protein structures](https://deepmind.google/blog/alphafold-using-ai-for-scientific-discovery/)

  * Google Deepmind Blog - [AlphaFold reveals the structure of the protein universe](https://deepmind.google/blog/alphafold-reveals-the-structure-of-the-protein-universe/)
  
  * AlphaFold Protein Structure Database - [AlphaFold protein structure DB](https://alphafold.ebi.ac.uk/)

  * Youtube Video - [AlphaFold - The Most Useful Thing AI Has Ever Done](https://www.youtube.com/watch?v=P_fHJIYENdI)

  * AlphaFold github repo - [alphafold repo](https://github.com/google-deepmind/alphafold)