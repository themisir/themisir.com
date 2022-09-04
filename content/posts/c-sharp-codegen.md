---
title: "Writing C# Source Generator"
date: 2022-09-04T16:33:34+04:00
tags:
  - engineering
  - csharp
images:
  - https://images.unsplash.com/photo-1643114823006-a0fd52f70670?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1828&q=80
---

First and foremost I want to write quick disclaimer before you start reading the article. The reason I wanted to write such article is that becuase as of writing this article there was not much of resources available on the internet to cover the subject. For some reason Microsoft lately decided that it's *good* idea to write blog posts instead of proper documentation for the new features they've introducing. So I wanted to share my findings to let other devs save up some time. But for no means I don't have deep knowledge of this subject. I might have gone thru some "hacky" workarounds in some cases that could have been written much better. I will try to update this article as I learn more *efficient* ways of doing things explained in this article. 

## Why would you need to use Source Generator?

Last week I was writing a binary serialization utility for converting runtime objects into binary format that can be efficiently serialized and deserialized. The serializer itself is composed of 2 parts. Binary encoder, writer or whatever you call it, that provides API to write primitives like byte, int, string to the buffer using methods like: `encoder.WriteUInt64(value)`. It's simple and straightforward. And the second part is the object serializer that maps fields of runtime objects into corresponding encoder method and writes its data to the buffer using that method. Here's what it looks like:

```csharp
public sealed class Customer
{
  public string Name { get; set; }
  public int Age { get; set; }
  public ulong RegisteredAt { get; set; }
}

public sealed class Serializer {
  public void SerializeCustomer(ref BinaryEncoder encoder, Customer customer)
  {
    encoder.WriteString(customer.Name);
    encoder.WriteInt32(customer.Age);
    encoder.WriteUInt64(customer.ReigsteredAt);
  }
}
```

As you can see there's nothing complex happening here. It's just 1:1 mapping of properties to corresponding `Write___` methods. It will quickly become boring to write all those serializer implementation for each object type if you need to serialize lots of different object. You will have to write all the boilerplate one by one manually. So I decided to spend days to automate this instead of spending a few hours to write all of this manually.

> There's actually other *good* reasons to automate this kind of stuff aside from the boredom part.
>
> - It will be much easier to introduce new object types and use them with the serializer in future
> - You can and most probably will mess up when copy pasting from somewhere when writing boilerplate manually.
> - It's just fun! And a good weekend activity.

To automate the above process I decided to try out new C# feature introduced with C# 9: "Source Code Generators". Source generators (or just "codegen" if you fancy) is a metaprogramming pattern that's been there for a long time in other programming languages.

# Getting Started with C# source generators

To get started with C# source generators first create an empty class library project. And add the following references to the project:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.2.0" />
  <PackageReference Include="Microsoft.CodeAnalysis.Analyzers" Version="3.3.3" PrivateAssets="all" />
</ItemGroup>
```

The next step is to create a class for our generator code. The class should implement `ISourceGenerator` interface and be annotated with the `[Generator]` attribute:

```csharp
[Generator]
public sealed class SampleSourceGenerator : ISourceGenerator
{
  public void Initialize(GeneratorInitializationContext context)
  {
    //
  }
  
  public void Execute(GeneratorExecutionContext context)
  {
    context.AddSource("Example.g.cs",
                      @"public static class Example {
    											public static int Value = 42;
    									}");
  }
}
```

As you can see source generator interface contains 2 methods. I'm not entirely sure but I guess the `Initialize` method is executed when compiler starts to parse the source code and after parsing and resolving is done the `Execute` method will be called. We are going to write most of our generator logic inside `Execute` method which accepts `GeneratorExecutionContext` as an argument. Execution context contains all the needed information about the parsed source code and utilities for injecting source code and providing diagnostics messages.

To test our generator let's create a sample console app project. Then reference newly created generator project:

```xml
<ItemGroup>
  <ProjectReference Include="..\Sample.Generator\Sample.Generator.csproj"
                    OutputItemType="Analyzer"
                    ReferenceOutputAssembly="false" />
</ItemGroup>
```

After compiling sample project you can reference the code we dynamically injected using source generator. Try accessing `Example.Value` to see that in effect.

That's the bare minimum for writing source generator. But what you can do with it doesn't end here. C# source generator is more than just a simple codegenerator, it also lets you access to parsed syntax tree of the project, so you can precudially generate code based on existing code.

# Accessing to source code with Syntax receivers

Let's say for example you want to get list of classes that's been annotated with a specific attribute. In my use case I wanted to get list of classes that has `[Message]` attribute. Then I'll use that list to generate specific serialization code for each message type.

Let's first implement a `ISyntaxReceiver` interface. The bellow implementation will store all class declarations that have attribute named "Message" or "MessageAttribute".

```csharp
public sealed class SampleSyntaxReceiver : ISyntaxReceiver
{
    public List<TypeDeclarationSyntax> MessageTypes { get; } = new();

