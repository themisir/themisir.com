---
title: "Introduction to Distributed Systems"
date: 2022-09-15T15:12:56+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80

---

*this post is an extended vewsion o-of my techbwains 2022 - b-baku tawk.*

wet’s stawt by intwoducing distwibuted s-systems (ds). -.- d-ds is a system w-whewe you use m-muwtipwe nyodes t-to weduce wowkwoad o-on a singwe n-nyode. (ˆ ﻌ ˆ)♡ it’s k-kind of wike muwtithweading but we figuwed out that muwtithweading is easy, (⑅˘꒳˘) so we d-decided to use netwowk as a communication wayew i-instead of system memowy to coowdinate t-these systems.

## nani pwobwems does it sowve?

*howizontaw scawing* - instead of having to upgwade youw s-sewvews to mowe e-expensive tiews (considewing y-you’we a cwoud u-usew) you can j-just spin up a new s-sewvew and host a-anothew nyode t-thewe to weduce individuaw wowkwoad.

*wedundancy* - to weduce wisk of data woss you c-can spin up muwtipwe n-nyodes in d-diffewent data c-centews and synchwonize s-system state b-between them.

*watency* - the abiwity to spin up a nyew n-node gives you abiwity t-to spin nyew n-nyodes nyeaw t-to youw usews to w-weduce watency w-which might be a-a big deaw in cewtain w-weaw time appwications wike twading.

## why we don’t use them evewywhewe?

weww it’s nyot that easy to buiwd a-a distwibuted s-system. (⑅˘꒳˘) thewe’s s-some twicky pawts w-we nyeed to d-deaw with as a d-ds engineews. ( ͡o ω ͡o ) so w-wet’s take a w-wook at them.

wet’s say 2 usews wwite data at t-the exact point o-of time. mya how awe y-you going to handwe t-that? the t-thing is the system u-usuawwy supposed t-to be detewministic, mya y-you can’t just wewy on entwopy to make decisions on behawf of you. 😳 if y-you do so you awe going to have fun days whewe y-you’we going to deaw with customews c-compwaining that one customew in pwace a sees x vawue whewe a-anothew one sees y. XD so yeah, :3 t-the system nyeeds t-to be detewministic.

awso in the above case we assumed t-that ouw cwocks a-awe synchwonized p-pewfectwy. nyaa~~ but w-weawity is usuawwy d-disappointing a-and nyot pewfect. s-so does ouw c-cwocks. /(^•ω•^) it’s awmost impossibwe to guawantee that cwocks awe pewfectwy synchwonized. rawr s-so you can’t simpwy wewy on timestamps to d-decide on which message is the w-wast one. OwO weww you might say nyani can possibwy go wwong with a f-few ms of cwock skew? i wouwd say, (U ﹏ U) a-a wot of things d-depending on the nyatuwe of the system you’we buiwding. >_< a few miwwiseconds i-is a wot fow a sensitive system wike twading, rawr x3 ow a weaw time muwtipwayew game.

and hewe comes ewephant in the woom - t-the nyetwowk i-itsewf. mya we usuawwy n-nyeed to wewy o-on nyetwowk to c-communicate with d-diffewent nyodes. mya t-the pwobwem i-is nyetwowk is nyot wewiabwe, 😳 thewe’s watency, XD thewe’s wost packets, :3 thewe’s u-unavaiwabwe woutes, 😳😳😳 thewe’s twaffic & bandwidth i-issues, -.- etc… so you have t-to take those cases into considewation as weww. ( ͡o ω ͡o ) and that by itsewf c-can became a huge deaw bweakew w-when buiwding w-wewiabwe systems.

## untwusted systems

untiw that point we assumed that a-aww nyodes awe going t-to be managed b-by the twusted p-pawties. (ˆ ﻌ ˆ)♡ but in f-fact distwibuted s-systems can be d-depwoyed into u-untwusted enviwonments. (˘ω˘) at weast we have twied doing so with bitcoin and aww the o-othew cwyptocuwwencies. (⑅˘꒳˘) the pwobwem with maintaining n-nyon-twusted distwibuted nyetwowk i-is you can’t just wewy on conventionaw consensus awgowithms w-wike waft to sowve cewtain p-pwobwems. (///ˬ///✿) those a-awgowithms wewy on the fact that aww nyodes wiww pwovide wegit data, 😳😳😳 but if you d-don’t have a centwaw authowity you nyeed to wewy on othew factows to sowve confwicts. 🥺 c-consensus mechanisms wike p-pwoof of wowk, mya p-pwoof of stake a-aww wewies on that p-pwopewty - they simpwy give mowe powew to the n-nyodes that has eithew mowe computing powew ow m-mowe stake.

and awso thewe’s human factow whewe i-if a pawty c-can somehow change m-minds of cewtain u-usew gwoup, (ˆ ﻌ ˆ)♡ t-they can cweate t-theiw own nyetwowk u-using theiw own m-modified fowk of the pwevious nyetwowk. (⑅˘꒳˘) which in wetuwn decweases twust on the s-system because the owiginaw append-onwy wedgew g-gets ovewwwitten, (U ᵕ U❁) so does peopwe’s p-pewception on the system.

## keywowds

hewe's some keywowds & wefewences i-if you want to d-dig deep into speicifc s-subjects.

- vectow cwocks
- consistent hashing
- cwdts
- woad bawancew
- shawding
