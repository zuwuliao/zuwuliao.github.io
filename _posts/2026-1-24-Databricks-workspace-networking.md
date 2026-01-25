---
layout: post
title: Databricks workspace networking
categories: Data
---

When you deploy Databricks workspace on your cloud(Azure, AWS or GCP), you know there are two subnets need to be created, one for public and one for private. You need to assign non-overlapping IP address spaces to these two subnets. Sometimes, you are struggling the limited IP address spaces because Databricks doesn't support IPv6 so far. Have you ever thought about what these two subnets are and why we need two for workloads? 

Today, let’s dive into Databricks workspace networking, explore the roles of the public and private subnets, and discuss strategies for addressing IP address space constraints.

**Host Subnet and Container Subnet**

Under the hood, Databricks runs Spark using a containerized execution model (even though you don’t manage Kubernetes directly). This architecture involves two key subnets:

* **Private subnet (container subnet)**: Used for Spark executor containers. It provides pod/container-level IP addresses.

* **Public subnet (host subnet)**: Used for Databricks compute VMs, including Drivers and Workers.

Each VM in the host subnet attaches secondary IP addresses from the container subnet in order to run Spark containers. Importantly, the container subnet does not provide independent compute—it exists to supply IPs to containers running on host VMs.

The easy way to remember:

* Host subnet = machines
	
* Container subnet = processes

The containers cannot exist without the hosts, but hosts cannot scale efficiently without container IPs.

**Architecture view**

```text
Your VNet / VPC
│
├── Host Subnet
│   ├── Driver VM (primary NIC IP)
│   ├── Worker VM 1 (primary NIC IP)
│   └── Worker VM 2 (primary NIC IP)
│
└── Container Subnet
    ├── Executor IPs (secondary IPs attached to host NICs)
    ├── Executor IPs
    └── Executor IPs
```


**How Traffic Actual Works**

1. VM creation

	* Databricks provisions VMs into the host subnet
    * Each VM gets one primary IP from the host subnet
	
2. Container networking
		
    * Databricks attaches multiple secondary IPs from the container subnet to the VM’s NIC
	* Each Spark executor binds to one of those secondary IPs
	
3. Spark communication
    * Executor ↔ executor traffic uses container subnet IPs
    * Driver ↔ executor traffic uses container subnet IPs
    * Outbound traffic (to storage, APIs, etc.) egresses via host NIC
    * Databricks performs source NAT (SNAT) - Outbound traffic is NAT-translated to the host VM’s primary IP. External services never see container subnet IPs

Now Let's look at what are the IP address space requirements for subnets:

**IP Address Space Requirements**

1. Same VNet / VPC

    They must be:
    * In the same VNet (Azure) or VPC (AWS)
    * In the same region

2. Non-overlapping CIDRs
    * CIDR ranges cannot overlap
    * Databricks validates this at workspace creation

3. Container subnet must be larger

    Rule of thumb:

    * Container subnet needs ~2–3× more IPs than host subnet

    Why:

    * One VM may run dozens of executors
    * Each executor consumes one IP from the container subnet

Example:
Host subnet:      /24  (~256 IPs)
Container subnet: /22  (~1024 IPs)

**Common mistakes**

❌ Making both subnets the same size

❌ Treating container subnet as optional

❌ Blocking NSG rules between the two

❌ Reusing subnets across workspaces

❌ Forgetting IP exhaustion planning

After learning how Databricks uses host and container subnets, you might wonder:
Can we reuse container subnet IP ranges across different VNets?

In theory, yes. Since Spark containers use secondary IPs and all outbound traffic is SNAT’ed (source network address translated) through the host VM, external systems only see the host’s IP. That means the container subnet is locally significant and hidden from the outside world.

Reusing container subnet IP space across VNets could help conserve address space—especially since container subnet CIDRs are typically 2 to 4 times larger than host subnets.

However, the main blocker is VNet peering. Both the host and container subnets are assigned IP ranges within their VNets. And for VNet peering to work, there must be no overlapping IP address space between VNets. This requirement applies to all subnets, including the container subnet—even if its IPs aren't externally routable.

That’s why, in practice, you cannot reuse container subnet IP ranges across VNets when peering is involved.

**How can we solve IP address exausting challenge?**

Frankly, there’s no perfect solution—at least not today. Databricks only supports IPv4, combined with the need for large container subnet CIDRs, it makes IP planning a real challenge. However, here are some strategies to mitigate the issue:

1. Use Serverless Compute wherever possible

    Serverless workloads are managed by Databricks and do not consume IP addresses in your VNet, which can dramatically reduce pressure on your address space.

2. Wait for IPv6 support from Databricks

    IPv6 would eliminate most of these constraints by providing vastly more address space. It’s worth watching the roadmap of IPv6 support.

3. Reuse container subnet IP ranges in non-peered VNets

    If a VNet is not peered with others, you can technically reuse the same container subnet IP ranges. However, be cautious with outbound internet access especially if the VNet is not part of a Hub-Spoke model. This design can create future blockers if peering is needed later.

4. In peered VNets (especially Hub-Spoke), allocate large, non-overlapping CIDR blocks

    For peered environments, your only real option is to plan ahead and reserve large, unused IP ranges for container subnets. This requires coordination with network teams and foresight in CIDR allocation.