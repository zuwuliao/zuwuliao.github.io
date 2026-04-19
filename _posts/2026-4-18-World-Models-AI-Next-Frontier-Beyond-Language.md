---
layout: post
title: World Models - AI's Next Frontier Beyond Language
categories: AI
---

**World models are learned internal simulators of reality — systems that predict how an environment evolves, how actions change it, and how to plan inside it. In 2025-2026, they have vaulted from niche research curiosity to the strategic center of AI, backed by billions of dollars and the field's most prominent researchers.**

*Based on a research report compiled April 2026, drawing from arXiv, Nature, NeurIPS, CVPR, ICLR proceedings, company announcements, and press coverage.*

---

## 1. The Bet Against Language Alone

Within twelve months, Meta released V-JEPA 2, Google DeepMind unveiled Genie 3, NVIDIA opened Cosmos, Fei-Fei Li's World Labs shipped a commercial product called Marble, Yann LeCun left Meta to found a billion-dollar startup built entirely around this idea, and LeWorldModel demonstrated the first stable end-to-end JEPA trainable on a single GPU. The common bet: that scaling text-based large language models will not, by itself, produce machines that understand the physical world, and that a different kind of model — grounded in video, action, and 3D/4D geometry — is the missing piece for robotics, autonomous vehicles, scientific simulation, and ultimately artificial general intelligence.

The intellectual lineage runs from Kenneth Craik's 1943 "small-scale model" hypothesis through Schmidhuber's 1990 recurrent controller-world model and Ha & Schmidhuber's 2018 "World Models" paper to today's generative 3D world engines. What has changed is scale, stakes, and money: the research debate is now also a commercial race — and it is global.

## 2. What a World Model Actually Is

A world model is a learned, typically compressed, internal representation of an environment's dynamics that an agent can use to **predict, simulate, plan, and reason counterfactually** about future states conditioned on actions.

Ha & Schmidhuber's 2018 *World Models* paper (arXiv:1803.10122) grounds the idea in neuroscience: humans develop a mental model of the world based on what they are able to perceive with their limited senses, and our ability to hit a 100 mph fastball relies on our instinctive ability to predict when and where the ball will go. Their architecture split an agent into three modules:

1. **V (Vision)** — a VAE that compresses frames into latent representations
2. **M (Memory)** — an MDN-RNN that predicts the next latent given an action
3. **C (Controller)** — a tiny controller evolved by CMA-ES

The remarkable result: an agent trained **entirely inside its own "hallucinated dream"** could transfer to real VizDoom and CarRacing-v0 environments.

**2.1 Neuroscience Roots**

The conceptual foundations go much deeper than 2018. Scottish psychologist Kenneth Craik wrote in *The Nature of Explanation* (Cambridge, 1943) that if an organism carries a small-scale model of external reality and of its possible actions within its head, it is able to try out various alternatives and react in a much fuller, safer, and more competent manner. Philip Johnson-Laird formalized this as mental-models theory in 1983. Wolpert, Miall, and Kawato's *Internal Models in the Cerebellum* (1998) showed the brain's cerebellum likely implements paired forward models (predicting sensory consequences of motor commands) and inverse models (computing commands for desired states). Rao & Ballard's *Predictive Coding in the Visual Cortex* (1999) and Karl Friston's free-energy principle generalized this into a hierarchical Bayesian brain that continuously minimizes prediction error.

Jürgen Schmidhuber introduced recurrent neural world models to machine learning in 1990, splitting an agent into a **controller C** and a recurrent world model **M** and training C to exploit M for planning — a lineage he still defends.

**2.2 Key Properties of Modern World Models**

Modern world models aim to exhibit the following capabilities:

1. **Prediction** of future observations or latents given actions
2. **Imagination-based simulation** enabling training without costly real-world interaction
3. **Planning** via lookahead inside the model (MPC, MCTS as in MuZero, analytic value-gradient backpropagation as in Dreamer)
4. **Grounding** in sensorimotor data rather than symbols
5. **Abstraction hierarchies** enabling planning at multiple timescales
6. **Uncertainty** via stochastic latent dynamics
7. **Counterfactual reasoning** — "what if I did A instead of B"
8. **Transfer** of learned dynamics across tasks

Fei-Fei Li, writing in her November 2025 manifesto *From Words to Worlds*, describes them as a new type of generative model whose capabilities of understanding, reasoning, generation, and interaction with the semantically, physically, geometrically, and dynamically complex worlds are far beyond the reach of today's LLMs.

## 3. How World Models Differ from Large Language Models

The gap between LLMs and world models is not a matter of degree but of fundamental design. The differences run along three dimensions.

**3.1 Dimension 1: Object of Prediction**

LLMs perform autoregressive next-token prediction over a discrete symbolic vocabulary. The loss is cross-entropy on human text, and whatever "state" exists lives implicitly in the KV-cache of hidden activations. World models predict future **state** — latent, pixel, occupancy, or 3D/4D — conditioned on **actions**, using reconstruction, contrastive, or energy-based objectives in representation space. The target of one is a distribution over linguistic tokens; the target of the other is a compressed model of environmental dynamics.

**3.2 Dimension 2: Grounding**

