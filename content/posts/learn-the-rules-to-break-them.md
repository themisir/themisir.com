---
title: "Learn the rules to break them"
date: 2023-08-05T21:13:01+04:00
tags:
  - art
  - engineering
images:
  - https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80
---

I have been trying to learn new skills for last few years. For example last year I started learning piano and this year I decided to get deep down into photography (so I can keep buying new lenses when I get bored). Though I consider myself as a beginner on both as a pianist and photographer, I realized an emerging pattern while learning them.

When does someone get better at something? Why certain art pieces by certain people has more value than others? What is the difference that mastery teaches someone? I think I have an idea, and I will try to connect them with software engineering practices, to explain how can you create more value from what you already know?

# To Learn

Generally, learning any subject: whether it's a profession, an hobby, a subject at school or even a video game - starts with learning certain rules. You learn alphabet, numbers, arthimetric, pitches, rhythms, framing, light, chemical elements, formulas, organs, features, languages, design patterns, algorithms, balancing, acrobatics, how to throw a ball, how to catch it, when to pass, when to shoot, aiming, peeking, recoil control, running, flanking, checking and castling in chess, and many more (sorry for a bit long line of examples). These are what makes a complete beginner, an amateur. These teach you how to play the game as intended. These teach you walking through the known pathways.

For the most part we spend our learning journey to explore those rules, those knowns discovered by the previous nomads. However there's one unavoidable truth that learning the same rules as everyone else isn't enough to create significant art pieces. We are bond to repeat what we've been taught.

Unless, you decide to unlearn your habits and break out of the safeguards. Without exploring possibilities you have no way to create an art that's worth significance. And that's what emerges an amateur to become a professional. They mastered the rules so good that, they feel comfortable breaking them. And without realizing they break them so swiftly, it becomes an order of itself.

With music you learn rhythms and harmonics, but then you encounter some important pieces that doesn't follow those rules, and that's what makes them significant (and that's why It's more than 2 months and I am still practicing the same piece by Chopin). That's how new genres appear. You learn photography rules, but here comes a moment where the best composition you can get out of a moment can be accomplished only by breaking the well known rules. You start learning math by simple arthimetric and rules, then there comes a moment in one's life where you have to accept that there's a non existent number when multiplied with itself results with `-1`, or `infinity + infinity = infinity` (this is actually questionable, it was meaningless until the Set theory came out and created some sort of controversy in the Math world, but it's another story).

If breaking the rules are necessary for creativity, one might ask if rules are holding us back...

# Why Rules?

To me the answer is: you can only break so many rules before your art loses its significance. I believe that creativity is an art of balancing. You break the rules, not to look cool, but because you seek a balance in a different way.

You need to balance harmony, rhythm, emotions and story when composing music. You need to balance exposure, composition, environment, equipment, budget and many more factors when shooting photographs. You need to balance maintainability and performance when writing software. You need to balance your freedom and responsibilities in life to feel fulfilled. You may consider not to do so, and still would get great results. However, unconsciously that would also be a form of balance by itself, just with unusual coefficients you're not aware of.

Balancing is not about maintaining good state of all the variables at hand. Sometimes, creating an artistic result requires sacrifice on one end to get better results from another end. To catch the golden hour horizon of a sunset with all the details, you may have to sacrifice details of your subject and still get great looking photos of such:

![Don't let go; woman on bike reaching for man's hand behind her also on bike](https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80)
<small>Photo by [Everton Vila](https://unsplash.com/@evertonvila?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/AsahNlC0VhQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)</small>

The photo above not just have poorly lit subjects, it also doesn't have a "proper" composition (as if it doesn't follow the thirds rule, placing subjects on the edges which is usually avoided). Yet it still looks pleasing to eyes. More importantly it succeeds at telling a story, and while doing so it uses "the broken rules" for storytelling.

