---
layout: post
title: Databricks workspace networking
categories: Data
---

When you deploy Databricks workspace on your cloud(Azure, AWS or GCP), you know there are two subnets need to be created, one for public and one for private. You need to assign non-overlapping IP address spaces to these two subnets. Sometimes, you are struggling the limited IP address spaces because Databricks doesn't support IPv6 so far. Have you ever thought about what they are and why we need two subnets for workloads? 

Today, let's dive into Databricks workspace networking and explore why there are two subnets and how to overcome shore of the IP address space issue. 

**Host Subnet and Container Subnet**

Under the hood, Databricks runs Spark using a containerized execution model (even though you don’t manage Kubernetes directly). So there is a container subnet for Spark executors' containers. This container subnet is called private subnet. The container needs to run on a host(VM). So there is a host subnet for Databricks compute VMs(Drivers and Workers). Host subnet is called public subnet. Each Databricks VM in the host subnet attaches secondary IPs from the container subnet to run Spark containers. The container subnet is not independent compute — it exists to provide pod/container-level IPs for the hosts.

The easy way to remember:

* Host subnet = machines
	
* Container subnet = processes

The containers cannot exist without the hosts, but hosts cannot scale efficiently without container IPs.

**Architecture view**

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
    * Databricks performs source NAT (SNAT)

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

Once you read through here, you may have a question, can we reuse IP address space for container subnets across VNET? There is SNAT and all external resources see IP for Host only. That means container IP is only local significant and will be hidden to external. 

In thoery, Yes, you could reuse IP space for container subnet. And this will save a lot of IP address spaces since container subnet space will be 2 to 4 times as host subnet. The reason of not be able to reuse IP address space for container subnet is VNET peering. Since both subnets IP address spaces need to assign to VNETs. And the requirement for VNET peering is no overlapping IP address space. The is the reason that you cannot reuse IP address space across VNET.

How can we solve IP address exausting challenge? Frankly speaking, there isn't good solution. What you can do:

1. Use Serverless Compute as much as you can.

2. wait Databricks to support IPv6.

3. For non-peered VNET, you can reuse IP address space for container subnet. But the outbound to Internet need to be carefully implemented if it's not part of Hub-Spoke network. But you need to clearly understand this is a common future blocker.

4. For peered VNET(especially Hub-Spoke mode), find large unused IP address spaces for container subnets. 