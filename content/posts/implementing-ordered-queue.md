---
title: "Implementing Ordered Concurrent Queue"
date: 2022-10-25T01:48:09+04:00
tags:
  - engineering
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

Usually queues are implemented using an array (static array if the queue is bounded<sup>[1]</sup> or dynamic array if unbounded). Aside from the internal array, queue also holds a *pointer* to the first and last item of the queue, and those *pointers* are respectively called head and tail.

When you add a new item to a regular queue, the item will be set to the `array[tail+1]`. And when you pop an item from the queue, the item at `array[head]` will be returned and value of the head will be increased. If you are interested about in depth implementation details please check out related keywords on your favourite search engine. Or just use javascript which has an array that's in fact a dictionary, that can also be used as a queue (and stack as well, YAY!).

Aside from arrays, queues can be also implemented using linked lists as well. And that's what we are going to use in our queue implementation. However aside from [YOLO](http://yolo.urbanup.com/13839877 )ing our internal data structure choice, there's actually technicial reasoning behind it. If you remember we said that our data structure is going to be ordered in a custom way. That means we might regularly need to break the queue in between and put an item there. Putting an item between existing items on array is not feasible, because you can't just insert item into middle of an array. There might be an `Insert(int index, T item)` method for `List` implementation on your favourite language (which is javascript of course! Wait js doesn't have `array.insert`, oh wait [it does have this one](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) which of course does multiple things at once). But keep in mind that Insert doesn't magically warp time & space to create a new memory address between n and n+1th item. Instead it does moves items around to create space for the new item, which can become costly for large data sets.

How does linked list help us in inserting new items in between you would say. Well, because it's just pointers between nodes, we will only need to modify 1 or 2 nodes to put a new item in between: a node before the added item and the one after it if we have used double linked list.

Linked list also gives us flexibility to expand and shrink our data set without having to worry about costly array resize operations (which involves allocation of a new array with new size, copying data from the previous array to the new one then deallocation of the previous array). You might be saying that, well array gives you flexibility on random access by letting you access to any nth item in O(1) time complexity. But the thing is our data structure only cares about the value on the head node.

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

The above snippet is a simple interface we are going to come up with eventually. That's all we care about: pushing, popping and peeking values. No random index lookups or whatsoever. Oh, and I choose to use golang for blog post because I will be going to use some bits and pieces from my own implementation which is also written in golang.

Since we choose our internal data structure —which is going to be "linked list" in this case, we are ready to pick up from where we left off. Linked list by itself is mostly enough for writing a proper queue implementation. But that's not what we planned to make in the first place. Since the *queue* part is almost ready, we can jump right into implementing "ordered" part of the "Ordered Concurrent Queue".

<small>[1] - bounded queue can only hold up to predefined number of items, while unbounded queue can expand and shrink on-demand just like a list would. In fact we can call a bounded queue as ring buffer as well because of the same characteristics.</small>

## Implementation details

Since our design specification is partially done we can start implementing our data structure step-by-step. In each step I will try to implement a single responsibility alongside with implementation details and reasoning behind the choices I made.

### Ordering items

Let's make it clear from the beginning that we are not going to implement a sorting algorithm in this section. Because we don't need to have one! How though, we were supposed to build an ordered data sturcutre, aren't we? Well, the thing is sorting algorithms are useful for sorting unordered data sets. However our implementation will ensure that the data set will be always ordered in a way. To get this result we are going to apply ordering right as we add a new item to the list. How so? Easy, peasy. 

If you remember on the previous section I wrote that "*the queue part is almost ready*", but we didn't had anything to start with, the queue wasn't ready yet when I wrote that. That's because we are going to integrate our sorting mechanism into our queue implementation directly. That's how we are going to end up with an ordered data set without using a sorting algorithm. We won't need it because we will place items in the "right" place as they are pushed into the queue. That will be inefficent right? Yeah it will be for sure, if you have an unordered set that you want to push into queue it will be hell a lot of inefficent to find right place for each item. But on my main use case for this data structure I assumed that the entries will be pushed to the store one-by-one and irregularly, there won't be a predefined but unordered data set to start with. If there's one, the implementation can be improved in a different way to fit that use cases as well.