LLMs operate on symbols whose referents they never observe. They learn, as Yann LeCun puts it, the map (text), not the territory (reality). A child learns fire is hot by touching it; an LLM learns that "fire" co-occurs with "hot." World models aim for **grounded representations** — pixels, depth, LiDAR, proprioception, robot trajectories — that retain object permanence and physical constraints. Fei-Fei Li frames this sharply: today's LLMs remain wordsmiths in the dark — eloquent but inexperienced, knowledgeable but ungrounded.

**3.3 Dimension 3: Reasoning and Planning**

LLMs lack an explicit planner. Plans emerge only as token sequences, and chain-of-thought is a scaffold bolted on top. Dziri et al.'s *Faith and Fate* (NeurIPS 2023) showed transformer accuracy degrades with graph depth in ways consistent with compounding error. World models natively support **model-based reinforcement learning**: Dreamer backpropagates analytic value gradients through imagined latent trajectories; MuZero runs MCTS inside a learned model; PlaNet uses CEM planning in latent space. Actions are first-class inputs, not generated strings.

**3.4 LeCun's Critique of Autoregressive LLMs**

LeCun's critique, articulated in *A Path Towards Autonomous Machine Intelligence* (2022) and refined through 2025-2026, rests on five specific claims:

1. **Exponential error compounding** — if each generated token has probability *e* of leaving the correct manifold, the probability an *n*-token answer is correct is (1-e)^n, decaying exponentially
2. **No world model** — LLMs lack object permanence and cannot explain why a cup does not fall through a table
3. **No persistent state** — the fixed context window provides no long-term integration of new experience
4. **No energy-based reasoning** — real reasoning should be energy minimization over plans in representation space, not token generation
5. **The "dumber than a cat" argument** — a house cat has roughly LLM-scale synapses, yet can remember, understand the physical world, plan complex actions, and reason far better than the biggest LLMs

**3.5 The Counterargument: LLMs as Implicit World Models**

The opposing camp argues LLMs already contain limited world models. *Emergent World Representations* (Li, Hopkins, Bau, Pfister, Wattenberg — ICLR 2023) showed a GPT trained only on Othello move sequences developed an internal board-state representation recoverable and causally controllable via probes; illegal-move rate fell from 93.3% untrained to 0.01%. Neel Nanda et al. (BlackboxNLP 2023) confirmed the representation is linearly probeable. Karvonen's Chess-GPT (COLM 2024) extended the finding to chess, with probes recovering even player Elo ratings.

The debate turns in part on the fact that "world model" itself is an under-defined term — a point flagged by recent surveys from Ding et al. (2024) and Kong et al. (2025).

## 4. Major Approaches and Reference Architectures

The world-model landscape has crystallized into several distinct approaches, each with different strengths and applications. The interactive timeline below traces the full arc — from Craik's 1943 hypothesis to the 2025-2026 commercial inflection.

<details>
<summary style="color: #1e6fe0; cursor: pointer; text-decoration: underline; font-weight: 600;">Interactive Timeline: World Model Architecture Evolution (click to expand)</summary>

