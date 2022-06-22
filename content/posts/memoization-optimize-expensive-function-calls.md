---
title: "Optimizing Expensive Function Calls with Memoization"
date: 2022-06-23T02:56:32+04:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1588941288445-b1a5f3977b9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80

---

## Factorials

Let's write a function that's used as an example when teaching "recursion": a function that returns factorial of provided argument.

If you don't remember what "factorial" is, it's just a function that returns multiplication of numbers from 1 to given number n. So, `factorial(5) = 5 * 4 * 3 * 2 * 1`.

Most of the times factorial function implemented as following to teach recursion in programming:

```csharp
// f(n) = n * f(n-1)
int Factorial(int n) {
  if (n < 2) {
    return 1;
  }
  return n * Factorial(n - 1);
}
```

However the following code isn't perfect. Before applying futher optimization, let's fix obvois issues, like stack overflow. As you can see the function is going to call itself multiple times, but as that happens each function call will be stored on call stack of the process memory which is not an infinite resource. So this function is clearly limited by how many entries does current runtime, OS, cpu arcitecture supports. So let's "fix" this issue by implementing factorial function using loops:

```csharp 
int Factorial(int n) {
  int result = 1;
  while (n > 1) {
    result *= n;
    --n;
  }
  return result;
}
```

This implementation is good enough for most use cases. But let's see how much futher we can optimize this implementation.

Let's say you are working on a game and for some reason you need to calculate factorial of some number on each frame (est: 60 times per second). Games is one of the types of software that you have to count on time each function takes. Because you usually have less than 16 milliseconds to calculate everything and draw them on to screen + prepare for the next update. Our "optimized" factorial function might get job done for some time, but at some point the time it takes to calculate result will become noticable, especially if you're working with big numbers.

So... Let's see what we can do? Let's calculate a bunch of factorials by hand:

```plain
factorial(3) = 3 * 2 = 6
factorial(4) = 4 * 3 * 2 = 24
factorial(7) = 7 * 6 * 5 * 4 * 3 * 2 = 5040
```

I don't know if you've noticed or not, but if you look closely you can see we have done lot's of unnecessary repeated calculations above. Like, instead of calculating `4 * 3 * 2` we can use result of previous calculation (`3 * 2 = 6`) and multiply it with the other values:

```plain
factorial(4) = 4 * factorial(3) = 4 * 6
factorial(7) = 7 * 6 * 5 * factorial(4) = 210 * 24 
```

It might seem like not a big deal here, but imagine you're calculating factorial of 120 and on next update you'll need to calculate factorial of 121. Instead of going thru all 120 values one by one, you can skip 120 steps by using result of previous calculation.

Let's try rewriting our factorial function to use results from previous calculations:

```csharp
Dictionary<int, int> memo = new();

int Factorial(int n) {
  int result = 1;
  while (n > 1) {
    if (memo.TryGetValue(n, out var cachedResult)) {
      // if there's a known result for factorial(n) we use it to calculate result
      result = result * cachedResult;
      break;
    }
    
    result *= n;
    --n;
  }
  
  // store calculated result for future use
  memo[n] = result;
  return result;
}
```

The method above is called memoization (**not** *memorization*). Instead of calculating expensive functions you try to use values from previous calculations to return answers much faster.

Perfect, now this function can go TO THE MOOOON! Unless you're living in 1960s and happened to be writing a program for [Apollo Guidance Computer](https://en.wikipedia.org/wiki/Apollo_Guidance_Computer) to help astronauts safely navigate to the Moon which only had 72K of memory. 

> Yeah, the above implementation has a major flaw - it's a memory hog, it'll be going to use a lot of memory on long runs. We usually don't always have that luxry of using as much memory as we want. To optimize memory usage there's some known methods.
>
> One of them is to using a data structure called LRU cache to store previous calculations. The magic behind LRU cache is that it stores value only if they're accessed regularly. Otherwise it just forgets them so you'll end up storing values that's most usable in given situation stored on cache. Obviously depending on use case you can write custom optimizations, you're not limited to LRU cache, but it's situational and there's trade-offs for each implementation.