### Comparing values

Then how do we order items as they are pushed to the queue? Before answering that question let's first answer a bit simpler version. How can we compare 2 values? Please consider that we haven't talked about the type of the value. It can be a numerical value in which case a simple comparison like `a > b` would do the job, but in most cases our values will be complex structures with custom comparison rules. So it would make sense to outsource comparison part in the first place. What I mean is instead of explicitly comparing 2 values like `a > b` we are going to request a function (aka: delegate, interface, closure) from user that will compare the values for us.

```go
type Comparer[T any] interface {
	Less(a, b T) bool
}
```

As simple as that. A single function that accepts 2 values and returns true if the first value is smaller than the second one. That's all we need to know about our values in order to correctly place in order like we are going to do next.

### Implementing `OrderedQueue[T]`

Let's start by creating a structure that holds internal parts for the queue. That parts being:

- a pointer to the head node
- an instance of the `Comparer[T]` interface, so we can compare values as we wish.

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

And a "constructor" function that initializes an empty `OrderedQueue[T]` for us when called:

```go
func NewOrderedQueue[T any](comparer Comparer[T]) OrderedQueue[T] {
	return OrderedQueue[T]{
    comparer: comparer,
  }
}
```

We only initialized comparer property here and left  `head` as is because an empty linked list doesn't have any head node at starting, thus the value is going to be `nil` on initial state. Now that we have a base structure, we can start adding methods to it. I'll start by adding `Pop` and `Peek` methods because both are similar and much easier to implement than the `Push` method.

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

As you can see both `Pop` and `Peek` has similar implementation with only exceptation being `q.head = q.head.next` part of the `Pop` method. With those two methods above we can consume our data structure all we want. But the data structure is totally useless without an actual data in it. Therefore, we need to implement a way to push a new value into our queue structure. 

### The `Push` method

We are going to be almost done with our core functionality with the `Push` method. Before implementing it though, let's first start by writing down what that method is going to do.

First we need to consider initial/empty state where our head node will ne `nil`. In that case we only need to create a node with pushed value and assign it to the head and that's it. Then we need to iterate the linked list until we reach out to a node with value greater than the value we are pushing. When we found out that node, we will insert a new node before it. If we reach to the end of the linked list without finding out a node with greater value, we will add the value as a sibling of the last node (aka: tail node).

A pseudo implementation of the above specification will look like this:

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

There's one minor issue here. To add a value in between two nodes we need to modify `next` pointer of the previous value, however we only have access to the next value which we are going to insert before which is not enough. However the fix is quite easy actually, since we are already iterating those nodes, we can hold pointer to the `next` property of the previous node during the iteration. Doing so will allow us to modify previous node's sibling node. With that in mind, our final implementation becomes like so:

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

Why instead of holding reference to the previous value, I held reference to the reference of a node that comes after the previous value? To be honest, that's the first thing came in my mind when I was implementing it, so I just went away with it. However let's try writing more readible version:

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

So as you can see both implementations are pretty similar. I don't think there should be any performance difference between the two.

> Well, actually there might be a performance difference though. I realized this during writing this article that my previous implementation were allocating a new reference to point out to `node.next` values, thus causing more GC pressure since golang is a managed language. So I will probably eventually switch to the second implementation since it uses existing references

Now that we have full linked-list based ordered queue implementation in place, we have only one missing piece on the puzzle which is "*concurrency*". As I mentioned earlier, I want to use this data structure in multithreaded applications, and to do so I need synchronization mechanisms in place.

### Synchronization

Yay! After years of googling this word to find out how it's written, I can finally write it from memory. Anyway, synchronization in our case could be achived using a simple [RW Lock](https://en.wikipedia.org/wiki/Readers–writer_lock). Basically it lets multiple readers to consume or a single writer to make changes concurrently.