<style>
.wm-timeline {
  --wm-bg: #FAFAF8;
  --wm-bg2: #F2F1ED;
  --wm-text: #1A1A18;
  --wm-text2: #6B6A65;
  --wm-text3: #9C9A92;
  --wm-border: rgba(0,0,0,0.08);
  --wm-purple-bg: #EEEDFE; --wm-purple-text: #3C3489;
  --wm-teal-bg: #E1F5EE; --wm-teal-text: #085041;
  --wm-coral-bg: #FAECE7; --wm-coral-text: #712B13;
  --wm-blue-bg: #E6F1FB; --wm-blue-text: #0C447C;
  --wm-amber-bg: #FAEEDA; --wm-amber-text: #633806;
  --wm-gray-bg: #F1EFE8; --wm-gray-text: #444441;
  --wm-accent: #534AB7;
  --wm-dot: #D3D1C7;
  --wm-dot-hl: #534AB7;
  --wm-line: #E5E4DF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 720px;
  margin: 24px 0;
  color: var(--wm-text);
  line-height: 1.6;
}
@media (prefers-color-scheme: dark) {
  .wm-timeline {
    --wm-bg: #1A1A18; --wm-bg2: #2C2C2A;
    --wm-text: #F1EFE8; --wm-text2: #B4B2A9; --wm-text3: #888780;
    --wm-border: rgba(255,255,255,0.08);
    --wm-purple-bg: #26215C; --wm-purple-text: #CECBF6;
    --wm-teal-bg: #04342C; --wm-teal-text: #9FE1CB;
    --wm-coral-bg: #4A1B0C; --wm-coral-text: #F5C4B3;
    --wm-blue-bg: #042C53; --wm-blue-text: #B5D4F4;
    --wm-amber-bg: #412402; --wm-amber-text: #FAC775;
    --wm-gray-bg: #2C2C2A; --wm-gray-text: #D3D1C7;
    --wm-accent: #AFA9EC; --wm-dot: #5F5E5A; --wm-dot-hl: #AFA9EC; --wm-line: #3D3D3A;
  }
}
.wm-timeline .wm-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.wm-timeline .wm-tag {
  display: inline-flex; align-items: center; font-size: 11px; font-weight: 500;
  padding: 3px 10px; border-radius: 100px; letter-spacing: 0.02em; white-space: nowrap;
}
.wm-timeline .wm-tag-concept { background: var(--wm-gray-bg); color: var(--wm-gray-text); }
.wm-timeline .wm-tag-rl { background: var(--wm-purple-bg); color: var(--wm-purple-text); }
.wm-timeline .wm-tag-jepa { background: var(--wm-teal-bg); color: var(--wm-teal-text); }
.wm-timeline .wm-tag-gen { background: var(--wm-coral-bg); color: var(--wm-coral-text); }
.wm-timeline .wm-tag-3d { background: var(--wm-blue-bg); color: var(--wm-blue-text); }
.wm-timeline .wm-tag-embody { background: var(--wm-amber-bg); color: var(--wm-amber-text); }
.wm-timeline .wm-era { margin-bottom: 32px; }
.wm-timeline .wm-era-label {
  font-size: 15px; font-weight: 600; color: var(--wm-text2);
  margin-bottom: 12px; padding-left: 48px;
}
.wm-timeline .wm-track { position: relative; padding-left: 48px; }
.wm-timeline .wm-track::before {
  content: ''; position: absolute; left: 18px; top: 4px; bottom: 4px;
  width: 1.5px; background: var(--wm-line);
}
.wm-timeline .wm-entry {
  position: relative; margin-bottom: 16px; padding: 12px 16px;
  background: var(--wm-bg2); border-radius: 10px; border: 1px solid var(--wm-border);
}
.wm-timeline .wm-entry::before {
  content: ''; position: absolute; left: -34px; top: 18px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--wm-dot); border: 2px solid var(--wm-bg); z-index: 1;
}
.wm-timeline .wm-entry.wm-hl::before {
  background: var(--wm-dot-hl); width: 10px; height: 10px;
  left: -35px; top: 17px;
  box-shadow: 0 0 0 3px rgba(83,74,183,0.2);
}
.wm-timeline .wm-entry-year { font-size: 11px; font-weight: 500; color: var(--wm-accent); letter-spacing: 0.04em; margin-bottom: 2px; }
.wm-timeline .wm-entry-title { font-size: 15px; font-weight: 500; color: var(--wm-text); line-height: 1.35; margin-bottom: 4px; }
.wm-timeline .wm-entry-desc { font-size: 13px; color: var(--wm-text2); line-height: 1.55; margin-bottom: 6px; }
.wm-timeline .wm-entry-authors { font-size: 11px; color: var(--wm-text3); font-style: italic; margin-bottom: 6px; }
.wm-timeline .wm-entry-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.wm-timeline .wm-entry-tags .wm-tag { font-size: 10px; padding: 2px 8px; }
</style>