    public void OnVisitSyntaxNode(SyntaxNode syntaxNode)
    {
        if (syntaxNode is TypeDeclarationSyntax typeDeclarationSyntax)
        {
            foreach (var attributeList in typeDeclarationSyntax.AttributeLists)
            {
                foreach (var attribute in attributeList.Attributes)
                {
                    var name = attribute.Name.ToString();

                    switch (name)
                    {
                        case "Message":
                        case "MessageAttribute":
                            MessageTypes.Add(typeDeclarationSyntax);
                            break;
                    }
                }
            }
        }
    }
}
```

To use the following syntax receiver we need to register it on the `Initialize` method of the source generator context:

```csharp
public void Initialize(GeneratorInitializationContext context)
{
  context.RegisterForSyntaxNotifications(() => new SampleSyntaxReceiver());
}
```

To access list of messages from generator's Execute method you can do the following:

```csharp
public void Execute(GeneratorExecutionContext context)
{
  if (context.SyntaxReceiver is SampleSyntaxReceiver receiver)
  {
    context.AddSource("Example.g.cs",
                      $@"public static class Example {
                          public static const string Messages =
                          	"{string.Join(' ', from t in receiver.MessageTypes select t.Name)}";   
                        }");
  }
}
```

# What is Syntax nodes and Symbols?

Understanding difference between syntax nodes and symbols is a bit tricky when working with C# analyzers. Let's first take a look into syntax nodes. To simply take syntax nodes are just C# parse tree nodes. It's tree representation of the source code. The tricky part is that symbols are also looks like syntax tree nodes. It has similar tree structure and represents source code. But the difference is that identifiers on syntax nodes are not resolved, meaning you can't directly access properties of the certain identifiers. For example take a look at the following code:

```csharp
interface IHandler {
  void Handle();
}

class MyHandler : IHandler {
  public void Handle() {}
}
```

If we find syntax node for `MyClass` declaration we can see that the class does implements a type called `IHandler` but to get more details about the type we will either need to scan syntax tree ourselves and find type with same name. To help with that C# analyzer API provides certain symbols. For example if we can find matching `ITypeSymbol` for `MyHandler` declaration node we can directly access type details for the implemented interfaces.

To resolve a matching symbol for certain syntax node you'll need `GeneratorExecutionContext` from syntax generator's Execute method.

```csharp
TypeDeclarationSyntax typeNode;

var semanticModel = context.Compilation.GetSemanticModel(typeNode.SyntaxTree);
if (semanticModel.GetDeclaredSymbol(typeNode) is ITypeSymbol typeSymbol)
{
  // typeSymbol.Interfaces = [IHandler]
}
```

### Bonus: Get element type symbol from array `ITypeSymbol`

If you ever need to get element type of an array type symbol (eg: to get type symbol for `byte` from `[]byte` type symbol), first try casting type symbol into `IArrayTypeSymbol` and then you can get element type from `IArrayTypeSymbol.ElementType` property:

```csharp
if (typeSymbol is IArrayTypeSymbol { Rank: 1 } arrayTypeSymbol)
{
  elementType = arrayTypeSymbol.ElementType;
}
```

# Debugging C# source generators

When developing source generators another sturggle I had is debugging the generators themselves. Because those generators were ran during compilation you can't debug it like casual C# projects. So we have to somehow attach our debugger into compiler process. But at this stage we'll have to pay the price of writing good performing code. The problem is the generator will run so fast that you won't have enough time to attach debugger to the compiler. Or even if you get lucky a few times, it will be very annoying to do it consistently. So when researching possible options I came across a nice workaround.

The trick is actually pretty simple. You just wait until the debugger is attached.

```csharp
public void Execute(GeneratorExecutionContext context)
{
#if DEBUG_GENERATOR
	while (!System.Diagnostics.Debugger.IsAttached)
    Thread.Sleep(500);
#endif
  
  // the rest is your imagination...
}
```

To make sure I can toggle debugging I added an `#if DEBUG_GENERATOR`  macro. When I need to attach debugger I just add a line on top of the file:

```csharp
#define DEBUG_GENERATOR
```

After adding this piece of code, just compile your project as usual and you'll see that compiler will hang at some point, it's becaue of our sleep loop. At that point you can attach debugger to the active `cscript` process.

