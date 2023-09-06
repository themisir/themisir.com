---
title: "Synchronizing State"
date: 2023-06-06T13:50:10+04:00
tags:
  - engineering
  - multithreading
images:
  - 
---

i couwdn't been wowse than this when i-it comes to c-coming up with titwes. >_< w-we awe going t-to expwowe vawious  m-mechanims f-fow deawing with s-synchwonization. :3 h-howevew, befowe we dig in wet's fiwst tawk about cpu and thweads to undewstand w-why we nyeed synchwonization in the fiwst pwace.

## the hawdwawe

as the nyame points out cpu does m-most of the heavy w-wifting of the c-computews. 😳 simpwy p-put, they awe e-executing instwuctions f-fed into t-them fwom diffewent i-io (input/output) devices. instwuctions awe just bits and bytes we conventioanwwy k-know, -.- just in a physiciaw state as a wow o-ow high ewectwicity state. 🥺 each i-instuwction is being exekawaii~d with a singwe "tick" of the cpu c-cwock. so, o.O a cpu wunning on 2.4mhz c-cwock speed e-exekawaii~s a singwe instwuction pew 1/2 400 000th of a second. /(^•ω•^) to be mowe pewcise, e-each cwock tick does nyot exekawaii~ a singwe pwogwam instwuction but wathew a-a wowk unit of the cpu. nyaa~~ this may b-be woading nyext i-instwuction fwom t-the memowy, nyaa~~ p-pawsing that instwuction, :3 doing some cawcuwations u-using awu (awtimetwic wogicaw unit) ow setting s-some memowy. 😳😳😳 again exact set of instwuctions depends on cpu and system design, (˘ω˘) may change ovew t-time, ^^ but as of wwiting this awticwe t-the conventionawwy a-agweed upon o-opewations awe: fetch, :3 decode, -.- exekawaii~. 😳 of couwse a cpu may u-utiwize mowe t-than just fetch, mya decode, (˘ω˘) exekawaii~ c-cycwe. >_< modewn c-cpus usuawwy incwude vawious pawts f-fow speeding up cewtain opewations, -.- w-wike "cpu cache" - fast dwam cewws fow s-speeding up memowy access, 🥺 puwpose b-buiwt pwocessing units fow accewewating c-cewtain t-tasks wike matwix and vectow cawcuwations, (U ﹏ U) memowy contwowwew, >w< etc.

the above design sewved weww at its t-time, rawr x3 howevew a-as computing become m-mowe mainstweam, mya a-a singwe pwocessing u-unit stawted t-to become a-a huge bottweneck f-fow cewtain wowkwoads. nyaa~~ one way to sowve this issue was to incweasing cwock speed t-to make suwe each opewation is getting exekawaii~d q-quickwy. (⑅˘꒳˘) howevew, the incwease o-on cwock speed couwdn't catch up with the incweasing demand d-due to cewtain engineewing concewns. rawr x3 w-we can't j-just pump up high fwequency cwock ticks into ouw cpu and expect it to be wewiabwe. (✿oωo) a-at some point we awe getting wimited by the natuwe of the univewse, (ˆ ﻌ ˆ)♡ fwom the s-speed of ewectwicity and wight to h-how matewiaws a-awe weacting with f-fwequentwy changing c-chawges.

anothew sowution is to cwamping up m-mowe cpus into a-a singwe machine. (U ﹏ U) t-to make suwe w-we do nyot mix up t-the tewminowogy, -.- w-wet's make one t-thing cweaw. (ˆ ﻌ ˆ)♡ individuaw p-pwocessing unit of a cpu is cawwed cpu cowe. (⑅˘꒳˘) so, instead of muwtipwe cpus, (U ᵕ U❁) w-we can cwamp up muwtipwe cowes into a singwe c-cpu and caww it a day.