<div class="wm-timeline">
  <div class="wm-legend">
    <span class="wm-tag wm-tag-concept">Conceptual</span>
    <span class="wm-tag wm-tag-rl">RL world model</span>
    <span class="wm-tag wm-tag-jepa">JEPA / SSL</span>
    <span class="wm-tag wm-tag-gen">Generative / video</span>
    <span class="wm-tag wm-tag-3d">3D / spatial</span>
    <span class="wm-tag wm-tag-embody">Embodied / robotics</span>
  </div>

  <div class="wm-era">
    <div class="wm-era-label">Foundational ideas (1943-2015)</div>
    <div class="wm-track">
      <div class="wm-entry">
        <div class="wm-entry-year">1943</div>
        <div class="wm-entry-title">Mental models hypothesis</div>
        <div class="wm-entry-desc">Kenneth Craik proposes organisms carry "small-scale models of external reality" to try out alternatives mentally before acting.</div>
        <div class="wm-entry-authors">Craik — The Nature of Explanation</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-concept">Conceptual</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">1990</div>
        <div class="wm-entry-title">Recurrent neural world model</div>
        <div class="wm-entry-desc">First neural controller-world model split: controller C exploits recurrent model M that predicts all sensory inputs including reward.</div>
        <div class="wm-entry-authors">Schmidhuber — FKI-126-90, TU Munich</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">1991</div>
        <div class="wm-entry-title">Dyna architecture</div>
        <div class="wm-entry-desc">Integrates learning, planning, and acting by using a learned model to generate simulated experience alongside real experience.</div>
        <div class="wm-entry-authors">Sutton — Machine Learning</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2015</div>
        <div class="wm-entry-title">ResNet</div>
        <div class="wm-entry-desc">152-layer deep residual networks with skip connections enable scalable visual representation learning — the substrate future world models build on.</div>
        <div class="wm-entry-authors">He, Zhang, Ren, Sun — CVPR 2016 Best Paper</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">SSL foundation</span></div>
      </div>
    </div>
  </div>

  <div class="wm-era">
    <div class="wm-era-label">Modern world models emerge (2018-2020)</div>
    <div class="wm-track">
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2018</div>
        <div class="wm-entry-title">World Models (Ha & Schmidhuber)</div>
        <div class="wm-entry-desc">V (VAE) + M (MDN-RNN) + C (controller) architecture. Agent trained entirely inside its own "hallucinated dream" transfers to real environments.</div>
        <div class="wm-entry-authors">Ha, Schmidhuber — arXiv:1803.10122</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2019</div>
        <div class="wm-entry-title">PlaNet — latent dynamics for planning</div>
        <div class="wm-entry-desc">Recurrent State-Space Model (RSSM) learns latent dynamics from pixels; CEM planning in latent space without reconstruction.</div>
        <div class="wm-entry-authors">Hafner, Lillicrap, Fischer et al. — ICML 2019</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2020</div>
        <div class="wm-entry-title">Dreamer — latent imagination</div>
        <div class="wm-entry-desc">Learns behaviors by backpropagating analytic value gradients through imagined latent trajectories.</div>
        <div class="wm-entry-authors">Hafner, Lillicrap, Ba, Norouzi — ICLR 2020</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2020</div>
        <div class="wm-entry-title">MuZero — planning with a learned model</div>
        <div class="wm-entry-desc">Masters Go, chess, shogi, and Atari without knowing the rules by planning via MCTS inside a learned latent dynamics model.</div>
        <div class="wm-entry-authors">Schrittwieser et al. (DeepMind) — Nature</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
    </div>
  </div>

  <div class="wm-era">
    <div class="wm-era-label">Diverging paradigms (2021-2023)</div>
    <div class="wm-track">
      <div class="wm-entry">
        <div class="wm-entry-year">2021</div>
        <div class="wm-entry-title">MAE — masked autoencoders</div>
        <div class="wm-entry-desc">Scalable self-supervised vision learner: mask 75% of image patches, reconstruct. Provides the representation-learning substrate for JEPA.</div>
        <div class="wm-entry-authors">He, Chen, Xie, Li, Dollar, Girshick — CVPR 2022</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">SSL foundation</span></div>
      </div>
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2022</div>
        <div class="wm-entry-title">LeCun's autonomous intelligence blueprint</div>
        <div class="wm-entry-desc">Proposes cognitive architecture with JEPA and H-JEPA as centerpiece. Argues LLMs lack world models and are "a dead end."</div>
        <div class="wm-entry-authors">LeCun — A Path Towards Autonomous Machine Intelligence</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">JEPA</span><span class="wm-tag wm-tag-concept">Conceptual</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2023 Jan</div>
        <div class="wm-entry-title">DreamerV3 — single algorithm, 150+ tasks</div>
        <div class="wm-entry-desc">First agent to collect diamonds in Minecraft from scratch with no human data. Published in Nature April 2025.</div>
        <div class="wm-entry-authors">Hafner, Pasukonis, Ba, Lillicrap (DeepMind)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2023</div>
        <div class="wm-entry-title">I-JEPA — joint embedding prediction on images</div>
        <div class="wm-entry-desc">Predicts in representation space, not pixel space. Non-generative, non-contrastive.</div>
        <div class="wm-entry-authors">Assran, Duval, Misra et al. — CVPR 2023</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">JEPA</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2023</div>
        <div class="wm-entry-title">Emergent world representations in Othello-GPT</div>
        <div class="wm-entry-desc">GPT trained on Othello move sequences develops an internal board-state representation — evidence that sequence models may build limited world models.</div>
        <div class="wm-entry-authors">Li, Hopkins, Bau, Pfister, Wattenberg — ICLR 2023</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-concept">Conceptual</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2023</div>
        <div class="wm-entry-title">GAIA-1 — driving world model</div>
        <div class="wm-entry-desc">9B-parameter generative world model for autonomous driving, trained on 4,700 hours of London driving video.</div>
        <div class="wm-entry-authors">Wayve (Kendall et al.)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-gen">Generative</span><span class="wm-tag wm-tag-embody">Embodied</span></div>
      </div>
    </div>
  </div>

  <div class="wm-era">
    <div class="wm-era-label">Scaling and commercialization (2024)</div>
    <div class="wm-track">
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2024 Feb</div>
        <div class="wm-entry-title">Sora — video generation as world simulation</div>
        <div class="wm-entry-desc">Spacetime-patch diffusion transformer. OpenAI claims emergent 3D consistency. Sparks debate: are video generators true world models?</div>
        <div class="wm-entry-authors">OpenAI — Technical report</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-gen">Generative / video</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2024 Feb</div>
        <div class="wm-entry-title">Genie — generative interactive environments</div>
        <div class="wm-entry-desc">Learns action-conditioned platformer worlds from unlabeled internet video.</div>
        <div class="wm-entry-authors">Bruce et al. (DeepMind)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-gen">Generative</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2024</div>
        <div class="wm-entry-title">V-JEPA — video JEPA</div>
        <div class="wm-entry-desc">Extends I-JEPA to video: predicts masked spatiotemporal regions in representation space.</div>
        <div class="wm-entry-authors">Meta FAIR (Bardes, Assran, LeCun et al.)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">JEPA</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2024 Sep</div>
        <div class="wm-entry-title">World Labs founded</div>
        <div class="wm-entry-desc">Fei-Fei Li launches spatial intelligence startup. $230M initial raise from a16z, NEA, Radical Ventures.</div>
        <div class="wm-entry-authors">Li, Johnson, Mildenhall, Lassner</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-3d">3D / spatial</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2024 Oct</div>
        <div class="wm-entry-title">Oasis — real-time Minecraft world model</div>
        <div class="wm-entry-desc">Diffusion-based world model running Minecraft-like environments at 20 fps on a single H100. Pure neural generation.</div>
        <div class="wm-entry-authors">Decart + Etched</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-gen">Generative</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2024</div>
        <div class="wm-entry-title">DIAMOND — diffusion for world modeling</div>
        <div class="wm-entry-desc">Diffusion world model achieves 1.46 mean human-normalized score on Atari 100k — new record for agents trained entirely inside a world model.</div>
        <div class="wm-entry-authors">Alonso, Jelley, Micheli et al. — NeurIPS 2024 Spotlight</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-rl">RL world model</span><span class="wm-tag wm-tag-gen">Generative</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2024 Dec</div>
        <div class="wm-entry-title">Genie 2 — 3D foundation world model</div>
        <div class="wm-entry-desc">Extends Genie to 3D environments. Persistent, explorable, action-conditioned worlds.</div>
        <div class="wm-entry-authors">DeepMind</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-gen">Generative</span><span class="wm-tag wm-tag-3d">3D / spatial</span></div>
      </div>
    </div>
  </div>

  <div class="wm-era">
    <div class="wm-era-label">Inflection point (2025-2026)</div>
    <div class="wm-track">
      <div class="wm-entry">
        <div class="wm-entry-year">2025 Jan</div>
        <div class="wm-entry-title">NVIDIA Cosmos — world foundation models</div>
        <div class="wm-entry-desc">Open-weight WFMs (4B-14B params) trained on 20M hours of real-world data. Adopted by 1X, Figure, Wayve, XPENG.</div>
        <div class="wm-entry-authors">Liu et al. (NVIDIA) — CES 2025</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-embody">Embodied</span><span class="wm-tag wm-tag-gen">Generative</span></div>
      </div>
      <div class="wm-entry">
        <div class="wm-entry-year">2025 Mar</div>
        <div class="wm-entry-title">GR00T N1 — humanoid robot foundation model</div>
        <div class="wm-entry-desc">2.2B-parameter dual-system VLA: System-2 VLM + System-1 diffusion transformer. Deployed on Fourier GR-1.</div>
        <div class="wm-entry-authors">Fan, Zhu et al. (NVIDIA GEAR)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-embody">Embodied</span></div>
      </div>
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2025 Jun</div>
        <div class="wm-entry-title">V-JEPA 2 — 1.2B video world model</div>
        <div class="wm-entry-desc">Pretrained on 1M+ hours of video. Action-conditioned variant controls robot arms zero-shot with only 62 hours of unlabeled robot video.</div>
        <div class="wm-entry-authors">Assran, Bardes, LeCun, Ballas et al. (Meta FAIR)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">JEPA</span><span class="wm-tag wm-tag-embody">Embodied</span></div>
      </div>
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2025 Aug</div>
        <div class="wm-entry-title">Genie 3 — real-time interactive world model</div>
        <div class="wm-entry-desc">First general-purpose real-time world model: 720p, 24fps, ~1 min visual memory. Pairs with SIMA agent.</div>
        <div class="wm-entry-authors">Parker-Holder, Fruchter et al. (DeepMind)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-gen">Generative</span><span class="wm-tag wm-tag-3d">3D / spatial</span></div>
      </div>
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2025 Nov</div>
        <div class="wm-entry-title">Marble — commercial 3D world generation</div>
        <div class="wm-entry-desc">World Labs ships persistent, downloadable 3D worlds as Gaussian splats and meshes. AI-native editor "Chisel."</div>
        <div class="wm-entry-authors">Li, Johnson, Mildenhall, Lassner (World Labs)</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-3d">3D / spatial</span></div>
      </div>
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2025 Nov</div>
        <div class="wm-entry-title">LeCun leaves Meta, founds AMI Labs</div>
        <div class="wm-entry-desc">Co-founds Advanced Machine Intelligence Labs in Paris. Raises $1B at $3.5B valuation by March 2026.</div>
        <div class="wm-entry-authors">LeCun — AMI Labs</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">JEPA</span></div>
      </div>
      <div class="wm-entry wm-hl">
        <div class="wm-entry-year">2026 Mar</div>
        <div class="wm-entry-title">LeWorldModel — stable end-to-end JEPA from pixels</div>
        <div class="wm-entry-desc">First JEPA that trains stably from raw pixels with only two loss terms. ~15M params, single GPU, plans 48x faster than foundation-model alternatives.</div>
        <div class="wm-entry-authors">Maes, Le Lidec, Scieur, LeCun, Balestriero</div>
        <div class="wm-entry-tags"><span class="wm-tag wm-tag-jepa">JEPA</span><span class="wm-tag wm-tag-rl">RL world model</span></div>
      </div>
    </div>
  </div>