Source: https://nicksnettravels.builttoroam.com/debug-code-gen/

# Diagnostics

Sometimes we might want to provide some diagnostics feedback to the developer to let them know when things aren't going as expected. As mentioned earlier the context provided on `Execute` method does provides needed utility for logging diagnostic messages using `context.ReportDiagnostic(Diagnostic.Create(descriptor, location, ...args))` method. The diagnostic entity requires diagnostic descriptor which contains stuff like message, message type, title, diagnostic code, help link and other stuff, optional location to pinpoint exact location of the issue on the source code, and optional arguments for descriptor (works same way as `string.Format` args). 

To keep things clean I would suggest storing diagnostic descriptors on a separate static class like this:

```csharp
internal static class DiagnosticDescriptors
{
    public static readonly DiagnosticDescriptor FailedToParseMessage = new("SAMPLE001",
        "Message parser failed",
        "Failed to parse message type '{0}'.", "Parser", DiagnosticSeverity.Error, true);
}
```

To report a diagnostic message just call `ReportDiagnostic` with all the needed parameters:

```csharp
context.ReportDiagnostic(Diagnostic.Create(
  Descriptors.FailedToParseMessage,
  typeNode.GetLocation(), // You can use GetLocation method on syntax nodes to pinpoint certain elements
  messageType.ToDisplayString())); // Argument will be used to format descriptor message
```

# Bonus: Generating source code

First of all DO use `StringBuilder` if you are going to build source code procedurally. Because concatenating strings using `+` operator will cause unnecessary memory allocations and will put some pressure on the garbage collector. This might not seem like a big deal, and indeed it's not. It's just waste of resources and possibly time depending on generator and project scale.

One think I always wanted when writing source generators was to using templating engine to generate source code. I thought something like razor pages would be so cool to use with source generators. So instead of writing:

```csharp
var sb = new StringBuilder();
sb.AppendFormat("public {0}partial class {1} {\n", isSealed ? "sealed " : "", className);
sb.AppendLine("  public const int Version = 5;");
sb.AppendLine("}");
```

.. i could write much more readible and maintainable templates like:

```razor
public @(Model.IsSealed ? "sealed" : "")partial class @Model.ClassName {
	public const int Version = 5;
}
```

I didn't wanted to use razor pages because runtime compiling razor pages is kind of overwhelming, so I wanted something lightweight. For a moment I even thought about writing another source generator for a custom templating language to write templates and generate template builder procedurally. Then I decided to do some research to see if there's any preexisting solution for that problem, and indeed there was - T4 text templates. And it's kind of built-in feature of .NET. What a shame I haven't heard of it in a long time. Better late than never I guess... Anyway, I ended up using T4 templates to generate source code which made maintiaining templates much more efficent and less painful.

You can read more about T4 templates here: https://docs.microsoft.com/en-us/visualstudio/modeling/code-generation-and-t4-text-templates

To get started with T4 templates add the following package reference if the IDE won't add it automatically otherwise the project won't compile:

```csharp
<PackageReference Include="System.CodeDom" Version="6.0.0" />
```

Then create a file with `.tt` extension (or choose runtime T4 template option from new item dialog). The above template can be written like this in that template file:

```csharp
<#@ template language="C#" #>

public <#= Model.IsSealed ? "sealed " : "" #>partial class <#= Model.ClassName #> {
  public const int Version = 5;
}
```

To inject parameters into the template create a partial class with the same name as the template file. For example if you created `Example.tt` the partial class should be called `Example`. In that class you can define properties that will be visible from the template:

```csharp
public partial class Example
{
    public Example(ClassModel model)
    {
        Model = model;
    }

    public ClassModel Model { get; }
}
```

To execute the following template you need to instantiate template class and call `TransformText` method on the instance like:

```csharp
var example = new Example(classModel);

string source = example.TransformText();
```

# Conclusion

That's it! I hope this article will cover some edge cases or poorly documented parts of writing source generators. This article definitely isn't beginner friendly, if you're looking for a step by step guide I would suggest checking out other articles or official documentation. However this article might help you when you want to do something kind of extraordinary. When I wrote my first source generator finding a decent resource to get answers for my questions was really struggling. Official documentation didn't covered most of the edge cases and advanced use cases. Existing implementations were either too simple or too complex (with multiple layers making it hard to navigate) to find useful parts. So I decided to cover up all my findings through the journey into an article to help "future me" and othrers as well.

Also I will try to update this article as I gain more experience with the source analyzers / generators. I'm currently at the first stage of Dunning-Kruger scale for C# source analyzers, I don't know much about it to say how well I know about it.