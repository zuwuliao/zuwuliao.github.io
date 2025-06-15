---
layout: post
title: Entropy, Cross-Entropy, and KL Divergence in the Context of LLMs and Knowledge Distillation
categories: AI
---

This blog is a summary of the concepts of entropy, cross-entropy, and KL divergence, and how they are applied in the context of LLMs and knowledge distillation. Before diving into the details, let's first understand the plain language explanation of these concepts.

**Plain Language Explanation**

Suppose you need to explain a situation to a friend:

**Cross Entropy represents:**
How much you need to say in total to describe things clearly.

**KL Divergence represents:**
The extra things you said because you don’t fully understand that part accurately.

**Entropy represents:**
Even if you fully understand that part, the minimum you still need to say to describe it clearly.

**Example Explanation**
Suppose we have two probability distributions:

**True Distribution (P):**
Tossing a fair coin, the probability of heads and tails is equal.
So, P = [0.5, 0.5]

**Predicted Distribution (Q):**
The model predicts the probability of heads as 0.8 and tails as 0.2.
So, Q = [0.8, 0.2]


**Cross Entropy = Entropy + KL Divergence**
Calculating the entropy of P:
$$
H(P) = - \sum_{x} P(x) \log P(x) = - (0.5 \log 0.5 + 0.5 \log 0.5) = 0.693
$$

Calculating the KL divergence between P and Q:
$$
D_{KL}(P \parallel Q) = \sum_{x} P(x) \log \frac{P(x)}{Q(x)} = (0.5 \log \frac{0.5}{0.8} + 0.5 \log \frac{0.5}{0.2}) = 0.223
$$

So, the cross entropy is:
$$
H(P, Q) = H(P) + D_{KL}(P \parallel Q) = 0.693 + 0.223 = 0.916
$$

This explains three reasons why:

- Cross entropy is always greater than or equal to entropy
- KL divergence is always greater than or equal to 0
- Only when the predicted distribution exactly matches the true distribution, the KL divergence equals 0

From an optimization perspective, when training machine learning models, cross entropy is typically used as the loss function.
This process only focuses on the accuracy of the prediction,
ensuring that the predicted distribution approximates the true distribution as closely as possible.

The below is the formal definition of these concepts.

## 1. Entropy: Measuring Uncertainty

### Definition

Entropy quantifies the **uncertainty or randomness** in a probability distribution. For a discrete random variable with distribution \( P(x) \), entropy is defined as:

$$
H(P) = - \sum_{x} P(x) \log P(x)
$$

- Units depend on the logarithm base (usually base 2 or natural log).
- Entropy is maximal when the distribution is uniform and minimal (zero) when the outcome is deterministic.

### Intuition

Entropy answers: *How unpredictable is the outcome?*

- Example:
  - $$ P = [0.5, 0.5] \Rightarrow H = 1 $$
  - $$ P = [1.0, 0.0] \Rightarrow H = 0 $$

### Role in LLMs

In Large Language Models:
- High entropy = more possible next tokens → uncertainty.
- Low entropy = confident, peaked prediction.

---

## 2. Cross-Entropy: Comparing Two Distributions

### Definition

Cross-entropy measures the difference between the **true** distribution \( P(x) \) and the **model's predicted** distribution \( Q(x) \):

$$
H(P, Q) = - \sum_{x} P(x) \log Q(x)
$$

If the ground truth is a one-hot distribution (common in classification), then cross-entropy reduces to:

$$
H(P, Q) = -\log Q(x_{\text{true}})
$$

### Use in LLM Training

LLMs are trained by minimizing the **cross-entropy loss** between the predicted probability distribution over the vocabulary and the actual next token.

#### PyTorch Example

```python
import torch
import torch.nn as nn

logits = model(input_ids)  # shape: [batch_size, vocab_size]
loss_fn = nn.CrossEntropyLoss()
loss = loss_fn(logits, true_token_ids)
```

---

## 3. KL Divergence: Measuring Distribution Divergence

