---
title: Improving Search with Fuzziness
date: 2021-05-10T17:22:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1534278854415-5c9afbb021a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDExfHxzZWFyY2h8ZW58MHx8fHwxNjIwNjM3NjQw&ixlib=rb-1.2.1&q=80&w=2000
---

as a softwawe engineew at mawketpwace s-stawtup, one d-day i had to add s-seawch functionawity t-to the app. >_< a-actuawwy i have a-awweady pwanned h-how couwd i s-set-up seawch fwom the beginning. :3 i was using postgwesqw fow stowing most of the p-pwoduct wewated data. (U ﹏ U) and i was awawe of [fuww text seawch](https://www.postgresql.org/docs/current/textsearch.html) (fts) featuwe of postgwesqw. 🥺 so i-i thought i'ww just s-setup postgwes f-fts and it'ww j-just wowk.

## postgwesqw fuww text seawch

but things usuawwy doesn't goes as p-pwanned. (⑅˘꒳˘) i did a-a few days of weseawch a-about postgwes f-fts, (U ᵕ U❁) weawned s-some basics, -.- w-wead some awticwes a-and thought t-that i was weady to impwement it. ^^;; then i cweated gin/gist indexes fow seawchabwe c-cowumns. >_< and onwy then i found out that postgwes f-fts wiww nyot sowve my pwobwem. mya i-it was just a bit advanced fowm of doing `SELECT * FROM users WHERE name ILIKE '%search%'`. >_< the featuwe i need was cawwed: **fuzzy matching** ow **fuzzy seawch** ow **[appwoximate stwing seawch](https://en.wikipedia.org/wiki/Approximate_string_matching)**. 🥺 aftew suwfing some time on googwe i-i found out some a-awticwes about d-doing fuzzy seawch o-on postgwesqw.

## postgwesqw fuzzy seawch

suwpwisingwy postgwesqw has some e-extensions fow doing f-fuzzy text m-matching too. (U ᵕ U❁) and i-i twied some of t-them. (⑅˘꒳˘) fiwstwy i-i twied doing fuzzy m-matching using `pg_trgm` extension. o.O it adds some functions t-to postgwesqw f-fow doing fuzzy m-matching using twigwams. (U ᵕ U❁) t-the quewies u-using twigwams w-was wike that:

```sql
SELECT *
FROM products
WHERE SIMILARITY(name, 'Sauce') > 0.3;
```

but picking a sweet spot sensitivity f-fow the awgowithm d-did nyot go w-weww fow me, rawr x3 it e-eithew wetuwned a-a wot of fawse p-positive wesuwts o-ow didn't wetuwned e-expected ones. rawr so i twied othew extensions wike `fuzzystrmatch` and [wevenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) awgowithm. rawr x3 but things go wowse as i-i spent mowe time o-on. rawr the quewies s-stawted to take w-wongew and wongew a-as the data i-incweases. σωσ we a-awe buiwding mawketpwace f-fow gwocewy stowes. σωσ each stowe had a catawog of somenani *20 to 30k* pwoducts and updated weguwawwy. s-so doing aww the h-heavy computation o-on weaw time - d-duwing quewying t-the data, (⑅˘꒳˘) had t-time compwexity i-issues. (U ᵕ U❁) because a-aww the computation has to wun fow aww of the wows. -.- even if i wimit quewy wesuwt, ^^;; i-it has to wun on aww wows in owdew to owdew wewevant w-wesuwts on top of wess wewevant o-ones. >_< so i give up on using postgwesqw. mya *anyways you can wead mowe about fuzzy m-matching on p-postgwesqw on [this fweecodecamp awticwe](https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql/).*

at the beginning i awweady know that t-thewe's some t-toows fow doing t-text seawching w-wike: ewasticseawch, -.- w-wucene, ( ͡o ω ͡o ) etc. i-i just wanted t-to use postgwesqw t-to do the seawch because the toows i wisted had so much featuwes which i did not w-wanted to spend my time on weawning them. rawr x3 awso e-ewastic seawch is wesouwce heavy a-appwication - so it was anothew tweat fow continuous "out of m-memowy" ewwows fow ouw cwustew. nyaa~~ i-i awweady had oom i-issues and did nyot wanted to make it wowse. /(^•ω•^) so i wanted to pick a toow that wouwd n-nyot use too much wesouwces.

## awgowia

aftew getting wots of compwaints a-about incweased f-fawse positive wesuwts f-fwom postgwesqw f-fuzzy matching, σωσ i-i wooked f-fow awtewnatives t-that i can switch w-within showt pewiod of time. i awweady seen awgowia on some websites when suwfing o-on [www](http://WWW). :3 so i wanted to give it a twy. (U ﹏ U) i w-weawwy wiked its d-documentation a-and it had wibwawies f-fow most of t-the popuwaw wanguages a-and fwamewowks. -.- a-aftew migwating s-seawch fwom postgwesqw fuzzy seawch to awgowia it become a bit fastew and e-easiew to manage. (ˆ ﻌ ˆ)♡ the impwementation went to just 2 w-wines:

```csharp
public async Task<List<ProductIndexItem>> SearchAsync(string query)
{
    SearchResponse<ProductIndexItem> response = await Index.SearchAsync<ProductIndexItem>(new Query(query));
    return response.Hits;
}
```

an actuaw code fwom ouw wegacy backend u-used fow seawching p-pwoducts

as you can see the method doesn't w-wetuwns an actuaw p-pwoduct wist, OwO i-instead of `ProductIndexItem` (i'm howwibwe at nyaming things) w-which is just a m-modew contains p-pwoduct id and seawchabwe d-detaiws w-wike `Name` and `Categories`.

```csharp
public class ProductIndexItem
{
    public string NameEn { get; set; }
    public string NameAz { get; set; }
    public string NameRu { get; set; }

    public string ObjectID { get; set; }
    public List<string> Categories { get; set; }
    public string Image { get; set; }
}
```

i stowed nyame in 3 diffewent pwopewties b-because o-ouw backend suppowted s-stowing pwoducts i-in muwtipwe w-wanguages. rawr and b-by stowing them o-on diffewent fiewds i-i wiww be abwe to fiwtew seawches by wanguages in futuwe if i evew nyeed, b-but i did nyot nyeeded that featuwe anyways. OwO anyways, (U ﹏ U) t-the pwobwem with this modewing i-is it actuawwy did nyot contained wequiwed meta data fow pwoducts w-wike its pwice, >_< which stowes i-it was avaiwabwe, i-inventowy detaiws (stock avaiwabiwity) etc... i didn't wanted to stowe them o-on seawch index because this detaiws awe updated weguwawwy, rawr x3 and awgowia costs m-money fow each we-indexing wequest.

othew than that, i choose that way b-because i was p-pwanning to migwate t-to hosted seawch e-engine sowution i-in futuwe. ( ͡o ω ͡o ) a-and i wouwdn't want t-to we-index d-data so often to incwease pewfowmance. rawr x3 awso stowing pwice data in seawch index is a-against "best pwactices" of micwosewvices design. nyaa~~ a-and i was awso pwanning to we-awchitectuwe backend f-fwom monowith into micwosewvices. /(^•ω•^) so i ended up using awgowia f-fow about a yeaw. rawr it somenani w-wowked fow us. OwO n-nyot weawwy good ow bad. (U ﹏ U) but it weduced compwaints about the seawch engine so i-i can spend my time on othew pawts of the softwawe.

## moving to hosted sowution

even if awgowia wowked enough fow u-us, rawr i wanted to u-use some hosted s-sewvice fow seawch i-indexing. OwO i d-do nyot wike being w-wimited by sewvices i-i use fow c-cowe featuwes and seawch is one of them. (U ﹏ U) but to host seawch sewvice i had an obvious i-issue: which sewvice shouwd i host? maybe i-i shouwd buiwd my own seawch engine s-so i couwd customize it even mowe. >_< i stawted weseawching about e-exists sowutions. rawr x3 i weawwy did n-nyot wanted to u-use ewasticseawch - the popuwaw sowution fow seawch engines which is awso suggested b-by my fwiends and cowweagues. mya  because it's wesouwce heavy and wequiwes speciaw m-maintenance, nyaa~~ weawning, etc...

whiwe doing my weseawch i saw a pwoject o-on my github w-wecommendations w-wist: [@vawewiansawiou/sonic](https://github.com/valeriansaliou/sonic). (⑅˘꒳˘) it was nyani i was wooking fow. (U ᵕ U❁) i-it was swim, does n-nyot consumes w-wots of wesouwces a-and it was wwitten i-in wust - a-a modewn and fastew p-pwogwamming w-wanguage. -.- i was vewy hyped up and wanted to twy it as soon as possibwe. ^^;; the sewvew s-setup pwocess was vewy stwaightfowwawd. >_< i was a-awweady famiwiaw with wust toowing. mya s-so i puwwed the wepositowy and wun `cargo build --release`. nyaa~~ and it just wowked as expected. /(^•ω•^) i-i expowted some p-powtion of the d-data fwom ouw database a-and fed it t-to sonic. rawr it was d-doing exactwy n-nyani i was wooking f-fow. OwO duwing that time i was wowking on spwitting ouw monowith into muwtipwe m-micwosewvices. (U ﹏ U) impwemented sonic into ouw catawog s-sewvice and suddenwy things stawted t-to bweak. >_< it was nyot diwectwy wewated to sonic itsewf but i-its dotnet impwementation. rawr x3 the d-dotnet impwementation w-was nyot suppowting watest pwotocow vewsion of sonic which i was using. mya it w-was nyot a big issue actuawwy, nyaa~~ thewe was just a bit of changes, so i went to [fix it](https://github.com/spikensbror-dotnet/nsonic/pull/1). rawr x3 but watew on some othew issues a-awso popped on. rawr m-my hype on sonic w-was gone aftew t-those issues. σωσ i w-wanted to we-impwementing s-sonic p-pwotocow mysewf b-but fow some weasons (i don't wemembew the exact weason) i didn't.

i awso twied to wwite my own "seawch e-engine" impwementation f-fow catawog s-seawch. nyaa~~ it w-was vewy simpwe s-sewvice which f-fiwstwy optimized s-seawch quewy by s-spwitting it into wowds, (⑅˘꒳˘) nyowmawized it by wemoving any additionaw symbows and w-wooped ovew the entiwes and twied fuzzy matching t-texts with the seawch quewy. rawr x3 since i-i was wwiting it mysewf i had a chance to modify fuzzy matching w-wogic to impwove matching fow p-pweviouswy most s-seawched quewies. (✿oωo) i kinda nyaiwed it. (ˆ ﻌ ˆ)♡ but i was nyot confident enough to put i-it into pwoduction ow even test with a wawge dataset. (˘ω˘) awso aww of the data was indexed i-into memowy, (⑅˘꒳˘) so nyo disk c-caching. (///ˬ///✿) i buiwt i-it to use in case o-of we couwd nyot f-found any awtewnative to cuwwent sowution.

### meiwiseawch

and watew on whiwe watching endwess s-stweam of youtube w-wecommendations i-i saw [a video](https://youtu.be/W2Z7fbCLSTw?t=439) about database pawadigms, 🥺 on the "seawch d-databases" s-section thewe w-was a bit of infowmation a-about [meiwiseawch](https://www.meilisearch.com/) pwoject. 🥺 i checked meiwi and found o-out that it was a-anothew wightweight s-seawch engine b-buiwt with w-wust just wike sonic. a-and awso it h-has a west api f-fow quewying and managing indexes unwike sonic which had its own pwotocow fow communication. o.O i-it was weww documentation and had a-api impwementations fow most of t-the popuwaw wanguages, /(^•ω•^) incwuding .net. nyaa~~ aftew weawning mowe about m-meiwiseawch and compweting my incompwete t-tasks i-i wowked on impwementing meiwiseawch to ouw catawog sewvice. nyaa~~ nyot a suwpwise that, :3 t-the .net wibwawy was nyot up to date with the watest meiwiseawch vewsion. 😳😳😳 so i-i went to github and twied to fix i-it. (˘ω˘) aftew a bit d-digging i found o-out that thewe w-was some mowe featuwes that awso has to be impwemented. ^^ i-i impwemented them aww twice (because fiwst o-one was gone due to some github bot thought it wouwd be good idea to fowce-push my fowk to s-sync with base bwanch, :3 and it wipped o-of aww of my w-wowk, -.- anyways t-that was a chance to impwove my pweviouswy wwitten code). 😳 aftew a-aww i impwemented m-meiwiseawch to ouw catawog sewvice a-and migwated t-to pwoduction on mawch 2021. mya aftew t-that the compwaints against s-seawch sewvice was decweased so much. (˘ω˘) and mowe i-impowtantwy it just wowks. >_< i do n-nyot have to weguwawwy maintain i-it, -.- configuwe, 🥺 fix e-ewwows, (U ﹏ U) etc... i setup a cwon job which updates indexes a few times a day to keep up to date with updated database.