## A generic Memoization implementation

To make things more interesting let's take stuff a level above. Let's replace our factorial functon with a dynamic value of  function type that takes an argument and returns some value, let's call it `Func<TArg, TResult>`. Can we write an utility to memoize any function that matches the following pattern? That's exactly what we're going to do!

Let's first start with a simple interface to store our expensive calculate method and provide a public method for returning memozied result.

```csharp
public class Memo<TArg, TResult> {
  private readonly Func<TArg, TResult> _calculate;
  
  public Memo(Func<TArg, TResult> calculate) {
    _calculate = calculate;
  }
  
  public TResult Calculate(TArg arg) {
    return _calculate(arg);
  }
}
```

The class above does not have any memoization magic in it, yet. Let's add a bit of memoization to it. First we add a dictionary to store memoized values.

```csharp
private readonly Dictionary<TArg, TResult> _memo = new();
```

And modify `Calculate` method accordingly to our example above:

```csharp
public TResult Calculate(TArg arg) {
  // try fetching value from the cache
  if (_memo.TryGetValue(arg, out var memoizedValue)) {
    return memoizedValue;
  }
  
  // use expensive function to get result
  var result = _calculate(arg);
  // cache it for future
  _memo[arg] = result;
  // and return
  return result;
}
```

That seems like good enough for most use cases, but we can move futher by separating our cache layer from memoization, so we can use different cache backends for different use cases. Ok, let me explain. Let's assume you need to use LRU cache on some memoization implementations, or on other cases you might need to distribute that cache across multiple nodes so you decide to use Redis or Memcached to store cached values. Instead of reimplementing `Memo` class for different cache backends we can separate both layers so they can become pluggable.

Let's design an interface for our cache layer. As you can see from our above example we've only used 2 methods of `_memo` dictionary: TryGetValue - to check if value exists, and get the value and `[key] = value` setter to cache a new value. So, our interface will be going to have similar interface:

```csharp
public interface IMemoCache<TArg, TResult> {
  bool TryGetValue(TArg arg, out TResult result);
  void SetValue(TArg arg, TResult result);
}
```

And let's also change our `Memo` implementation to use `IMemoCache` instead of `Dictionary` as a cache backend.

```csharp
public sealed class Memo<TArg, TResult> {
  private readonly Func<TArg, TResult> _calculate;
  private readonly IMemoCache<TArg, TResult> _cache;
  
  public Memo(Func<TArg, TResult> calculate, IMemoCache<TArg, TResult> cache) {
    _calculate = calculate;
    _cache = cache;
  }
  
  public TResult Calculate(TArg arg) {
    if (_cache.TryGetValue(arg, out var memoizedResult)) {
      return memoizedResult;
    }
    
    var result = _calculate(arg);
    _cache.SetValue(arg, result);
    return result;
  }
}
```

Now creating a new memoizers using different caching backends is easier as just implementing `IMemCache` interface.

```csharp
public sealed class DictionaryCache<TArg, TResult> : IMemoCache<TArg, TResult> {
  private readonly Dictionary<TArg, TResult> _dict = new();
  
  public bool TryGetValue(TArg arg, out TResult result) =>
    _dict.TryGetValue(arg, out result);
  
  public void SetValue(TArg arg, TResult result) =>
    _dict[arg] = result;
}
```

That's it. I think our current implementation is good enough for most use cases. Obviously you can go futher by using source generators or reflection to simplify memoization API using decodator pattern. But that level of *magic* might be a bit too much or unnecessary. You usually don't need to memoize all the functions on your program, only just a few ones that's called often does worth the additional complexity and memory overhead.

---

Originally this article supposed to be about "system programming" but for some reason I ended up writing about memoization instead. But, I liked how it turned out and continued to write it. Thanks for reading this far 😇