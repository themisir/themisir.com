---
title: "Dear API Providers"
date: 2024-10-22T00:37:00+01:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1729432535993-048bf87e1ceb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

_If you are looking for a set of good technical advices for designing your API, I would recommend checking this article instead of reading my rant: https://jcs.org/2023/07/12/api_

I am writing this article as a manifestation and a cry for help to everyone being involved in designing and serving APIs to be consumed by external consumers.

Please, just maintain stability of your APIs, don't change name of a field because of some internal reason I am not concerned about, or heck don't move the entire body into another object just because you can now claim to have a cleaner API design. As a consumer, the last thing I would care about is what are your internal struggles, struggles that are undocumented and have not been disclosed during integration phrase. Consumers want a peace of mind and stability. Otherwise changing software to fit third party's changing needs is costly and time consuming exercise.

Here, I will be sharing my experience working with lots of third party service providers ranging from CRMs, payment services, well known services like Firebase, to internal providers from another department within the same company.

My common experience with those providers are the following:

- Breaking things for no good reason
- Not realizing scope of their changes
- And the worst of all, not properly communicating their changes
- Poor documentation
- Using assumptions instead of putting engineering guardrails to directing consumers

# Documentation

Let me start from the last two points, where the pain started hitting when I first started integrating the provider. Third party API integration documentations are a common pain point among many service providers; they usually lack the empathy necessary to look at the problem from the consumer's perspective and write out what they need.

But you know what sucks more? A documentation that doesn't have the valid material in it. Again, I have been working with many service providers around the world. It's not the first time I am having the experience of manually testing each endpoint one by one and creating an ad-hoc documentation I can refer to internally. I learned to not trust any word third parties say, even their documentation. You better check it yourself and take a damn closer look at the requests and responses you are dealing with just to either build some confidence on the documentation or realize to not waste any time with it.

I had a fairly recent interaction with some providers that suffered from documentation issues... What was their problem?
Outdated documentation, mostly. Their response models was completely out of touch with the reality.

On top of that documentation was unstructured and lacking important details like explanations of the enumeration parameters. In a slightly complex integration scenarios like webhooks, it's worth investing a bit of time to create some illustrations for the data flow to show event timings and explain how the data flows among the bigger system.

