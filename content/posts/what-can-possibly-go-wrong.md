---
title: "What can Possibly go wrong?"
date: 2023-04-22T04:36:03+04:00
tags:
  - kubernetes
  - k3s
  - database
images:
  - https://images.unsplash.com/photo-1618589048342-5c08bb2e7491?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80
---

Well, apparently as many things as possible. I hate the fact that I had to learn this the hard way

# The Cluster

To give you a bit of context, I have a small kubernetes cluster for hosting some tools, projects and background services I may or may not use. Most of them are private and password protected, so even if I were to share them with you, you won't be able to access them (I hope 🤞). However, if you're curious, you can check out [bin - a self hosted pastebin](http://bin.themisir.com), that apparently is very useful.

The cluster itself is built using [k3s](http://k3s.io), because I can not bear maintaining a full blown kubernetes cluster by myself. But, k3s is kinda feels lightweight, so I went for it. Some may say that using kubernetes for self hosting is just an overhead. However, I really like it, especially the fact that I can get any app up and running in a few minutes (if I don't mess up the YAML indentation). This lets me try out new stuff without having to deal with the boring deployment process. All I need to is just duplicate an existing YAML deployment file, replace image, name, ports and host name, and run `kubectl apply -f miniflux/app.yaml` and pray for the best. If luck is on our side, the service will start working within a few seconds (assuming I have done my DNS configuration to point the right hostname).

Well, everything I've said above may seem too good to be true. Well, it's usually true. Well, having this kind of autonomous system requires lots of moving part to work in a harmony. Moving parts are prone to failure. And everything that can go wrong, will eventually go wrong as [Murphy's law](https://en.wikipedia.org/wiki/Murphy%27s_law) states.

## The Downfall

Everything started with an innocent "(401) unauthorized" error message that I started seeing when running `kubectl` commands. Well, probably the token has been expired, I'll just grab a new one and it should get back online, I thought. I ssh'd into my master node to enroll a new token. However, before doing so I tried one more thing. `k3s` comes with a built in `kubectl` that lets users to execute various commands on the local cluster. I tried checking cluster stats by running `k3s kubectl get node` to see if all nodes are up and running. To my surprise, `k3s kubectl` also returned the same 401 unauthorized error message as I got when running kubectl commands on my own machine. In theory, k3s should manage the authentication process for the local kubectl commands. Something should've went wrong.

Kubernetes has multiple ways of authentication. I am using TLS certificates to authenticate with the server. If you know a thing or two about certificates, you probably know that they are kind of pain to manage. The second thing you probably know is that, they may[^tls-exp] have an expiration date. That's why, I thought, "well, the certificates are probably expired". So, the right way to deal with this issue would be to check out the k3s documentation to learn how I am supposed to rotate certificates. As rightful as the previous sentence may sound, I just went ahead and rebooted my server. Why? I don't know, probably just an instinct probably - "let's restart the service without changing anything and hope it all gets fixed by itself". Well, if the story was going to end there, I wouldn't have this article written. So the reboot actually made things worse, but we are not yet aware of this. Because, we still can't use kubectl to check the cluster state.

[^tls-exp]: I am actually not sure if it's possible to create a TLS certificate with an infinite lifetime 

After realizing that the reboot isn't enough to get my certificates fixed, I have done the impossible and checked the documentation. Apparently, there's a command for rotating k3s certificates: `k3s certificate rotate`. I ran it, and crossed my fingers before trying out `k3s kubectl`. It didn't showed up an authenticate error like before. However, now that I have access to my cluster stats, I saw that almost all of the services are down. And the ones are up weren't accessible either, because my [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) also were down. The cluster weren't able to handle any incoming request.

What have I done in this situation is more ridiculous than the previous one. Of course, I tried upgrading my k3s instance, because what's better than upgrading a broken kubernetes cluster. Fortunately, this didn't' added more insult to the injury. However, the issue still persisted. For some reason most of the services were not working. After checking logs of the individual failed pods, I realized that most of them were caused by a faulty database connection. However, the database instances were up and running. Additionally aside from services depending on database connections, the ingress controller was also down.

## Getting Locked-out

With all the above findings, I narrowed the issue down to a single, yet monstrous point: The Network. Apparently, the networking between containers were not working properly. Well, that's not good, but at least we know the issue. What we don't know is however, How we are going to approach this issue? At this exact moment I realized that I have very little knowledge of how Linux networking stack works. I had no idea where to look for and how to solve the issue. All I can do is, I hoped that someone more knowledgeable than me also had the same issue, then solved it, felt generous and posted the solution online. Then I found this GitHub issue on a similar subject: https://github.com/k3s-io/k3s/issues/535. Seeing that the issue has been closed, my eyes fluttered and I started scrolling down to see if someone had posted a solution.

A GitHub user named @zengyongjie had [a comment](https://github.com/k3s-io/k3s/issues/535#issuecomment-716955670) that looked promising. Ofc, without further thinking I started copying and executing the commands posted on the comment. I ran the very first one - `iptables -F` and my ssh session froze. That rang some bells on my mind that, I somehow managed to escalate the network issue to the whole machine. Since the ssh server uses the same broken networking stack to create ssh connections, I locked myself out of my own server.

Thankfully (or perhaps thanklessly), this is not the first time I managed to lock myself out of my servers. So, I knew the solution. To use the cloud provider's serial prompt to connect to the server. This method works because it acts like as you have connected physical keyboard and monitor to the server, since there's no networking involved for those two, a broken network wouldn't be an issue. After establishing a serial connection, I managed to reset iptables by running the rest of the commands from the GitHub comment and restored the ssh connection back. Wait, it still doesn't work. For some reason now my firewall (ufw) does block all the connections. After resetting ufw, finally the SSH connection were back on.

I rebooted the server once again to reset the containers hoping that with clean iptables setup, the containers would start having a proper networking again. Of course, at this point this would be too good to be true. The container network is still down and containers were simply not working as expected. I had another look at k3s documentation and saw this section: https://docs.k3s.io/upgrades/killall

After executing the `/usr/local/bin/k3s-killall.sh` command, it reset the containers and OS resources (including networking) associated with them. Now, the containers seemed to be working. Hurrah, it's all becoming green again! Oh wait, one of the database servers is not starting correctly.

## The Database

Apparently, the database server got OOM (out of memory) killed by the kernel. First, I tried increasing resource limits of the database pod and it didn't solved the issue, apparently the servers ran out of memory to handle all the load. I didn't wanted to increase running costs, so I just went ahead and scaled down some services that no longer been used. This freed quite bit of memory space and now the database server were finally able to start without running out of memory. Or will it? Well, it was quite unlucky day for me, so for the database. Now the deployment was in CrashLoopbackOff state. That means, whenever it tried to start the service, the service crashed, and kubernetes couldn't recover the service by restarting because it would still crash and crash again.

Again, this is not the first time me having to deal with PostgreSQL failure at 3 am. I checked the database logs and:

```plain
PANIC: could not locate a valid checkpoint record
```

Doing a bit of research revealed that the [WAL (write ahead log)](https://en.wikipedia.org/wiki/Write-ahead_logging) was corrupted. This was apparently happened due to previous crash loops and OOM kills. The database server couldn't shut down gracefully, henceforth couldn't finish off properly closing the WAL. The fix was easy though, PostgreSQL server comes with a bundled tool called `pg_resetwal` that we can run to reset the log files and get our database back up running.

I tried shelling into the database pod to execute the `pg_resetwal` tool. However, there's one minor issue. The database pod was getting crashed the moment it started. So, there was nothing running to shell into. To shell in, I had to make sure the database pod is running. Since the database server is getting crashed whenever it started, I decided to modify the entry-point of the pods temporarily to something else that would make the pod stay in the idle state while I was working on getting it fixed. The built-in `pause` utility seemed a good candidate for this use case. I added these 2 lines to pod specs file to change the command temporarily:

```yaml
command: ["/bin/sh -c"]
args: ["sleep infinity"]
```

This indeed created an idle pod and let me to shell in to execute `pg_resetwal` to restore the WAL. The rest is just some shell wizardry:

```shell
printenv | grep PGDATA
PGDATA=/var/lib/postgresql/data

su - postgres
pg_resetwal /var/lib/postgresql/data
```

_You can check out this stackoverflow answer for detailed write up on restoring corrupted PostgreSQL WAL: https://stackoverflow.com/a/73339220/7616528_

After restoring the WAL, I removed the 2 lines from the pod specs I added earlier and restarted the server, and it indeed started working. Finally, all the services were up and running again!

# Conclusion

Will I be cautious the next time before running anything that may damage the server? Probably not. In conclusion, I didn't learned any lesson on how to be a responsible server administrator. However, I learned that when something falls apart, there's a good chance that other things may as well join the party. It was quite some time I had to restore a database server, last time it happened it was 3 years ago, I was working on my startup and the production database went down alongside with other services depending on them. From that day, I learned to keep my cool when shit hits the fan. And to work on the problems systematically to solve them one by one.

In conclusion it was kind of fun journey to see what more can possibly go wrong, and eventually get everything (I hope 🤞) up and running again. Thanks for reading!