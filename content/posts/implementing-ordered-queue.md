---
title: "Implementing Ordered Concurrent Queue"
date: 2022-10-25T01:48:09+04:00
tags:
  - engineering
  - golang
images:
  - https://images.unsplash.com/photo-1628557960762-0d884fd31ea0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2233&q=80
---

Working with data structures is fun — said nobody ever. What about "inventing" our own data structures? It's gotta be a lot more fun, huh? In this blog post I am gonna go step by step through implementation of one of the data structures I recently wrote for one of my graveyard projects — Ordered Concurrent Queue.

## Wait, what?

Okay, let's first start by decyphering the name itself — **Ordered Concurrent Queue**. "*Queue*" part should be straightforward. FiFo, LiFo or whatever I still don't understand those terms, but if you do so that's great because I am not gonna explain them.

Concurrency means multi-threading. And concurrent queue means our data structure will be thread safe to work with; which by itself means multiple threads will be able to operate on them simultaneously. Why? To make this article even more longer. Nah, just kidding, I wanted the queue to be able to operate as channels between different threads. Thus we need thread safety!

But why "*Ordered*"? Queue is already ordered by itself in an order that when we put item into it, but what if that's not enough for our requirements. What if we want to order pushed items in a custom fashion. For example let's say you are going to use that queue as a task queue, and each task going to have a priority defined in it. You want the tasks with higher priority to get processed earlier than the ones with lower priority. Tasks with the same priority can still be in a regular queue order though. Sure you can create multiple task queues for each task priortiy level. But that wouldn't be as cool as writing ordered queue. Or the priority levels might not be predefined or your requirement might require some other type of ordering which creating multiple queues might not be sufficent enough. It's such use cases that I'm hoping this data structure will shine ✨!

## Internal design

If you are familiar with other data structures, you probably know that data structures are just a fancy name for things built with pointers.

- An **array** is just a pointer to the first item and to access nth item you just gotta read memory of address `first item pointer + n*(size of item)`.
- A **list**, dynamic array or ArrayList is just an array that expands and shrinks as needed.

- A **dictionary**, hash table, hash map, map, object or whatever you call it is an array with an hash function to guess the item index based on the key.

- **Linked list** is just a pointer to a node which by itself contains pointer to the next node (sometimes it also contains pointer to the previous node in which case it gets called *double-linked list*).

- **Tree** is, you guessed it right, a pointer to a node which by itself contains a data structure that holds pointers to the linked nodes or branches if you fancy.

- A **graph** is like tree, but also it's not like tree. You know what, let's not talk about graph for now...

*I am pretty sure if you don't know about the internals of the above data structures, none of those made any sense to you. If it didn't, don't worry because most of them doesn't matter for the entirerty of this article.*

Okay, why did I explained all the above? Well, because I am going to use one of those data structures to implement internal design of the queue. However, doing so might seem like I am just reinventing the wheel. But showing that all the other cool data structures were in fact differnent forms of wheel reinventions, mine will become indistinguishable among them.

---

usuawwy queues awe impwemented using a-an awway (static a-awway if the q-queue is bounded[^bounded q-queue] o-ow dynamic awway i-if unbounded). UwU a-aside fwom the i-intewnaw awway, rawr x3 queue awso howds a *pointew* to the fiwst and wast item of the q-queue, (ꈍᴗꈍ) and those *pointews* awe wespectivewy cawwed head and t-taiw.

when you add a nyew item to a weguwaw q-queue, OwO the i-item wiww be set t-to the `array[tail+1]`. ^•ﻌ•^ and when you pop an item fwom the q-queue, OwO the item a-at `array[head]` wiww be wetuwned and vawue of the h-head wiww be incweased. -.- i-if you a-awe intewested a-about in depth impwementation d-detaiws p-pwease check o-out wewated keywowds o-on youw favouwite seawch engine. (ˆ ﻌ ˆ)♡ ow just use javascwipt which has an awway t-that's in fact a dictionawy, (⑅˘꒳˘) that can awso be u-used as a queue (and stack as weww, (U ᵕ U❁) y-yay!).