</div>

</details>

**4.1 Reinforcement-Learning World Models (The Original Lineage)**

The RL track represents the longest-running line of world-model research:

- **Schmidhuber (1990)** — the first neural controller-world model split
- **Sutton's Dyna (1991)** — model-based RL with learned models
- **Ha & Schmidhuber (2018)** — the namesake *World Models* paper
- **PlaNet (Hafner et al., 2019)** — introduced the Recurrent State-Space Model and latent planning
- **Dreamer / DreamerV2 (2020-2021)** — learning behaviors "purely by latent imagination"
- **DreamerV3 (Nature, April 2025)** — the **first algorithm to collect diamonds in Minecraft from scratch** with no human data or curricula, using a single fixed configuration across 150+ tasks

DreamerV3 introduced key innovations including symlog observations, KL-balance with free bits, and percentile return normalization. DeepMind's **MuZero** (2020) mastered Go, chess, shogi, and Atari without being told the rules, planning inside an implicit learned model. Transformer-based variants like **IRIS**, **STORM**, and **TWM** continue to push the frontier.

**4.2 Joint Embedding Predictive Architecture (JEPA)**

LeCun's non-generative alternative predicts in representation space rather than pixel space:

- **I-JEPA (CVPR 2023)** — demonstrated the paradigm on images
- **V-JEPA (2024)** — extended it to video
- **V-JEPA 2 (June 2025)** — a 1.2 billion-parameter world model pretrained on over 1 million hours of internet video plus 1 million images. It reaches 77.3% top-1 on Something-Something v2 and state-of-the-art 39.7 R@5 on Epic-Kitchens-100 action anticipation. A second stage — V-JEPA 2-AC — fine-tunes an action-conditioned predictor with just **62 hours of unlabeled robot video** and is deployed **zero-shot on Franka arms** for pick-and-place on novel objects with no task-specific training
- **LeWorldModel (March 2026)** — addresses the central fragility problem that held JEPA back: **representation collapse**

