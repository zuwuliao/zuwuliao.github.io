---
layout: post
title: Databricks Documents Parsing at Scale Performance Optimization
categories: Data
---

The document addresses the performance optimization to dedicated scenario for AI document parsing pipelines (e.g., using ai_parse_document(...), extracting elements, then building section-level outputs). It’s grounded in the Databricks performance optimization guide’s core performance themes—file explosion, data skipping/layout, shuffles, skew, spill, serialization/UDF avoidance, and cluster choice. 

## 1. Use Case: Document Parsing Pipeline at Scale

### Typical Pattern

    1. Read candidate documents (DOC / DOCX / PDF) from a source table 

    2. Incremental gating using a stable hash (e.g., `content_hash`)  

    3. Apply parsing in a set-based distributed plan  

    4. `explode()` parsed elements into rows  

    5. Transform into sections  

    6. Write into a cache / serving table (Delta)

---

## 2. What usually makes document parsing slow

Document parsing pipelines frequently hit 3 of Spark’s most common bottlenecks:

### 1. Explode-driven row growth → spill risk
Document parsers often return arrays of elements; explode() multiplies rows quickly. The deck calls out explode() as a common contributor to spill when partitions become too large.   

### 2. Wide transformations → shuffle cost
Building “sections” typically involves:

    * Window functions(heading propagation / ordering)

    * `groupBy`(assemble section text)

    * `orderBy`(distinct in some pipelines)

    These are classic shuffle triggers, which the deck lists as a key performance tax. 

### 3. Serialization overhead if you use Python UDF / applyInPandas
If you do sectionization in Pandas or Python UDFs, you pay serialization costs. The deck recommends sticking to SQL/DataFrames and minimizing UDFs due to serialization overhead—especially Python UDFs. 

---

## 3. Practical optimization techniques for document parsing

### A) Keep parsing and sectionization set-based (avoid driver loops)
### Do

    *	Parse many documents in one SQL/DataFrame plan

    *	Use anti-join gating (LEFT ANTI JOIN) against a cache of processed content_hash values

### Avoid

    *	collect() to driver + for-loop that runs one CALL ... or one parse per document

    The guide explicitly recommends avoiding operations that force work into the driver (collect()), and avoiding extra actions besides reads/writes. 
### Recommendation

    *	“single INSERT INTO ... WITH ... SELECT ...” approach is the right shape for throughput and scalability.
### Note 
    *	 toPandas() internally uses collect() (or a similar data collection mechanism) to retrieve all records from worker nodes and bring them to the driver node.


### B) Control document-level parallelism explicitly
Parsing is often CPU-heavy per document. You want many docs processed concurrently, but you don’t want tiny partitions.
### Technique
    ●	Repartition the document dataset before parsing, based on a document identifier or hash:
        o	SQL hint (if applicable): /*+ REPARTITION(N) */
        o	DataFrame: df.repartition(N, "content_hash") or df.repartition(N)
### How to pick N (practical)
    ●	Start with something like 2–4× total cluster cores for the “parse stage” (enough tasks to keep CPUs busy).
    ●	Then verify in Spark UI that tasks are evenly sized, and you don’t see heavy spill.
This aligns with the deck’s “parallelism” principle as a fundamental performance driver. 
 

### C) Reduce data before wide ops - Early Pruning
After parsing, do early pruning so you shuffle less:
###Do
    ●	Filter element types early (e.g., keep only section_header and text)
    ●	Drop fields you don’t need downstream before groupBy/windows
    ●	Avoid carrying large binary fields after parsing completes
This fits the guide’s guidance on reducing shuffled data by removing unnecessary columns/rows before the shuffle. 


### D) Prefer Native SQL / DataFrame + groupBy over Pandas UDF for sectionization
For sectionization, the fastest/most maintainable pattern is usually:
    ●	window to forward-fill heading (or another native approach)
    ●	groupBy heading to assemble content
    ●	row_number to compute section order
Even though window functions require partitioning + ordering, they do not inherently “break parallelism”—they process each document partition in parallel across tasks. The deck’s “code optimization recommendations” also strongly push toward SQL/DataFrames over RDDs/UDFs/driver compute. 

### Recommendation
    ●	Use native SQL/DataFrame transforms unless you truly cannot express the logic without Python.


### E) Spill Management (very relevant to parsing + explode)
The deck lists spill causes that map directly to doc parsing workloads:
    ●	partitions too large
    ●	explode
    ●	joins producing many rows
    ●	shuffle partitions too low 
### Practical actions
    ●	Ensure AQE is enabled (default in modern runtimes) to help with skew/partition sizing. 
    ●	If you see spill in Spark UI:
        o	increase shuffle parallelism (or use spark.sql.shuffle.partitions=auto where supported)
        o	or explicitly size shuffle partitions using the deck’s heuristic:
            ▪	set shuffle partitions to roughly largest shuffle stage size ÷ ~200MB 
    ●	Consider more memory per core if spill persists (the deck suggests moving to memory-optimized families after confirming spill). 