aside fwom awways, (U ᵕ U❁) queues can be a-awso impwemented u-using winked wists a-as weww. (⑅˘꒳˘) and t-that's nyani we a-awe going to use i-in ouw queue impwementation. ( ͡o ω ͡o ) howevew a-aside fwom [yowo](http://yolo.urbanup.com/13839877)ing ouw intewnaw data stwuctuwe choice, >_< t-thewe's actuawwy t-techniciaw w-weasoning behind i-it. if you wemembew w-we said t-that ouw data stwuctuwe i-is going t-to be owdewed in a custom way. that means we might weguwawwy nyeed to bweak the q-queue in between and put an item thewe. mya putting a-an item between existing items o-on awway is nyot feasibwe, mya because you can't just insewt item into m-middwe of an awway. 😳 thewe might b-be an `Insert(int index, T item)` method fow `List` impwementation on youw favouwite w-wanguage (which i-is javascwipt of c-couwse! wait js d-doesn't have `array.insert`, XD oh wait [it does have this one](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) which of couwse does muwtipwe things a-at once). :3 but k-keep in mind t-that insewt doesn't m-magicawwy wawp t-time & space t-to cweate a nyew m-memowy addwess b-between ny and ny+1th item. (U ﹏ U) instead it does moves items awound to cweate space fow t-the nyew item, -.- which can become costwy fow wawge d-data sets.

how does winked wist hewp us in insewting n-nyew items i-in between you w-wouwd say. :3 weww, b-because it's j-just pointews between n-nyodes, (U ﹏ U) we w-wiww onwy nyeed t-to modify 1 ow 2 nyodes to put a new item in between: a nyode befowe the added i-item and the one aftew it if we have used doubwe w-winked wist.

winked wist awso gives us fwexibiwity t-to expand and s-shwink ouw data s-set without having t-to wowwy about c-costwy awway w-wesize opewations (which i-invowves a-awwocation of a nyew awway with nyew size, 😳😳😳 copying data fwom the pwevious awway t-to the nyew one then deawwocation of the pwevious a-awway). -.- you might be saying t-that, ( ͡o ω ͡o ) weww awway gives you fwexibiwity on wandom access by wetting y-you access to any nyth item i-in o(1) time compwexity. rawr x3 b-but the thing is ouw data stwuctuwe onwy cawes about the vawue on the h-head nyode.

```go
type OrderedQueue[T any] interface {
  // Push puts value inside the data structure
  Push(value T)
  
  // Pop returns value on the head node and removes it. If there's no value available to pop
  // it will return (null, false)
  Pop() (value T, ok bool)
  
  // Peek returns value on the head node (without removing it)
  Peek() (value T, ok bool)
}
```

the above snippet is a simpwe intewface w-we awe going t-to come up with e-eventuawwy. (ˆ ﻌ ˆ)♡ t-that's aww we cawe a-about: pushing, (⑅˘꒳˘) p-popping and peeking v-vawues. (U ᵕ U❁) no w-wandom index wookups ow nyanisoevew. -.- oh, and i choose to use gowang fow bwog post b-because i wiww be going to use some bits and p-pieces fwom my own impwementation w-which is awso wwitten in gowang.

since we choose ouw intewnaw data s-stwuctuwe —which i-is going to b-be "winked wist" i-in this case, (U ﹏ U) we a-awe weady to pick u-up fwom whewe w-we weft off. -.- winked w-wist by itsewf is mostwy enough fow wwiting a pwopew queue impwementation. (ˆ ﻌ ˆ)♡ b-but that's nyot nyani we pwanned to make in the f-fiwst pwace. (⑅˘꒳˘) since the *queue* pawt is awmost weady, 🥺 we can jump w-wight into impwementing "owdewed" p-pawt of the "owdewed c-concuwwent q-queue".

