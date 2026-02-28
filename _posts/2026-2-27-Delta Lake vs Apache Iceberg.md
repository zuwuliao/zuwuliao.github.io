---
layout: post
title: Delta Lake vs Apache Iceberg
categories: Data
---


Modern lakehouse architectures rely on open table formats to bring ACID guarantees, schema enforcement, and scalable metadata management to object storage. There are two commonly used formats - Delta Lake and Apache Iceberg. Both sit on top of immutable columnar files (typically Parquet) and provide transactional semantics. However, their internal architecture and ecosystem design differ significantly. Today, we are looking into these two dominant formats from their architecture, feature, and limitations point of views.

## 1. Architectural Overview

**Delta Lake Architecture**

Delta Lake is built around an append-only transaction log layered on top of Parquet files.

Physical Structure

![pic 1](/images/delta-table.jpg "pic 1")


Core Components of Delta Lake are:

* Parquet data files (immutable)

* Transaction log (_delta_log) in JSON

* Checkpoint files (Parquet metadata compaction)

A snapshot is built by:

* Reading the latest checkpoint

* Replaying JSON log files

* Constructing the set of valid files

Delta snapshots are log-replay based.

**Apache Iceberg Architecture**

Iceberg uses a snapshot + manifest tree structure rather than a sequential log.

**Metadata Hierarchy**
metadata.json
   ↓
snapshot
   ↓
manifest list
   ↓
manifest files (Avro)
   ↓
data files (Parquet/ORC/Avro)

Core Components are:

* Immutable data files

* Manifest files (Avro) containing file metadata

* Snapshot metadata JSON

* Manifest lists

Iceberg snapshots are pointer-based:

* A snapshot references a manifest list

* Switching versions = pointer change

* No log replay required

## 2. Core Features

**ACID Transactions**

Both formats provide:

* Atomic commits

* Snapshot isolation

* Concurrent read/write safety

* Rollback capability

They achieve this using immutable files and metadata versioning rather than database locks.

**Time Travel**

| Feature                  | Delta                | Iceberg              |
| ------------------------ | -------------------- | -------------------- |
| Query historical version | Yes                  | Yes                  |
| Metadata mechanism       | Log replay           | Snapshot pointer     |
| Storage cost             | Metadata + old files | Metadata + old files |


Snapshots are not physical data copies — only metadata references.

**Schema Evolution**

Both support:

* Add column

* Rename column

* Drop column

* Type widening

Differences:

* Delta: name-based column tracking (optional column mapping)

* Iceberg: column ID-based tracking (more engine-neutral)

Iceberg handles column renames more cleanly across engines.

**Partitioning**

Delta

* Directory-based partitioning

* Changing partition strategy requires rewrite

Iceberg

* Hidden partitioning

* Logical partition spec

* Partition evolution without data rewrite

Iceberg provides more flexible partition evolution.

**Delete Handling**

Delta

* Copy-on-write

* Optional deletion vectors

Iceberg

* Position delete files

* Equality delete files

Iceberg deletes are more engine-neutral.
Delta deletion vectors are optimized for Databricks runtime.

**Streaming Support**

| Feature                     | Delta  | Iceberg        |
| --------------------------- | ------ | -------------- |
| Spark Structured Streaming  | Mature | Supported      |
| Databricks Streaming Tables | Native | Not applicable |
| Change Data Feed            | Native | Not native     |


Delta is stronger for streaming-heavy Spark workloads.

## 3. Metadata Model Comparison

| Category               | Delta                                | Iceberg                      |
| ---------------------- | ------------------------------------ | ---------------------------- |
| Metadata style         | Sequential log                       | Hierarchical tree            |
| Snapshot creation      | Log replay                           | Snapshot pointer             |
| File metadata location | Log entries                          | Manifest files               |
| Planning scalability   | Good (checkpoint mitigates log size) | Excellent (manifest pruning) |


Iceberg’s manifest tree scales extremely well for very large tables (10PB+).

## 4. Ecosystem Orientation

Delta Lake

* Spark-first design

* Deep integration with Databricks

* Strong governance via Unity Catalog

* Photon-optimized

Iceberg

* Engine-neutral from inception

* Designed for multi-engine reads/writes

* Widely adopted across:

    * Snowflake

    * Trino

    * Flink

    * Spark

    * Presto

Iceberg prioritizes interoperability.
Delta prioritizes Spark optimization.

## 5. Limitations

**Delta Limitations**

* Primarily optimized for Spark environments

* Log replay can grow expensive without checkpointing

* Partition evolution less flexible

* Cross-engine write support limited

* Some advanced features unavailable outside Spark

**Iceberg Limitations**

* Less tightly optimized for Spark than Delta

* Streaming maturity historically behind Delta

* Operational complexity around manifest compaction

* Delete file accumulation can degrade performance

* Governance integration depends on external catalog

## 6. Performance Considerations

Both depend heavily on:

* Large Parquet files (128MB–1GB)

* Efficient row groups

* Column pruning

* Predicate pushdown

* Proper compaction

Small files degrade performance in both systems.

## 7. Architectural Trade-Off Summary

| Category                | Delta     | Iceberg            |
| ----------------------- | --------- | ------------------ |
| Spark optimization      | Excellent | Good               |
| Multi-engine neutrality | Moderate  | Strong             |
| Partition evolution     | Limited   | Flexible           |
| Metadata scaling        | Good      | Excellent          |
| Streaming integration   | Strong    | Moderate           |
| Governance (Databricks) | Deep      | External-dependent |

## 8. When to Choose Each

Choose Delta When:

* Databricks is primary platform

* Heavy streaming workloads

* ML pipelines integrated with Spark

* Need Change Data Feed

* Deep Unity Catalog governance required

Choose Iceberg When:

* Multi-engine architecture

* Snowflake/Trino/Flink interoperability required

* Partition evolution flexibility needed

* Engine-neutral long-term strategy

* Very large table planning scale critical

## 9. Summary

**Delta Lake:**

  Transaction-log-based lakehouse optimized for Spark.

**Iceberg:**

  Snapshot-tree-based open table format optimized for engine neutrality.

Both provide ACID. They differ in metadata design philosophy and ecosystem focus.