### Definition

KL divergence (Kullback-Leibler divergence) measures how one distribution \( Q(x) \) diverges from a reference distribution \( P(x) \):

$$
D_{KL}(P \parallel Q) = \sum_{x} P(x) \log \frac{P(x)}{Q(x)}
$$

- KL is **asymmetric**: \( D_{KL}(P \parallel Q) \neq D_{KL}(Q \parallel P) \)
- KL is always ≥ 0, and is 0 iff \( P = Q \)

### Relationship to Cross-Entropy

$$
D_{KL}(P \parallel Q) = H(P, Q) - H(P)
$$

That is, KL measures the **extra** entropy due to predicting with \( Q \) instead of \( P \).

---

## 4. Application in Knowledge Distillation

### What is Knowledge Distillation?

Knowledge distillation involves using a student model to learn from the predictions of a teacher model (Soft Labels), rather than directly learning from the labels in the training dataset (Hard Labels). The goal of the student model is to simultaneously mimic both the Hard Labels and Soft Labels.

When the teacher model makes predictions on input data, it outputs the probability distribution over each class. For example, in a 3-class classification problem, it might output:

\[
0.7, 0.2, 0.1
\]

This is called a **Soft Label**.

In contrast, a **Hard Label** would be:

\[
1, 0, 0
\]

These probability distributions reflect the model's "confidence" in each class, and they contain information about the relative relationships between the classes (e.g., Class B is more similar to Class C than to Class A).

Knowledge distillation is a model compression technique where:
- A **large teacher model** produces soft probability outputs.
- A **smaller student model** is trained to mimic these outputs.

### Loss Function

The student is trained to minimize a combination of:
- Cross-entropy with true labels (hard targets)
- KL divergence with teacher outputs (soft targets)

\[
\mathcal{L}_{\text{distill}} = \alpha \cdot H(y, s) + (1 - \alpha) \cdot T^2 \cdot D_{KL}(t_T \parallel s_T)
\]

Where:
- \( y \): ground truth label (one-hot)
- \( s \): student predictions
- \( t_T, s_T \): teacher/student soft predictions with temperature \( T \)
- \( \alpha \): trade-off coefficient
- \( T \): temperature scalar (usually > 1 to soften predictions)

#### Python Skeleton

```python
import torch.nn.functional as F

# logits from teacher and student
teacher_logits = teacher_model(input_ids)
student_logits = student_model(input_ids)

T = 2.0
alpha = 0.5

# Soft targets
teacher_probs = F.softmax(teacher_logits / T, dim=-1)
student_log_probs = F.log_softmax(student_logits / T, dim=-1)

# KL Divergence
kl_loss = F.kl_div(student_log_probs, teacher_probs, reduction='batchmean') * (T ** 2)

# Hard label cross-entropy
ce_loss = F.cross_entropy(student_logits, true_labels)

# Combined loss
loss = alpha * ce_loss + (1 - alpha) * kl_loss
```

---

## 5. Summary Table

| Metric          | Formula                                     | Use Case in LLMs                            |
|-----------------|----------------------------------------------|---------------------------------------------|
| Entropy \( H(P) \)       | \( -\sum P(x) \log P(x) \)                   | Measures prediction uncertainty             |
| Cross-Entropy \( H(P,Q) \) | \( -\sum P(x) \log Q(x) \)                   | Token prediction loss during training       |
| KL Divergence \( D_{KL}(P \| Q) \) | \( \sum P(x) \log \frac{P(x)}{Q(x)} \)        | Soft label loss in knowledge distillation   |

---

## 6. Practical Implications

- **Entropy**: Debugging model confidence and uncertainty.
- **Cross-Entropy**: Default loss for classification/token tasks.
- **KL Divergence**:
  - Measuring how far model distributions diverge from targets.
  - Regularizing or aligning models (e.g., in distillation or RLHF).
- **Distillation**:
  - Efficient deployment with smaller models.
  - Preserves teacher behavior while improving inference cost.