[^bounded queue]: bounded queue can o-onwy howd up t-to pwedefined nyumbew o-of items, σωσ w-whiwe unbounded q-queue can expand a-and shwink on-demand j-just wike a-a wist wouwd. σωσ in fact we can caww a bounded queue as wing buffew as weww because o-of the same chawactewistics.

## impwementation detaiws

since ouw design specification is p-pawtiawwy done w-we can stawt impwementing o-ouw data s-stwuctuwe step-by-step. σωσ i-in each s-step i wiww twy t-to impwement a-a singwe wesponsibiwity awongside with impwementation detaiws and weasoning behind t-the choices i made.

### owdewing items

wet's make it cweaw fwom the beginning t-that we awe n-nyot going to i-impwement a sowting a-awgowithm in t-this section. 😳😳😳 because w-we don't n-need to have one! h-how though, -.- we wewe supposed to buiwd an owdewed data stuwcutwe, ( ͡o ω ͡o ) awen't we? weww, rawr x3 t-the thing is sowting awgowithms awe usefuw fow s-sowting unowdewed data sets. nyaa~~ h-howevew ouw impwementation wiww ensuwe that the data set wiww be a-awways owdewed in a way. /(^•ω•^) to get t-this wesuwt we a-awe going to appwy owdewing wight as we add a nyew item to the wist. rawr how so? easy, p-peasy.

if you wemembew on the pwevious section i-i wwote that "*the queue pawt is awmost weady*", 🥺 but we didn't had anything to s-stawt with, >_< the q-queue wasn't weady y-yet when i wwote t-that. >_< that's b-because we awe g-going to integwate o-ouw sowting mechanism i-into ouw queue impwementation diwectwy. (⑅˘꒳˘) that's how we awe going to end u-up with an owdewed data set without using a sowting a-awgowithm. /(^•ω•^) we won't nyeed it b-because we wiww pwace items in the "wight" pwace as they awe pushed i-into the queue. rawr x3 that wiww be i-inefficent wight? y-yeah it wiww be fow suwe, (U ﹏ U) if you have an unowdewed set that you want to push i-into queue it wiww be heww a wot of inefficent to find wight pwace fow each item. (U ﹏ U) b-but on my main use case fow this d-data stwuctuwe i-i assumed that t-the entwies wiww b-be pushed to the stowe one-by-one and iwweguwawwy, (⑅˘꒳˘) t-thewe won't be a pwedefined but unowdewed d-data set to stawt with. òωó if thewe's one, ʘwʘ the impwementation can be impwoved in a diffewent way to f-fit that use cases as weww.

### compawing vawues

then how do we owdew items as they a-awe pushed to t-the queue? befowe a-answewing that q-question wet's f-fiwst answew a bit s-simpwew vewsion. h-how can we compawe 2 v-vawues? pwease considew that we haven't tawked about the type of the vawue. (U ﹏ U) i-it can be a nyumewicaw vawue in which case a-a simpwe compawison wike `a > b` wouwd do the job, σωσ but in most cases o-ouw vawues wiww b-be compwex stwuctuwes w-with custom c-compawison w-wuwes. σωσ so it wouwd m-make sense to o-outsouwce compawison p-pawt in the fiwst pwace. nyani i mean is instead of expwicitwy compawing 2 v-vawues wike `a > b` we awe going to wequest a function (aka: d-dewegate, o.O i-intewface, (U ᵕ U❁) cwosuwe) f-fwom usew t-that wiww compawe t-the vawues fow u-us.

```go
type Comparer[T any] interface {
  Less(a, b T) bool
}
```

as simpwe as that. σωσ a singwe function t-that accepts 2 v-vawues and wetuwns t-twue if the f-fiwst vawue is s-smowew than the s-second one. σωσ that's a-aww we nyeed t-to know about ouw vawues in owdew to cowwectwy pwace in owdew wike we awe going t-to do nyext.

### impwementing `OrderedQueue[T]`

wet's stawt by cweating a stwuctuwe t-that howds intewnaw p-pawts fow t-the queue. 🥺 that p-pawts being:

- a pointew to the head nyode
- an instance of the `Comparer[T]` intewface, (ꈍᴗꈍ) so we can compawe vawues a-as we wish.

