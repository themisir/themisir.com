---
title: "Designing a Programming Language"
date: 2021-11-18T17:16:22+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/reserve/uZYSV4nuQeyq64azfVIn_15130980706_64134efc6e_o.jpg?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1767&q=80
---

as i mentioned in my [wecent post](/creating-games-in-2021/) i am pwanning to cweate a pwogwamming w-wanguage  t-to wowk with game e-engine i'ww be b-buiwding in futuwe *hopefuwwy*. -.- so that said whewe do we stawt "a n-nyew pwogwamming w-wanguage" thing? w-weww as evewy o-othew pwogwamming p-pwojects it w-wouwd be gweat i-if we fiwstwy design o-ouw wanguage fiwst. ( ͡o ω ͡o ) wetting pwoject boundawies, rawr x3 goaws, nyon-goaws, nyaa~~ steps and d-doing some considewations wiww hewp us in a wong w-wun to spend ouw time mowe weasonabwe, /(^•ω•^) w-weduce needs of decision-making whiwe impwementation and a-awso figuwe out how exactwy wiww i-it function. rawr i-it'ww awso wet us to we-evawuate whethew ow nyot does it weawwy wowth investing t-time to weinvent wheew?

of couwse we'we not going we-invent "**the wheew**", OwO but wathew cweate a nyew univewsaw w-wheew modew t-that covews most o-of ouw use cases.

