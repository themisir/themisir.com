---
title: "Learn the rules to break them"
date: 2023-08-05T21:13:01+04:00
tags:
  - art
  - engineering
images:
  - https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80
---

For last 2 years I have been trying to learn new skills, just to keep myself engaged. Compared to interests, none of those new skills are tech related. Instead as you may or may not already know I have decided to learn an instrument (because it's cool, and something I wanted to do when I was a kid), and now trying to learn photography alongside with it. Though I consdier myself beginner on both line of interests, I realised a pattern emerging while learning them.

When does someone get better at something? Why creations of certain people, certain art pieces seem more valuable, more interesting, more creative than the rest? And believe it or not, I will onnect all of these to software engineering. I will try at least.

# To Learn

Generally, learning any subject - whether it's a profession, an hobby or a subject at school; starts with learning certain rules. You learn the general rules and orders. You learn alphabet, numbers, artimetrics, pitches, notes, rythms, rule of thirds, golden ratio, elements, formulas, organs, features, languages, design patterns, algorithms, balancing, acrobatics, how to throw a ball, how to catch it, when to pass, when to shoot, aiming, peeking, recoil control, running, flanking, checking, castling in chess, and many more. These are what makes a complete beginner, an amateur. These teach you how to play the game as intended. These teach you the known pathways.

For the most part we spend our learning journey to explore those rules, those knowns discovered by the previous nomads. However there's one unavoidable truth that learning the same rules as evryone else isn't enough to create a significant art. We are bond to repeat what we've been taught. That's how we've learnt to play the game. You can only go so far with the same strategies that your enemies aware of.

Unless, you decide to unlearn your habits and break out of your safeguards. Without exploring possibilities you have no way to create an art that's worth significance. And that's what emerges an amateur to become a professional. They mastered the rules so good that, they feel comfortable breaking them. And without realizing they break them so swiftly that it becomes an order of itself.

With music you learn rythims and harminics, but then you encounter important pieces that doesn't follow those rules, and that's what makes them significant. That's how new genres are born. You learn photography rules, but here comes a moment where the best composition you can get out of a moment is by breaking the well known rules contrary to the general belief.

If breaking the rules are that significant for creativity, one might ask..

# then why do we learn?

To me the answer is: you can only break so much rules before your art loses its significance. I believe creating art is a balancing game. You break the rules, not because it looks cool, but because you try to seek a balance. A hidden balance that's kind of a rule we have on our brains unconsciously.

You need to balance harmony, rythim, emotions and story when composing or playing a music. You need balance exposure and composition when shooting photographs. You need to balance maintainability and performance when writing software. You need to balance your freedom and responsbilities in life. Or you may consider not to do so, and still would get a great results. However, unconsciously that would alsobe a form of balance by itself.

Balancing is not about maintaining all the variables in hand to be in a good state. Sometimes, creating an artistic result requires sacrifice on one knob to get a better result on another one. To catch the golden horizon of a sunset with all the details, you may have to sacrifice details of your subject and still get great looking photos of such:

![Don't let go](https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80)
<small>Photo by [Everton Vila](https://unsplash.com/@evertonvila?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/AsahNlC0VhQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)</small>

The photo above not just have poorly lit subjects, it also doesn't have a "proper" composition (as if it doesn't follow the thirds rule, placing subjects on the edges which is usually avoided). Yet it still looks pleasing to eyes, and more importantly it tells a story, and while doing so uses the above details as a storytelling tools. While it may seem off balance at the first sight, the end result is balanced by a well detailed sky contrasting with our subjects and creating a story. And the composition shifts our focus from the subjects to the general theme, atmosphere and the fact that the world is bigger than us.

As a whole these details amplifies the hidden story, than the small details we may interpret from the image if otherwise. And most probably, that's exactly what the creator intended when taking this shoot.

# Balancing in Engineering

Noticing these factors helped me to make my mind on how I am supposed to do engineering. It showed me the importance of the general balance, the primary story we want to tell compared to the importance of individual components.

Now I understand that before engineering a system it's important to understand customer's needs and constraints of the team you are working on. It makes no sense to engineer a complex system for a one off script that's going to be executed only once, and yet I still end up [challenging myself to write a virtual machine using the `awk` tool](https://themisir.com/awk-vm/) while trying to save a few seconds.

The same principles apply to individual aspects of software engineering as well. When you learn a new tool or a new pattern, it's temptying to use it at all the possibilities. They say you shouldn't repeat yourself (DRY), or you should follow single responsibility principle. However, not all rules worth the sacrifices we make to satisfy them. If DRYing your code will result in a utility function 300 lines long handling some edge cases, maybe you may consider repeating that few lines.

When you see your application CPU graph peaking over 400% utilization and client requests get slowed down, you may start questioning your abstractions you've done. A tightly integrated system usually surpasses, well abstracted applications. However,  - ethe word "usually" on the previous statement leaves a room for a discussion. While the abstraction costs us performance (unless you're using [zero cost abstraction](https://boats.gitlab.io/blog/post/zero-cost-abstractions/) features presented by the language), it makes our lives "easier" by removing certain burdens of writing code like: repeating certain snippets, providing safety, just making code easier to read or understand, providing understandability. Generally abstractions help us to improve code maintainability.

I like putting quotes around the words I am going back to refer to, and "easier" is another one of them. While abstractions in theory makes our lives easier, easy is by no means an absolute term. Instead it's definition is heavily subjective and relative. A piece of code you wrote a few hours ago will seem easier to understand in comparison with the snippet below:

```c
static void ep_unregister_pollwait(struct eventpoll *ep, struct epitem *epi)
{
	struct eppoll_entry **p = &epi->pwqlist;
	struct eppoll_entry *pwq;

	while ((pwq = *p) != NULL) {
		*p = pwq->next;
		ep_remove_wait_queue(pwq);
		kmem_cache_free(pwq_cache, pwq);
	}
}
```

<small>Note: the above code is a snippet from [eventpool.c](https://github.com/torvalds/linux/blob/024ff300db33968c133435a146d51ac22db27374/fs/eventpoll.c#L567C1-L577C2) - a file from the linux kernel. The people who maintain this part of the project is well aware of what's going on here. However, It's very unlikely that a Linux maintainer is going to read this post, so I am going to assume you are not one of them either, and the piece is hard to understand without any insights. But hey, if you are, that's great news for me!</small>

The guys (or gals) who wrote this piece also thought it's well understandable, and they are right so. We are not them to be a comparison point when making such assumption. It's all up to the writer (or maintainer team) to decide what's an acceptible understanding standard for a project.

We have been sidetracked a bit, sorry 'bout that. In conclusion I am trying to say, we as humans are not capable of making objective decisions when it comes to subjective matters. Heck, everything around us, time, speed, distance, matter and what not, all is a part of some relative system. We can not state any absolute measurements as of now; all of our units are linked to some sort of universal constants we all have agreed upon (except in US, they've decided since we're already onto relative stuff let's keep using them, who needs [standards](https://xkcd.com/927/) anyway).

Then, how dare we can be so confident on "easiness", "maintainability" of our code. The best we can do is just assume everything we wrote today is going to become an utter mess of tomorrow, and somebody may have to deal with it. If you don't care and probably going to switch to another project in a month or two, then you don't have to do anything. If you do, you may want to reconsider your choices, complexities, abstractions or optimization passes you've done before moving on.

# Conclusion

We learn rules to get good at things. They show us the pathway others have taken while their own discovery. However, at one point stepping out and exploring may teach your a lot of new things to let you create impressive art pieces, whether it's a photo, a new dance move or a script for changing text casing.

Also before leaving I just want to note that this article itself is opinionated and states on a rule that "you should consider breaking rules ever now and then". However, by doing so it becomes contradictory with itself, maybe the rule you may wanna break is the rule that says "you should break the rules". Nobody knows the answer of life, we all are just wanderers, living based on our assumptions. Make your own pathway, and enjoy the journey. Cheers! 🥂 