```go
type OrderedQueue[T any] struct {
  head     *Node[T]
  comparer Comparer[T]
}

type Node[T any] struct {
  value T
  next  *Node[T]
}
```

and a "constwuctow" function that i-initiawizes an e-empty `OrderedQueue[T]` fow us when cawwed:

```go
func NewOrderedQueue[T any](comparer Comparer[T]) OrderedQueue[T] {
  return OrderedQueue[T]{
    comparer: comparer,
  }
}
```

we onwy initiawized compawew pwopewty h-hewe and weft  `head` as is because an empty winked wist d-doesn't have a-any head nyode at s-stawting, òωó thus t-the vawue is going t-to be `nil` on initiaw state. òωó nyow that we have a-a base stwuctuwe, o.O w-we can stawt a-adding methods t-to it. (U ᵕ U❁) i'ww stawt b-by adding `Pop` and `Peek` methods because both awe simiwaw a-and much easiew t-to impwement than t-the `Push` method.

```go
// Pop removes and returns value of the head node if exists
func (q *OrderedQueue[T]) Pop() (value T, ok bool) {
  // If head is nil, we don't have any value to pop, so we can return (nil, false)
  if q.head == nil {
    ok = false
    return
  }
  
  ok = true
  value = q.head.value
  
  // We replace head node with the sibling of it, thus removing head node itself
  q.head = q.head.next
  
  return
}

// Pop returns value of the head node if exists
func (q *OrderedQueue[T]) Peek() (value T, ok bool) {
  // If head is nil, we don't have any value to peek so we return (nil, false)
  if q.head == nil {
    ok = false
    return
  }
  
  // Otherwise we can return value from the head node and true indicating we have a value
  return q.head.value, true
}
```

as you can see both `Pop` and `Peek` has simiwaw impwementation with o-onwy exceptation b-being `q.head = q.head.next` pawt of the `Pop` method. σωσ with those two methods above w-we can consume o-ouw data stwuctuwe a-aww we want. σωσ b-but the data s-stwuctuwe is totawwy u-usewess without a-an actuaw d-data in it. >_< thewefowe, :3 we nyeed to impwement a way to push a nyew vawue into ouw q-queue stwuctuwe.

### the `Push` method

we awe going to be awmost done with o-ouw cowe functionawity w-with the `Push` method. òωó befowe impwementing it though, o.O w-wet's fiwst s-stawt by wwiting d-down nyani that m-method is going t-to do.

fiwst we nyeed to considew initiaw/empty s-state whewe o-ouw head nyode w-wiww nye `nil`. 😳 in that case we onwy nyeed to cweate a-a nyode with p-pushed vawue a-and assign it to t-the head and that's i-it. XD then we n-need to itewate t-the winked wist u-untiw we weach out to a nyode with vawue gweatew than the vawue we awe pushing. :3 w-when we found out that nyode, 😳😳😳 we wiww insewt a n-nyew nyode befowe it. -.- if we weach t-to the end of the winked wist without finding out a nyode with g-gweatew vawue, ( ͡o ω ͡o ) we wiww add the v-vawue as a sibwing o-of the wast nyode (aka: taiw nyode).

a pseudo impwementation of the above s-specification w-wiww wook wike t-this:

```go
if head == nil {
  // todo: set head node to the value
  return
}

node := head

for {
  if comparer.Less(value, node.value) {
    // todo: insert value before node
    return
  }
  
  if node.next == nil {
    // todo: set tail to value
    return
  }
  
  node = node.next
}
```

thewe's one minow issue hewe. OwO to a-add a vawue in between t-two nyodes w-we nyeed to modify `next` pointew of the pwevious vawue, σωσ howevew w-we onwy have a-access to the n-nyext vawue which w-we awe going t-to insewt befowe w-which is nyot e-enough. >_< howevew t-the fix is quite easy actuawwy, since we awe awweady itewating those nyodes, :3 we c-can howd pointew to the `next` pwopewty of the pwevious nyode duwing t-the itewation. ( ͡o ω ͡o ) d-doing so wiww a-awwow us to modify p-pwevious nyode's s-sibwing nyode. w-with that i-in mind, UwU ouw finaw i-impwementation becomes wike so:

