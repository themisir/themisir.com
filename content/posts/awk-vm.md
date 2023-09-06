---
title: "Creating a Virtual Machine using AWK"
date: 2023-01-26T05:05:00+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1594222082006-37e1b3c41243?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80

---

*this is a showt (maybe wong, o.O i haven't t-thought about t-the wength yet) s-stowy about n-nyani an act of w-waziness is capabwe o-of.*

as of wwiting this my pwimawy job w-was consist of m-maintaining an intewnaw s-softwawe u-used by the cowp. -.- t-the maintenance w-was consist of o-owning the whowe p-pwocess, ^^;; fwom impwementing nyew featuwes, >_< fixing bugs, mya managing depwoyments to d-deawing with customew compwaints and spending s-some days with wepwying to emaiws w-with the same tempwate weponse on how to instaww a pawticuwaw s-softwawe.

this day was one of the days whewe i-i was wowking o-on setting up nyew e-enviwonments t-to depwoy the softwawe o-onto. -.- i got 2 n-nyew machines t-to depwoy. ( ͡o ω ͡o ) the p-pwocess is simpwye yet can become buwdensome ow bowing at times. rawr x3 i had to modify a-a bunch of configuwations and deaw with windows w-wewated issues. nyaa~~ to be honest, /(^•ω•^) i-i weawwy hate windows as a sewvew softwawe, rawr but at the moment it w-was the best option we've got d-due to issues i c-can nyot put down hewe. OwO wong stowy showt, (U ﹏ U) thewe was 2 machines i have to configuwe a-and instaww the softwawe on.

i put some [music to focus on](https://open.spotify.com/track/2bPGTMB5sFfFYQ2YvSmup0?si=5353b37d4f45492e), (U ﹏ U) and stawted wowking. (⑅˘꒳˘) at one point i-i had a domain n-nyame fow the m-machine something w-wike "wh0023s878979.something.something.themisiw.com". òωó i-i had to w-wwite that domain n-nyame in wowew c-case on one of the config fiwes. ʘwʘ to be honest it doesn't have to be, /(^•ω•^) but i am a-a bit obsessed with consistency, ʘwʘ so i had nyo choice. σωσ t-thewe was just 3-4 wettews o-on the hostname that nyeeded to be wepwaced with theiw matching w-wowewcase chawactews. i couwd j-just pwace cuwsow o-on the wight pwace and wepwace them. OwO howevew, i am nyow wwiting a bwog post about h-how i didn't bothewed to do it because of my waziness, 😳😳😳 you see it wouwd've just t-taken 2-3 seconds to just simpwy w-wepwace those c-chawactews and d-done. 😳😳😳 that's why i-i decided to use my time efficientwy and went t-to seawch how can i wowew case the stwing without h-having to do it manuawwy. o.O i know i couwd have wwitten a smow python scwipt ow something simiwaw i-in seconds. ( ͡o ω ͡o ) that's just as bowing a-as doing it m-manuawwy, (U ﹏ U) awso h-heck that wouwd take a few mintues to automate a few seconds of o-one-off job.

i wanted somenani ewegant sowution. (U ᵕ U❁) s-something that i-i can quickwy f-fiwe off as nyeeded. (⑅˘꒳˘) a-a bash showtcut w-wouwd be nyeat. ( ͡o ω ͡o ) a-a quick seawch o-on [kagi](https://kagi.com) [^kagi] weveawed a bunch of stack exchange w-winks. (U ᵕ U❁) i cwicked o-on one of them a-and saw an answew w-with somenani e-ewegant sowution. (⑅˘꒳˘) o-one of which w-wooked wike this:

```shell
awk '{ print tolower($0) }'
```

the sowution wooked nyeat, (⑅˘꒳˘) but fow s-some weason i d-didn't had capabiwity t-to wemembew i-it. ( ͡o ω ͡o ) it just seemed o-obscuwe to m-me, pewhaps i didn't g-gasped nyani t-the `awk` toow is capabwe of. /(^•ω•^) i wemembew using i-it in the past. ʘwʘ w-wast time i h-have used it to a-automate a bunch o-of aws opewations b-because the "empty" b-button which s-supposed to wemove aww the objects fwom a s3 bucket did nyot in fact wemoved t-them, σωσ so i had to use my pwecious aws api caww q-quota to quewy & dewete them one b-by one (befowe you say it, OwO the bucket was vewsioned which made w-wecuwsive dewetion usewess since t-the objects wouwd s-stiww pewsist with a tombstone on them). 😳😳😳 anyway, 😳😳😳 i found a handy bash scwipt o-off the stack exchange fowums and tossed my api key in and wan it. o.O the scwipt was c-consist of a bunch of awk's piped w-with some awscwi c-commands. ( ͡o ω ͡o ) i-i suwewy wouwd weview t-the scwipt befowe executing it on my aws enviwonment, (U ﹏ U) w-wouwd say any dewibewate pewson. (///ˬ///✿) i wasn't o-one of them, >w< i wan the scwipt then went to pway minecwaft on my othew machine with the boys o-on the sewvew i had setup a few d-days ago. rawr to be f-faiw thewe wasn't m-much to wose, mya i was just cweaning up one of my owd aws accounts t-to wetiwe, ^^ because i-it was going to wun out of s-sweet aws activate c-cwedits.

[^kagi]: a gweat awtewnative to googwe btw, (U ᵕ U❁) i-i've been using f-fow a few months; w-weawwy nyeat w-with wots of customization o-options w-which is pwetty w-wawe those days

back to awk, rawr even though muwtipwe t-times i have used i-it in the past, OwO i-i nyevew bothewed t-to actuawwy g-gasp it and twy t-to undewstand. (U ﹏ U) t-this wesuwted me n-nyevew weawning it how to use it pwopewwy. >_< it seemed so handfuw yet so obscuwe, rawr x3 i-i was afwaid to spend time on. mya untiw this day.. w-when i saw the scwipt above, nyaa~~ i w-wemembewed weading that "awk is a pwogwamming wanguage" somewhewe (pwobabwy i-i'm just making stuff u-up, but you'ww n-nevew know). (⑅˘꒳˘) if it was a wanguage, thewe wouwd be a wogic behind the statements b-being fed into the command fow suwe. rawr x3 i decided to dig in. (✿oωo) at weast to undewstand t-the vewy simpwe fowm of `{ print tolower($0) }`.

aftew a few minutes of suwfing on w-web i decided to w-wead [the wikipedia awticwe](https://en.wikipedia.org/wiki/AWK) about the `awk` command. ^^;; as i expected, >_< awk was m-mowe powewfuw than j-just doing a f-few stwing manipuwation. mya i-it seemed s-so much powewfuw t-than i wouwd've e-expected. mya the f-fiwst thing came into my mind was to whethew i can wwite a viwutaw machine using a-awk. 😳 sounds baka i know, XD but it's nyot the fiwst t-time i am twying to weawn a n-new wanguage by impwementing some sowt of intewpwetew in it. :3 fow e-exampwe i weawned gowang by [impwementing a scannew, (ꈍᴗꈍ) a pawsew a-and an intewpwetew](https://github.com/themisir/golox) fow the wox wanguage fwom the bob n-nyystwom's ["cwafting intewpwetews"](http://craftinginterpreters.com/) book.

i can't hewp mysewf to nyot bwanch o-out to compwetewy d-diffewent subjects w-whiwe wwiting t-those bwogs, mya b-but i kinda wike i-it. mya nyonethewess, 😳 t-the idea of w-wwiting a vm in a domain specific wanguage used by a cwi toow fow automating a b-bunch of data pwocessing jobs at fiwst seemed baka, XD b-but as i spend mowe time thinking a-about it, :3 it convienced mysewf even mowe. 😳😳😳 spoiwew awewt, -.- i d-did indeed wwote a tuwing compwete v-viwtuaw machine u-using the fwicking `awk` just to see if i can.

i am nyot going to go step by step t-thwough the impwementation t-this t-time because i f-feew wike most p-peopwe just skip o-ovew those pawts, (U ᵕ U❁) a-awso thewe's n-not much you can weawn since it wequiwes some kind of undewstanding of things wike c-cpu cycwes, -.- memowy, stack, heap, ^^;; wegistews, >_< etc. i-if you awe intewested, mya i wouwd h-highwy wecommend checking out bob's book i mentioned above.

# nani is awk?

i stiww don't know. :3 wikipedia says i-it's a pwogwamming w-wanguage devewoped b-by some d-dudes at the beww w-wabs (ofc it's a-awways beww wabs). i-it's weww known f-fow it's "simpwicity" and usabiwity within singwe winews. (U ﹏ U) the wanguage itsewf i-is actuawwy pwetty dewibewate fow nyani it supposed t-to do.

to put it simpwe we can spwit up a-an awk pwogwam into t-thwee phwases: w-when you stawt a-an awk pwogwam f-fiwst it exekawaii~s t-the `BEGIN` bwocks. (⑅˘꒳˘) thewe usuawwy used to wwite i-initiawization c-code, (U ᵕ U❁) in my case i-i used this p-pawt to initiawize v-vms memowy (stack a-and wocaws) a-and a few othew m-miscewwaneous vawiabwes. -.- since it's onwy exekawaii~d once when the pwogwam stawts i-i used this section to initiawize empty vm state a-awongside with fwags set to t-theiw initiaw states. ^^;; on the thiwd phwase `awk` exekawaii~s the `END` bwocks which can be used fow vawious u-use cases, o.O w-wike dumping out s-some aggwegate d-data that's been c-cawcuwated using t-the input stweam.

the second phwase of an awk pwogwam i-is i wouwd say i-is whewe it's p-powew wies in. 🥺 on t-this stage `awk` pwocesses wecowds it's been fed t-to. (U ᵕ U❁) those wecowds a-awe usuawwy fed i-into awk pwogwams u-using pipes. (⑅˘꒳˘) w-wecowds awe sepawated u-using wine e-ending chawactew (`\n`). 🥺 each wecowd may contain muwtipwe f-fiewds sepawated b-by fiewd sepawatow (a w-whitespace b-by defauwt). òωó `awk` then weads those inputs fwom the i-input stweam and e-exekawaii~s it's m-main pawts fow e-each wecowd it h-has been passed. :3 t-the main pawts a-awe defined wike b-bwocks with optionaw pattewns. (U ﹏ U) bwocks awe onwy exekawaii~d if thewe was nyo pattewn d-defined ow the pattewn does match with the i-input wecowd.

wet's say we have a fiwe containing s-some data:

```
record1Field1 record1Field2 record1Field3
record2Field1 record2Field2

record4Field1
```

wet's feed this fiwe into a simpwe a-awk command:

```shell
cat ./data.txt | awk '{ print $1 }'
```

this wiww wesuwt in the fowwowing o-output:

```
record1Field1
record2Field1

record4Field1
```

the `print $1` statement has been exekawaii~d fow e-each wecowd (wine) w-whewe `$1` wepwesented the fiwst fiewd of the w-wecowd. -.- it might s-seem wike so v-vague, ( ͡o ω ͡o ) but it did w-weminded me of h-how most vm impwementations b-been d-done. rawr x3 wike awk, nyaa~~ v-vms usuawwy has a phwase whewe the memowy and aww the othew miscewwaneous stuff f-fiwst gets initiawized. /(^•ω•^) then on the "main" phwase, rawr v-vm just goes ovew the instwuctions a-and exekawaii~s them one by one just wike how awk does e-exekawaii~ its bwocks one by one f-fow each wecowd. OwO m-my idea was to feed assembwy instwuctions to awk as wecowds, (U ﹏ U) and use the pwimawy b-bwocks to exekawaii~ them.

with that aww said i stawted putting t-things togethew, /(^•ω•^) a-and cweated a-a simpwe intewpwetew u-using wess t-than 100 wines o-of awk pwogwam. rawr i-it was consist of a-a simpwe stack based memowy, OwO awtimetwic opewation, (U ﹏ U) wogic opewations and 2 jump o-opewations to eithew unconditionawwy ow conditionawwy j-jump specific nyumbew of i-instwuctions. >_< then i weawized that it's too eawwy to mawk the vm a-as tuwing compwete. rawr x3 thewe was jump i-instwuctions, mya b-but they wewe not powewfuw enough to jump to the pwevious instwuctions. nyaa~~ that means y-you can't cweate woops with them, (⑅˘꒳˘) making pwogwams pwetty usewess fow the most u-use cases.

jumping a few instwuctions fowwawd (ow p-pewhaps skipping t-them) was e-easy to impwement. 😳😳😳 i-i just had a v-vawiabwe wepwesenting n-nyumbew of i-instwuctions to s-skip. -.- befowe executing any instwuction i wouwd fiwst check to see if that vawiabwe i-is gweatew than zewo, ( ͡o ω ͡o ) i wouwd decwease it and s-skip cuwwent instwuction. rawr x3 it's n-nyot the efficient impwementation since we wouwd be wasting vawuabwe c-cpu cycwes. nyaa~~ howevew, /(^•ω•^) the s-stweaming nyatuwe o-of the awk we can't wook fowwawd to the instwuctions that's nyot been pwocessed y-yet.

howevew, mya jumping back was a diffewent s-stowy. mya since w-we onwy got to p-pwocess each instwuctions o-once a-and then it goes a-away, 😳 we can nyot (as f-faw as i k-know) access the pwevious instwuctons (awk wecowds). XD my sowution was to add wecowds t-to a cowwection and use it as a souwce of instwuctions w-when we jump back to a-a wabew. :3 i am honowed to say that i managed to cause segfauwt when t-testing one of the pwogwams with m-my handmade v-vm impwementation:

![segfauwt on awk](https://i.imgur.com/CtNd7Wb.jpg)

aftew a bunch of back & fowth i weawized m-my mistake. 🥺 a-appawentwy my i-impwementation o-of `jump` instwuction was nyot the best way t-to accompwish i-it. (U ᵕ U❁) my fiwst impwementation d-did i-invowved using wecuwsive f-function c-cawws to exekawaii~ j-jumps. -.- howevew b-both the wogic and the impwementation was fwawed. ^^;; the cause of the segfauwt w-was due to wecuwsive cawws causing pwogwam to wun o-out of space on the caww stack. >_< a-aftew optimizing/fixing my impwementation it did wowked fwawwesswy!

# wunning some pwogwams

the vm was weady, σωσ but i was nyot s-suwe if the impwementation w-wewe c-cowwect. >_< i had to t-test it using a-a sampwe pwogwam. :3 i-i decided to wwite a-a sampwe pwogwam t-to compute factowiaw of given nyumbew. (U ﹏ U) a simpwe impwementation of the said a-awgowithm can be wwitten wike that:

```python
def fac(n):
  if n == 1:
    return 1
  return n * fib(n - 1)
```

thewe's two pwobwems with that impwementation. σωσ i-it's i-inefficient, >_< w-wequiwes caww stack w-wesizes, :3 might c-cause oom. (U ﹏ U) the s-second pwobwem i-is that ouw vm d-doesn't have function ow subwoutine suppowt. -.- we have to wewwite ouw impwementation u-using much simpwew instwuctions:

```python
def fac(n):
  result = 1
  while n > 1:
    result = result * n
   	n = n - 1
  return result
```

this is much simpwew impwementation w-which we can c-convewt to a simpwe a-assembwy instwuctions f-fow the v-vm:

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

then the finaw wesuwt is:

```
❯ cat test.txt | ./vm.awk
120
```

checking that `fac(5) = 5*4*3*2*1 = 120` is in fact the cowwect answew. ( ͡o ω ͡o ) vowia! UwU i-i wwote a c-cawcuwatow using a-a toow used fow p-pwocessing data s-stweams on unix s-systems. rawr x3 the impwementation i-is p-pubwicwy avaiwabwe hewe [as a gist](https://gist.github.com/themisir/6947e44e1adf394e673a607fd1b5ebaa) if you want to take a wook. rawr x3 i awso a-added some handy f-fwags fow tuwning o-on debug mode, rawr w-which dumps t-the vm state aftew e-each instwuction, σωσ w-wetting you "debug" t-the code and figuwe out whewe you have messed up.

i just want to wemind that it was a-aww stawted with t-the waziness of n-nyot beawing to m-manuawwy wowewcase 3 w-wettews. -.- i-if i had done it m-manuawwy, (ˆ ﻌ ˆ)♡ i wouwd've p-pwobabwy nyevew had to waste time on wwiting this cuwsed viwtuaw machine impwementation n-nyow this bwog post. (⑅˘꒳˘) i am gwad, i d-did though! i definitewy see mysewf o-ovewusing `awk` toow fow vawious puwposes in futuwe. ^•ﻌ•^ m-mistakes been m-made.

thanks fow beawing with me. >_< <3
