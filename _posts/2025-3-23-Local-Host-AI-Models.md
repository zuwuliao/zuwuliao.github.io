---
layout: post
title: Local Host AI Models
categories: AI
---

There are many reasons you may want to host AI models on your local machine. For examples, you want to run use AI models with poor or no Internet connection area; or you don’t want to send your data to public shared AI service provider for security reason. But LLM usually contains too many parameters which requires lots of compute and memory capacity. Can we host AI LLM model on our local server or even on our personal computers? The answer is YES.

There are some limitation for sure to run the LLM on the local machine. For example, full size of  Llama 3.1 is 405B parameters model require significant storage and computational resources, occupying approximately 750GB of disk storage space and necessitating two nodes on MP16 for inferencing. It’s not easy for individuals to run it locally. Therefore, we are looking for some small quantized models(refer to my other blogs for quantization introduction) or distillation models.

The tools we are going to use in this article is Ollama and LM Studio


### Ollama

** Ollama - Run LLM locally **

*https://ollama.com/*

 

**Install Ollama:**

Download ollama from https://ollama.com and run the package

 

**Run LLM model:**

1. Pull the model

    Ollama pull phi3

2. Run the model

    Ollama run phi3

 

If you are not familiar with CLI or want to have the same user experience as ChatGPT with GUI interface, you can install Ollama Web UI. It is using docker to run.

**Run Ollama Web UI:**

1. Install docker and run

2. Run the following command:

*docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name   open-webui --restart always ghcr.io/open-webui/open-webui:main*

3. On browser:

http://localhost:3000

4. Select model to chat:
![pic 1](/images/local-host-ai-model-pic1.png "pic 1")

Ollama run DeepSeek R1 models:

https://ollama.com/library/deepseek-r1:8b

ollama run deepseek-r1:8b

ollama pull deepseek-r1:8b

DeepSeek R1 Ollama local deployment:

https://snowkylin.github.io/blogs/a-note-on-deepseek-r1.html

 

Another method you can use that is LM Studio:

### LM Studio:

1. download LM Studio and install

    https://lmstudio.ai/

2. select LLM model to download on LM Studio
![pic 2](/images/local-host-ai-model-pic2.png "pic 2")

Now you can chat with LLM on LM Studio just like you chat online:
![pic 3](/images/local-host-ai-model-pic3.png "pic 3")

Please Note, LM Studio has RAG capability. You can upload a file and chat with it offline. This is super useful for some private and highly sensitive documents process. 

https://lmstudio.ai/docs/app/basics/rag