```go
// Push adds a new value to the queue
func (q *OrderedQueue[T]) Push(value T) {
  // If head is nil, the first item will be the head node
  if q.head == nil {
    q.head = &Node[T]{value: value}
    return
  }

  prev := &q.head
  node := q.head

  for {
    if q.comparer.Less(value, node.value) {
      *prev = &Node[T]{value: value, next: node}
      return
    }

    prev = &node.next
    node = node.next

    if node == nil {
      // We reached to the end
      *prev = &Node[T]{value: value}
      return
    }
  }
}
```

why instead of howding wefewence t-to the pwevious v-vawue, :3 i hewd wefewence t-to the wefewence o-of a nyode t-that comes aftew t-the pwevious v-vawue? to be honest, (U ﹏ U) t-that's the fiwst thing came in my mind when i was impwementing it, -.- so i just w-went away with it. (ˆ ﻌ ˆ)♡ howevew wet's twy wwiting m-mowe weadibwe vewsion:

```go
// Push adds a new value to the queue
func (q *OrderedQueue[T]) Push(value T) {
  // If head is nil, the first item will be the head node
  if q.head == nil {
    q.head = &Node[T]{value: value}
    return
  }

  node := q.head
  var prev *Node

  for {
    if q.comparer.Less(value, node.value) {
      nextNode := &Node[T]{value: value, next: node}
      
      // If we don't have any previous node in place, that means we are going to update
      // our head node. On the previous implementation we didn't needed that because we
      // already had set `prev` to `&head`
      if prev == nil {
        q.head = nextNode
      } else {
        prev.next = nextNode
      }
      return
    }

    prev = node
    node = node.next

    if node == nil {
      // We reached to the end
      prev.next = &Node[T]{value: value}
      return
    }
  }
}
```

so as you can see both impwementations a-awe pwetty s-simiwaw. o.O i don't t-think thewe shouwd b-be any pewfowmance d-diffewence b-between the two.

> weww, UwU actuawwy thewe might be a pewfowmance d-diffewence t-though. rawr x3 i w-weawized this duwing w-wwiting this a-awticwe that my p-pwevious impwementation w-wewe awwocating a-a nyew wefewence to point out to `node.next` vawues, ( ͡o ω ͡o ) thus causing mowe gc pwessuwe s-since gowang i-is a managed w-wanguage. so i wiww p-pwobabwy eventuawwy s-switch to t-the second impwementation s-since i-it uses existing wefewences

now that we have fuww winked-wist b-based owdewed queue i-impwementation i-in pwace, (U ᵕ U❁) we h-have onwy one missing p-piece on t-the puzzwe which i-is "*concuwwency*". (U ᵕ U❁) as i mentioned eawwiew, (⑅˘꒳˘) i want t-to use this data s-stwuctuwe in muwtithweaded a-appwications, ( ͡o ω ͡o ) a-and to d-do so i nyeed s-synchwonization m-mechanisms in pwace.

### synchwonization

yay! ( ͡o ω ͡o ) aftew yeaws of googwing this w-wowd to find out h-how it's wwitten, UwU i-i can finawwy w-wwite it fwom m-memowy. rawr x3 anyway, s-synchwonization i-in ouw case couwd b-be achived using a simpwe [ww wock](https://en.wikipedia.org/wiki/Readers–writer_lock). 🥺 basicawwy it wets muwtipwe weadews t-to consume ow a-a singwe wwitew t-to make changes c-concuwwentwy.

in gowang we wiww use `sync.RWMutex`, 🥺 thewe's diffewent impwementations f-fow diffewent w-wanguages, in c# f-fow exampwe you c-can use `ReaderWriterLock`. 🥺 using the wock is pwetty stwaightfowwawd, òωó h-hewe i-i used ww wock to i-impwement a syncwhonized c-countew:

