---
title: Dry
date: 2024-03-10T19:52:00+04:00
tags:
  - engineering
  - stories
images:
  - https://plus.unsplash.com/premium_photo-1671253985486-6c047bbad250?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

Let’s create a simple Rest API using ASP.NET Core, and then try to improve it as much as we can.

I assume you already know how to configure your project so I will skip over that part. I case you are not familiar with ASP.NET Core you can still follow along as I think the the patterns should feel familiar if you have written software for some time.

We receive our first requirement: create an API endpoint that returns `“pass”` when called with `?value=ok` query parameter.

```csharp
[ApiController, Route("[controller]")]
public sealed class Demo1Controller : ControllerBase
{
    [HttpGet]
    public ActionResult Index(string value)
    {
        if (value == "ok")
        {
            return Ok("pass");
        }
        return BadRequest();
    }
}
```

Do not forget to add `builder.Services.AddControllers()` and `app.MapControllers()` where applicable.

The implementation is ready and fits all the requirements. Maybe just commit & push now? It shouldn’t be that easy, you think something is wrong. We exposed our “business logic” to user facing endpoint. What if we need to test it, or re-use it from some other place in the code. Well, as of now there’s not a such requirement, but you feel like one day there will be someone asking you to re-use that implementation, and you will be thankful that you already have split the implementation away. All the thoughts going on your head, you decided to _encapsulate_ the implementation into another class you called `ValueChecker`.

```csharp
public sealed class ValueChecker
{
    public bool TestValue(string value)
    {
        return value == "ok";
    }
}

public static class Demo2ServiceExtensions
{
    public static IServiceCollection AddDemo2Services(this IServiceCollection services)
    {
        services.AddSingleton<ValueChecker>();
        return services;
    }
}
```

And you modify the controller to call `ValueChecker.TestValue` method instead:

```csharp
[ApiController, Route("[controller]")]
public sealed class Demo2Controller : ControllerBase
{
    private readonly ValueChecker _valueChecker;

    public Demo2Controller(ValueChecker valueChecker)
    {
        _valueChecker = valueChecker;
    }

    [HttpGet]
    public ActionResult Index(string value)
    {
        if (_valueChecker.TestValue(value))
        {
            return Ok("pass");
        }
        return BadRequest();
    }
}
```

You were ready to send your changes for review. But wait! Now you are exposing your implementation (`ValueChecker`) to the API users which is just you by the way, you are solo developing the project. With a few last minute changes you write an interface for better maintainability.

```csharp
public interface IValueChecker
{
    bool TestValue(string value);
}

public sealed class ValueChecker : IValueChecker {
...
```

Writing the interface you wonder if the user requesting the feature would change their mind and come up with a different idea one day. Maybe they will ask you to only check if the vale is empty or null instead of checking for the exact value of `"ok"`.

You came up with this brilliant design:

```csharp
public interface IValueChecker
{
    bool TestValue(string value);
}

public sealed class OkValueChecker : IValueChecker
{
    public bool TestValue(string value)
    {
        return value == "ok";
    }
}

public sealed class NonEmptyValueChecker : IValueChecker
{
    public bool TestValue(string value)
    {
        return !string.IsNullOrEmpty(value);
    }
}

public enum ValueCheckerType
{
    Ok,
    NonEmpty
}

public static class Demo3ServiceExtensions
{
    public static IServiceCollection AddDemo3Services(this IServiceCollection services, ValueCheckerType valueCheckerType)
    {
        switch (valueCheckerType)
        {
            case ValueCheckerType.Ok:
                services.AddSingleton<IValueChecker, OkValueChecker>();
                break;
            case ValueCheckerType.NonEmpty:
                services.AddSingleton<IValueChecker, NonEmptyValueChecker>();
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(valueCheckerType), valueCheckerType, null);
        }
        return services;
    }
}
```

That way when user asks for such a change, you can just modify a single line in your `Program.cs` file to `builder.Services.AddDemo3Services(ValueCheckerType.NonEmpty);` and publish the changes.