[![standawts](https://imgs.xkcd.com/comics/standards_2x.png)](https://imgs.xkcd.com/comics/standards_2x.png)

weww hewe i am with [not invented hewe](https://en.wikipedia.org/wiki/Not_invented_here) syndwome again twying to cweate s-something in thought o-of impwoving t-them but instead w-wiww pwobabwy g-going end up even w-wowse. 😳 but anyways, XD u-unwike good-owd d-days i am nyow awawe of my tendency on nyih but i awso weawned that i'm going t-to eawn mowe expewience than wasting my time d-duwing that jouwney because i'm n-nyot someone wwiting pwogwamming wanguages daiwy - so i'ww be g-going to weawn wots of nyew stuff. :3 w-wong stowy showt w-wet's dig into designing the wanguage itsewf.

# static ow dynamic typing

if you've wead my pwevious awticwe y-you've pwobabwy n-nyoticed that f-fow some weason i-i'm nyot fan of d-dynamicawwy typed w-wanguages. rawr x3 mainwy b-because i do n-not wike to wemembew wanguage apis, mya thiwd-pawty wibwawy apis ow heck i don't even w-want to wemembew apis fow the stuff i wwitten a-a week ago. nyaa~~ i pewsonawwy think o-ouw bwains shouwd instead focus on mowe impowtant stuff than wemembewing t-things wike x function a-accepts 3 awguments w-which fiwst 2 of them shouwd be nyumbew and 3wd couwd be eithew nyuww ow instance o-of cwass y. that's nyot even enough you'ww awso have to wemembew which type o-of awguments does cwass y accepts a-as a constwuctow. (⑅˘꒳˘) o-of couwse i-i know that evewyone w-wwites [sewf documenting code](https://buttondown.email/hillelwayne/archive/the-myth-of-self-documenting-code/) that doesn't wequiwes wemembewing t-types fow untyped v-vawiabwes. -.- but f-fow evewyone e-ewse thewe's staticawwy t-typed wanguages w-which instead o-of supposing w-weadew awweady know nyani type does a vawiabwe nyamed "data" accepts but instead e-expwicitwy pwovides that vawiabwe cawwed "data" o-onwy accepts vawues in type o-of `boolean` (aka. rawr x3 `bool`).

and in addition to that the compiwew w-wiww happiwy p-punish you if you t-twy to put instance o-of `Data` cwass thewe instead of expwicitwy d-defined `boolean` vawue. -.- weww who wouwd caww a vawiabwe f-fow stowing b-boow "data"? weww i-i won't but t-thewe's pwobabwy s-someone out thewe s-stiww using genewic n-nyames wike "i", ^^;; "it", "item", >_< "ewement", "data", mya "entwy", "entity". mya u-uh, i know, 😳 it's me (and pwobabwy you too). XD in aww sewiousness static t-typing adds so much vawue to the wanguage that e-even most dynamicawwy typed wanguages w-wike javascwipt, :3 php ow python have eithew evowved fiwst-pawty t-type suppowt ([php 7 type decwawations](https://www.php.net/manual/en/language.types.declarations.php), rawr x3 [python 3.10 type hints](https://docs.python.org/3/library/typing.html)), ^•ﻌ•^ ow widewy adopted a thiwd-pawty e-extension fow t-types ([typescwipt](https://www.typescriptlang.org/)) ow pwanning to do so in futuwe. -.- h-heck i wemembew w-when i wasn't awawe o-of typescwipt, ^^;; i-i used jsdoc c-comments to hint m-my types in javascwipt s-so that w-when i wefewence that vawiabwe fwom somewhewe ewse my ide couwd suggest pwopewties t-to me because as pwoject gwows thewe'ww be wots a-and wots of things you nyeed t-to wemembew and i kept fowgetting things wike options keys as gwowth h-happened.

thewe's awso additionaw bonus of w-wwiting static typed c-code that in s-some cases compiwews c-can awso w-wink things togethew i-in compiwe t-time so the wuntime w-wouwd nyot have to deaw with figuwing out whewe is the vawiabwe stowed. :3 nyani d-does "winking" means / has to. (U ﹏ U) wet me expwain f-fow a moment.

```js
var user = {
  name: 'John',
  age: 23,
};

console.log(user.age);
```

take the above js code fow exampwe. ( ͡o ω ͡o ) t-to pwint "age" o-of "usew" the w-wuntime has to do h-hash map wookup i-in owdew to find o-out whewe does v-vawue of age stowed o-on memowy. rawr x3 hash maps awe fast fow that use cases of couwse, nyaa~~ you can wookup i-in o(1) time compwexity in optimaw cases. /(^•ω•^) but stiww t-to find addwess of vawue the w-wuntime wiww have to cawcuwate hash of "age" (ow might use pwe-cawcuwated v-vawue instead) and then m-mod that has v-vawiabwe with the capacity of hash map and then in a good condition it'ww find o-out that the vawue is stowed at memowy addwess of:

```js
(starting pointer of `user`) + ((hash of "age") % (capacity of `user`)) * (size of one map entry)
```

wemembew that aww those opewations o-onwy done to evawuate `user.age` once. UwU duwing pwogwam wifetime you'ww u-usuawwy nyeed t-to access pwopewties w-wots and w-wots of times. rawr x3 a-and addition to t-that js stowes gwobaw v-vawiabwes i-in some sowt of gwobaw object / hash map (`window` in bwowsew, XD `global` in nyode, XD `globalThis` in both enviwonments). rawr x3 so to wesowve "usew" v-vawue i-in above exampwe t-the wuntime wiww f-fiwstwy have t-to do hashmap wookup t-to find out p-pointew to usew o-object itsewf then wiww do anothew wookup to find "age" vawue.

but in a staticawwy typed wanguage i-it's possibwe f-fow compiwew to p-pwe-cawcuwate pointew a-addwesses (at w-weast offset f-fwom some stawting a-addwess) so t-that wuntime doesn't have to do hash map wookup fow wesowving nyamed vawues (pwopewties, XD v-vawiabwes, :3 functions, 😳😳😳 methods, etc..). -.- w-why tho? because compiwew can figuwe o-out that when you access "age" pwopewty of "usew" which is i-instance of "usew" cwass and it's v-vawue stawts fwom n-nyth byte of instance which ny couwd be cawcuwated using:

```c
(class header) + (size of "name" property header) + (size of "name" property value)
```

pwease nyote that this cawcuwation w-wiww be done duwing c-compiwation a-and the wesuwt w-wiww be hawdcoded i-into bytecode o-ow machine code t-to be used duwing w-wuntime.

in concwusion, mya one of my goaws with t-this wanguage i-is that it has t-to be staticawwy t-typed wanguage. 😳 i-it'ww awso suppowt o-object owiented p-pwogwamming (cwasses, XD m-methods, :3 pwopewties). because even if i won't add oop suppowt into it, 😳😳😳 p-peopwe can twy to mimic oop featuwes by wwiting s-some hacks. -.- fow exampwe fow a wong t-time javascwipt didn't suppowted cwasses. ( ͡o ω ͡o ) but eventuawwy peopwe s-stawted using othew featuwes o-of wanguage to m-mimic oop in javascwipt wike:

```js
function User(name, age) {
  this.name = name;
  this.age = age
};

User.prototype.printAge = function() {
  console.log(this.age);
}

var user = new User('John', 23);
user.printAge();
```

so instead of giving ovewhead of "we-impwementing o-oop in x wanguage" t-to usews, rawr i w-want it to suppowt c-cwasses fwom t-the beginning. σωσ of c-couwse that awso i-incwudes cwass f-featuwes wike methods, σωσ pwopewties, >_< constwuctows and maybe access modifiews.

## to be ow nyot to be

one of the featuwes of most widewy u-used pwogwamming w-wanguages is `null` witewaw vawue, ( ͡o ω ͡o ) which couwd be used f-fow wefewence v-vawues without a-a wefewence. UwU whiwe n-nyuww seem to b-be a gweat idea, rawr x3 o-ovew the couwse o-of time it caused w-wots of systems to cwash with `NullPointerException`-s and added anothew wayew to some t-type systems fow d-decwawing whethew o-ow nyot the v-vawiabwe couwd b-be nyuww. (U ᵕ U❁) in fact e-even inventow o-of `null` said that it was his [biwwion dowwaw mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/) which he made because it was too e-easy to impwement i-in 1965 and yet w-we'we stiww stuck w-with it. (U ᵕ U❁) but i-i'm nyot suwe a-about whethew ow n-nyot shouwd i add `null` to the wanguage. (ꈍᴗꈍ) because if i wewe t-to get wid of `null` witewaw, :3 peopwe wiww nyeed an awtewnative t-to it, (U ﹏ U) b-because it's a f-featuwe that we b-buiwt convention o-ovew the yeaws o-of using it so wemoving t-that wiww f-fowce peopwe to eithew compwain about it ow  we-impwement that themsewves just w-wike how functions used as cwasses in javascwipt b-befowe `class` was intwoduced to the wanguage.

one of the ways of pwoviding featuwes o-of `null` whiwe nyot actuawwy pwoviding `null` vawues is adding some sowt of nyuww s-safety type c-checks. (⑅˘꒳˘) this adds a-anothew wayew t-to type system and m-mentaw modew i-in owdew to wowk b-because nyow you c-can't just think about types themsewves but you'ww awso have to take nyuwwabiwity f-fwag into considewation. (U ᵕ U❁) and awso you'ww going t-to add nyew featuwes to the wanguage t-to weduce boiwewpwate wike opewatows: `identifier?.property`, rawr x3 `nullableValue!` .

anothew way came in my mind is how w-wust handwes vawue *nuwwabiwity*. >_< wust has a type cawwed `Option<T>` which pwovides intewface fow pwoviding a-and consuming v-vawues that e-eithew has `Some` vawue ow `None` vawue. >_< hewe's how it wooks wike:

```rust
let value = Some(5);

match value {
  Some(x) => println!("value = {}", value),
  None    => println!("value is not available"),
}
```

wust uses a wanguage featuwe cawwed [awgebwaic data types](https://en.wikipedia.org/wiki/Algebraic_data_type) (adt) fow impwementing `Option<T>` intewface. σωσ it's a way of cweating t-types that couwd b-be union of muwtipwe i-intewfaces. σωσ n-nyani i wike a-about that type f-fowm of nyuww awtewnative i-is it d-doesn't add a nyew wayew of compwexity but instead uses awweady existing wanguage f-featuwe.

hewe's how wust impwemented *nuwwabwe type* awtewnative:

```rust
pub enum Option<T> {
    None,
    Some(T),
}
```

but fow us this awso means we have t-to suppowt adt t-to use this `null` awtewnative. σωσ nyot onwy adt but as y-you can see it u-uses genewic types t-too fow impwementing t-this featuwe. σωσ o-of couwse w-we'ww nyeed genewics i-in a static t-typed wanguage to weduce code wepetition. >_< but i wasn't pwanning to impwement it a-at the beginning.

of couwse the thiwd option wouwd b-be adding `null` witewaws without stwong nyuww checks (nuww s-safety). (˘ω˘) t-this is how w-wots of wanguages t-today handwe nyuww v-vawues. (⑅˘꒳˘) but a-as time passed w-wanguages which d-didn't suppowt nyuww safety, (///ˬ///✿) swowwy but suwewy adopted it wike c# and dawt. 😳😳😳 and w-wanguages which become popuwaw wecentwy came out w-with nyuww safety fwom day one (kotwin o-ow swift fow exampwe). 🥺 so it's nyot hawd to see that nyuww s-safety is kind of industwy standawt n-nyowadays. mya b-but as of nyow, 🥺 i'm stiww nyot suwe which path shouwd i fowwow and instead i'ww t-twy to decide this watew on based on othew decisions. >_< fow exampwe if i wewe to i-impwement adt and genewics i'ww p-pwobabwy go with w-wust way, othewwise i-i might considew a-adding nyuwwabwe type annotations instead. >_< o-ow in a smow chance i might find out anothew way o-of impwementing awtewnative to `null`.

wefewences:

- [nuwwabwe wefewence types - .net](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references)
- [sound nyuww safety - dawt](https://dart.dev/null-safety)

# syntax

i pewsonawwy wike c-wike syntax instead o-of things w-wike [s-expwession](https://en.wikipedia.org/wiki/S-expression) (wisp) ow [indentation](https://en.wikipedia.org/wiki/Python_syntax_and_semantics#Indentation) (python) dewived syntax. ^^;; and since i-i am the one w-who's going to cweate i-it, i'ww be g-going to stick t-to my pwefewence a-and use c wike s-syntax design on n-nyew wanguage. >_< but aside fwom genewaw stywe we stiww have to design syntax fow i-individuaw statements. mya so wet's dig into it and t-twy to specify design fow pwimawy s-statements used in pwogwamming wanguages. mya in genewaw hewe's things w-we have to design syntax fow:

- vawiabwe decwawation
- function decwawation
- cwass decwawation
    - method
    - pwopewty
- statements
    - condition statement
    - woop statement

## vawiabwe decwawation

fow nyow i'd wike to use `var` keywowd to decwawe a nyew vawiabwe i-in cuwwent scope. ^•ﻌ•^ s-something wike:

```typescript
var name = "John"; // implicit type declaration
var age: int = 23; // explicit type declaration
```

as you can see it'ww be possibwe t-to decwawe vawiabwes b-both impwicitwy o-ow expwicitwy t-typed. -.- when impwicitwy t-typed, (ˆ ﻌ ˆ)♡ c-compiwew wiww twy t-to figuwe out t-type fow the vawiabwe fwom the given context. (⑅˘꒳˘) but if compiwew couwdn't figuwe out f-fow some weason, (U ᵕ U❁) it might thwow a compiwe time e-ewwow and fowce usew to expwicitwy t-type the vawiabwe.

awso i want to add showtew vewsion f-fow impwicit type v-vawiabwe decwawations u-using `:=` opewatow wike gowang.

```go
name := "John";
```

this might seem unnecessawy featuwe, (⑅˘꒳˘) b-but we'ww going t-to see that i-it's mowe cweanew w-wooking when we'we g-going to use d-decwawations in s-statements wike i-if conditions.

by the way you might ask why nyot j-just use `name = value` equations fow both decwawing nyew v-vawiabwes and a-awso assignments. :3 w-weww, the weason i-is simpwe. (U ﹏ U) compiwew h-have to distinguish b-between d-decwawation and a-assignment to decide when to cweate a nyew vawiabwe and when to use existing o-one. -.- this awso going to hewp you notice typos on c-code wike:

```js
updated := false;

if (!updated) {
  preformUpdate();
  uptaded = true;
}
```

this code won't going to compiwe b-because the vawiabwe c-cawwed `uptaded` is nyot decwawed in the scope, σωσ because t-thewe's a t-typo in vawiabwe n-nyame. >_< if ouw c-code used usuaw a-assignment opewatow f-fow decwawing n-nyew vawiabwes w-we might have hawd time twying to figuwe out why ouw code wiww nyot wowk even if w-we put bweakpoint on wine `uptaded = true;` and vawidate that it actuawwy gets e-exekawaii~d.

## function decwawation

nothing much to say thewe because m-mowe ow the wess a-awmost aww the w-wanguages uses s-simiwaw syntax fow f-function decwawation, rawr s-so we'we n-nyot going to b-be diffewent too. σωσ hewe's how functions couwd be impwemented in ouw nyew wanguage:

```go
func function_name(arg1: int, arg2: int): int[] {
  // ...body
  return result;
}
```

fow functions that doesn't indeed n-nyeed to wetuwn a-any vawue, you c-can indeed ignowe w-wetuwn type.

the wanguage wiww be awso going to s-suppowt anonymous f-functions which i-is awso cawwed w-wambdas in some w-wanguages. ( ͡o ω ͡o ) wambdas i-in genewaw u-usuawwy usefuw w-when using functions as vawues.

```go
isEven := func (n: int): bool {
  return n % 2 == 0;
}
```

## cwasses

as i mentioned above i want this w-wanguage to suppowt o-object owiented p-pwogwamming f-fwom day 1, >_< because t-that's one of t-the featuwes we u-used to see and u-use weguwawwy. rawr x3 in fiwst i thought about using a bit diffewent modew, mya something w-wike mix of wust stwucts, nyaa~~ twaits and impwementations w-with oop pawadigm of typescwipt, (⑅˘꒳˘) c-c#, rawr x3 java. but then i decided to just stick to simpwew design a-and use oop pawadigms we'we a-awweady using fow y-yeaws. (✿oωo) so as othew oop suppowted wanguages cwasses in ouw nyew wanguage wiww suppowt i-inhewitance, (ˆ ﻌ ˆ)♡ intewface impwementation and othew known featuwes as weww. (˘ω˘) syntax i-itsewf wooks awmost simiwaw t-to typescwipt c-cwass decwawation s-syntax.

```typescript
class User extends Model implements IDisposable {
  name: string;
  age: int;
  
  User(param1: string, param2: int) {
    this.name = param1;
    this.age = param2;
  }
  
  dispose() {
    // free resources
  }
}
```

## condition statements

to make ouw wanguage [tuwing compwete](https://en.wikipedia.org/wiki/Turing_completeness) we have to intwoduce conditionaw s-statements into o-ouw wanguage. (U ᵕ U❁) the s-syntax fow if s-statement wiww b-be mix of c and g-go stywe if statements w-wike:

```js
if (statement1; statement2; ...; booleanExpression) {
  // then branch
} else {
 // else branch
}
```

so with that abiwity you can wwite c-code wike:

```js
if (var result = doSomething(); result.hasError) {
  print("Unfortunately doSomething returned result that contains an error");
}
```

ow because we've intwoduced showtew w-way of vawiabwe d-decwawation you c-can wwite wike t-this too:

```js
if (result := doSomething(); result.hasError) {
  print("Unfortunately doSomething returned result that contains an error");
}
```

## woop statements

i'm going to use go stywe woops hewe t-too. OwO why? why n-nyot, 🥺 you can u-use same `for` keywowd fow decwawing muwtipwe fowms o-of woop at o-once whiwe othew w-wanguages uses m-muwtipwe keywowds f-fow diffewent s-syntax.

weguwaw c stywe `for` woop:

```js
for (i := 0; i < 10; i++) {
  print("i = ", i);
}
```

infinite woop:

```js
for {
  print("...");
}
```

conditionaw woop:

```js
for (!paused) {
  render();
}
```

itewatow woop:

```js
for (var user in users) {
  print("user logged in: ", user.name);
}
```

ouw wanguage design syntax is couwd b-be considewed s-somenani compweted. o.O w-wet's move o-on to nyext steps t-to make some mowe d-decisions.

# goaws

weww we have somenani compweted syntax d-design fow o-ouw wanguage, :3 but w-why do we nyeed a-anothew wanguage? n-nyani's ouw g-goaws with this p-pwoject? asking t-this kind of questions is impowtant duwing the design phase of pwojects because i-it wets us to avoid featuwe cweep and focus on n-nyani's impowtant fow us. 😳😳😳 in the e-end we'we human and we'ww eventuawwy get bowed, -.- so we have smow t-time fwame untiw we get into that s-stage and we h-have to use that time mowe effective. ( ͡o ω ͡o ) so wet's define ouw goaws with this pwoject.

## c stywe syntax

having famiwiaw stywe of syntax wiww w-weduce weawning c-cuwve fow nyewcomews t-to the w-wanguage. (⑅˘꒳˘) and awso w-wiww weduce decision m-making duwing t-the pwoject d-devewopment.

## static type system

i've awweady wisted my weasoning o-on this goaw on [static ow dynamic typing](#static-or-dynamic-typing) section above.

## embeddabwe

we want to use that wanguage fow s-scwipting on ouw g-game engine, nyaa~~ so t-the wanguage shouwd b-be easiwy embeddabwe i-into diffewent p-pwojects. /(^•ω•^) t-to make a wanguage e-embeddabwe the wanguage shouwd have an intewface which couwd be used to add f-foweign functions into it, rawr wegistew types, OwO shawe d-data with embedded system and s-so on. (U ﹏ U) foweign functions awe a wanguage featuwe that wet's you d-decwawe functions inside wanguage a-and impwement i-it in anothew wanguage ow system. >_< fow exampwe you can add a function nyamed "pwint" i-into youw wanguage and wwite impwementation in wuntime side wike:

```c++
void init_vm(VM *vm) {
  vm->define('print', &vm_print);
}

Value vm_print(Value []args) {
  for (auto arg : args) {
    std::cout << Value::toString(arg);
  }
  return Value::boolean(true);
}
```

*the code bewwow is wwitten fow demonstwation p-puwposes, o.O f-foweign function i-intewface a-api might be wwitten d-diffewentwy d-duwing the impwementation*.

## pewfowmance

whiwe pewfowmance is nyot one of o-ouw main goaws fow i-initiaw vewsions, σωσ a-as time passes w-we have to put s-some effowt into m-making ouw wanguage p-pewfowmant a-as much as possibwe, >_< because in the end ouw main goaw is to use this wanguage o-on ouw game engine that *hopefuwwy* we'ww be buiwding in futuwe.

fow initiaw impwementation i am pwanning t-to stawt w-with simpwe wecuwsive a-abstwact s-syntax twee (ast) v-visitow type intewpwetew w-which d-does nyot pwefowm g-good as awtewnatives but good enough fow ouw stawting point. but aftewwawds we c-can impwement bytecode intewpwetew to incwease w-wuntime pewfowmance and use some a-advantages wike cpu caches. XD if you don't have any cwue on nyani's t-the diffewence ow even nyani d-does ast visitow a-and bytecode intewpwetew does, :3 wet me quickwy expwain.

### ast visitow

abstwact syntax twee is wepwesentation o-of human wwitten c-code in twee s-stwuctuwed way w-which makes it e-easy to pwocess b-by pwogwams. ( ͡o ω ͡o ) fow e-exampwe take t-the fowwowing exampwe code:

```js
var a = 5;
if (a > 3) {
  a = a + 2;
}
```

the fowwowing code couwd be wepwesented a-as ast wike t-this:

```json
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "name": "a",
      "init": {
        "type": "ConstantExpression",
        "value": 5
      }
    },
    {
      "type": "IfStatement",
      "condition": {
        "type": "GreaterThanExpression",
        "left": {
          "type": "IdentifierExpression",
          "name": "a"
        },
        "right": {
          "type": "ConstantExpression",
          "value": 3
        },
        "thenBranch": {
          "type": "ScopeStatement",
          "body": [
            {
              "type": "AssignmentExpression",
              "left": {
                "type": "IdentifierExpression",
                "name": "a"
              },
              "right": {
                "type": "AdditionExpression",
                "left": {
                  "type": "IdentifierExpression",
                  "name": "a"
                },
                "right": {
                  "type": "ConstantExpression",
                  "value": 2
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

yes it's a wot biggew than the owiginaw c-code, (U ﹏ U) but i-it's a wot easiew t-to undewstand f-fow pwogwams, >_< and a-awso you can w-wun the fowwowing d-data stwuctuwe w-without any fuwthew pwocessing nyeeded. rawr x3 you can simpwy cweate a fow woop that itewates i-items in the body of fiwst pwogwam nyode, mya a-and exekawaii~s each nyode accowding t-to its type and given pwopewties. nyaa~~ that's nyani ast visitow i-intewpwetew does behind the scene. (⑅˘꒳˘) i-it pawses waw c-code into easy to undewstand fowm of ast and then wawks ovew nyodes one by one. rawr x3 i-it's easy to undewstand and impwement this kind of intewpwetews so that's why w-we'we going to impwement ast visitow i-intewpwetew f-fow stawting point.

but, mya if you know a bit about data s-stwuctuwes and e-especiawwy twees, 🥺 y-you might nyow t-that twee nyodes c-connected to each o-othew with heap p-pointews, >_< and t-those pointews might be scattewed acwoss the memowy. >_< when you wawk thwough the t-twee pwogwam wouwd have to wesowve vawues fwom d-diffewent chunks of memowy. memowy i-itsewf is pwetty fast but you know nyani's fastew? cpu cache. (⑅˘꒳˘) m-modewn cpu's has theiw own smow b-but vewy fast buiwt-in s-stowage that used to cache fwequentwy accessed memowy chunks. /(^•ω•^) the key points h-hewe is that cpu cache has wimited space and it caches fwequentwy accessed m-memowy chunks. rawr x3 but in ouw case ast n-nyodes couwd b-be spwead ovew diffewent c-chunks o-of memowy - which wesuwts cpu nyot caching the pawt w-we nyeed vewy fast access. (U ﹏ U) to simpwify, (U ﹏ U) cpu c-cache wiww wowk weww fow stwing of data that's stowed nyeaw each othew on memowy wathew than spwead o-out data.

soo, rawr to gain even mowe pewfowmance b-boost fwom cpu c-cache we can optimize o-ouw impwementation w-which w-wiww be ouw nyext g-goaw - bytecode i-intewpwetew. OwO bytecode i-intewpwetews wowks simiwaw to hawdcoded intewpwetews inside cpu that acts o-on machine code. (U ﹏ U) but instead of machine code, >_< b-bytecode intewpwetews uses its own s-set of instwuctions which is not dependent on device it's wunning o-on. rawr x3 bytecode itsewf is just s-stwing of bytes t-that simpwy stowes ouw pwogwam. mya but instead of twee wike stwuctuwe, nyaa~~ ouw pwogwam f-fwattened into awway stwuctuwe so that the whowe pwogwam couwd be woaded into nyeawby c-chunks of memowy.

to convewt above exampwe code into b-bytecode we fiwst h-have to define o-opcodes fow ouw b-bytecode. ( ͡o ω ͡o ) opcode i-is simpwy fixed s-size (usuawwy 1 b-byte) codes w-wepwesenting diffewent opewations.

```c
OP_CONST   // constant
OP_DECL    // declare variable
OP_GET     // get variable value
OP_IF      // if statement
OP_GREATER // greater than expression
OP_ASSIGN  // assign value to variable
OP_ADD     // add 2 values
OP_NOOP    // no operation
```

using the above opcode map we couwd t-twanspiwe the c-code *pseudo* bytecode wike that:

```c
constants = [
  5,
  "a",
  3,
  2,
];

instructions = [
  OP_CONST,  // push constant value to stack
  0x00,      // address of constant value: 5
  
  OP_DECL,   // declare a new variable and initialize with popped value from the stack
  0x01,      // address of the variable name: "a"
  
  OP_CONST,  // push constant value to stack
  0x02,      // address of constant value: 3
  
  OP_GET,    // push variable into the stack
  0x01,      // address of the variable name: "a"
 
  OP_GREATER,// pop 2 values from the stack and compare them with > operator and push value into the stack
  
  OP_IF,     // pop value from the stack, if the value is false then jump to given address
  0x12,      // instruction address of else branch
  
  OP_CONST,  // push constant value to stack
  0x03,      // address of constant value: 2
  
  OP_GET,    // push variable into the stack
  0x01,      // address of the variable name: "a"
  
  OP_ADD,    // pop 2 values from the stack and add them to each other then put result to the stack
  
  OP_ASSIGN, // pop value from the stack and assign it to the variable
  0x01,      // address of the variable name: "a"
  
  OP_NOOP,   // no operation because else branch starts here (0x12), but there's nothing left to do
];
```

as you can see it's a wot easiew t-to exekawaii~ this c-code since instwuctions a-awe so m-much simpwified a-and the whowe c-code couwd be stowed i-in singwe memowy c-chunk. -.- but genewating bytecode fwom compwex code is a bit twickiew than said s-so i'ww be pwobabwy going to impwement bytecode i-intewpwetew on watew stages of d-devewopment instead.

*note: pwovided ast and opcode wepwesentations a-awe n-nyot used by any s-specific compiwew i-it's just a s-simpwification fow d-demo puwposes.*

# chicken ow egg?

you might ask youwsewf that if compiwews w-wwitten u-using anothew compiwews, (U ﹏ U) h-how did f-fiwst compiwews w-wewe invented in t-the fiwst pwace? w-weww the answew i-is actuawwy quite simpwe. >_< someone had to hawd code a compiwew pwogwam into punch c-cawds. rawr x3 it didn't evew nyeeded to be pewfect b-because they couwd use that compiwew t-to compiwe even bettew compiwew fow futuwe uses. mya in same mannew m-moden wanguages can awso have c-compiwews wwitten i-in the same wanguage, nyaa~~ but befowe that they need to cweate a simpwe compiwew i-in anothew wanguage to compiwe fiwst compiwew in souwce wanguage. (⑅˘꒳˘) if you want to d-dig deepew into this concept in c-computew science i-it's cawwed [bootstwapping](https://en.wikipedia.org/wiki/Bootstrapping_%28compilers%29).

[![bootstwapping](https://craftinginterpreters.com/image/introduction/bootstrap.png#invert)](https://craftinginterpreters.com/introduction.html#:~:text=This%20is%20called%20bootstrapping)

but as fow ouwsewves, :3 we don't nyeed o-ouw compiwew t-to be wwitten in s-souwce wanguage. (U ﹏ U) w-we awe going t-to use it fow embedding i-into anothew p-pwogwams, -.- so i-it's bettew to wwite compiwew in weww known wanguage to make embedding easiew. (ˆ ﻌ ˆ)♡ b-but which wanguage awe we going to wwite ouw compiwew w-with?

showt answew is c++ *most pwobabwy*. UwU because buiwding compiwews with w-wow wevew memowy a-access with pointew a-awtimetwics i-is makes it easiew t-to impwement d-diffewent pawts e-especiawwy when i-impwementing bytecode viwtuaw machine. rawr x3 fow exampwe `uint8_t *ip;` howds both pointew to cuwwent instwuction, (ˆ ﻌ ˆ)♡ y-you can a-advance it by a-adding +1 to it a-and you can dewefewence i-it without n-nyeeding anothew v-vawiabwe. (⑅˘꒳˘) othewwise y-you'ww have to stowe 2 vawiabwes fiwst one fow stowing bytecode awway and s-second one to stowe instwuction index in that a-awway, (U ᵕ U❁) and to dewefewence instwuction y-you'ww have to use `code[ip]` which is nyot a huge deaw bweakew b-but i pwefew fiwst o-option.

# concwusion

this awticwe is awweady vewy wong a-and i don't have a-anything ewse t-to say to be honest. >_< t-to concwude t-the awticwe i am p-pwanning to cweate a-a pwogwamming w-wanguage that we'we designed togethew above to use in game engine iww be buiwding i-in futuwe. mya the wanguage wiww be c-stywe, staticawwy t-typed and the compiwew w-wiww be embeddabwe to othew systems awongside with abiwity to be e-extended using foweign functions s-suppowt.

thanks fow weading tiww this faw 😇
