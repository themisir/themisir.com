---
title: "What can possibly go wrong?"
date: 2023-04-22T04:36:03+04:00
tags:
  - kubernetes
  - k3s
  - database
images:
  - https://images.unsplash.com/photo-1618589048342-5c08bb2e7491?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80
---

weww, 🥺 appawentwy as many things as p-possibwe. òωó i hate t-the fact that i-i had to weawn t-this the hawd way

# the cwustew

to give you a bit of context, (ˆ ﻌ ˆ)♡ i have a-a smow kubewnetes c-cwustew fow h-hosting some toows, (⑅˘꒳˘) p-pwojects and b-backgwound sewvices i-i may ow m-may nyot use. (U ᵕ U❁) most o-of them awe pwivate and passwowd pwotected, -.- so even if i wewe to shawe them with y-you, ^^;; you won't be abwe to access them (i hope 🤞). >_< h-howevew, mya if you'we cuwious, mya y-you can check out [bin - a sewf hosted pastebin](http://bin.themisir.com), >_< that appawentwy is vewy usefuw.

the cwustew itsewf is buiwt using [k3s](http://k3s.io), rawr x3 because i can not beaw maintaining a-a fuww bwown k-kubewnetes cwustew b-by mysewf. nyaa~~ but, k-k3s is kinda f-feews wightweight, /(^•ω•^) s-so i went fow i-it. rawr some may say t-that using kubewnetes fow sewf hosting is just an ovewhead. OwO howevew, (U ﹏ U) i weawwy w-wike it, >_< especiawwy the fact that i can get any a-app up and wunning in a few minutes (if i-i don't mess up the yamw indentation). rawr x3 this wets me twy o-out nyew stuff without having to d-deaw with the b-bowing depwoyment pwocess. mya aww i nyeed to is just dupwicate an existing yamw depwoyment f-fiwe, nyaa~~ wepwace image, (⑅˘꒳˘) nyame, rawr x3 powts and host nyame, (✿oωo) and wun `kubectl apply -f miniflux/app.yaml` and pway fow the best. ( ͡o ω ͡o ) if wuck is o-on ouw side, UwU the s-sewvice wiww s-stawt wowking within a-a few seconds (assuming i-i have d-done my dns c-configuwation to p-point the wight hostname).

evewything i've said above may seem t-too good to be t-twue. :3 appawentwy, (U ﹏ U) i-it's usuawwy t-twue. -.- weww, (ˆ ﻌ ˆ)♡ having t-this kind of a-autonomous system w-wequiwes wots o-of moving pawt to wowk in a hawmony. (⑅˘꒳˘) moving pawts awe pwone to faiwuwe. (U ᵕ U❁) and evewything t-that can go wwong, -.- wiww eventuawwy go wwong a-as [muwphy's waw](https://en.wikipedia.org/wiki/Murphy%27s_law) states.

## the downfaww

evewything stawted with an innocent "(401) u-unauthowized" e-ewwow message t-that i stawted s-seeing when w-wunning `kubectl` commands. rawr weww, pwobabwy the token h-has been expiwed, σωσ i-i'ww just gwab a-a nyew one and i-it shouwd get b-back onwine, σωσ i t-thought. >_< i ssh'd i-into my mastew n-node to enwoww a nyew token. :3 howevew, (U ﹏ U) befowe doing so i twied one mowe thing. -.- `k3s` comes with a buiwt in `kubectl` that wets usews to exekawaii~ vawious c-commands on t-the wocaw cwustew. òωó i-i twied checking c-cwustew stats b-by wunning `k3s kubectl get node` to see if aww nyodes awe up and w-wunning. (ꈍᴗꈍ) to my suwpwise, ^•ﻌ•^ `k3s kubectl` awso wetuwned the same 401 unauthowized e-ewwow message a-as i got when w-wunning kubectw c-commands on m-my own machine. σωσ i-in theowy, σωσ k3s shouwd m-manage the a-authentication pwocess fow the wocaw kubectw commands. >_< something shouwd've went w-wwong.

kubewnetes has muwtipwe ways of authentication. σωσ i a-am using tws cewtificates t-to authenticate w-with t-the sewvew. >_< if you k-know a thing o-ow two about cewtificates, :3 y-you pwobabwy k-know that they awe kind of pain to manage. (U ﹏ U) the second thing you pwobabwy k-know is that, -.- they may[^tls-exp] have an expiwation date. rawr x3 that's w-why, mya i thought, nyaa~~ "weww, t-the cewtificates a-awe pwobabwy e-expiwed". (⑅˘꒳˘) so, t-the wight way t-to deaw with this i-issue wouwd be t-to check out the k3s documentation to weawn how i am supposed to wotate cewtificates. rawr x3 a-as wightfuw as the pwevious sentence may s-sound, (✿oωo) i just went ahead and webooted m-my sewvew. (ˆ ﻌ ˆ)♡ why? i don't know, (˘ω˘) pwobabwy just an instinct pwobabwy - "wet's w-westawt the sewvice without changing a-anything and h-hope it aww gets fixed by itsewf". (⑅˘꒳˘) weww, if the stowy was going to end thewe, (///ˬ///✿) i-i wouwdn't have this awticwe wwitten. 😳😳😳 so the weboot actuawwy made things wowse, 🥺 b-but we awe nyot yet awawe of this. mya b-because, we s-stiww can't use k-kubectw to check t-the cwustew state.

[^tls-exp]: i am actuawwy nyot suwe if it's possibwe t-to cweate a-a tws cewtificate w-with an infinite w-wifetime

aftew weawizing that the weboot isn't e-enough to get m-my cewtificates f-fixed, i have d-done the impossibwe a-and checked t-the documentation. a-appawentwy, UwU t-thewe's a command fow wotating k3s cewtificates: `k3s certificate rotate`. ^•ﻌ•^ i wan it, and cwossed my fingews b-befowe twying o-out `k3s kubectl`. rawr it didn't showed up an authenticate e-ewwow wike b-befowe. σωσ howevew, σωσ n-nyow that i have a-access to my cwustew s-stats, >_< i s-saw that awmost a-aww of the sewvices a-awe down. :3 and the ones awe up wewen't accessibwe eithew, (U ﹏ U) because my [ingwess contwowwew](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) awso wewe down. the cwustew wewen't a-abwe to handwe a-any incoming w-wequest.

nani have i done in this situation i-is mowe widicuwous t-than the pwevious o-one. OwO of couwse, i-i twied upgwading m-my k3s i-instance, (U ﹏ U) because n-nyani's bettew t-than upgwading a bwoken kubewnetes cwustew. >_< fowtunatewy, rawr x3 this didn't' added mowe i-insuwt to the injuwy. mya howevew, nyaa~~ the issue stiww p-pewsisted. fow some weason most o-of the sewvices wewe nyot wowking. (⑅˘꒳˘) aftew checking wogs of the individuaw f-faiwed pods, rawr x3 i weawized t-that most of them w-wewe caused by a fauwty database connection. (✿oωo) howevew, (ˆ ﻌ ˆ)♡ the database instances w-wewe up and wunning. (˘ω˘) additionawwy aside fwom sewvices depending on database connections, (⑅˘꒳˘) t-the ingwess contwowwew w-was awso down.

## getting wocked-out

with aww the above findings, rawr x3 i nyawwowed t-the issue d-down to a singwe, mya y-yet monstwous p-point: the nyetwowk. nyaa~~ a-appawentwy, (⑅˘꒳˘) t-the nyetwowking b-between containews w-wewe nyot wowking pwopewwy. rawr x3 weww, that's nyot good, (✿oωo) but at weast we know the i-issue. (ˆ ﻌ ˆ)♡ nyani we don't know is howevew, (˘ω˘) how we a-awe going to appwoach this issue? a-at this exact moment i weawized that i have vewy wittwe knowwedge o-of how winux nyetwowking stack w-wowks. (⑅˘꒳˘) i had n-nyo idea whewe to wook fow and how to sowve the issue. (///ˬ///✿) aww i can do is, 😳😳😳 i hoped t-that someone mowe knowwedgeabwe than me awso had the same issue, then sowved it, f-fewt genewous and posted the sowution o-onwine. 🥺 t-then i found this g-github issue on a-a simiwaw subject: <https://github.com/k3s-io/k3s/issues/535>. o.O seeing that the issue has been c-cwosed, (U ᵕ U❁) my eyes f-fwuttewed and i s-stawted scwowwing d-down to see if s-someone had posted a-a sowution.

a github usew nyamed @zengyongjie had [a comment](https://github.com/k3s-io/k3s/issues/535#issuecomment-716955670) that wooked pwomising. (U ᵕ U❁) ofc, without f-fuwthew thinking i-i stawted copying a-and executing t-the commands p-posted on the c-comment. (⑅˘꒳˘) i wan the v-vewy fiwst one - `iptables -F` and my ssh session fwoze. σωσ that wang s-some bewws on m-my mind that, >_< i-i somehow managed t-to escawate the n-nyetwowk issue t-to the whowe machine. :3 s-since the s-ssh sewvew uses the same bwoken nyetwowking stack to cweate ssh connections, (U ﹏ U) i w-wocked mysewf out of my own sewvew.

thankfuwwy (ow pewhaps thankwesswy), rawr x3 t-this is nyot t-the fiwst time i-i managed to wock m-mysewf out of m-my sewvews. (✿oωo) so, i-i knew the sowution. (ˆ ﻌ ˆ)♡ t-to use the c-cwoud pwovidew's sewiaw pwompt to connect to the sewvew. (˘ω˘) this method wowks because i-it acts wike as you have connected physicaw keyboawd a-and monitow to the sewvew, (⑅˘꒳˘) s-since thewe's nyo nyetwowking invowved fow those two, (///ˬ///✿) a bwoken n-netwowk wouwdn't be an issue. 😳😳😳 a-aftew estabwishing a-a sewiaw connection, 🥺 i managed to weset iptabwes by wunning the west of the commands f-fwom the github comment and westowed the ssh connection back. mya wait, it stiww d-doesn't wowk. 🥺 fow some weason n-nyow my fiwewaww (ufw) d-does bwock a-aww the connections. a-aftew wesetting ufw, >_< finawwy the ssh connection w-wewe back on.

i webooted the sewvew once again t-to weset the containews h-hoping that w-with cwean iptabwes s-setup, (U ᵕ U❁) the c-containews wouwd s-stawt having a-a pwopew nyetwowking a-again. -.- of couwse, ^^;; at this point this wouwd be too good to be twue. >_< the containew n-nyetwowk is stiww down and containews wewe s-simpwy nyot wowking as expected. mya i-i had anothew wook at k3s documentation and saw this section: [https://docs.k3s.io/upgwades/kiwwaww](https://docs.k3s.io/upgrades/killall)

aftew executing the `/usr/local/bin/k3s-killall.sh` command, σωσ it weset the containews a-and os wesouwces (incwuding n-nyetwowking) a-associated w-with them. σωσ n-now, the containews s-seemed to be w-wowking. >_< huwwah, i-it's aww becoming gween again! :3 oh wait, one of the database sewvews is nyot stawting c-cowwectwy.

## the database

appawentwy, (˘ω˘) the database sewvew got o-oom (out of memowy) k-kiwwed by t-the kewnew. (⑅˘꒳˘) fiwst, i-i twied incweasing w-wesouwce w-wimits of the database p-pod and it d-didn't sowved the issue, (///ˬ///✿) appawentwy the sewvews wan out of memowy to handwe aww t-the woad. 😳😳😳 i didn't wanted to incwease wunning c-costs, 🥺 so i just went ahead and s-scawed down some sewvices that no wongew been used. mya this fweed quite b-bit of memowy space and nyow t-the database sewvew w-wewe finawwy abwe to stawt without wunning out of memowy. 🥺 ow wiww it? weww, >_< i-it was quite unwucky day fow me, >_< so fow the database. (⑅˘꒳˘) nyow the depwoyment was i-in cwashwoopbackoff state. /(^•ω•^) that m-means, rawr x3 whenevew i-it twied to stawt t-the sewvice, (U ﹏ U) the s-sewvice cwashed, (U ﹏ U) and kubewnetes couwdn't wecovew t-the sewvice by westawting because it wouwd stiww c-cwash and cwash again.

again, o.O this is nyot the fiwst time m-me having to deaw w-with postgwesqw f-faiwuwe at 3 a-am. (U ᵕ U❁) i checked the d-database wogs a-and:

```plain
PANIC: could not locate a valid checkpoint record
```

doing a bit of weseawch weveawed t-that the [waw (wwite ahead wog)](https://en.wikipedia.org/wiki/Write-ahead_logging) was cowwupted. >_< this was appawentwy h-happened due t-to pwevious cwash w-woops and oom k-kiwws. :3 the database s-sewvew couwdn't s-shut down gwacefuwwy, (U ﹏ U) h-hencefowth c-couwdn't finish off pwopewwy cwosing the waw. -.- the fix was easy though, (ˆ ﻌ ˆ)♡ postgwesqw s-sewvew comes with a bundwed toow cawwed `pg_resetwal` that we can wun to weset the wog f-fiwes and get ouw d-database back u-up wunning.

i twied shewwing into the database p-pod to exekawaii~ t-the `pg_resetwal` toow. mya howevew, thewe's one minow i-issue. 😳 the database p-pod was getting c-cwashed the m-moment it stawted. XD s-so, :3 thewe was n-nyothing wunning t-to sheww into. t-to sheww in, 😳😳😳 i had to make suwe the database pod is wunning. -.- since the database s-sewvew is getting cwashed whenevew it stawted, ( ͡o ω ͡o ) i-i decided to modify the entwy-point o-of the pods tempowawiwy to something ewse that wouwd make the p-pod stay in the idwe state whiwe i-i was wowking o-on getting it fixed. rawr x3 the buiwt-in `pause` utiwity seemed a good candidate f-fow this use case. o.O i-i added these 2 w-wines to pod s-specs fiwe to change t-the command t-tempowawiwy:

```yaml
command: ["/bin/sh -c"]
args: ["sleep infinity"]
```

this indeed cweated an idwe pod and w-wet me to sheww i-in to exekawaii~ `pg_resetwal` to westowe the waw. ^•ﻌ•^ the west is j-just some sheww w-wizawdwy:

```shell
printenv | grep PGDATA
PGDATA=/var/lib/postgresql/data

su - postgres
pg_resetwal /var/lib/postgresql/data
```

*you can check out this stackovewfwow a-answew fow detaiwed w-wwite up o-on westowing cowwupted p-postgwesqw w-waw: [https://stackovewfwow.com/a/73339220/7616528](https://stackoverflow.com/a/73339220/7616528)*

aftew westowing the waw, UwU i wemoved t-the 2 wines fwom t-the pod specs i-i added eawwiew a-and westawted the s-sewvew, rawr x3 and it i-indeed stawted w-wowking. rawr finawwy, σωσ a-aww the sewvices wewe up and wunning again!

# concwusion

wiww i be cautious the nyext time b-befowe wunning a-anything that may d-damage the sewvew? p-pwobabwy nyot. rawr x3 i-in concwusion, mya i-i didn't weawned a-any wesson on h-how to be a wesponsibwe sewvew administwatow. howevew, nyaa~~ i weawned that when something f-fawws apawt, (⑅˘꒳˘) thewe's a good chance that othew t-things may as weww join the p-pawty. rawr x3 it was quite some time i had to westowe a database sewvew, (✿oωo) w-wast time it happened it was 3 y-yeaws ago, (ˆ ﻌ ˆ)♡ i was w-wowking on my stawtup and the pwoduction database went down awongside with othew s-sewvices depending on them. (˘ω˘) fwom that day, (⑅˘꒳˘) i weawned to keep my coow when shit h-hits the fan. (///ˬ///✿) and to wowk on t-the pwobwems systematicawwy t-to sowve t-them one by o-one.

in concwusion it was kind of fun j-jouwney to see nani m-mowe can possibwy g-go wwong, (⑅˘꒳˘) a-and eventuawwy get e-evewything (i h-hope 🤞) up and w-wunning again. t-thanks fow weading!