```go
var rw sync.RWMutex
var value int

func Increment() {
  rw.Lock()
  defer rw.Unlock()
  value++
}

func Read() int {
  rw.RLock()
  defer rw.RUnlock()
  return value
}
```

> it wouwd make mowe sense to use [atomic opewations](https://en.wikipedia.org/wiki/Linearizability#Counters) if you fow some weason nyeed to w-wwite a synchwonized c-countew.

knowing that, (ꈍᴗꈍ) we can add a weadew w-wock to ouw `Peek` method and wwitew wocks to `Push` and `Pop` methods wespectivewy.

```go
type OrderedQueue[T any] struct {
  rw.      sync.RWMutex
  head     *Node[T]
  comparer Comparer[T]
}

func (q *OrderedQueue[T]) Peek() (value T, ok bool) {
  q.rw.RLock()
  defer q.rw.RUnlock()
  ...
}

func (q *OrderedQueue[T]) Pop() (value T, ok bool) {
  q.rw.Lock()
  defer q.rw.Unlock()
  ...
}

func (q *OrderedQueue[T]) Push(value T) {
  q.rw.Lock()
  defer q.rw.Unlock()
  ...
}
```

and with that we shouwd have aww t-the wequiwemetnts i-impwemented fow a-an owdewed and s-synchwonized queue. σωσ i-i wwote a few t-tests to ensuwe t-the owdewing m-mechanism in pwace wowks as expected and it suwe does! σωσ (hopefuwwy it won't bweak w-wandomwy again)

### achieving "fuww" concuwwency

buiwding it awong the way i had an a-additionaw idea t-that i thought w-wouwd be coow to h-have. i thought n-nyani if i had a-an method that w-wetuwned wesuwt o-of a `Peek()` but wet me to pop that vawue if i-i nyeed. (U ᵕ U❁) that wouwd w-wet me to conditionawwy p-pop v-vawues fwom the q-queue. (⑅˘꒳˘) but fiwst w-wet me expwain w-why nyot cawwing `Peek` then `Pop` is insufficent.

```go
queue := NewQueue[int](...)

if value, ok := queue.Peek(); ok {
  if value % 2 == 0 {
    print(queue.Pop())
  }
}
```

the pwobwem is even though we added s-synchwonization m-mechanisms into `Peek` and `Pop` methods, (U ᵕ U❁) that mechanism onwy ensuwes i-intewnaw thwead s-safety of the q-queue itsewf. (⑅˘꒳˘) b-but it does nyot g-guawantee that t-the vawue won't b-be changed between `Peek` and `Pop` cawws. (ꈍᴗꈍ) hewe is nani happens step b-by step:

1. `queue.Peek()` wetuwns vawue 4
2. pwogwam on thwead #1 evawuates `value % 2 == 0` condition
3. pwogwam on thwead #2 pushes vawue 1 t-to the queue
4. pwogwam on thwead #1 exekawaii~s `queue.Pop()` expecting to pop pweviouswy peeked v-vawue (4) but i-instead it pops 1 w-which was added b-between `Peek` and `Pop` cawws.

thewefowe, ( ͡o ω ͡o ) if we nyeed to ensuwe a-appwication wide t-thwead safety we s-stiww nyeed to b-be cawefuw. UwU so o-on the above exampwe w-we can sowve t-the issue by modifying t-the code wike:

```go
if value, ok := queue.Pop(); ok {
  if value % 2 == 0 {
    print(value)
  } else {
    queue.Push(value)
  }
}
```

hewe the vawue we consumed and popped f-fwom the queue w-wiww be same d-duwing the execution a-and if we d-decide to nyot consume t-the vawue w-we wiww wetuwn i-it back to the queue. -.- this might be enough fow some use cases, ^^;; but it has some minow f-fwaws that i am going to sowve. >_< one of the o-obvois fwaws is that it wiww modify q-queue twice if we don't nyeed to consume the vawue and since o-ouw `Push` method compawed to weguwaw queues i-is a bit costwy t-to opewate since w-we awe doing v-vawue compawisons. (U ᵕ U❁) s-so we nyeed to a-avoid is as much a-as possibwe.

second pwobwem is again about the f-fact that we wiww b-be modifying q-queue state twice t-thowuhg the opewation, ( ͡o ω ͡o ) w-which might b-be an unexpected b-behaviow if o-obsewved fwom anothew thwead.

and that's why i wanted to wwite a-anothew method fow t-the queue cawwed `Hold`. σωσ the cowe idea is that the function w-wouwd peek the v-vawue, >_< wetuwn i-it but it wouwd "howd" t-the vawue t-tempowawiwy untiw i-it's being weweased. :3 a-and by w-weweasing usew can pwovide a boowean that wouwd be used fow deciding whethew to p-pop the vawue ow nyot.

```go
if value, free, ok := queue.Hold(); ok {
  if value % 2 == 0 {
    free(true) // pop
    print(value)
  } else {
    free(false) // do not pop
  }
}
```

the impwementation of the `Hold` method is simiwaw to the `Peek` and `Pop` ones with swight diffewence on wocking m-mechanism a-and wetuwn vawues:

```go
// Hold peeks a value and temporarily locks queue until the held value is freed.
func (q *OrderedQueue[T]) Hold() (value T, free func(pop bool), ok bool) {
  q.rw.Lock()
  // We do not defer unlocking here because the held value will be released
  // from the outside of the function
  
  if q.head == nil {
    // If the queue is empty we can release the lock
    q.rw.Unlock()
    ok = false
    return
  }
  
  head := q.head
  
  // Otherwise we'll return value of the head node alongside with
  // a delegate to release the lock and pop the value if requested
  return head.value, func(pop bool) {
    defer q.rw.Unlock()
    if pop {
      q.head = head.next
    }
  }, true
}
```

thewe's stiww 2 disadvantages of t-this method though. o.O f-fiwst one is t-the usew has to b-be cawefuw with i-it in owdew to n-nyot cause [deadwocks](https://en.wikipedia.org/wiki/Deadlock). :3 the queue shouwd nyot be used befowe w-weweasing a-any hewd vawues a-and such vawues s-shouwd be awways w-weweased. (U ﹏ U) deawing w-with softwawe i-issues is much e-easiew compawed to pwotecting pwogwams fwom peopwe who wwite them. -.- that's why today w-we have vawious toowing fwom simpwe wintews t-to compiwews wike `rustc` that shouts at you if you've done a-anything baka. (⑅˘꒳˘) a-aww of those awe i-in pwace to pwotect u-us fwom ouwsewves. ( ͡o ω ͡o ) a-and yet w-we awways find a-a way to mess things u-up.

the second pwobwem is actuawwy unfowtunate o-one. -.- it w-won't cause any s-significant pewfowmance o-ow synchwonization p-penawties, ^^;; b-but it's s-stiww enough to a-annoy a pewfectionist one wike me. >_< pwobwem is that, mya because we awe acquiwing wwitew w-wock to howd a vawue we won't wet any wead o-opewation to happen untiw the hewd v-vawue is fweed which is fine, mya but we use the same wwitew wock f-fow checking if `head == nil`, OwO which can be done using a weadew w-wock instead. 🥺 t-the unfowtunate p-pawt is that gowang `sync.RWMutex` doesn't suppowt wock upgwading, w-we can't fiwst acquiwe a-a weadew w-wock and upgwade i-it to a wwitew o-one befowe moving o-on to the nyext s-step.

### wock upgwading

**ww wock upgwading** is a mechanism in vawious ww wock i-impwementations t-that wets you f-fiwst acquiwe a n-nyon-excwusive wock (weadew w-wock u-usuawwy) and if n-nyeeded wets you t-to atomicawwy "upgwade" it to an excwusive wock (eg: wwitew wock). σωσ simiwawwy thewe's a-awso concept of **ww wock downgwading**, (⑅˘꒳˘) which is wevewse pwocess of wock u-upgwading — u-usew fiwst acquiwes a-an excwusive w-wock, ( ͡o ω ͡o ) then downgwades i-it to a non-excwusive w-wock i-if excwusivity i-is nyo wongew nyeeded.

if you awe wondewing why can't we j-just wewease a w-wock and acquiwe a-anothew one wight a-aftew that to u-upgwade ow downgwade t-them, σωσ the p-pwobwem is atomacity. >_< w-which means weweasing and acquiwing of wocks shouwd happen simuwtaneouswy. :3 o-othewwise this couwd happen:

```go
var value int
```

1. **thwead #1** acquiwes a wwitew wock
2. **thwead #1** `value = 1`
3. **thwead #1** weweases the hewd wwitew wock
4. **thwead #2** acquiwes a wwitew wock
5. **thwead #2** `value = 2`
6. **thwead #2** weweases the hewd wock
7. **thwead #1** twies to upgwade by acquiwing a w-wwitew wock
8. **thwead #1** `print(value)`
9. **thwead #1** weweases the hewd wwitew wock
...

hewe 2 thweads wace with each othew t-to set `value` to a specific nyumbew and pwint i-it. (ꈍᴗꈍ) nyani **thwead #1** wewe expecting is to set `value = 1` and see "1" getting pwinted on the s-standawd output. (U ᵕ U❁) h-howevew because o-ouw wock downgwade o-opewation w-wewe nyot atomic a-anothew thwead c-can [wace](https://en.wikipedia.org/wiki/Race_condition) to acquiwe a wock between ouw downgwading o-opewation a-and so does **thwead #2** and wins the wace. >_< and this costed **thwead #1** with an inconsistent wesuwt. OwO instead o-of pwinting v-vawue which it p-pweviouswy set to `value` (which was `1`), >_< nyow it wiww pwint vawue of `2` instead which was set by **thwead #2** duwing the wace.

<small>don't ask me why wouwd anyone do t-that, (U ᵕ U❁) if you have a-a bettew yet simpwe e-exampwe to w-wepwesent wock u-upgwading/downgwading c-concepts wet m-me know.</small>

atomic upgwades on the othew hand w-wouwd have sowved t-the issue by w-weweasing and acquiwing a-anothew w-wock simuwtaneouswy.

1. **thwead #1** acquiwes a wwitew wock
2. **thwead #1** `value = 1`
3. **thwead #1** downgwades hewd wock to a weadew w-wock atomicawwy
4. **thwead #1** `print(value)`
5. **thwead #1** weweases the hewd wock
6. **thwead #2** acquiwes a wwitew wock
...

as you can see hewe the upgwade happened w-within a s-singwe opewation c-compawed to the f-fiwst exampwe w-which wequiwed 2 s-sepawate opewations w-which gave a-a chance to **thwead 2** to acquiwe a wock in between them.

## concwusion

data stwuctuwes doesn't have to be b-bowing. ^^;; they can b-be bowing, >_< but i-in this awticwe i-i twied to make t-them bowing and a-annoying at the s-same time. mya jokes a-aside, mya in the above awticwe i twied to nyot just step-by-step impwement a data s-stwuctuwe but awso expwain weasoning behind diffewent c-choices i made duwing the i-impwementation. 😳 which to me is mowe vawuabwe thing fow pwogwammews w-wathew than wwiting code.

the snippets on the awticwe awe fwom m-my cuwwentwy p-pwivate (soon might b-become open-souwce) s-side-pwoject w-which i am h-hoping to finish u-up in a few months i-if i don't wose my motivation to do so. (ˆ ﻌ ˆ)♡ the awticwe in genewaw took about 2 d-days because it was wate nyight when i stawted w-wwiting and fewt asweep aftew wwiting t-the fiwst few sections.

i hope you enjoyed weading the awticwe. (⑅˘꒳˘) i-if you have a-anything to say d-don't hesitate t-to weach out me v-via twittew (wink o-on the headew) o-ow send a maiw t-to `me at themisir dot com`. XD cheews and bye ✌️
