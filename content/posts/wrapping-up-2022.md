---
title: "Wrapping up 2022"
draft: true
date: 2022-12-19T01:06:31+04:00
tags:
  - unusual
images:
  - https://images.unsplash.com/photo-1637291454111-1d115acb5023?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80

---

We are going to wrap up yet another year in a few days (If you are reading this in ≥2023, please feel like you've traveled to the past). A lot happened this year. I am not gonna go over all the stuff that happened to the world itself from the Ukraine war (or "special military operation" if you're Vladimir Putin), to economical crisis, fall of the crypto currencies (where all the #web3 hype has gone?), death of the queen, possible beginning of the WW3, and many other things I can't remember as of writing this. You can tell how bad I was at history by looking at the order of events above. I am not even sure if they're shuffled or somehow I randomly put them in a correct order.

## The tech

Tech hasn't changed that much though. JS world has evolved as usual with the introduction of the new frameworks and libraries, but that's not an unusual thing for js devs, it's just how the ecosystem works nowadays. Every other developer knows the best way to fix problems ocurring from abstractions created by the previous developer. We somehow completed a full loop journey and invented PHP with javascript frameworks. Don't believe me? Check latest popular way of writing js - metaframeworks, and check out their freautre set. We have come from full server side rendering to full client side rendering now going to re-create full server side rendering using the abstractions built for client side rendering. What can possibly go wrong, huh?

And another memorable tech event of the year was Elon's twitter purchase. I fell sad for all the employees whose life has been affected by it, but also I am sometimes just going to twitter and enjoying the last moments, because every now and then Elon can just decide to close it after all the weird things he've done to damage it already.

## Politics

Politics is something that most people consider as "something you shouldn't talk about in public". Well I am not going to talk about individual politicians or any politics parties. However I wanted to note a few changes that 2022 policies are going to make difference in our tech lives. Why tech? Because that's the branch I am mostly aware of in politics. It's also the one with slowest improvements i'd say, but can not prove because there's probably worser ones out there I am not aware of. Nonetheless, the few changes I've mentioned earlier are, [digital markets act](https://en.wikipedia.org/wiki/Digital_Markets_Act) - which is going to force gatekeepers to open up their platform for alternative app stores and many other nice feature set that previous seemed wild, and standardization of USB-C (which is ) among the devices. Well to be honest after hearing about those laws, it sucks to live outside EU. I don't know why, it's just I get more hopeful about the future when I see "pro-consumer" policies getting applied.

---

Well that's all the stuff going to affect "most of us" that I am going to write about. After this section it will be all about the recap of the year & me. Why? No idea, I just wanted it to be like that, so bear with me or check out my other [posts](https://themisir.com/posts).

# The rest will be about *myself*

To be honest even though the whole blog is owned by me and the only reason I am still keeping it up & continuing to write it is that I just want a medium to share my thoughts - a medium that I don't have to satisfy any algorithm, or not care about what people might comment on, I still feel some responsibility and writing about myself feels like a selfish act. That's why almost all of my previous articles were about abstract concepts with little to no connection to my own persona. Heck I didn't even bothered to create an about me page, or upgraded to latest version of [the theme](https://github.com/nanxiaobei/hugo-paper) I am using because it now has an intro section where I can put my profile picture and write a small biography. I have no idea why my unconscious thoughts work like that, but today I will be *selfish* and write about things & people that matters to me, and myself.



## The downfall

Firstly the year didn't started as good as I hoped for. In January we are in process of closing our startup company - Fonibo (rip). For some reason I was emotionally connected with it, and couldn't accept the fact that it's over (we'll come back to this section down below). That's why it took me about 3 months to completely dismantle all the technology stack of the platform (excluding [the landing page](https://fonibo.com), which should be alive as of now as well).

First month I stopped the gitops processor, so the new versions wouldn't be going to be deployed to the server. Then I scaled down the nodes. At the time I was using Elastic Kubernetes Service created using [eksctl](https://eksctl.io) (which is an amazing tool if you don't want to deal with AWS services one-by-one). After scaling down the servers the OOM errors started popping up, most of the memory was consumed by our monitoring and logging systems which wasn't a surprise because we already declared our closure publicly, so nobody was actually hitting our backends to cause any resource use other than a few cached entities I was storing on the memory, expect the uptime monitoring services. Yeah, after seeing that our backend services are completely inaccessible, including the ingress controller I destroyed the whole deployment using eksctl, which pulled the plug from all the allocated EC2 instances, IP addresses, VNCs, ELB instances, and the EKS master nodes.

