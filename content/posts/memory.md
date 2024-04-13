---
title: "Computer Memory"
date: 2024-04-13T18:55:00+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1490739043913-239b6cdf4084?q=80&w=3039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

This is the second revision of this article. At first I thought of explaining all the minor details, but then I realized it would be very overwhelming for all kinds of audiences. Too much explanation of simple stuff bores experienced readers and too much depth could overwhelm newcomers. I decided to revise the article with more concise goal and trimmed down some bits.

# Introduction

The modern CPU architecture (aka [von Neumann architecture](https://en.wikipedia.org/wiki/Von_Neumann_architecture)) relies heavily on having a part of the system responsible for storing the current state. Contents of the state can vary from program instructions to stack & heap values encoding different kinds of information to be processed. While this may sound boring, have you ever wondered how on earth does computers manage all the different needs of storage persistence modern software requires? I will try to unravel most of the abstractions we use to not think about this problem.

# The Hardware

Let's start with the physical world. History of storing stuff for computing needs dates way back than computers. Hence I will skip most of them and will focus on electronic development been done in the last few centuries.

In very low level we need a way to change physical state of an object externally (write) and a way to detect those changes in that object (read). While it may seem absurd at first, If we can somehow manage to reliably (to some degree) store and read just a single bit of information that would be enough to build the next steps on the memory architecture.

We managed to accomplish the required properties by using vacuum tube diodes, and then by further research into semiconductors we now use transistors alongside with small capacitors for our storage needs. This is an oversimplification and nowadays different applications use different kind of builds with many clever hacks to get most out of the system for their own needs. For example, long term non-volatile storage solutions like SSD and memory cards mostly use [flash chips](https://en.wikipedia.org/wiki/Flash_memory) which are built using transistors. I would recommend [this animated explanation](https://www.youtube.com/watch?v=5Mh3o886qpg) by Branch Education if you are interested in flash memory chips.

Once we have a method for storing a single bit of information[^bit] in a cell, we can put many of them together (let's say 2<sup>37</sup> cells) to create larger blocks of memory space to work with. However, how we have an issue. How are we going to work with individual bits of information? Wiring all the bits directly to the CPU doesn't make a sense at all, it would be very expensive, cost inefficient and volatile.

[^bit]: It's worth noting that current storage devices sometimes may store more than 1 bit of information in a single cell. It's a matter of choice between reliability and speed + capacity.

Instead of giving external systems access to all the bits, modern storage systems (we ignore any specific purpose build systems here) communicate with processing units using by sending commands and address to the memory module and writing or reading from the data lines. DDR4 SDRAM modules for example have 64 bits of data lane support, meaning the processor can read or write 64 bits of information at once by sending a single command.

To work with different parts of the memory, we are using addresses to tell memory modules which part of the stored memory we are operating on. Memory modules themselves are structured in multiple layers to work with blocks of memory cells at once efficiently. The addressing in a sense maps to the physical structure of memory cell layout. By giving the memory module some address it can use certain bits of address to choose which memory bank group, which bank, which chip, which row, etc to work on depending on the structure used on given layout. Once the group of cells has been identified using the address the module uses given command which is usually sent as a part of the address line, to execute certain actions on the block of cells. You can read further about the available commands and the exact communication layout used from the wikipedia pages for the respective memory module generation. For example here's link to the command encoding structure of DDR5 SDRAM: https://en.wikipedia.org/wiki/DDR5_SDRAM#Command_encoding

Both the address and data lanes are physically connected to the CPU using connectors on the motherboards or directly via soldered PCB connectors on the System on Chip (SoC) models. I believe this is enough information to let you develop a mental model on how CPU and RAM talk with each other. I skipped over many parts and optimization hacks, and leaving them up to you to dig further if you are interested.

# Powering the device on

I know this article is about memory systems, but let's take a step back and walk through what's happening when you start your computer. It will help us later on to have better understanding over the existing memory management models we use.

When you power on your machine the very first program the CPU needs to run is system firmware (BIOS). However, the attached memory module (RAM) is currently empty since we started it just now. How does CPU executes anything if there's nothing useful in the system memory to execute?

It's all magic. So, what happens is, after resetting the device the program counter of the CPU is set to some predefined address that's called [reset vector](https://en.wikipedia.org/wiki/Reset_vector). For x86 family CPUs it is the address 0xffff0. The chipset on the motherboard (or SoC) maps this address to non-volatile ROM device. So when CPU tries to read program from the address 0xffff0, it reads contents of the ROM chip attached to the device. It is usually used for storing BIOS program, which is exactly what we want to start right after starting our device. But why? Can't we just jump right into the operation system?

Well we could, only if we knew where to find the operation system and how to load it into our system memory, which by the way we don't know where they are either. Basically we don't know the environment around us. BIOS software is usually distributed by the hardware manufacturers designing motherboards. They know their chipset design, they know where and how to talk with attached devices like RAM, SSD, your display, keyboard, etc... They hardwired them into specific ports and they know which [bus ports](https://en.wikipedia.org/wiki/Bus_(computing)) maps to specific hardware lanes. That's why today's general purpose systems usually tend to rely on a firmware to initialize the hardware and guide the rest of the software flow with the information it can gather. Some systems may decide to skip this architecture or may use different levels of integration between the OS and the firmware. It all depends on the control the hardware manufacturer has at hand from the hardware to the software. For example Modern macs seems to be using different memory configuration on startup sequence and the OS uses some parts of that non-volatile memory modules as well. I am not totally sure though, but even if it's all just my speculation, it is very doable once you manufacture both the hardware and the software. I am just trying to explain that the decision for the current architecture stems from the separation of the responsibilities of the hardware and software makers.

Once the BIOS is running it usually checks hardware, creates some buffers on the memory to store necessary information for the next steps. Once its done doing it's own initialization sequence, it usually starts looking for another piece of software we call "bootloader". It is usually stored on the first sector of the attached storage devices (ie: SSD). BIOS would use the pre-configured device order (which you can usually change from your Boot menu) to look for any bootable device. Depending on the BIOS mode (legacy BIOS[^legacy-bios] or UEFI) and configuration, the exact mechanism may differ.

[^legacy-bios]: "BIOS" itself is actually the name of the legacy firmware system. The modern alternative is called "UEFI" which is just an alternative to BIOS. However, the name BIOS still sticks around since it's a well known term used in tech industry to describe the firmware. 

Once BIOS finds a bootable device, it loads contents of the boot sector into a predefined memory address and then jumps to that address to start executing bootloader. Because of the single sector long size restriction (512 bytes for MBR and 4096 bytes for GPT partitioned disk), some bootloaders may load the rest of the program from the disk, though this step is optional if the bootloader is small enough to be fitted inside the boot sector.

The job of the bootloader is to make the system ready for the OS and load the kernel program into the memory, prepare hardware if necessary and give the control to the kernel program.

So, bootloader is just another layer to stick different pieces together, OS to the BIOS in this case. They also play an important role in memory management. They usually initialize memory regions using the information collected from the BIOS and pass this information down to the kernel.

With all the hardware and memory mapping information at hand, the kernel can start other components of the operation system and can let programs to use this memory space.

# Software and Memory

To this point in article we created all the necessary machinery to run a program on the CPU. We have access to the memory, we can load our program to certain memory region and let it compute, jump around and do its thing. One minor issue is this model doesn't scale very well if we would like to have more than one program running on the CPU. Let's ignore the part about actual kernel / OS design involving scheduling and focus on memory instead, since while I failed to avoid writing about OsDev stuff, I would like to not get drawn further from the subject. Maybe in another time we can talk about OsDev in depth. 

There's two problems with the memory architecture we explained so far: Security and Address space collision.

## Security

Programs can see and write to memory regions used by each other. This can be a good thing if that's what you are after. Maybe you have the full control over the software being deployed on your custom built hardware. Then this can be acceptable to some degree, however it is still advised to be avoided since writing memory space of other programs may lead to unexpected behavior even in a controlled environment.

That said, on a general purpose system this is a huge security risk we need to deal with.

## Address space collision

Even if we ignore the security implications, we need to think about address spaces. Let me give some context first.

Programs are consist of operations involving working on memory directly and branching operations that indirectly involves memory. All the `if`, `for`, function calls, `return`-s involve branching in the program. While writing the program on a high level language like C or assembly we use labels or language syntax to define those branch jumps, the compiled binary usually uses the absolute memory address for branches.

The following assembly:

```asm
...
	BLE factorial_end
...
factorial_end:
	POP {r4, pc}
```

- has to get compiled into something like this:

```asm
...
0x00001000 BLE 0x000010fe
...
0x000010fe POP {r4, pc}
```

Now imagine using line numbers instead of function names to call them. If you were to move that function within the file, now all the callers of the function would be pointing to an invalid line number.

That would be the same case if we used a single memory space and loaded all the programs there. They would just corrupt each others behavior since they would be pointing to the same address space that might have been overwritten by other programs.

The solution would be to recompile all the programs with an offset in mind for the existing programs, so their address spaces would not clash.

## Virtual Memory

To solve both of the above problems to some degree CPUs have a built in solution called memory paging. [Segmentation](https://en.wikipedia.org/wiki/X86_memory_segmentation) is another way solution that can be used. However, modern CPUs (eg: x86-64) usually does no longer support segmentation.

The idea of memory pages is simple. First split the memory into 64KiB slices. Then we can use one of those slices to store a lookup table for different virtual memory address ranges (page) into physical memory address ranges (frame). You can also store additional flags (writable, non executable, ...) with each entry, which CPU can use to ensure memory protection.

|Page |Frame |Flags|
|-----|------|-----|
|0    |10    |r    |
|10   |50    |rw   |
|20   |20    |rwx  |

To increase address space CPUs like x86_64 use 4 layers of paging where all the pages except the last layer points to a frame containing page table for the next layer. So all the virtual address translation will go through all 4 of those layers to finally point to the physical memory frame containing the data we are looking for. This all happens implicitly by the CPU and the paging is maintained by the kernel.

I'd love to explain memory paging further, however Philipp has done it a lot better than what I could have done, so I would suggest checking [Introduction to Paging](https://os.phil-opp.com/paging-introduction/#paging-on-x86-64) section from his Writing an OS in Rust book. Honestly, the book was my first source of the information on some of the concepts I have talked about above.

This level of abstraction does solve our address space collision issue. When a new program is launched, kernel usually allocates a new memory page table for the specific program and carefully manages the pages to avoid any collision with the existing pages. From the program perspective it doesn't have to worry with any of those issues. It can just start executing operations as usual, jump around, modify memory without worrying about overwriting other program's memory space (unless kernel really messes up with something).

## Heap & Stack

Now that we have a working memory model, let's talk about how we consume this model in our software. You probably have heard about stack and memory as 2 distinct memory constructs we can use in our programs. Despite how it's being paraphrased, both stack and heap memory space lies within the same hardware, read and written using the same instructions. It is possible that you may have a heap allocated space right next to your stack.

Then why "the stack" is considered faster than heap allocated memory? The reason is not that we dedicate a faster kind of memory hardware for stack. Both memory spaces live within the same hardware, sometimes right next to each other. However, the difference lies within how CPUs work with system memory. You see, modern CPUs have clock speeds around 4GHz and can burst to even higher frequencies, and similarly memory modules support clock frequencies like 6GHz. Each clock tick needs to be completed around 0.25 nanoseconds to reach those speeds. Unfortunately due to the physical nature of those technologies and how we use them, it is not always possible to complete memory operations in this duration. Because it is two distinct systems talking to each other, the communication may have latency and overloading issues. On top of that the memory module also needs to do [some maintenance and bookkeeping work](https://en.wikipedia.org/wiki/Memory_refresh) ever now and then in order to ensure stability. There's also added latency of memory controller managing the workload, CPU translating virtual addresses into physical address. With all that in perspective we would like to reduce our dependence on the memory module.

To tackle this down CPUs designed around multiple layers of caching to reduce the need for reading and writing memory on the external memory module. When CPU needs to work on a memory page, after fetching the page, it stores contents of the page on its cache. CPUs have multiple layers of caching mechanism, trying to create a balance between cost and performance. Faster memory modules cost a fortune to manufacture, so CPU needs to be conservative about when to use faster cache lanes and when to use slower ones. Again, the exact implementation differs between CPU models, architectures and generations. Generally speaking, CPUs try to move frequently accessed memory bits from slow cache layers to faster ones. In an example, if you are accessing a certain global variable very frequently, it is likely that CPU moved it into faster cache layers like L0 or L1 to speed the process up for you.

> **Security:** It is worth noting that the cache space is shared among programs and kernel, and some layers are also shared between different CPU cores. It is important for CPU manufacturers to properly isolate them to reduce security risks. Security vulnerabilities like [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)), [Meltdown](https://en.wikipedia.org/wiki/Meltdown_(security_vulnerability)) and the recently found vulnerability called [GoFetch](https://en.wikipedia.org/wiki/GoFetch) affecting Apple silicon CPUs mostly abused the shared nature of the CPU caches to get unprivileged access to memory from other applications or even kernel itself.

Once we understand the exact model CPU uses to speed things up, we can optimize our application to better utilize these features. If you have noticed, CPUs try to move frequently accessed pages from slower layers to faster cache layers. This feature is called [cache locality](https://en.wikipedia.org/wiki/Locality_of_reference). If we allocate a block of memory to use during our application lifetime, we can ensure the memory block we are using will be moved to faster cache layers. Stack memory used for optimizing application flow for this exact case.  When you launch a program, kernel allocates a block of memory   and presents it as a call stack to the program. CPUs also has specific instructions (pop, push) and registers ([SP](https://en.wikipedia.org/wiki/Stack_register)) to help working with stack spaces.

However, this doesn't mean heap memory is always slower! CPU caches doesn't work exclusive for stack regions[^cpu-stack-locality]. Any frequently accessed memory region could be cached by CPU. If you have a big blob of heap allocated buffer, and working on it, it is likely to be cached as well as program call stack. The only difference is it's now up to the software engineer to consider cache locality cases, when in contrast due to the memory layout, call stack is easier to get cached without any extra effort.

[^cpu-stack-locality]: There could be certain application specific microprocessor designs that exclusively caches certain memory regions. I couldn't find one, but just wanted to note that it is possible, just not a viable option for general purpose computing.

There's another reason why heap memory might be considered slow. To allocate some heap buffer the program usually has to ask kernel to do the allocation. If we ignore purpose build kernels, many of the general purpose kernels have memory management capabilities, that would let programs to ask for a block of memory. Properly managing memory space between different programs require additional synchronization and management overhead which adds to the cost of memory allocation. 

Imagine this: once you ask for a 64KiB of memory bloc from the kernel, it can't just return you a random memory address. It first has to find a range of memory that has necessary amount of bytes available / not allocated already. Then it needs to keep a record of this region for two needs:

- To mark it as "unused" once the program asks to free the memory, or once the program exits.
- When allocating a new block, to avoid returning the same region as part of the new allocation.

In conclusion, this bookkeeping is costly, especially if you allocate and free memory blocks very frequently or doing these operations on hot paths[^hot-path]. That said, allocating should not scare you either, it is just important to know why it costs and use it efficiently. If it is possible you can pre-allocate the memory buffer before jumping into the hot path to avoid costly allocations:

```c
// slow
while (true) {
  char* buf = malloc(64 * 1024);
  // ...
  free(buf);
}

// faster (probably, if you know what you are doing within the loop body)
char* buf = malloc(64 * 1024);
while (true) {
  // ...
}
free(buf);
```

[^hot-path]: Frequently executed parts of code. Could be body of a loop, or frequently called message handler, game loop, etc...

# Managed program environments

The cost of allocating memory can be reduced (or increased) by adding one more layer to the picture. Languages like Java, Python, C#, JavaScript, GoLang ship with additional *language runtimes*. These runtimes usually grab a large chunks of memory from the kernel and feed you in smaller chunks when you need extra memory. They themselves have to do the similar kind of bookkeeping, but being an application specific piece, you can fine tune them to perform better or worse than using kernel for an allocation.

> **What's a language runtime?**
> This may sound counter intuitive but low level languages like C, C++, Rust, Zig and others does also ship softwares with runtimes. You can call it a standard library as well since it is more like some boilerplate and utility functions. The terminology is a bit confusing and it is hard to draw a line between fully managed languages and a language like Rust or Zig where both lets you use a custom memory allocator which in theory lets you manage the memory underneath. C/C++ as well depend on glibc or similar libraries to provide implementation for platform specific memory allocation functions.

There's also a step called Garbage Collection (GC) that many of the previously mentioned languages rely on in order to free unused memory regions for either returning back to the OS or using during the next allocation requests. The necessity for such mechanism stems from the fact that you have to `free` the block of memory once you no longer need it. And keeping track of all the allocated memory blocks and knowing when to free is not an easy task.

```c
void ws_send(char* buf, int size) {
  FrameHdr hdr;
  memset(&hdr, 0, sizeof(hdr));
  hdr.version = 2;
  hdr.size = size;

  fwrite(sd, &hdr, sizeof(hdr));
  fwrite(sd, buf, size);
}
```

Let's say the above function is used for sending network packets with prepending a packet header. The function accepts a pointer to a buffer. After sending the buffer, we no longer need the buffer. Do we need to free the buffer after calling the second `fwrite`?

It is not really clear here, the language doesn't prescribe any guidelines to how and when you should free a memory blocks. You usually have to rely on comments provided by the developer and hope it really represents the implementation to decide whether you should free a buffer or not. Or you walk through all the usages of given functions to see how it's being consumed.

There's multiple ways different programs try to tackle this issue:

## Memory arenas

Arenas used to define a scope of execution in which you can allocate and attach those allocations to a certain arena. And when you get out of the scope you can free the arena, returning all the allocated memory. Certain applications suit well with this method includes if they have a clear scope boundaries where the arenas can be used. PostgreSQL for example [uses](https://www.postgresql.org/docs/current/spi-memory.html) arenas (memory context in pg terms), and there's also a [GoLang proposal](https://github.com/golang/go/issues/51317) for adding arenas to the language. There's also libraries for other programming languages for implementing similar features.

## Reference counting

We can add counters (a simple integer) to the shared pointers and increment them when creating a copy of the pointer, and decrementing them when dropping the pointer.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

typedef struct {
  int*  counter;
  void* pointer;
} Rc;

/// Create a new reference counted pointer from given source by copying its contents
Rc rc_new(void* source, size_t size) {
  void* buf = malloc(size + sizeof(int));
  Rc rc;
  rc.counter = (int*) buf;
  rc.pointer = buf + sizeof(int);

  *rc.counter = 1;
  memcpy(rc.pointer, source, size);
  return rc;
}

Rc rc_copy(Rc rc) {
  *rc.counter += 1;
  return rc;
}

void rc_drop(Rc rc) {
  *rc.counter -= 1;
  if (*rc.counter <= 0) {
    free(rc.counter); // rc.counter points to the head of the allocated memory
  }
}

int main(void) {
  Rc shared = rc_new("Hello\0", 6);
  printf("1. %s\n", (char*)shared.pointer);

  Rc shared_2 = rc_copy(shared);
  printf("2. %s\n", (char*)shared_2.pointer);

  rc_drop(shared_2);
  printf("3. %s\n", (char*)shared.pointer);

  rc_drop(shared);
  printf("4. %s\n", (char*)shared.pointer);
  
  return 0;
}
```

The above program implements a simple reference counter. If you run the code, you shall get an output like:

```plain
❯ gcc main.c -o test && ./test
1. Hello
2. Hello
3. Hello
4. �G
```

You may or may not see the line starting with "4. " because we freed all the shared references for the pointer. The  `shared.pointer` will point to some memory address that's not necessarily owned by us anymore. It can contain some random data, or can point to an unmapped memory space causing SIGINT panic!

What's good about reference counting is, before sending a value into any function you can increment its counter and send it in. And if you consistently drop (decrement) all the references at the end of the block after using them, you can guarantee all the allocated memory would be freed properly. Unless, you forget to increment or decrement a reference on some place. Then things get really complicated. I personally encountered this issue, twice in a row, affecting an application on production.

One of them was due to use-after-free issue. We tried reusing a reference counted pointer after the counter has been reset (hence the pointer has been freed). And on another case we leaked memory all over the place because we were not properly dropping shared references. Both of those happened because of the developer error, and could be avoided if the tooling / language was enforcing proper use of reference counter. Such languages that has a "proper" design for reference counter use often employ a mechanism called ["Resource acquisition is initialization" - RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization).

They provide language level constructs for types to write handlers for copying, moving, cloning and dropping values explicitly. Languages like C++, Rust, Ada and others support this feature. For example in Rust you can write a custom drop handler like:

```rust
struct SharedRef<T> {
  pointer: &T;
  counter: usize;
}

impl<T: Drop> Drop for SharedRef<T> {
  fn drop(&mut self) {
    self.counter -= 1;
    if self.counter == 0 {
      self.pointer.drop();
    }
  }
}
```

This is a simplified version of the actual [`Rc::drop()`](https://doc.rust-lang.org/src/alloc/rc.rs.html#2095) function. RAII is not just about the traits (interfaces) that language provides. Language also inserts those calls where suitable. For example let's take a look at the following snippet:

```rust
fn send_to_client(&self, rc: Rc<String>) {
  self.client.send(&rc);
}
```

The compiler turns this code into:

```rust
fn send_to_client(&self, rc: Rc<String>) {
  self.client.send(rc.as_ref()); // <- &rc expansion
  drop(rc); // <- RAII
}
```

It adds a `drop(rc);` call to the end of the function, dropping all the unused values. This ensures you never get to forget freeing any unused resource. There's also other features you can override to provide different implementations for the language features. In rust traits like `Copy`, `Clone`, `AsRef` can be used to implement custom RAII features providing better developer experience, and more reliable programming paradigms.

Languages like Swift and Python (2.7) do also use reference counted pointers. They have similar features to RAII baked more into the language itself so you're not exposed to constructs like `Rc`, `Arc` from rust (or `std::shared_ptr` from C++).

## Garbage collection

Another way to tackle memory management issues is to avoid tracking memory movement in real time but when a certain threshold reached, pause the program execution and check all the allocated resources one by one to find out whether they are still in use or can be freed. Such checks can be possible in language environments where the runtime has a greater control over the values you create. By having the said control, the runtime can walk through all the values, fields, closures, arguments, stack frames to see if any given value is still being referenced somewhere. If the runtime doesn't find any reference, it removes the value contents from the memory and marks it available for the next allocation.

Languages like JavaScript, C#, Go, Java rely on garbage collection for memory management needs. This wikipedia entry has a lot of in depth information about garbage collectors, different stages of them, different optimization methods being used, etc: https://en.wikipedia.org/wiki/Tracing_garbage_collection

## Not freeing the memory

Lastly it may sound counter intuitive, but in some cases we may get away with not caring about memory at all. If your program supposed to do a quick one-off job and exit immediately after, relying on the kernel to free all of your leftovers might be as efficient solution as alternatives. After all the memory isolation provided by the kernel for processes act like arenas we discussed earlier. Once you exit from the process, the entire memory arena - program address space in this case can be freed. It can even be efficient in some cases.

This should be used as a last resort or when you really have a good reason to prefer this. I would not personally want to use a tool that doesn't clean the memory after itself. I just wanted to note that this option is also available for your consideration.

# Pointers vs References

One major confusion I had when getting into low level programming was a distinction between pointers and references. I thought it might be beneficial to share their difference.

As we talked earlier, in our programs we use virtual addresses to point to certain regions of the memory. To be exact, those addresses point to a certain byte. In programming we call those addresses as **pointers**. Pointers themselves are represented numerically. On 64 bit systems they are usually represented as 64 bit integers. Since pointers themselves are a value representing an address, you can have pointers of the pointers as well!

```c
int   value   = 16;
int*  pointer = &value; // 0x00fe48a0
int** pointer_to_pointer = &pointer; // 0x00fe48a4

assert(*pointer == value); // 16 == 16
assert(**pointer_to_pointer == value); // 16 == 16
assert(*pointer_to_pointer == &value); // 0x00fe48a0 == 0x00fe48a0
```

References are an abstraction over pointers. They are usually represented as an underlying platform pointer type (ie: `uint64`). However, they tend to be more stricter than pointers. Compiler uses references to provide certain guarantees while letting users have more fine grained control over the memory using pointer like constructs. To provide such guarantees they tend to deny certain actions, or require stricter annotations. This ensures that while you may have an invalid pointer pointing to an invalid address, references tend to be stable in that regard preventing you from passing invalid references around.

```cpp
int& get_ref() {
  int a_ref = 5;
  return &a_ref;
}

int* get_ptr() {
  int a_ptr = 5;
  return &a_ptr;
}
```

If you try to compile the above code, you'll get the following compiler output:

```
❯ gcc main.cpp -o main  -lstdc++
main.cpp:3:10: error: non-const lvalue reference to type 'int' cannot bind to a temporary of type 'int *'
  return &a_ref;
         ^~~~~~
main.cpp:8:11: warning: address of stack memory associated with local variable 'a_ptr' returned [-Wreturn-stack-address]
  return &a_ptr;
          ^~~~~
1 warning and 1 error generated.
```

As you can see while compiler warns about returning invalid pointer at `return &a_ptr` it doesn't prevent us from compiling. However, it doesn't the same way with us returning invalid reference with `return &a_ref`. It throws an error message saying completely gibberish, but preventing us from having an invalid reference.

In the above code despite creating invalid pointers is allowed, both of those functions if got compiled would result in undefined behavior when executed. References are just less forgiving with this kind of mistakes.

While this helps with avoiding common mistakes, we may still need to use references ever now and then for certain use cases where the compiler may not allow us even though we are sure that the reference would be valid. As far as I know as of 2024, in the C++ language you will have to use pointers in those cases.

In Rust you can solve those issues by using lifetime annotations to create a better expression of your intentions. I am not going to try to explain reference lifetimes here because I don't think my capability of explaining things is good enough for this subject. I have tried to write a post explaining rust lifetimes a few times in the past, but almost always the result were not satisfying enough for me to publish. I would instead suggest you checking out [Lifetimes](https://doc.rust-lang.org/rust-by-example/scope/lifetime.html) section from the "Rust by Examples" book.

# Conclusion

I tried to tackle down most of the abstractions over the memory management from the hardware level to the language runtime implementations to give you brief overview of the scene. This is my first compressive article on a complex subject like memory. It is a quite long one too... To be honest I am not expecting anyone to read it all. I just wanted to write down overview of the everything I learned over the years working with different technologies on different problems. I tried to do my research to check correctness of the information I have shared over there.

This entire blog post took me more than 10 hours to write (editing excluded) but I do not regret any minute of it. I enjoyed doing the necessary research and sharing my knowledge alongside with some personal thoughts. I got the inspiration to write an in depth post about a big subject from this [HTTP crash course](https://fasterthanli.me/articles/the-http-crash-course-nobody-asked-for) post by fasterthanli.me.

I hope this writing was somewhat useful for you, and hope to see you back with new articles. 

#### References

- https://www.nand2tetris.org
- https://cpu.land
- https://os.phil-opp.com/paging-introduction/
- https://craftinginterpreters.com/garbage-collection.html
- https://en.wikipedia.org/wiki/Von_Neumann_architecture
- https://www.youtube.com/watch?v=5Mh3o886qpg