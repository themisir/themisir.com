---
title: "Creating a Virtual Machine using AWK"
date: 2023-01-26T05:05:00+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1594222082006-37e1b3c41243?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80

---

*This is a short (maybe long, I haven't thought about the length yet) story about what an act of laziness is capable of.*

As of writing this my primary job was consist of maintaining an internal software used by the corp. The maintenance was consist of owning the whole process, from implementing new features, fixing bugs, managing deployments to dealing with customer complaints and spending some days with replying to emails with the same template reponse on how to install a particular software.

This day was one of the days where I was working on setting up new environments to deploy the software onto. I got 2 new machines to deploy. The process is simplye yet can become burdensome or boring at times. I had to modify a bunch of configurations and deal with Windows related issues. To be honest, I really hate windows as a server software, but at the moment it was the best option we've got due to issues I can not put down here. Long story short, there was 2 machines I have to configure and install the software on.

I put some [music to focus on](https://open.spotify.com/track/2bPGTMB5sFfFYQ2YvSmup0?si=5353b37d4f45492e), and started working. At one point I had a domain name for the machine something like "WH0023S878979.something.something.themisir.com". I had to write that domain name in lower case on one of the config files. To be honest it doesn't have to be, but I am a bit obsessed with consistency, so I had no choice. There was just 3-4 letters on the hostname that needed to be replaced with their matching lowercase characters. I could just place cursor on the right place and replace them. However, I am now writing a blog post about how I didn't bothered to do it because of my laziness, you see it would've just taken 2-3 seconds to just simply replace those characters and done. That's why I decided to use my time efficiently and went to search how can I lower case the string without having to do it manually. I know I could have written a small python script or something similar in seconds. That's just as boring as doing it manually, also heck that would take a few mintues to automate a few seconds of one-off job.

I wanted somewhat elegant solution. Something that I can quickly fire off as needed. A bash shortcut would be neat. A quick search on [kagi](https://kagi.com)<sup>[1]</sup> revealed a bunch of stack exchange links. I clicked on one of them and saw an answer with somewhat elegant solution. One of which looked like this:

```shell
awk '{ print tolower($0) }'
```

The solution looked neat, but for some reason I didn't had capability to remember it. It just seemed obscure to me, perhaps I didn't gasped what the `awk` tool is capable of. I remember using it in the past. Last time I have used it to automate a bunch of AWS operations because the "Empty" button which supposed to remove all the objects from a S3 bucket did not in fact removed them, so I had to use my precious AWS API call quota to query & delete them one by one (before you say it, the bucket was versioned which made recursive deletion useless since the objects would still persist with a tombstone on them). Anyway, I found a handy bash script off the stack exchange forums and tossed my api key in and ran it. The script was consist of a bunch of awk's piped with some awscli commands. I surely would review the script before executing it on my aws environment, would say any deliberate person. I wasn't one of them, I ran the script then went to play minecraft on my other machine with the boys on the server I had setup a few days ago. To be fair there wasn't much to lose, I was just cleaning up one of my old AWS accounts to retire, because it was going to run out of sweet AWS Activate credits.

<small>[1] - a great alternative to google btw, i've been using for a few months; really neat with lots of customization options which is pretty rare those days</small>

Back to awk, even though multiple times I have used it in the past, I never bothered to actually gasp it and try to understand. This resulted me never learning it how to use it properly. It seemed so handful yet so obscure, I was afraid to spend time on. Until this day.. When I saw the script above, I remembered reading that "awk is a programming language" somewhere (probably I'm just making stuff up, but you'll never know). If it was a language, there would be a logic behind the statements being fed into the command for sure. I decided to dig in. At least to understand the very simple form of `{ print tolower($0) }`.

After a few minutes of surfing on web I decided to read [the wikipedia article](https://en.wikipedia.org/wiki/AWK) about the `awk` command. As I expected, awk was more powerful than just doing a few string manipulation. It seemed so much powerful than I would've expected. The first thing came into my mind was to whether I can write a virutal machine using awk. Sounds stupid I know, but it's not the first time I am trying to learn a new language by implementing some sort of interpreter in it. For example I learned golang by [implementing a scanner, a parser and an interpreter](https://github.com/themisir/golox) for the lox language from the Bob Nystrom's ["Crafting Interpreters"](http://craftinginterpreters.com/) book.

I can't help myself to not branch out to completely different subjects while writing those blogs, but I kinda like it. Nonetheless, the idea of writing a VM in a domain specific language used by a CLI tool for automating a bunch of data processing jobs at first seemed stupid, but as I spend more time thinking about it, it convienced myself even more. Spoiler alert, I did indeed wrote a turing complete virtual machine using the fricking `awk` just to see if I can. 

I am not going to go step by step through the implementation this time because I feel like most people just skip over those parts, also there's not much you can learn since it requires some kind of understanding of things like CPU cycles, memory, stack, heap, registers, etc. If you are interested, I would highly recommend checking out Bob's book I mentioned above.

# What is AWK?

I still don't know. Wikipedia says it's a programming language developed by some dudes at the Bell Labs (ofc it's always Bell Labs). It's well known for it's "simplicity" and usability within single liners. The language itself is actually pretty deliberate for what it supposed to do.

To put it simple we can split up an awk program into three phrases: when you start an awk program first it executes the `BEGIN` blocks. There usually used to write initialization code, in my case I used this part to initialize VMs memory (stack and locals) and a few other miscellaneous variables. Since it's only executed once when the program starts I used this section to initialize empty VM state alongside with flags set to their initial states. On the third phrase `awk` executes the `END` blocks which can be used for various use cases, like dumping out some aggregate data that's been calculated using the input stream.

The second phrase of an awk program is I would say is where it's power lies in. On this stage `awk` processes records it's been fed to. Those records are usually fed into awk programs using pipes. Records are separated using line ending character (`\n`). Each record may contain multiple fields separated by field separator (a whitespace by default). `awk` then reads those inputs from the input stream and executes it's main parts for each record it has been passed. The main parts are defined like blocks with optional patterns. Blocks are only executed if there was no pattern defined or the pattern does match with the input record.

Let's say we have a file containing some data:

```
record1Field1 record1Field2 record1Field3
record2Field1 record2Field2

record4Field1
```

Let's feed this file into a simple awk command:

```shell
cat ./data.txt | awk '{ print $1 }'
```

This will result in the following output:

```
record1Field1
record2Field1

record4Field1
```

The `print $1` statement has been executed for each record (line) where `$1` represented the first field of the record. It might seem like so vague, but it did reminded me of how most VM implementations been done. Like awk, VMs usually has a phrase where the memory and all the other miscellaneous stuff first gets initialized. Then on the "main" phrase, VM just goes over the instructions and executes them one by one just like how awk does execute its blocks one by one for each record. My idea was to feed assembly instructions to awk as records, and use the primary blocks to execute them.

With that all said I started putting things together, and created a simple interpreter using less than 100 lines of awk program. It was consist of a simple stack based memory, artimetric operation, logic operations and 2 jump operations to either unconditionally or conditionally jump specific number of instructions. Then I realized that it's too early to mark the VM as Turing Complete. There was jump instructions, but they were not powerful enough to jump to the previous instructions. That means you can't create loops with them, making programs pretty useless for the most use cases.

Jumping a few instructions forward (or perhaps skipping them) was easy to implement. I just had a variable representing number of instructions to skip. Before executing any instruction I would first check to see if that variable is greater than zero, I would decrease it and skip current instruction. It's not the efficient implementation since we would be wasting valuable CPU cycles. However, the streaming nature of the awk we can't look forward to the instructions that's not been processed yet.

However, jumping back was a different story. Since we only got to process each instructions once and then it goes away, we can not (as far as I know) access the previous instructons (awk records). My solution was to add records to a collection and use it as a source of instructions when we jump back to a label. I am honored to say that I managed to cause SEGFAULT when testing one of the programs with my handmade VM implementation:

![segfault on awk](https://i.imgur.com/CtNd7Wb.jpg)

After a bunch of back & forth I realized my mistake. Apparently my implementation of `jump` instruction was not the best way to accomplish it. My first implementation did involved using recursive function calls to execute jumps. However buth the logic and the implementation was flawed. The cause of the SEGFAULT was due to recursive calls causing program to run out of space on the call stack. After optimizing/fixing my implementation it did worked flawlessly!

# Running some programs

The VM was ready, but I was not sure if the implementation were correct. I had to test it using a sample program. I decided to write a sample program to compute factorial of given number. A simple implementation of the said algorithm can be written like that:

```python
def fac(n):
  if n == 1:
    return 1
  return n * fib(n - 1)
```

There's two problems with that implementation. It's inefficient, requires call stack resizes, might cause OOM. The second problem is that our VM doesn't have function or subroutine support. We have to rewrite our implementation using much simpler instructions:

```python
def fac(n):
  result = 1
  while n > 1:
    result = result * n
   	n = n - 1
  return result
```

This is much simpler implementation which we can convert to a simple assembly instructions for the VM:

```shell
push 5
setloc n
# n = 5

push 1
setloc r
# result = 1

:loop
getloc r
getloc n
mul
setloc r
# result = result * n

push 1
getloc n
sub
setloc n
# n = n - 1

push 1
getloc n
cmpgt
jmpif :loop
# if n > 1 jump to the ":loop" label

getloc r
print
# print result
```

Then the final result is:

```
❯ cat test.txt | ./vm.awk
120
```

Checking that `fac(5) = 5*4*3*2*1 = 120` is in fact the correct answer. Volia! I wrote a calculator using a tool used for processing data streams on unix systems. The implementation is publicly available here [as a gist](https://gist.github.com/themisir/6947e44e1adf394e673a607fd1b5ebaa) if you want to take a look. I also added some handy flags for turning on debug mode, which does dumps VM state after each instruction, letting you "debug" the code and figure out where you did have messed up.

I just want to remind that it was all started with the laziness of not bearing to manually lowercase 3 letters. If I had done it manually, I would've probably never had to waste time on writing this cursed virtual machine implementation nor this blog post. I am glad, I did though! I will definitely see myself overusing `awk` tool in future for various purposes. Mistakes been made.

Thanks for bearing with me. <3
