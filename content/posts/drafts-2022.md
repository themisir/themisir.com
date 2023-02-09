---
title: Drafts of 2022
date: 2023-02-09T21:03:51+04:00
tags:
  - drafts
  - books
images:
  - https://images.unsplash.com/photo-1518826778770-a729fb53327c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80
---

I have a list full of ideas to write articles about. However, I realized that there's a high possibility that I will never cross a line over any of them. Instead, I thought about combining all and going through them one by one. Some of them I might write a full size blog article, but probably, I won't do it for the most (all?) of them though.

Let's dive in, shall we?

# Book review - “Attached” by Amir Levine

I had an idea that maybe I should start writing book reviews on my blog. I tried writing them, but it didn't felt just "right" enough to dedicate an article just for the review. Maybe I will write a comprehensive post about one or two of the "best" books I might read one day. However, this one was not one of them. Don't get me wrong, the book was great. It contributed to me with a great amount of toughtfulness.

The book itself is generally about the "Attachment" theory that initially been developed to label children's relations with their care-takers (i.e. parents). After some time it was realized that, the same principles does work for adult relationships as well. Henceforth, this book was one of the results of such researchs being done on this subject. It goes through the three major attachment types - secure, anxious, avoidant, - attachment types, explains their behaviors, and relationship between different types. In short, an anxious and an avoidant relationship doesn't go well in a long term.

# Book review - “Quiet” by Susan Cain