LeWorldModel deserves special attention. Existing JEPAs relied on complex multi-term losses (up to six tunable hyperparameters), exponential moving averages, pretrained encoders, or auxiliary supervision to prevent encoders from mapping all inputs to identical representations. LeWM is the **first JEPA that trains stably end-to-end from raw pixels** using only two loss terms: a next-embedding prediction loss and a **SIGReg regularizer** that enforces Gaussian-distributed latent embeddings. This reduces tunable loss hyperparameters from six to one. With only ~15 million parameters trainable on a single GPU in a few hours, LeWM plans up to **48x faster** than foundation-model-based world models while remaining competitive across diverse 2D and 3D control tasks — and linear probes confirm its latent space encodes meaningful physical quantities like positions and velocities.

**4.3 Video Generation as World Simulation**

OpenAI's **Sora** (February 2024) used spacetime-patch diffusion transformers to generate video, with its technical report claiming emergent 3D consistency and object permanence. Sora 2 (September 2025) added camera-physics simulation. Runway Gen-3, Pika, Kling, Luma Dream Machine, and Google Veo 3 form a crowded field of text-to-video systems that blur into world-model territory.

Critics including LeCun point out that these models show physical-commonsense failures and, more fundamentally, do not run interactive simulations with action conditioning or persistent state.

**4.4 Interactive World Simulators**

- **Genie (DeepMind, 2024)** — learned action-conditioned platformer environments from unlabeled video
- **Genie 2 (December 2024)** — extended to 3D
- **Genie 3 (August 2025)** — the **first real-time, general-purpose, interactive world model**, generating 720p 24-fps worlds from text prompts with visual memory for roughly one minute
- **Oasis (Decart + Etched, October 2024)** — a Minecraft-like real-time diffusion world model running at 20 fps on a single NVIDIA H100
- **GameNGen (Microsoft/Google, 2024)** — diffusion models running interactive Doom as a "neural game engine"

**4.5 Diffusion-Based World Models**

**DIAMOND** (NeurIPS 2024 Spotlight) achieved 1.46 mean human-normalized score on Atari 100k — a new record for agents trained entirely inside a world model.

**4.6 Autonomous-Driving World Models**

Wayve's **GAIA-1** (2023) scaled to 9 billion parameters on 4,700 hours of London driving data. **GAIA-2** (March 2025) added multi-camera, controllable generation of safety-critical scenarios using latent diffusion.

**4.7 World Foundation Models for Physical AI**

NVIDIA's **Cosmos** (January 2025) is a platform of open-weight world foundation models, tokenizers, and guardrails trained on **9,000 trillion tokens from 20 million hours of real-world data**. Models ship in 4B to 14B parameter sizes under an open license.

**4.8 3D/Spatial World Models**

Fei-Fei Li's **World Labs** built **Marble** (commercial launch November 2025), which generates persistent, downloadable 3D environments as Gaussian splats, meshes, or video from text/image/video/panorama/3D-layout prompts, with an AI-native hybrid 3D editor called Chisel.

**4.9 Embodied/Robotics World Models**

NVIDIA's **GR00T N1** (March 2025) is a 2.2B-parameter dual-system VLA — System-2 Eagle-2 VLM plus System-1 diffusion transformer — trained on ~50K H100-hours. Physical Intelligence's **pi-zero** (2024) and **pi-zero.5** (2025) VLAs are the other major embodied-AI play.

## 5. Three Tracks, One Term: A Taxonomy of World Models

A crucial insight is that "world model" is not a single concept but an umbrella term covering **three fundamentally different tracks**. Confusing them leads to misunderstanding where real value lies. As analyst Natasha Malpani has noted, although major players are all building "world models," they are not building the same structure.

**5.1 Track 1: Simulation Infrastructure — Modeling the Environment**

NVIDIA's Cosmos and Omniverse ecosystem exemplify the "God's-eye view." The goal is to build large-scale, physics-based synthetic environments for training, evaluating, and deploying physical AI systems. The core motivation is **data scarcity**: it is impossible to let robots fall a hundred million times in the real world just to learn walking, and real-world edge cases — a child running into traffic, a forklift dropping a pallet — are too rare and dangerous to collect naturally.

