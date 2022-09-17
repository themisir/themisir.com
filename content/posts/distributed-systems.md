---
title: "Introduction to Distributed Systems"
date: 2022-09-15T15:12:56+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80

---

*This post is an extended version of my Techbrains 2022 - Baku talk.*

Let’s start by introducing Distributed Systems (DS). DS is a system where you use multiple nodes to reduce workload on a single node. It’s kind of like multithreading but we figured out that multithreading is easy, so we decided to use network as a communication layer instead of system memory to coordinate these systems. 

## What problems does it solve?

*Horizontal scaling* - instead of having to upgrade your servers to more expensive tiers (considering you’re a cloud user) you can just spin up a new server and host another node there to reduce individual workload.

*Redundancy* - to reduce risk of data loss you can spin up multiple nodes in different data centers and synchronize system state between them.

*Latency* - the ability to spin up a new node gives you ability to spin new nodes near to your users to reduce latency which might be a big deal in certain real time applications like trading.

## Why we don’t use them everywhere?
Well it’s not that easy to build a distributed system. There’s some tricky parts we need to deal with as a DS engineers. So let’s take a look at them.

Let’s say 2 users write data at the exact point of time. How are you going to handle that? The thing is the system usually supposed to be deterministic, you can’t just rely on entropy to make decisions on behalf of you. If you do so you are going to have fun days where you’re going to deal with customers complaining that one customer in place A sees X value where another one sees Y. So yeah, the system needs to be deterministic.

Also in the above case we assumed that our clocks are synchronized perfectly. But reality is usually disappointing and not perfect. So does our clocks. It’s almost impossible to guarantee that clocks are perfectly synchronized. So you can’t simply rely on timestamps to decide on which message is the last one. Well you might say what can possibly go wrong with a few ms of clock skew? I would say, a lot of things depending on the nature of the system you’re building. A few milliseconds is a lot for a sensitive system like trading, or a real time multiplayer game.

And here comes elephant in the room - the network itself. We usually need to rely on network to communicate with different nodes. The problem is network is not reliable, there’s latency, there’s lost packets, there’s unavailable routes, there’s traffic & bandwidth issues, etc… So you have to take those cases into consideration as well. And that by itself can became a huge deal breaker when building reliable systems.

## Untrusted systems
Until that point we assumed that all nodes are going to be managed by the trusted parties. But in fact distributed systems can be deployed into untrusted environments. At least we have tried doing so with bitcoin and all the other cryptocurrencies. The problem with maintaining non-trusted distributed network is you can’t just rely on conventional consensus algorithms like Raft to solve certain problems. Those algorithms rely on the fact that all nodes will provide legit data, but if you don’t have a central authority you need to rely on other factors to solve conflicts. Consensus mechanisms like Proof of Work, Proof of Stake all relies on that property - they simply give more power to the nodes that has either more computing power or more stake.

And also there’s human factor where if a party can somehow change minds of certain user group, they can create their own network using their own modified fork of the previous network. Which in return decreases trust on the system because the original append-only ledger gets overwritten, so does people’s perception on the system. 

## Keywords

Here's some keywords & references if you want to dig deep into speicifc subjects.

* Vector clocks
* Consistent hashing
* CRDTs
* Load balancer
* Sharding
