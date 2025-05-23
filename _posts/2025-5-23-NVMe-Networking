---
layout: post
title: NVMe Networking
categories: Network
---

This post is a study note from Cisco document of [Network Requirements of NVMe Storage](https://www.cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743772.html) and [Azure Stack Solution Design](https://www.cisco.com/c/en/us/td/docs/unified_computing/ucs/UCS_CVDs/ucs_mas_hci_m7.html)


**Introduction to NVMe and NVMe-oF**

Traditional networks were sufficient for HDDs, but SSDs, especially NVMe, drastically increase performance demands.NVMe(Non-Volatile Memory Express) is a protocol designed to maximize SSD performance by leveraging the PCIe bus, allowing multiple CPU cores to access storage in parallel. NVMe-oF(NVMe over Fabric) extends NVMe capabilities over networks (Ethernet, Fibre Channel) to support remote storage with high performance.

Performance Comparison PCIe-3 Devices (2020)
![pic 1](/images/nvme-1.jpg "pic 1")


NVMe is a protocol more than anything else, not a connector or a form factor or an interface specification. NVMe differs from other storage protocols like SATA because it treats the SSD devices much more like memory than hard drives. The NVMe protocol is designed from the start to be used over the PCIe interface, and thus connect almost directly to the CPU and memory subsystems of the server.

In multicore environments, NVMe is even more efficient, because it allows each core to independently talk to the storage system. With more queues and deeper queue depth in NVMe, multiple CPU cores can keep the SSDs busy, eliminating even internal bottlenecks to performance. NVMe is a NUMA-aware protocol, taking advantage of the advances in memory subsystem design in newer CPUs. Overall, storage with SSDs and the NVMe protocol can deliver dramatically higher I/O Per Second (IOPS) and lower latency than the same SSDs using SATA or SAS.

![pic 2](/images/nvme-2.jpeg "pic 2")

**NVMe-oF Transport Bindings**

Three main types of network bindings are discussed:

1. NVMe/RDMA (RoCE, iWARP): High performance, low latency; requires specialized NICs and lossless Ethernet.

2. NVMe/FC: Familiar to storage teams; uses existing Fibre Channel infrastructure.

3. NVMe/TCP: Easiest to implement; standard NICs and switches, but requires precise tuning to meet latency constraints.

![pic 3](/images/nvme-3.jpeg "pic 3")

**Network Solution Design for NVMe/RDMA**

*Architecture*

The architecture has a data fabric and a management fabric. The servers connect to the data fabric using dual 100Gb connections. This data fabric is provided by the Cisco 9300 series switches which provide layer 2 connectivity and carries all the Azure Stack HCI network traffic (management, compute, and RDMA storage traffic). Server management is facilitated through an Out-of-band (OOB) management network that connects the server’s dedicated management port to an OOB management switch with 1GbE links. The servers Azure Stack HCI OS 22H2 provides a rich set of software defined services that are core to this solution.

*Physical Topology*

The data center is expected to have infrastructure services such as DNS and Active Directory. WDS (Windows Deployment Service) and DHCP are also recommended to expedite deployments. These services must be accessible through the ToR (Top of Rack) or EoR (End of Row) network switches that connect the Cisco UCS C240 M6 and M7 Servers that are part of the Cisco solution for Azure Stack HCI to the datacenter infrastructure.

![pic 4](/images/nvme-4.jpeg "pic 4")

*Logical Topology*

The logical topology is comprised of the following:

    * Tenant/Compute Network

    The Tenant network is a VLAN trunk that carries one or more VLANs that provide access to the tenant virtual machines. Those VLANs are configured on the ToR switch’s port in trunk mode. To connect VMs to these VLANs, the corresponding VLAN tags are defined on the virtual network adapter. Each tenant VLAN is expected to have an IP subnet assigned to it.

    * Management Network

    The management network is a VLAN that carries network traffic to the parent partition. This network is used to access the host operating system. The connectivity to the management network is provided by the management (Mgmt) vNIC in the parent partition. Fault tolerance for the management vNIC is provided by the SET switch. A bandwidth limit can be assigned to the management, as necessary.

    * Storage Network

    The storage network carries RoCEv2 RDMA network traffic that is used for Storage Spaces Direct, storage replication, and Live Migration network traffic. This network is also used for cluster management communication. The storage network has a Storage A and Storage B segment, each with its own IP subnet. This design keeps the east-west RDMA isolated to the ToR switches and avoids the need for the upstream switches to be configured for supporting RoCEv2 traffic.

    DCB (Data Center Bridging) is required for RoCE. If DCB is used, PFC and ETS configuration is implemented properly across every network port, including network switches. RoCE-based Azure Stack HCI implementations require the configuration of three PFC traffic classes, including the default traffic class, across the fabric and all hosts.

QoS Configuration

| Purpose                                | Cluster Traffic                          | Storage (RDMA) traffic | Default (Tenant and Management Networks)       |
|----------------------------------------|------------------------------------------|------------------------|------------------------------------------------|
| Flow Control (PFC enabled)             | No                                       | Yes                    | No                                             |
| Traffic Class                          | 5                                        | 4                      | 0 (default)                                    |
| Bandwidth reservation                  | 1% for 25GbE or higher RDMA networks     | 50%                    | Default (no host configuration required)       |


Network Topology

1. East-West RDMA Traffic Isolation

![pic 5](/images/nvme-5.png "pic 5")

2. Fully Converged Network Topology

![pic 6](/images/nvme-6.png "pic 6")

3. Storage Switchless Converged Topology

![pic 7](/images/nvme-7.png "pic 7")