![Stripe payment lifecycle](https://i.imgur.com/GKQqUoC.png)

It doesn't help with their situation that they decided to make major API structure changes 2 times, which I am going to talk separately about. Their unstructured documentation didn't helped either. Nor the changes has been communicated properly.

The way out of this situation I see is like this:

1. Do not break the users
2. If you do anyways, talk to your users and give them time and resources. Those resources should include what **exactly** needs to be changed, what are the **excepted** behavioral changes of the system.
3. Monitor your migration process and communicate with your users!

# Breaking the compatibility

I do not like spreading my religious views, but if I have to spread one of my views, it would be this sentence from Linus Torvalds:

> We don't break the userspace!

[Linus Torvalds on why desktop Linux sucks [2:52]](https://youtu.be/Pzl1B7nB9Kc?t=172)

Userpsace here means the consumer side of the product Linus is maintaining (the Linux Kernel). With the same analogy the userspace is the API interface service providers expose. The problem with this approach is people are prone to making breaking changes unintentionally, I would like to list a few cases starting with the obvious ones:

## Do not change your public API interface ...

... (URLs, request, response models, headers, etc...) unless you have a really good reason. And no, I don't care about your internal procedures. I don't care if you have moved from ints to uuids on your database and asking us to except a string. That's an irresponsible change on your end. Even if you must make a change because the third party service you are relying on made a bad decision, you are still the one to blame if you let the change to cascade into your users.

Let's say you decided to move anyway, then please refer to the [communication](#communication) section down below to learn how to move with migration processes. And please keep old versions of your APIs available until you are confident (with a measurable metrics!) that you can deprecate the API.

Starting July, 2024 firebase shut down its _legacy_ HTTP api for sending notifications to user's android phones. What they changed? The way they authenticate. Because previously they were using api tokens to authenticate those requests. For some reason they thought instead of a scoped down API key, using a service account that can be used to act on behalf of user if not configured properly is more secure. That was the first point on their reasoning. It just created me a few more hours of work to migrate everything to use FirebaseAdmin instead of just plain HTTP apis that was easier to test and integrate. I had to _extend_ my configuration stack to load service account identification file from a separate path for authentication. They tried to avoid using api keys in favor of files that are still a big responsibility to store properly, can be leaked and cause damage, but it is more complicated to use if you don't import their proprietary library into your codebase. Of course it is much more easier to integrate if you are hosting your app in <abbr title="Google Cloud Platform ">GCP</abbr> infrastructure, assuming you also know how to properly configure IAM settings to not expose your entire infrastructure vulnerable.

## Minor changes

**DO NOT make any minor changes!** Calling a change a "minor change" is just avoiding responsibility on your end. ["Hyrum's law"](https://www.hyrumslaw.com) states it the best:

> With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.

If you have more than 3 users, please be respectful and at least be honest to yourself, do not downplay how much damage you can make by making small observable adjustments in your system.

[![XKCD: Workflow](https://imgs.xkcd.com/comics/workflow_2x.png)](https://xkcd.com/1172/)

Let me give you a concrete example. We had a payment provider we integrated with the software used by one of our clients. A few days ago the payment provider decided to start sending one additional `cardRegistration` field via their WebHook interface. Well, usually they would send this field only if we initiated the process with another specific endpoint used for card registration. We used the absence of `cardRegistration` field to communicate back our system which endpoint we used to initiate the process and handle accordingly. They probably deployed an update that is now sending `"cardRegistration": { "cardUid": "null", ... }` to us as a part of the response. Our system recognized this as a valid request for card registration and stored the card credentials (which is a string `"null"`) to be used afterwards. Well, within a day, over hundreds of orders stacked in the system from users trying to pay their dues using the card token `"null"`. Now users are probably angry at our client, the client is now angry at us, and now me pointing fingers to the provider. This could have been avoided if the scope of the change has been measured properly (and tested properly).

Your assumptions about your users are **WRONG**! All of them! Do not expect them to behave the way you intended. You put possible guardrails in your API design, accept rest of the all possibilities. That's also a good reason to keep exposed surface of your API endpoints to a minimum. I should have not relied on the absence of an arbitrary field to communicate some information back from a different part of the stack. I made a mistake by trusting the third party system, because they seemed reliable at the time of this integration. I assumed if there's `cardRegistration` field, it sure means I can use it to register new card tokens. I shouldn't have assumed this; Nor the provider should not have assumed that nobody had this assumption. It was a clearly observable behavior change that ended up causing lots of repetitional and financial damage.

## Shifting the blame

Blaming your users when they are not behaving the way you expected them to behave is just a terrible oversight on your end. I have personally felt the passive aggressive blame from local software shops selling CRM services to clients I personally work with. It's not my mistake if your software crashes when I provide a data that's clearly fits the format you provided. Look, I don't say this shouldn't happen, you can not avoid unforeseen behaviors entirely. How you deal with them is your responsibility. Acting insecure and pointing fingers does just portray a weakness.

# Communicate

So you decided to make a change to the observable behavior of the system. I wish you didn't but on a longer timescale change is unavoidable. What's avoidable is the damage you would be incurring. You need to clearly communicate with your users, in a technical terms, explain what is **exactly** going to change, what are the observable changes you are expecting to pop up. And if possible provide a clear timeline.

## Observe your system

Please improve observability on your system. That's one of the hard lessons I learned in last couple of years myself. To make helpful communication, you first need to let your system communicate its state back to you.

Collect as much telemetry as possible from your system. If your only stored metrics are the logs inside `/var/nginx/logs/access.log`, you are not doing it right! Start logging, tracing and collecting all the application telemetry if possible into a central system (eg: ELK stack, CloudWatch, Seq, etc...).

You need to make use of the data to see what you are missing. Start building useful dashboards. Use the dashboards to make technical and business decisions. You will find a lot of data missing. Add new tracing capabilities on your system to gather more data to have more clearer visibility. Rinse and repeat.

If you are working with third parties, trace the communication interfaces. Have clear success metrics, error logs, timestamps, etc. Also create alarms that would page you back if something doesn't look alright. A user constantly hitting your endpoint and getting 400 BadRequest is a good indicator that you probably have messed up something on your last batch of minor changes release.

Once you have data to identify issues and observe the system, please communicate with your users if you suspect any unusual activity. The investment into system observability does usually pay a lot over time, mostly giving you numbers you can refer to and confidence to speak out. It will lower your guess work. On top of that I have seen it many times helping me identify very specific issues that I would otherwise couldn't reproduce, debug and figure out. It will take quite a time until you start to make sense of data you have collected. Let it take the time it needs, the experience will be paid off in dividends later on.

Back to the main topic, communicate your findings with your users. You can do so much with those numbers to make life easier for your users. During migration you can keep track of the adaption by users and decide when you can deprecate older APIs, or communicate with users to learn their pain points. Act quickly when experiencing sudden increase in errors.

# Conclusion

As a service provider, you will be held responsible for your own actions. To avoid as much damage as possible, timely communication is a must have skill you need to master. You need to understand your responsibilities and be brave enough to apologize when necessary. You need to understand your users and your system. You need data, as much data as possible until you can effectively utilize them. Use data as a leverage on your choices. Be vigilant, act before it's too late to avoid further damages.

I am myself providing services to companies that are relying on software I build. Tens of thousands users around the globe are interacting with them almost daily.

I am also learning, and trying to improve as a service provider. For example I would not consider myself good at communication part, but that has been improved quite a lot over the years. I can still see further improvement on my end and I am trying to get better it. I learned to take responsibilities at face and navigate at the hard times. I understand the struggles of the service providers.

That's why I also share my experience, especially putting emphasis on engineering solutions we can use like observability and using data we gathered to better optimize our workflow.