The well detailed sky is in contrast with our subjects' silhouette, and the off balanced composition shifts our focus to see the big picture, the story, atmosphere. As a whole these details amplifies the hidden story, than the small details we may interpret from the image if otherwise. It's a story about our subjects being a small part of a big world and still holding onto themselves. And most probably, that's exactly what the creator intended when taking this shoot, it's not about the technicality of details (contrary to what I thought when I first started photography), but rather it's all about storytelling.

# Balancing in Engineering

Noticing these factors helped me to make my mind on how I am supposed to do engineering. It showed me the importance of the general balance, the primary story we want to tell compared to the importance of individual components.

Now I understand that before engineering a system it's important to understand customer's needs and constraints of the team you are working on. It makes no sense to engineer a complex system for a one off script that's going to be executed only once, and yet I still end up [challenging myself to write a virtual machine using the `awk` tool](https://themisir.com/awk-vm/) while trying to save a few seconds.

The same principles apply to individual aspects of software engineering as well. When you learn a new tool or a new pattern, it's tempting to use it at all the possibilities. They say you shouldn't repeat yourself (DRY), or you should follow single responsibility principle. However, not all rules worth the sacrifices we make to satisfy them. If DRYing your code will result in a utility function 300 lines long handling some edge cases, maybe you may consider repeating that few lines.

When you see your application CPU graph peaking over 400% utilization and client requests get slowed down, you may start questioning your abstractions you've done. A tightly integrated system usually surpasses, well abstracted applications. However,  the word "usually" on the previous statement leaves a room for a discussion. While the abstraction costs us performance (unless you're using [zero cost abstraction](https://boats.gitlab.io/blog/post/zero-cost-abstractions/) features presented by the language), it makes our lives "easier" by removing certain burdens of writing code like: repeating certain snippets, providing safety, just making code easier to read or understand, providing understand-ability. Generally abstractions help us to improve code maintainability.

While abstractions in theory makes our lives easier, "easy" by no means is an absolute term. Instead it's definition is heavily subjective. A piece of code you wrote a few hours ago will seem easier to understand in comparison to the snippet below:

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

<small>Note: the above code is a snippet from [eventpool.c](https://github.com/torvalds/linux/blob/024ff300db33968c133435a146d51ac22db27374/fs/eventpoll.c#L567C1-L577C2) - a file from the Linux kernel. The people who maintain this part of the project is well aware of what's going on here. However, It's very unlikely that a Linux maintainer is going to read this post, so I am going to assume you are not one of them either, and the piece is hard to understand without any insights. But hey, if you are, that's great news for me!</small>

The guys (or gals) who wrote this piece also thought it's well understandable, and they are right so. We are not them to be a comparison point when making such assumption. It's all up to the writer (or maintainer team) to decide what's an acceptable understanding standard for a project.

We have been sidetracked a bit, sorry 'bout that. In conclusion I am trying to say, we as humans are not capable of making objective decisions when it comes to subjective matters. Heck, everything around us, time, speed, distance, matter and what not, all is a part of some relative system. We can not state any absolute measurements as of now; all of our units are linked to some sort of universal constants we all have agreed upon (except in US, they've decided since we're already onto relative stuff let's keep using them, who needs [standards](https://xkcd.com/927/) anyway).

Then, how dare we can be so confident on "easiness", "maintainability" of our code. The best we can do is just assume everything we wrote today is going to become an utter mess of tomorrow, and somebody may have to deal with it. If you don't care and probably going to switch to another project in a month or two, then you don't have to do anything. If you do, you may want to reconsider your choices, complexities, abstractions or optimization passes you've done before moving on.

# Conclusion

We learn rules to get good at things. They show us the pathway others have taken while their own discovery. However, at one point stepping out and exploring may teach your a lot of new things to let you create impressive art pieces, whether it's a photo, a new dance move or a script for changing text casing.

Before you leave, I want to emphase that the article is based on my own experience and opinions, you may have had a conflicting experience in life that worked out for you. Please take my word with a grain of salt. Nobody has all the answers you may be seeking, we are just wandering around and experimenting wit life. Make your own pathway, and enjoy the journey. Cheers! 🥂