NVIDIA's approach is scale-driven: brute-force simulation plus massive compute, on the bet that intelligence emerges from sufficient synthetic experience. The philosophy: if you build a faithful enough environment, the agents will come. **NVIDIA solves "where to train."**

**5.2 Track 2: Spatial Intelligence — Modeling Objects and Their Relationships**

Fei-Fei Li's World Labs and Marble represent the "Architect view." The goal is to give machines a persistent, accurate model of physical space — understanding where objects are (precise 3D positioning), how they move (dynamic trajectories), and what affordances they provide (a cup can be grasped, a chair can be sat on).

This is perception-first: the conviction that without understanding 3D space and object relationships, intelligence is illusion. Because the scope is narrower and more concrete, it is the **easiest to commercialize near-term**: VR/AR, 3D design, film/VFX, and game content creation all have immediate demand. **Fei-Fei Li solves "what to perceive."**

**5.3 Track 3: Cognitive Architecture — Modeling Causal Logic**

LeCun's JEPA paradigm and AMI Labs represent the "Philosopher view." The goal is to construct a **causal model of reality** and enable planning within it. Unlike LLMs that predict the next token, JEPA predicts future states in abstract representation space — not pixels or words, but "what will happen next."

LeCun's architecture requires three core components:

1. A **causal model** — understanding how the world works
2. A **forward simulator** — mentally simulating possible futures
3. A **selection mechanism** — deciding which futures are worth simulating

The selection mechanism — the ability to efficiently prune the space of possible imagined trajectories — is arguably the **hardest and most critical unsolved piece**. No current AI system truly has it. This is why LeCun's approach is the most ambitious yet longest-term path. **LeCun solves "how to think."**

The analogy: confusing these three tracks is like calling engine makers, tire manufacturers, and road builders all "car makers."

| Track | Leader | Focus | Commercialization |
|-------|--------|-------|-------------------|
| Simulation Infrastructure | NVIDIA (Cosmos, Omniverse) | Synthetic training environments | Most mature — enterprise revenue |
| Spatial Intelligence | Fei-Fei Li (World Labs, Marble) | 3D perception and generation | Mid-stage — launched Nov 2025, ~$5B valuation |
| Cognitive Architecture | LeCun (AMI Labs, JEPA) | Causal reasoning and planning | Earliest — research-only, $1B raise on long-term bet |

This maturity gradient explains an important puzzle: why NVIDIA can monetize world models today while LeCun's approach remains years from revenue.

## 6. Key Advocates and Who Drives the Field

**Yann LeCun** is the field's most public advocate and loudest critic of LLM-centrism. His 2022 *A Path Towards Autonomous Machine Intelligence* blueprints a cognitive architecture of configurator, perception, world model, cost, short-term memory, and actor modules. In **November 2025 he left Meta after 12 years**, telling the *Financial Times* Llama 4 results were "fudged a bit." He co-founded **AMI Labs** in Paris and by March 2026 raised $1.03 billion at a $3.5 billion pre-money valuation. He continues to co-author foundational JEPA research, including the March 2026 LeWorldModel paper.

**Fei-Fei Li** co-founded **World Labs in early 2024** with Justin Johnson, Ben Mildenhall (NeRF), and Christoph Lassner. The company emerged from stealth in September 2024 with $230 million, shipped Marble in November 2025, and is reportedly raising at roughly $5 billion.

**Danijar Hafner** (DeepMind) owns the Dreamer lineage, capped by DreamerV3's publication in *Nature* in April 2025 — the first agent to collect Minecraft diamonds from scratch with no human data.

**David Ha** is the original co-author of the 2018 *World Models* paper. After a decade at Google Brain, he co-founded **Sakana AI** in July 2023, reaching $2.65B post-money valuation by November 2025.

**Jim Fan** (NVIDIA) is the most visible embodied-AI advocate, leading Project GR00T and the GEAR team. **Kaiming He** (MIT, part-time at DeepMind since June 2025) provides the representation-learning substrate — ResNet, MAE, MoCo — that many world models build on. **Saining Xie** (NYU) bridges the camps, co-authoring Cambrian-S with both LeCun and Fei-Fei Li.

**Jürgen Schmidhuber** defends priority for the 1990 controller-world-model architecture. **Demis Hassabis** (DeepMind CEO, Chemistry Nobel 2024) oversees the Genie 1-3 line. **Alex Kendall** (Wayve) built GAIA-1/2. **Sergey Levine** and **Chelsea Finn** co-founded Physical Intelligence.

## 7. Where the Field Stands in 2025-2026

The field has bifurcated into three distinct product shapes:

1. **Predictive latent-dynamics world models** (JEPA, Dreamer, V-JEPA 2, LeWM) — pursuing non-generative prediction in representation space, winning on data efficiency and robot control
2. **Generative 3D/video simulators** (Genie 3, Marble, Cosmos, GAIA-2) — producing interactive or downloadable worlds for creators, robotic training, and AV scenario generation
3. **Action-conditioned agent training stacks** (DreamerV3, GR00T, SIMA, pi-zero.5) — integrating the two for embodied control

**7.1 Capital at Unusual Rates**

The investment intensity is striking:

- World Labs: $230M pre-product (2024), raising again at multi-billion valuations
- AMI Labs: $1B at $3.5B pre-money with essentially no product
- Sakana AI: $2.65B post-money
- Wayve: $1.5B cumulative
- Physical Intelligence, Skild AI, Figure, 1X: all at billion-plus valuations with world-model narratives