Eh, why go through all the pain of releasing a new version? Just read the value from configuration.

```csharp
public static class Demo3ServiceExtensions
{
    public static IServiceCollection AddDemo3Services(this IServiceCollection services, IConfiguration configuration)
    {
        return AddDemo3Services(services, configuration.GetValue<ValueCheckerType>("ValueChecker"));
    }
    
    public static IServiceCollection AddDemo3Services(this IServiceCollection services, ValueCheckerType valueCheckerType)
    {
        switch (valueCheckerType)
...
```

# The Next Day

You open up your machine to start working. First you go through your emails and unread messages. All looks fine. Then out of nowhere you feel [that damn ringtone](https://www.youtube.com/watch?v=qHOjMgcBjJA). It’s your colleague who asked for the feature you wrote yesterday. She says that there was some misunderstanding on the requirements she sent earlier, and what she actually wants is an endpoint to check if 2 values are equal to each other. She gives you a few samples and quickly hangs up to join another call.

You open up Visual Studio, after waiting up a few seconds for your project to load it crashes unexpectedly. You restart the IDE and it now seems fine. You remember all the wonderful abstractions you’ve created yesterday. You are feeling the pain of having to scrap them away since most of it is now useless & does not suit the new requirements. The logic you’ve added for reading custom testing methods from configuration, separating implementation away and all is for no use. Also you noticed that  you never called the new method you’ve added for reading configuration, so it uses an hardcoded value on production right now.

Keeping some of the logic around you remove most of the implementation. Despite the defeat, you still feel the motivation within yourself, and get back to designing another masterpiece.

Aha, you can use a [factory](https://themisir.com/design-patterns-with-examples-facory-pattern/) to construct a value checker instance which then you can use for testing given values.

First modifying the original implementation to accept another value to match with the input:

```csharp
public sealed class ValueChecker : IValueChecker
{
    private readonly string _otherValue;

    public ValueChecker(string otherValue)
    {
        _otherValue = otherValue;
    }

    public bool TestValue(string value)
    {
        return value == _otherValue;
    }
}
```

Then a factory to instantiate checkers:

```csharp
public sealed class ValueCheckerFactory
{
    public IValueChecker CreateChecker(string otherValue)
    {
        return new ValueChecker(otherValue);
    }
}

public static class Demo4ServiceExtensions
{
    public static IServiceCollection AddDemo4Services(this IServiceCollection services)
    {
        services.AddSingleton<ValueCheckerFactory>();
        return services;
    }
}
```

Modify your controller to inject the factory instead of a `IValueChecker` instance and you’re good to go:

```csharp
[ApiController, Route("[controller]")]
public sealed class Demo4Controller : ControllerBase
{
    private readonly ValueCheckerFactory _valueCheckerFactory;

    public Demo4Controller(ValueCheckerFactory valueCheckerFactory)
    {
        _valueCheckerFactory = valueCheckerFactory;
    }

    [HttpGet]
    public ActionResult Index(string value, string other)
    {
        if (_valueCheckerFactory.CreateChecker(other).TestValue(value))
        {
            return Ok("pass");
        }
        return BadRequest();
    }
}
```

Reflecting your previous choices, you realize that the implementation probably won’t be used anywhere else in near future and the requirements are not stable either. You decide to abandon all the `IValueChecker` business, but you still resist putting the logic within the controller itself.

# Middleware

You remember writing out some middleware to show off to your colleagues back in days. Maybe it is the time you can put that skills in a good use.

However, you don’t want to just create a middleware. It is not really straightforward to use. The fact that you have to plug middleware in somewhere along with the application configuration  (Program.cs or Startup.cs usually), means your implementation logic will become obscure, looking at the bare minimum method won’t make any sense when in fact all the implementation would lie in somewhere within `MyDearMiddleware` class. You have read statement by statement to understand what is going with the code. Also it is not easy to plug in a middleware to a specific endpoint in ASP.NET Core. It is possible, but not straightforward (to some degree).

Wouldn’t it be cool to just mark your methods with some sort of marker, attribute to do certain checks. Similar to adding `[Authorize]` to the actions you wish to be authorized [^authorize].

[^authorize]: [Microsoft Learn - Simple Auhorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/simple)

## Action filters

You can use action filters to create similar attributes! As easy as this:

```csharp
[AttributeUsage(AttributeTargets.Method)]
public sealed class ValueCheckerFilter : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var value = context.HttpContext.Request.Query["value"];
        var otherValue = context.HttpContext.Request.Query["other"];

        if (!value.Equals(otherValue))
        {
            context.Result = new BadRequestResult();
        }
    }
}
```

And just slap that `[ValueCheckerFilter]` attribute to the methods you want to run this filter on.

```csharp
[ApiController, Route("[controller]")]
public sealed class Demo5Controller : ControllerBase
{
    [HttpGet]
    [ValueCheckerFilter]
    public ActionResult Index()
    {
        return Ok();
    }
}
```

It still looks magical, but it is at least coupled with the call sites, you can find implementation without looking for clues.

### Just one more abstraction, bro

At this point there’s only one logical next step. Obviously the next step is putting the logic within the attribute declaration like: `[RequestFilter((HttpContext ctx) => ctx.Request.Query["value"] == ctx.Request.Query["other"]]`

It’s pity that we would get the following error if we try that: `Attribute constructor parameter 'predicate' has type 'System.Func<..>', which is not a valid attribute parameter type`

Looks like we can not use managed values (functions which are delegates which are objects which are managed by the language runtime) as attribute parameters [^attributes]. That’s pity.

[^attributes]: You can actually use some managed values, but not all of them, here’s more details: [C# Language Specs > Attribute Parameter Types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/attributes#2224-attribute-parameter-types)

Surely there’s a way around this! Who says we have to use function literals / delegates. We can just put our custom logic as a string parameter!

```csharp
[RequestFilter("""ctx.Request.Query["value"] == ctx.Request.Query["other"]"""]
```

Look how gorgeous this looks! So nice, so clean, so DRY!

![Jeremy Clarkson - Sometimes my genius is almost frightening](https://kagi.com/proxy/jeremy-clarkson-sometimes-my-genius.gif?c=j-qdscrRQkqr2zJA-q2ha-gD4Fvhsb2Msq1TEIvpZB1GcY7O2KPVUK_ztwj_wCgQhIcBQrqbfsMO_YcXnAPgNct0j5FBToZpp3cC6_MtJg6zfaf-ss8swRm8s7f3hL9N)

Now we need to find a way to compile this string into a managed function which we can call. I have done my homework and created the implementation for you! https://github.com/themisir/cursed-dry/blob/main/src/DryApi/Demo6/RequestFilter.cs

I won’t go in depth to explain the code as it would become boring real quick. We just use some `Microsoft.CodeAnalysis.CSharp` Roslyn package to parse the assembly, compile the parse tree while “linking” it with some other assemblies (like `Microsoft.AspNetCore.Http.Abstraction.dll` and its references), and then use some reflection to get a reference to the compiled function and call it. It’s not important for you to understand it however I appreciate if you did!

It’s completely unnecessary (just like the trouble & time I took to create this blog post?).

---

After all these, the feature we’ve been trying to implement got cancelled. Management decided to outsource all the requirements of the project to a new tool they have purchased.

Now our new quest is finding interesting ways to manage the newly purchased tool’s configuration files which are in YAML format, but some parts use TOML sprinkled with some inline JSON bits. You check out existing declarative solutions for generating configuration files from smaller configuration files. After a week of learning, trial & error, you give up and try out writing a few bash scripts using combination of `jq`, `awk`, `yq`, `grep` pipes. It works, but now nobody understands how it does.

You give up and write a small javascript script which turns into a project on its own with multiple layers and half a gig of `node_modules`. At least now you can validate and generate type definitions of different models at the same time!