In golang we will use `sync.RWMutex`, there's different implementations for different languages, in C# for example you can use `ReaderWriterLock`. Using the lock is pretty straightforward, here I used RW Lock to implement a syncrhonized counter:

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

> It would make more sense to use [atomic operations](https://en.wikipedia.org/wiki/Linearizability#Counters) if you for some reason need to write a synchronized counter.

Knowing that, we can add a reader lock to our `Peek` method and writer locks to `Push` and `Pop` methods respectively.

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

And with that we should have all the requiremetnts implemented for an ordered and synchronized queue. I wrote a few tests to ensure the ordering mechanism in place works as expected and it sure does! (hopefully it won't break randomly again)

### Achieving "full" concurrency

Building it along the way I had an additional idea that I thought would be cool to have. I thought what if I had an method that returned result of a `Peek()` but let me to pop that value if I need. That would let me to conditionally pop values from the queue. But first let me explain why not calling `Peek` then `Pop` is insufficent.

```go
queue := NewQueue[int](...)

if value, ok := queue.Peek(); ok {
  if value % 2 == 0 {
    print(queue.Pop())
  }
}
```

The problem is even though we added synchronization mechanisms into `Peek` and `Pop` methods, that mechanism only ensures internal thread safety of the queue itself. But it does not guarantee that the value won't be changed between `Peek` and `Pop` calls. Here is what happens step by step:

1. `queue.Peek()` returns value 4
2. Program on thread #1 evaluates `value % 2 == 0` condition
3. Program on thread #2 pushes value 1 to the queue
4. Program on thread #1 executes `queue.Pop()` expecting to pop previously peeked value (4) but instead it pops 1 which was added between `Peek` and `Pop` calls.

Therefore, if we need to ensure application wide thread safety we still need to be careful. So on the above example we can solve the issue by modifying the code like:

```go
if value, ok := queue.Pop(); ok {
  if value % 2 == 0 {
    print(value)
  } else {
    queue.Push(value)
  }
}
```

Here the value we consumed and popped from the queue will be same during the execution and if we decide to not consume the value we will return it back to the queue. This might be enough for some use cases, but it has some minor flaws that I am going to solve. One of the obvois flaws is that it will modify queue twice if we don't need to consume the value and since our `Push` method compared to regular queues is a bit costly to operate since we are doing value comparisons. So we need to avoid is as much as possible.

Second problem is again about the fact that we will be modifying queue state twice thoruhg the operation, which might be an unexpected behavior if observed from another thread.

And that's why I wanted to write another method for the queue called `Hold`. The core idea is that the function would peek the value, return it but it would "hold" the value temporarily until it's being released. And by releasing user can provide a boolean that would be used for deciding whether to pop the value or not.

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

The implementation of the `Hold` method is similar to the `Peek` and `Pop` ones with slight difference on locking mechanism and return values:

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

There's still 2 disadvantages of this method though. First one is the user has to be careful with it in order to not cause [deadlocks](https://en.wikipedia.org/wiki/Deadlock). The queue should not be used before releasing any held values and such values should be always released. Dealing with software issues is much easier compared to protecting programs from people who write them. That's why today we have various tooling from simple linters to compilers like `rustc` that shouts at you if you've done anything stupid. All of those are in place to protect us from ourselves. And yet we always find a way to mess things up.

## Conclusion

Data structures doesn't have to be boring. They can be boring, but in this article I tried to make them boring and annoying at the same time. Jokes aside, in the above article I tried to not just step-by-step implement a data structure but also explain reasoning behind different choices I made during the implementation. Which to me is more valuable thing for programmers rather than writing code.

The snippets on the article are from my currently private (soon might become open-source) side-project which I am hoping to finish up in a few months if I don't lose my motivation to do so. The article in general took about 2 days because it was late night when I started writing and felt asleep after writing the first few sections.

I hope you enjoyed reading the article. If you have anything to say don't hesitate to reach out me via twitter (link on the header) or send a mail to `me at themisir dot com`. Cheers and bye ✌️ 