However I still kept the last living part of the system alive, the master database (which is also happens to be the only database at the time because our team didn't had enough engineering capability to maintain multiple databases, so a single RDS instance did the job for us). The reason I kept it alive is because for some reason I still had a "what if" and "maybe" beliefs in my mind, that still believed we might need the data one day to restore the servies. It was like a break-up that I was not willing to move on. Yeah, do you remember that I said it took me 3 months to completely dismentle the system, I was lying, I kept the RDS instance (which was holding all of our customer, billing, order, catalog, shipping, and other critical infrasturcture data in it) alive for about 6 months, and it wasn't cheap either. It was costing more than $80 USD per month. So yeah, I haven't come into acceptance of the break-up yet. Even after moving on and starting a career at another company. It was a wild ride. However I finally pulled the plug and terminated the last living part of the system.

Actually,.. I did a thing before terminating the RDS instance. I took a snapshot of it, then terminated it. A snapshot that would let me restore it if I ever want to. And I still keep that snapshot on my aws account. I think I never actually completely moved on from the idea, huh.

Yeah that was my break-up story. You might be asking what didn't worked out? The best answer I can give you as of today is that it was destined to fail, we just didn't saw at the time. We tried our chance on a saturated market that become fragile as the world economy got a hit. Our industry was fueled by the huge VC funds and isn't actually supposed to be profitable during the competition period. The only probable way of actually making decent profit was to first dominate the market using the VC money, then use your domination against customers to increase fees and decrease wages to make profit. That's also the market plan of the services like Uber, their goal is to first become a monopoly, then dominate the market with your own rules. I wasn't aware of that when we started, nor my business partners. We just thought why we can't, if they can do that, we can do much better. We thought all we need is just working hard. Then COVID hit follwing all of its consequences like worldwide financial crisis and the important component of the formula "the VC money" become rare. In the end we lost the competition. We tried our best, we really  did. We pivoted our product multiple times to find the best product-market-fit. Even the during the "death bed" times we tried different ways to increase our revenue & runway.

That's not to say we couldn't do any better. We could, I could, my business partners could, the team in general could do much better, and maybe in a parallel universe the product would actually become successful. But in ours, it didn't, the odds were against us, we played our cards wrong, and the we have to accept the consequences.

In the end it was a great experience so far, I enjoyed the whole learning experience. I learned a lot, learned how to build a team, how to run a product, how to actually deliver a product to end users, how to talk to people, how to deal with conflicts (git conflicts included). I hoped for the best, and the best I had achieved was the experience I've earned. And lastly I never gave up until the last moment - the moment when we decided that it's not going to work out and it's time to move on.

It was also a nice case study for me to later on when analyzed I realized a lot of stuff that I did wrong, so I did learnt lots of wrong ways of doing stuff that I should look after in future and avoid. I can't list them all out there because lots of them are personal experience, situational and related to my own personalty and beliefs. However if you want, we can go through your newly built business and I can point out things I've noticed that you might be doing *wrong*, reach me out if you want.

I am thankful for all the members of the team, for letting me experience the process, and learn valuable lessons. I am thankful for all the customers who tried our product during the early launch period, and gave their valuable feedbacks. I am thankful for all of our external advisors for sharing their expeirence with us. It was a great experience, maybe it's the best ending that it could've had that we've experienced. I do not have any regrets towards it. I dropped out of university to work full time on the project, which caused lots of drama amongst my family and loved ones. I somehow found a way to deal with it, I hurt my parents hearts when they learned about my decision, but that had its own consequence that them realizing that from now on I am responsible for my own choices, I have to crave for my own way. Their denial caused huge stress and eventually mild depression on me, but with the help of close friends and a few relatives who really believed in my mission, I didn't ended up having to end my life out of the depression of not having anybody on your back that you can rely on. I love y'all <3

## Moving on, the career choice

After the failure from my previous startup, I have decided to put some time on the whole idea of "running a company". Even though I enjoyed it, it was hell a lot of stressful. I was starting to feel its damage caused on my mental and physical health. So taking a step back was a **must**.

I decided to look for a stable job that I can use to gain some financial freedom. Here comes my job hunt. I went over my resume, did some changes. And then I.. didn't know what to do. Yeah, if you're someone that I gave career advice in last year, I was in a same spot during the first few months of 2022. However I did know one thing that I have to start somewhere, I started researching, read lots of blogs, comments, watched videos on finding jobs. And in conclusion, I still wasn't sure what should I do next? Where I should apply, etc. At that moment my friend [Alvan](https://rahim.li) was working on a remote position. With his recommendation I created a profile on a job board website, filled my details. And a few days later, volia! I got a few offers. First 10 or 20 of them didn't worked out well, either I didn't liked the position or didn't meet some of the requirements. Then I found an open position at a startup that builds tools for designers. It was an awesome position because, it was remote, the product was interesting compared to most of the previous offers I've received, and the team was small enough to not have bureaucracy. I decided to apply, but didn't had any expecations.

A few days passed and we scheduled an interview call. I was stressed and anxious at the same time. My anxiety was peaked because we are going to attend this interview in English. Even though I am writing this posts in English, at that time I didn't had much speaking experience. I didn't even know how good or bad my speaking was. Then again, [a lovely friend of mine](https://rahim.li) come to help, comforted me that my English is okay and I can deal with the interview. The good thing was even though this was going to be my first interview experience, in the past I had done some research on hiring people for my own company. So I had some empathy with the recruiters, did know what they are expecting from me, what they are going to care about, what they aren't. And used that knowledge to reduce my stress. Also learned about breathing exercises to further reduce my anxiety. Combining both I prepared myself to the interview. By preparation I mean I prepared myself mentally, I was confident about my knowledge and as I said I was already aware of what recruiters are usually interested about. My main insecurity was primarily about my speaking skills and fear of saying something dumb (weird I know, but you can't imagine how wild an overthinking anxious one's imagination can become). The interview went alright, after the interview I chatted with the interviewer and asked for feedback about my speaking to reduce my anxiety further more you know, I was imagining him laughing at how terrible I've sounded after ending the call, again wild imagination, but I can't help myself to defeat that thoughts (yet). Then after a week, we had our second interview - a technicial one, then third one about the generic HR stuff, company goals, values, etc... It all went well, but the recruiter (also happens to be founder of the company) decided to take a step back, and figure out their hiring goals, etc. I waited a week, then two, three... Realized it's not going to work out I started applying to other jobs.

Then for some reason I took some break, I stopped applying, somehow lost my interest and hope a bit. It wasn't working out I thought and I got an email, email from a UK company asking to talk about something. I didn't replied it immediately, I even forget about it for a few months thinking it's just probably another agency company. After 3 days or so, I reminded the email and wrote a reply, we exchanged our numbers and had a small chat. Then a day after we scheduled an intro call. First he explained me why and what they are looking for. And asked me a few questions to learn a bit about my background. After about ~30 minutes of call, we have scheduled another call to take a coding interview. I went thorugh it, we have talked about my background, things I've done in the past, I started going through the technologies I've built for my own company, explained them about some design decisions, showed off the project structure, etc... Then we had 30 minutes of pair coding session which ended up taking more than 1 hour. First I implemented the requirements, then ofc there was some errors popping up, we have done some debugging tried solving it (protip: do not try writing a CSV parser by hand). Then we did some performance analysis, took some benchmarks, we've tried to optimize it, etc... Somehow we ended up discussing about JIT warmup times and other dotnet internals. In general it went alright, I went through the process like a casual coding session rather than a life deciding interview. It both reduces the stress and also makes you behave just like how you would've done on the real job environment, which is what the interviewer is actually trying to see - how you are going to behave, how you are going to deal with the issues, your problem solving skills. As developers that's more valuable than your knowledge of a specific technology.

In the end the interviews went alright, on the last interview I had with my current line manager, he introduced me the general company policies, work structure, general workflow, and then we proceeded to take a small pair-coding interview. It all went alright, a few days passed, we negotiated an offer package, and lastly after weeks of interviewing, we signed our contracts and  I started working at [bp](https://bp.com) on behalf of an outsourcing company. The work itself turned out to be alright, the team itself is great, the technicial responsibility I have taken over was also an interesting one. I had to maintain an internal software that used to connect different systems with each other. Due to the confidential nature of the work, I can not explain anymore further about the product itself. However I can say that it was something that I would enjoy working as a side project or an open source project. So yeah, I took over responsibility of maintaining that product which led me to learn a lot of new stuff I didn't previously know. Also it was great to find some small gems like quotes from different moves when reading the codebase.

At the moment of writing this post I am still working on the same position, with the same responsibility of maintaining that product and dealing with users of the product as well, it's like a small startup I had to look after within a big corp. Nothing much changed about my career and I haven't thought about any change either.

## What else?

There's some stuff that had some influence on my life, but I don't feel comfortable writing about it publicly and also for some privacy related reasons. However, if you think you are someone who I might be comfortable to sharing that info with, you can ask for a pass-phrase and instructions to decode and read those parts [here](https://gist.github.com/themisir/0ffb9677751525d86f33d8b28e367c62#file-message-txt). For everyone else you're not skipping much really, it's not an important part of the story anyway, it was just had some impact on forming my life.

If you've read my career path above, you have probably noticed that I had a lot of anxiety related issues. Simply put, I would get anxious in any situation with some unknowns. Getting over that issue become a goal for me, becuase it was really holding my life back from me. I wasn't taking enough risks, I was relying too heavily on my instrictiv thoughts to control my life and it wasn't working out well. Realizing that I started my research. I have read tons of articles about reducing anxiety, watched lots of interviews, and physicologist suggestion videos. I have got a few pointers from those sources that would lead to reduce my anxiety:

- **Facing up the challenge**. I had to make moves that would trigger my anxiety, just to prove myself that it's going to be fine. It's actually a lot ahrder than said. However by taking small steps it becomes easier as you move forward. Eventually you just learn your patterns and when you notice similarities you'll start to ignore anxious thought. However as I said it's really hard at the beginning. For me listening to a heavy music like metal, rock or some pop while taking an action does help to keep my mind away from overthinking. And sometimes you just gotta say "f🦆ck it" and take an action.
- **Studying before acting**. Considering all the possible outcomes and being prepared for them relieved my anxiety quite a bit. To do so I started journalling, before attempting anything that would hike up my anxiety, I would write down what I am going to do, and consider all the possible outcomes and face that none of them is going to kill me, so I am safe to try out.
- **Realizing that nobody really cares**. This is more about overthinking part, which led to a weird anxiety on me that I was always thinking what if __ thinks __ about me. Well the truth to be told, most people usually only care about themselves most of the time. We all have quite busy lifes to spend on thinking about someone's embarassed moments. And even if someone does, they'll probably forget it by a few days anyway. Also another thing that clicked on my mind was the fact that most people are actually insecure even though they don't seem on the first sight. After looking at people that way I started to notice they are indeed mostly insecure, trying every thing to prove their own value, satisfy themselves, be the king of their own lifes. That's actually kinda sad. We all need to accept our flaws and live with them. We are humans and flaws are what makes us unique amongst others. This reminded me of one of the my past essays about [imperfection](https://themisir.com/essays/imperfection/).
- **Talking to friends**. I used to be quite shy about becoming vulnerable around even my closest friends. However by opening up to them I felt a nice relief and hearing lots of advice helped me to see flaws on my thoughts and worries. Also being vulnerable led me to be more close to them and also let them also be vulnerable around me.

There's actually a lot more stuff than those 4 points above, but I don't want to put it all down there right now. This post is already becoming longer (3600+ words so far) and I am not even ready to wrap things up.

While doing my research I noticed that I really don't know much about myself, how and why my brain acts in a certain way. And I really wanted to dig deeper to understand my own thinking porcess and see where was the problem that was causing all the "wrong" things. During my research I've stumbled upon a few book references. I decided to purchase one of them and start reading. My first book choice was ["Quiet" by Susan Cain](https://www.goodreads.com/book/show/8520610-quiet). The book was mainly about introversion, how introverts act in a certain way, and a few guides for introverts to deal with certain situation. The primary reason why I loved that book is, it helped me to accept one of my main insecurities - my own introversion. I thought it's some sort of curse that I have to *fix*. However as I read the book I realized that it's more like a blessing than a curse. I can act and think in a certain way that some people can't. I am usually a really good listener, I listen carefully and try to not interrupt unless I don't have any valuable input to put in, which is apparently a rare thing that most people lack nowadays. By carefully listening to people I can put myself into their shoes and see the world from their eyes, really empathize with them and be part of their experience. I wasn't aware of that ability back then, I was just causally doing it.

Aside from that the book also taught me how to act out in certain situations, how to become a pseudo-extrovert to save the day. Apparently even though introverts are not known to be a talkative people, we can become a good speakers. The only catch is we need to be prepared for it. If we spent enough time to do our research and probably write a script and practice our speech beforehand, introverts can act out just as like as a regular extrovert can. To put that into a practice I attempted a local developer networking event where we've given ~5 to 10 minutes to speak about a subject of our choice. Just like most of you I had a terrible public-speaking anxiety. Well, it was a time to face it out and see that it's really not a big deal. I gave my speech and that was it, nobody laughed, nobody said anything terrible, or I didn't stutter. It was just an "i didn't know I can do this" moment for me.

The other book that contributed to my improvement was ["Attached" by Amir Levine and Rachel Heller](https://www.goodreads.com/book/show/9547888-attached). The book was about attachment theory, which is used to explains child-parent attachment patterns. Later on it was concluded that adult attachments had similar patterns as well. By learning those patterns we can understand our certain behaviors, know what caused certain situations and how to handle them. The book personally helped me to see my own patterns, understand why I act in certain ways that seemed weird when observed from outside. It taught me how to analyze other people's attachemnt styles and make conclusions based on them, to understand thinking mechanism behind each attachment style to see why they make certain moves. The book was mainly about adult relationships and specifically romantic relationships, but I have seen similar patterns with myself even on my friendships and weirdly enough during my career as well. I think the reason why it took me more than 6 months to accept our startup's failure has some correlation with my anxious attachment style since the patterns matched quite well. In conclusion the book gave me a huge "Aha!" moment of my life.

In addition to these 2 books this year I decided to make reading part of my "free time" activity in general. In total I read about 7 books (willing to make it 8 before end of the year) this year. It wasn't much but compared to 0 books I've read in previous years, it's an improvement and I am willing to continue forward. The list of read books available [here on my goodreads profile](https://www.goodreads.com/review/list/41454418?shelf=read). Actually all the above might make it seem like I have been reading for years, or something like that. However I started reading books just this year (maybe previous year might be more accurate but I took long breaks so i hadn't really read that much in the past). In general I am happy that I found another activity that I can replace my mindless scrolling activities with.

> Also, apparently reading increases brain activity, helps with memorization, reduces risk of Alzheimer's disease.

## And then things became boring again...

When my life become somewhat stable and things started to become stale. There was not much happening as time goes on. I had nothing interesting to spice things up on my day-to-day life. Well.. Even though I like having stability, not having any challenge or purpose other than "wake up -> work, eat -> sleep" cycle made me a bit depressing for some time. I was starting to question the purpose of living and other stuff that goes over one's mind during midlife crisis.

When talking with friends a few times I mentioned that I wanted to start learning to play a musical instrument - piano to be exact. It was on my "things to do" list for a long time, aging back to my childhood. Well, even though I already mentioned it a few times I hadn't done much to really accomplish it. One night for no reason at all I decided to really give in. It was not my first time making decisions out of nowhere. In the past I have decided to drop out of university while casually going to there on the bus, and another time I decided to attempt an IELTS exam without any preparation, all of those decisions happened spontaneously. While there was some long term thinking behind all of them, there wasn't any specific moment that triggered them. I guess, I just like to kick things off out of nowhere, just to make life a bit more spicy.

I started my research, started learning notation basics (you can check out [some of my notes](https://docs.google.com/document/d/1IqVJyrG3jgaQdaOTZbf4RQJLXKJOy-qFCU54wtBVGKE/edit?usp=sharing) I took during my initial research) and looking at piano models to see what can I purchase to kick things off. Eventually I got not really great but okay'ish keyboard and tried to get my hands used on it. After watching online tutorials and reading various blogs, reddit threads I got some basics but a few more weeks I stopped seeing any progress being made. That was when I decided to start looking for an instructor to help me kick things up. Another [close friend of mine](https://soltancode.com) helped me to find a good instructor. Eventually I started getting weekly lessons. Got some basics in place and started learning a few songs.

Truth to be told, at the beginning I was kind of feeling insecure. I couldn't read the notation, or couldn't accomplish things my instructor has taught me. I even though about giving up, multiple times, ranted quite a bit with my friends (sorry for bothering with me, lol). Eventually I realized that if I put enough time into it, I can eventually learn things that seemed unbearable at first. Also another thing that was bothering me is, I used to "invent" my own ways when it comes to learning something. For example during the primary school years I never been able to memorize the multiplication table. Instead of remembering them I just come up with a few hacks to calculate them on demand by adding multiple numbers together or following some patterns. It wasn't an efficient solution, however it was a scaleable one. However, as I used them more and more, my brain eventually started remembering them. I guess we have a built-in [LRU cache](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) implemented on our brains. Remembering that I decided to use the same method for notation as well. Instead of remembering all the details I would just remember a few references and use them to figure out the rest on demand hoping that the brain will eventually figure out the pattern and use it instead. That kinda worked, at least now I can figure out which key to press by looking at the notation and doing a bunch of calculations and counting notes up.

During my learning process I have built a few tools to help me while learning or practicing:

- https://sheet.themisir.com - Is a *crappy-looking* but quite useful (at least for myself) game like thing that you can use to practice reading note sheets, it's a weird approach, kind of.. but I made it for myself and it kind of worked, so, I am happy with the end result.
- I wrote a small golang app using [the midi library](https://github.com/gomidi/midi) to help me fix my timing/rythm issues on keyboard. The app were pretty simple actually, it just happens that I found a bunch of ways to overcomplicate it. Basically it just counts on duration between notes on a specific predefined ranges (treble and bass clef for example) and reports your tempo as BPM (beats per minute) back to you. Why? Because I was trying to get my hand timing right. I know I could have used metronome instead, and I used it as well. However I also wanted to see what my timing would look like without a metronome in place.

All in all right now I have been going to piano classes for about 2 months now, learned 3 songs and right now working on my rhythm issues. Hopefully my sightreading speed will go up as I practice more. However, my instructor always been telling me to focus on practicing slowly instead of focusing on the speed. I guess he's right and I'll go with what he says for now. I don't have any deadline or a huge goal anyways. I started learning it just as a hobby, just to have some activity I can spend time on when I don't feel like doing anything else. Also, playing helps me to reduce my stress (as long as I don't get stressed because I keep pressing the wrong key, or messed up the timing again). Also it added up some challenge to my life, which is nice seeing some progress on myself.

## What's next?

I do not know. Really. I haven't made any agenda for the next year. I decided to let the life flow by itself and make decisions based on where the flow turns into. I don't have much control over entirety of the life, so it's really hard to make any mid-term goals for now. My considerations does include but not limited to things like migrating to another country, starting a non-CS degree (physiology for example), or maybe just traveling the world (less likely, but I might try this with a smaller scope). Those are just a few options, but I am unsure about the future. World was quit unstable lately, which was adding up to my uncertainity about the future. I guess as I said earlier on this paragraph, I will just let things flow by itself for some time. Then based on the direction I might choose one or two destinations, create a route and start floating towards that route. Let's live and see how things turn out!

Thank you for reading this far! I was not expecting this post to turn out to be that long (about 5600+ words), but I wanted to wrap the year up for myself and use the opportunity to reflect on my own life. I know recently my posts started becoming more subjective and personal compared to my previous generalized & somewhat informative posts. As I said on my previous post I am planning to write different kinds of posts on my blog and make it my own personal medium on the internet.

Have a lovely new year! <3