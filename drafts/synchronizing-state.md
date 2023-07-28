---
title: "Synchronizing State"
date: 2023-06-06T13:50:10+04:00
tags:
  - engineering
  - multithreading
images:
  - 
---

I couldn't been worse than this when it comes to coming up with titles. We are going to explore various  mechanims for dealing with synchronization. However, before we dig in let's first talk about CPU and threads to understand why we need synchronization in the first place. 

## The Hardware







As the name points out CPU does most of the heavy lifting of the computers. Simply put, they are executing instructions fed into them from different IO (Input/Output) devices. Instructions are just bits and bytes we conventioanlly know, just in a physicial state as a low or high electricity state. Each insturction is being executed with a single "tick" of the CPU clock. So, a cpu running on 2.4MHz clock speed executes a single instruction per 1/2 400 000th of a second. To be more percise, each clock tick does not execute a single program instruction but rather a work unit of the CPU. This may be loading next instruction from the memory, parsing that instruction, doing some calculations using ALU (Artimetric Logical Unit) or setting some memory. Again exact set of instructions depends on CPU and system design, may change over time, but as of writing this article the conventionally agreed upon operations are: fetch, decode, execute. Of course a CPU may utilize more than just fetch, decode, execute cycle. Modern CPUs usually include various parts for speeding up certain operations, like "cpu cache" - fast DRAM cells for speeding up memory access, purpose built processing units for accelerating certain tasks like matrix and vector calculations, memory controller, etc.

The above design served well at its time, however as computing become more mainstream, a single processing unit started to become a huge bottleneck for certain workloads. One way to solve this issue was to increasing clock speed to make sure each operation is getting executed quickly. However, the increase on clock speed couldn't catch up with the increasing demand due to certain engineering concerns. We can't just pump up high frequency clock ticks into our CPU and expect it to be reliable. At some point we are getting limited by the nature of the universe, from the speed of electricity and light to how materials are reacting with frequently changing charges.

Another solution is to cramping up more CPUs into a single machine. To make sure we do not mix up the terminology, let's make one thing clear. Individual processing unit of a CPU is called CPU core. So, instead of multiple CPUs, we can cramp up multiple cores into a single CPU and call it a day. 
