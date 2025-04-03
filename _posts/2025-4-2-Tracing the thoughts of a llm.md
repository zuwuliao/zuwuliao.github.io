---
layout: post
title: How LLMs do math
categories: AI
---

Recently, Anthropic released a paper to reveal how LLM is thinking before it provides outputs to you. Check out [Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model). The paper is [here](https://transformer-circuits.pub/2025/attribution-graphs/biology.html).

Since LLM was born, how it works is a blackbox to us. The large amount of parameters and nueron networks make the trace is extremely difficult. This paper dives into Claude 3.5 Haiku models and captures some interesting facts that how Cloude thinks before predict the next token. There are a few topics in this paper answer our long time standing questions, like how LLM handle multi-language, whether the model plan ahead before predict the next word, how the refusal and jailbreak works, why there is hullucination, unfaithful Chain-of-Thought(CoT), and more. Knowing how LLM works inside the model itself would help us understand what we can trust from the LLM outputs and what not. 

In this post, I want to focus on one interesting topic this paper described, that is how LLM make mathmatic addition. Before this paper, we kind of know LLM is not good at math. But some times, it does give you the right answer if you ask it do some math such as addition. It could be right when the number is relatively small. However, it often gives you wrong answer when the number is large such as 2353103 x 87210313. 

![pic 1](/images/LLM-math-pic1.png "pic 1")
![pic 2](/images/LLM-math-pic2.png "pic 2")

Why does LLM give us the wrong answer like that? The paper shows how LLM comes with that answer. Using 36+59 as the example, LLM gives the right answer. Since the model isn't calculator, we assume the model might remember the answer from the large training dataset. The research shows us the surprising method the model is using to come with the correct answer. How it works? The researcher found Claude takes multiple paths in parallel. One path computes a rough approximation of the answer and the other focuses on precisely determining the last digit of the sum. 

![pic 3](/image/LLM-math-pic3.png "pic 3")

The detail is a bit complex. It illustrates in the diagram below.

![pic 4](/image/LLM-math-pic4.png "pic 4")

Regardless of whether this is smart or stupid method, what we can tell is this is not the proper way to get mathmatic answer correctly. Basically, the LLM is guessing the answer instead of calculating. It does answer the question why LLM cannot give you the correct answer if the two operands are large such as above numbers in muliplication.

I think this paper is very helpful for us to understand what LLM is and what it is good at. LLM can be a good tool only when we have the right expectation and put it in the right use cases. Further thinking would lead us to think about if Generative AI or LLM is the right way to lead us to AGI. Maybe not...