---

## 4. Data layout for the output “sections cache” table

Your output table (doc sections cache) tends to be:
    ●	append-heavy (new docs)
    ●	query-heavy (downstream apps retrieve sections by file_id, content_hash, investment number, etc.)
 
### Recommended layout options

### Option 1: Liquid Clustering
If available, Liquid clustering reduces tuning overhead and is robust to skew and changing access patterns. 
 
Good when
    ●	You expect evolving query patterns (sometimes by file_id, sometimes by investment_number)
    ●	You don’t want to manage partition strategy long-term

### Option 2: Z-Order (if you know the main retrieval keys)
Z-Order the columns you filter on most often (e.g., content_hash, file_id, investment_number) to improve skipping. 
**Note:** Don’t Z-Order too many columns; pick the “top few”.
**Partitioning advice for the cache table**
Partitioning is often not recommended and can cause tiny files and skew if misused; the deck explicitly warns about over-partitioning. 

Recommendation
    ●	Don’t partition by high-cardinality keys like file_id or content_hash.
    ●	If you need lifecycle management, consider a low-cardinality partition like ingestion date (only if it truly helps operationally).

---

## 5. Compute Recommendations

The guide differentiates compute choices:
    ●	Jobs compute for production ETL
    ●	SQL Warehouse for high concurrency SQL/BI with serverless availability
    ●	All-purpose for interactive dev 

### Best-fit compute choices
### 1) Production parsing pipeline (scheduled)
**Recommended:** Jobs compute + Photon (if your pipeline is mostly SQL/DF) 
 
**Why**
    ●	predictable batch throughput
    ●	isolated runs
    ●	easy autoscale boundaries
 
### 2) SQL-first parsing pipeline (pure SQL script)
**Recommended:** run as a SQL task; consider serverless SQL warehouse if:
    ●	you want fast startup
    ●	you want minimal cluster management
    ●	your workload is well-expressed as SQL and fits warehouse execution patterns 
    
### 3) Maintenance automation
If available, enable Predictive Optimization for the cache table so OPTIMIZE/VACUUM happen automatically using serverless compute (“set and forget”). 
 
### 4) Serverless CPU vs Serverless GPU
In most cases, using serverless CPU is sufficient. This is because ai_parse_document is a managed AI service call, not a model you run on your Spark (serverless CPU/GPU) executors. Your serverless compute orchestrates the calls and processes the results, but the LLM / parsing model itself runs in Databricks-managed AI infrastructure, not on your job’s CPU or GPU.

GPU makes sense only if:
    ●	You run your own models (OCR/LLM/embeddings) inside Spark
    ●	Using libraries that actually leverage CUDA
    ●	Batching inputs efficiently on executors

---

## 6. “Document parsing” quick recommendations checklist
### Do
    ●	✅ Set-based pipeline (no per-doc driver loop) 
    ●	✅ Prune early (element types, columns) before shuffles 
    ●	✅ Use SQL/DataFrame transforms (avoid Python UDFs in hot paths) 
    ●	✅ Tune parallelism at the document level (repartition docs) 
    ●	✅ Watch spill and shuffle metrics in Spark UI; adjust partitions using the deck heuristic 
    ●	✅ Use Liquid clustering or Z-Order on retrieval keys for the cache table 
    ●	✅ Consider serverless for SQL tasks and for automated maintenance (Predictive Optimization) 
### Avoid
    ●	❌ collect() + Python for-loops that call SQL/stored procs per document 
    ●	❌ Partitioning on high-cardinality IDs (file/hash) 
    ●	❌ Pandas/UDF-heavy sectionization unless required

---

## 7. When to Use AI Parse and How

### Decision Tree for AI Parse

![pic 1](/images/doc-parse-1.png "pic 1")

### Disable Figure Descriptions
When you are using ai_parse_document() function, make sure you are using version 2.0 which has ‘Disable AI generated figure descriptions’ feature. The “descriptionElementTypes” option (including disabling descriptions via '') is part of the v2.0 output schema. To reliably control descriptions, pin the schema to version 2.0 in your call. You can do it as follows:

```sql
ai_parse_document(content, map('version', '2.0'))
```

### Volumes vs Tables
ai_parse_document only requires a BINARY column holding the raw file bytes; it does not require Unity Catalog Volumes. Volumes are just a convenient source that the binaryFile reader can turn into a BINARY column. If you already have BINARY in Delta/Iceberg tables, you’re good to go. There’s no inherent inference-speed advantage to using Volumes over tables. Prefer storing the original raw bytes in a BINARY column up front to minimize I/O/CPU pre-work before calling the function.

---

## AI Parse Cost Estimation

The total cost of AI parse pipeline consists of two parts: compute cost and AI parse calling backend LLM cost. 
The compute cost depends on the compute type, DBU usage and time.
The AI parse cost is estimated as:

![pic 2](/images/doc-parse-2.png "pic 2")