**7.2 The Global Race**

The world-model race is no longer Western-only. On April 16, 2026 alone, **Alibaba launched HappyOyster** — an open world model for persistent, interactive 3D environments — while **Tencent open-sourced HY-World2.0** for 3D scene generation importable into game engines. Tencent's strategy is clear: as the world's highest-grossing gaming company, it possesses vast 3D data, mature engine experience, and continuous demand for content. **XPeng** has deployed a "physical world large model" combining VLT + VLA + VLM architectures in both autonomous driving and its IRON humanoid robot.

**7.3 Open Problems Remain Severe**

- Genie 3 consistency maxes out at a few minutes when training agents needs hours
- Sora and Veo still show physics failures
- Evaluation is unsolved: benchmarks like Physion, IntPhys 2, MVPBench, CausalVQA, and WorldModelBench are proliferating but none is the ImageNet of the field
- Compute and data requirements are enormous — Cosmos trained on 9,000T tokens; V-JEPA 2 on 1M+ hours of video
- The integration of action conditioning with internet-scale passive video remains the core scientific question
- **Grounding and embodiment** — whether a model must act in the world to understand it, or whether observation suffices — divides the field

However, LeWM's March 2026 result suggests a complementary path: rather than only scaling up, it may be possible to scale *down* — building lightweight, stable, physically-grounded world models accessible to any researcher with a single GPU. A 15M-parameter model planning 48x faster than foundation-model alternatives while encoding meaningful physics hints that the JEPA paradigm's real bottleneck was training stability, not scale.

## 8. The Convergence Question

The three tracks currently address different subproblems of a larger goal: enabling machines to understand and act in the physical world. Will they converge?

There are early signs:

- NVIDIA's Cosmos already serves as training infrastructure for spatial-intelligence companies (World Labs) and embodied-AI startups (1X, Figure, Wayve)
- V-JEPA 2's action-conditioned control could eventually plug into Cosmos-generated synthetic environments
- Marble's 3D worlds could become the perceptual training ground for JEPA-style cognitive agents

The most consequential near-term outcome may be **integration**: simulation infrastructure providing the environments, spatial intelligence providing the perceptual grounding, and cognitive architectures providing the reasoning and planning — with LLMs serving as semantic interfaces layered on top.

## 9. Key References

| Paper | Authors | Year | Contribution |
|-------|---------|------|--------------|
| The Nature of Explanation | Craik | 1943 | Mental models hypothesis |
| Making the World Differentiable | Schmidhuber | 1990 | First neural controller-world model |
| World Models (arXiv:1803.10122) | Ha, Schmidhuber | 2018 | V+M+C architecture, dream training |
| PlaNet | Hafner et al. | 2019 | RSSM, latent planning |
| Dreamer / DreamerV2 | Hafner et al. | 2020-21 | Latent imagination, analytic gradients |
| MuZero | Schrittwieser et al. | 2020 | MCTS in learned model |
| A Path Towards Autonomous Machine Intelligence | LeCun | 2022 | JEPA blueprint |
| MAE | He et al. | 2022 | Masked autoencoder SSL |
| DreamerV3 (Nature, April 2025) | Hafner et al. | 2023/25 | Minecraft diamonds, 150+ tasks |
| I-JEPA (CVPR 2023) | Assran et al. | 2023 | Image JEPA |
| Emergent World Representations | Li et al. | 2023 | Othello-GPT board state |
| GAIA-1 | Wayve | 2023 | 9B driving world model |
| Sora | OpenAI | 2024 | Video generation as simulation |
| Genie / Genie 2 | DeepMind | 2024 | Interactive environments |
| DIAMOND (NeurIPS 2024) | Alonso et al. | 2024 | Diffusion world model |
| Oasis | Decart + Etched | 2024 | Real-time Minecraft world model |
| Cosmos | NVIDIA | 2025 | World foundation model platform |
| V-JEPA 2 | Assran, Bardes, LeCun et al. | 2025 | 1.2B video JEPA, zero-shot robot control |
| Genie 3 | DeepMind | 2025 | Real-time 720p interactive worlds |
| Marble | World Labs (Li et al.) | 2025 | Commercial 3D world generation |
| GAIA-2 | Wayve | 2025 | Multi-view AV world model |
| GR00T N1 | Fan, Zhu et al. | 2025 | Humanoid robot VLA |
| LeWorldModel | Maes, Le Lidec, Scieur, LeCun, Balestriero | 2026 | First stable end-to-end JEPA from pixels; single GPU, 48x faster planning |

---

The world-models thesis is ultimately a wager that intelligence rests on simulation, not symbol manipulation — that the fastest path to machines that reason about reality is to build models of reality directly, grounded in perception and action, rather than hoping such models emerge as a free byproduct of next-token prediction on text. The question "what would a non-LLM path to general intelligence look like?" now has an answer with architectures, benchmarks, products, billions of dollars, a Nobel laureate's backing, and a global race spanning Silicon Valley, Paris, London, Shenzhen, and Hangzhou. Whether 2026 marks the year the bet pays off, or merely the year it became expensive, will depend on whether these models can extend from minutes to hours, from pick-and-place to general manipulation, and from demos to platforms.