As an introvert, I would recommend this book to whom had issues with accepting their introversion, thinking it's a curse or somehow they need to heal their introversion. The reality is there's no cure. In fact if put into right perspective, introversion can became a blessing. Introverts known to be good listeners for example (apparently [they (we) are not](https://www.goodreads.com/review/show/5044743321)). There's much to say about introversion and extraversion. The thing is nothing in life is perfect, nor introverts or extraverts are capable of conquering the world. The fact that both of the personality types survived the natural selection proves that the world is bigh enough for the both types. 

# Book review - “Crafting Interpreters” by Bob Nystrom

Man, discovering Bob was one of the life turning events for me. Especially his book mentioned above had taught me a lot of stuff about engineering, coding in C, building scanners, parsers, AST trees, interpreters, VMs, heck even how the processor works. The book not just explains things in theory, but also implements and also gives pointers in case you want to dig into the rabbit hole. Bob has a great amount of articles [on his blogs](https://journal.stuffwithstuff.com) which I would recommend checking out. If you are curious, here's some select articles from the blog:

- [What Color is Your Function?](http://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/) - *this might be one of the most referenced article about sync/async*
- [Stupid Dog](http://journal.stuffwithstuff.com/2022/02/13/stupid-dog/) - *who's cutting the onions?*

## More book reviews

Before moving on to next section I would like to do a shameless plug. I started writing my book reviews on [my GoodReads profile](https://www.goodreads.com/themisir) which you can follow if you want to spy on my reading habits (which I am still trying to build).

Here are some of my latest book reviews:

-  ["How to Win Friends and Influence People" by Dale Carnegie](https://www.goodreads.com/review/show/5045743016)
- ["You're Not Listening: What You're Missing and Why It Matters" by Kate Murphy](https://www.goodreads.com/book/show/45892276-you-re-not-listening)
- ["1984" by George Orwell](https://www.goodreads.com/review/show/5044743069)
- ["A Brief History of Time: From the Big Bang to Black Holes" by Stephen Hawking](https://www.goodreads.com/book/show/32853566-a-brief-history-of-time)

---

# C# Task Parallel Library in a nutshell, await, async, Task, Thread, etc...

Switching to C# from other languages had some rough moments. I was already familiar with async/await, asynchronous programming paradigms, event loops, etc. The problem was, on C# things were not as clear as I expected it to be. That's why it caused me great amount of confusion to really gasp those concepts. Understanding asynchronous programming does solve half of the problem, but the other half is more difficult because in C#, you can literally configure how the `await` keyword should behave. Or it's not clear to the caller whether calling an async function will spawn a new thread or will run on the same threading context, or will use epoll to wait for IO response from the operation system. The answer is, it depends. It's not clear, but over time you will have rough idea of what happens under the hood when calling certain functions

Because of this confusion I wanted to write a blog post to explain those concepts in bite sized pieces. However, I never felt confident enough to do so. I don't consider myself knowledgeable enough on this subject to educate others. In case you are looking for resources, check those out:

- [Microsoft Docs - Task Parallel Library](https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/task-parallel-library-tpl)
- [Stephen Toub - Async ValueTask pooling in .NET 5](https://devblogs.microsoft.com/dotnet/async-valuetask-pooling-in-net-5/)
- [Stephen Toub - Understanding the Whys, Whats, and Whens of ValueTask](https://devblogs.microsoft.com/dotnet/understanding-the-whys-whats-and-whens-of-valuetask/)
- [Stephen Toub - ConfigureAwait FAQ](https://devblogs.microsoft.com/dotnet/configureawait-faq/)
- [r/dotnet - When should you use Task.Run verus await?](https://www.reddit.com/r/dotnet/comments/yhahue/when_should_you_use_taskrun_verus_await_its/)

# The full cycle (micro-services and monolith)

Seeing both the rise and slight fall of the micro services hype, I feel tempted to write a word or two about those trends and whether or not to follow them. It's always easy to point a finger at some trend and advertise it as a "best practice". However, the reality is more complex than that. The decision of whether to use micro-services always ends with an answer: "it depends". It really is. It depends on your team's expertise, your budget, your operational complexity, your application, your resources in general. Just because someone at a big cord did, doesn't mean you should be following them as well. Yes, it's cool to look at dashboards full of empty graphs because you never had enough time to really learn to confugre them. However, it's not really fun to deal with detached volumes at 4am or recover a dead node, or deal with CrashLoopBackOff ([don't forget the pod memory limits](https://www.youtube.com/watch?v=9wvEwPLcLcA)), and don't get me even started on how ricidiously long it is to setup a damn single node cluster on AWS. Thanks [eksctl](http://eksctl.io) for saving my day & night.

All that said, there's time and place to use both worlds. However, the decision should be made with care. Otherwise you are going to waste lots of resources (money, time and engineering) on projects that doesn't return any promised value. That's why we are seeing lots of "new" paradigms bringing good of both worlds, but in reality it's just monolity with additional bloat. If you are unsure about which one to choose, I would suggest creating monolith. What about FaaS, if you're saying? C'mon. What's next, smart contracts?

# Surviving in the extroverted life as an introvert

I don't really have much to say about this since I am still trying to figure it out myself. I might come back to this in future, but for now let's move on.

# Why flutter is doomed to fail?

First of all please note that "failure" is a relative term. A failure for one might be a win for the other. For most though, it doesn't make much difference. In this section, I will be going to focus on very specific thing that [flutter](http://flutter.dev) is going to "fail". It will never become the go-to framework for building user interfaces. Also please note that I have invested a lot of resources into flutter ecosystem, so, I am not saying that just because I don't like it. I have built lots of applications with them, maintaining some packages and continuing to contribute to the community as much as I can. However, I don't think flutter will ever become a platform of choice.

On software engineering you can fix most of the problems by introducing another layer of abstraction. Flutter solves cross-platform UI problem by introducing their own rendering and user interaction layers. Instead of depending on OS to handle those layers, flutter gets the raw input (user input) from the OS and produces raw output (screen frame) to display. However, the tradeoff is the user experience. It doesn't matter how hard you try, the app won't feel as native as other apps on the user device. Even if we ignored the platform specific design language, the user interaction won't be as good as of native UIs. Especially keyboard and mouse interaction will always feel sluggish with the current architecture of flutter. Aside from that, native UI elements usually work best with the host OS, can integrate and provide additional functionality. That's not to say flutter is incapable of doing such things. It is capable, but it won't be ever as good as the native UI widgets. The other problem is, over time the OS will receive certain updates and that includes some changes to the UI components. The apps built with flutter will always have to catch up with the OS updates in order to feel native if they ever want to. However, having a native look & feel is not always the first priority (often not even the second, heck some native apps look & feel worse than their PWA counterparts).

## But flutter makes developer's life easier?

The declarative nature of flutter widget structure & the developer toolkit is really good. Especially hot reloading, seeing your code changes within seconds is a huge time saver. I can not ignore that and appreciate the flutter team for the effort. However, just because flutter done it doesn't mean they are the only ones that have done it. Surely they might have pioneered some of those features (alongside with react native), and they deserve a credit for that. But similar features are slowly but surely getting added to other native platforms as well. It's always good for the end users (developers in this case) to have competing technologies, since in the end it's us that's going to gain from the innovation.

That all said I hope good luck to the flutter team, and I will keep using it for my mobile projects as long as I don't need much of the native features. The reason I did not published this piece as a dedicated article is that it doesn't really contribute any value. Secondly, I didn't really feel the motivation to write about it. I don't like to force myself to come up with sentences when writing articles, if it doesn't happen, I just abandon the article and move on.

# Dependency etiquette

I don't even know how much I can talk about this. I only want to share some of my personal opinions on using dependencies:

- **Keep your dependency tree slim** - don't feel tempted to install a dependency just to import a feature. Keeping up to date and dealing with incompatibilites can be more costly going forward.
- **Read the damn change log before updating your dependencies** - at least do this if you are going to bump up the major version (not all libraries follow [semver](https://semver.org)). If you are maintaining a library and don't have a changelog, please create one and keep it updated as you publish new versions.
- **Don't just jump right into the edge** - just because it's the latest version, doesn't mean you must have to use the newest alpha version of a library. If you do so, you must know that you are taking the responsibility.
- **Don't demand, respectfully ask, but don't expect a positive response either** - your feature requests or contribution might and will get rejected from time and time. I hope I learned this much earlier, but one of the primary responsibilites of a maintainer is to say "NO". Adding more stuff doesn't always end up with good results. The more APIs & features you expose, the more it becomes harder to keep the library stable.

I don't have much to add to this subject at the moment. Also that's why I decided to abondon this draft and move on.

---

That's it. These are all the articles I either drafter or put as a note on my todo list to write one day and never did throug the 2021 and 2022 years. I wanted to free up my backlog to focus on the future. Take care! ☺️ 