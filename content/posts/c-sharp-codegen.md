---
title: "Writing C# Source Generator"
date: 2022-09-04T16:33:34+04:00
tags:
  - engineering
  - csharp
images:
  - https://images.unsplash.com/photo-1643114823006-a0fd52f70670?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1828&q=80
---

fiwst and fowemost i want to wwite q-quick discwaimew b-befowe you stawt w-weading the a-awticwe. (U ﹏ U) the weason i-i wanted to w-wwite such awticwe i-is that becuase a-as of wwiting this awticwe thewe was nyot much of wesouwces avaiwabwe on the i-intewnet to covew the subject. -.- fow some weason micwosoft w-watewy decided that it's *good* idea to wwite bwog posts instead o-of pwopew documentation f-fow the n-nyew featuwes they've i-intwoducing. -.- s-so i wanted t-to shawe my findings t-to wet othew d-devs save up some time. ^^;; but fow nyo means i don't have deep knowwedge of this s-subject. >_< i might have gone thwu some "hacky" wowkawounds i-in some cases that couwd h-have been wwitten much bettew. mya i wiww twy to update this awticwe a-as i weawn mowe *efficient* ways of doing things expwained in t-this awticwe.

## why wouwd you nyeed to use souwce g-genewatow?

wast week i was wwiting a binawy s-sewiawization utiwity f-fow convewting w-wuntime objects i-into binawy f-fowmat that can b-be efficientwy s-sewiawized and desewiawized. (⑅˘꒳˘) t-the sewiawizew itsewf is composed of 2 pawts. (U ᵕ U❁) binawy encodew, -.- wwitew o-ow nyanievew you caww it, ^^;; that pwovides api to w-wwite pwimitives wike byte, >_< int, s-stwing to the buffew using methods wike: `encoder.WriteUInt64(value)`. σωσ it's simpwe and stwaightfowwawd. σωσ a-and the second p-pawt is the object s-sewiawizew that m-maps fiewds o-of wuntime objects i-into cowwesponding e-encodew method a-and wwites its data to the buffew using that method. >_< hewe's nyani it wooks w-wike:

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

as you can see thewe's nyothing compwex h-happening h-hewe. 🥺 it's just 1:1 m-mapping of p-pwopewties to cowwesponding `Write___` methods. -.- it wiww quickwy become b-bowing to wwite a-aww those sewiawizew i-impwementation f-fow each object t-type if you n-nyeed to sewiawize w-wots of diffewent o-object. (ˆ ﻌ ˆ)♡ you wiww have to wwite aww the boiwewpwate one by one manuawwy. (⑅˘꒳˘) so i-i decided to spend days to automate this instead o-of spending a few houws to wwite a-aww of this manuawwy.

> thewe's actuawwy othew *good* weasons to automate this kind of s-stuff aside fwom t-the bowedom pawt.
> - it wiww be much easiew to intwoduce n-nyew object types a-and use them w-with the sewiawizew i-in futuwe
> - you can and most pwobabwy wiww mess u-up when copy p-pasting fwom somewhewe w-when wwiting b-boiwewpwate m-manuawwy.
> - it's just fun! (ꈍᴗꈍ) and a good weekend a-activity.

to automate the above pwocess i decided t-to twy out n-nyew c# featuwe i-intwoduced with c-c# 9: "souwce c-code genewatows". σωσ s-souwce genewatows (ow j-just "codegen" i-if you fancy) is a metapwogwamming pattewn that's been thewe fow a wong time i-in othew pwogwamming wanguages.

# getting stawted with c# souwce genewatows

to get stawted with c# souwce genewatows f-fiwst cweate a-an empty cwass w-wibwawy pwoject. o.O a-and add the f-fowwowing wefewences t-to the pwoject:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.2.0" />
  <PackageReference Include="Microsoft.CodeAnalysis.Analyzers" Version="3.3.3" PrivateAssets="all" />
</ItemGroup>
```

the nyext step is to cweate a cwass f-fow ouw genewatow c-code. OwO the cwass s-shouwd impwement `ISourceGenerator` intewface and be annotated with t-the `[Generator]` attwibute:

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

as you can see souwce genewatow intewface c-contains 2 m-methods. òωó i'm n-nyot entiwewy suwe b-but i guess t-the `Initialize` method is exekawaii~d when compiwew s-stawts to pawse t-the souwce code a-and aftew pawsing a-and wesowving i-is done the `Execute` method wiww be cawwed. OwO we awe going t-to wwite most o-of ouw genewatow w-wogic inside `Execute` method which accepts `GeneratorExecutionContext` as an awgument. execution context c-contains aww the n-nyeeded infowmation a-about the p-pawsed souwce code a-and utiwities f-fow injecting s-souwce code and p-pwoviding diagnostics messages.

to test ouw genewatow wet's cweate a-a sampwe consowe a-app pwoject. òωó t-then wefewence newwy c-cweated genewatow p-pwoject:

```xml
<ItemGroup>
  <ProjectReference Include="..\Sample.Generator\Sample.Generator.csproj"
                    OutputItemType="Analyzer"
                    ReferenceOutputAssembly="false" />
</ItemGroup>
```

aftew compiwing sampwe pwoject you c-can wefewence t-the code we dynamicawwy i-injected u-using souwce genewatow. òωó t-twy accessing `Example.Value` to see that in effect.

that's the bawe minimum fow wwiting s-souwce genewatow. :3 b-but nyani you c-can do with it d-doesn't end hewe. (U ﹏ U) c-c# souwce genewatow i-is mowe t-than just a simpwe c-codegenewatow, -.- it awso wets you access to pawsed syntax twee of the pwoject, s-so you can pwecudiawwy genewate code based on existing c-code.

# accessing to souwce code with syntax w-weceivews

wet's say fow exampwe you want to g-get wist of cwasses t-that's been a-annotated with a-a specific attwibute. (⑅˘꒳˘) i-in my use c-case i wanted to g-get wist of cwasses t-that has `[Message]` attwibute. 🥺 then i'ww use that wist t-to genewate specific s-sewiawization c-code fow each m-message type.

wet's fiwst impwement a `ISyntaxReceiver` intewface. òωó the bewwow impwementation w-wiww stowe a-aww cwass decwawations t-that have a-attwibute nyamed "message" o-ow "messageattwibute".

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

to use the fowwowing syntax weceivew w-we nyeed to w-wegistew it on the `Initialize` method of the souwce genewatow context:

```csharp
public void Initialize(GeneratorInitializationContext context)
{
  context.RegisterForSyntaxNotifications(() => new SampleSyntaxReceiver());
}
```

to access wist of messages fwom genewatow's e-exekawaii~ m-method you c-can do the fowwowing:

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

# nani is syntax nyodes and symbows?

undewstanding diffewence between s-syntax nyodes and s-symbows is a bit t-twicky when wowking w-with c# anawyzews. nyaa~~ w-wet's f-fiwst take a wook i-into syntax nyodes. /(^•ω•^) t-to simpwy take syntax nyodes awe just c# pawse twee nyodes. rawr it's twee wepwesentation o-of the souwce code. OwO the twicky pawt is t-that symbows awe awso wooks wike s-syntax twee nyodes. (U ﹏ U) it has simiwaw twee stwuctuwe and wepwesents s-souwce code. >_< but the diffewence i-is that identifiews o-on syntax nyodes awe nyot wesowved, rawr x3 meaning you can't diwectwy access pwopewties o-of the cewtain identifiews. mya fow exampwe take a wook at the fowwowing code:

```csharp
interface IHandler {
  void Handle();
}

class MyHandler : IHandler {
  public void Handle() {}
}
```

if we find syntax nyode fow `MyClass` decwawation we can see that the c-cwass does impwements a-a type cawwed `IHandler` but to get mowe detaiws about the t-type we wiww eithew n-nyeed to scan s-syntax twee o-ouwsewves and find t-type with same n-nyame. rawr to hewp w-with that c# anawyzew a-api pwovides cewtain symbows. σωσ fow exampwe if we can find matching `ITypeSymbol` fow `MyHandler` decwawation nyode we can diwectwy a-access type detaiws f-fow the impwemented i-intewfaces.

to wesowve a matching symbow fow c-cewtain syntax node y-you'ww nyeed `GeneratorExecutionContext` fwom syntax genewatow's exekawaii~ m-method.

```csharp
TypeDeclarationSyntax typeNode;

var semanticModel = context.Compilation.GetSemanticModel(typeNode.SyntaxTree);
if (semanticModel.GetDeclaredSymbol(typeNode) is ITypeSymbol typeSymbol)
{
  // typeSymbol.Interfaces = [IHandler]
}
```

### bonus: get ewement type symbow fwom a-awway `ITypeSymbol`

if you evew nyeed to get ewement t-type of an awway t-type symbow (eg: t-to get type symbow f-fow `byte` fwom `[]byte` type symbow), (ꈍᴗꈍ) fiwst twy casting t-type symbow into `IArrayTypeSymbol` and then you can get ewement type f-fwom `IArrayTypeSymbol.ElementType` pwopewty:

```csharp
if (typeSymbol is IArrayTypeSymbol { Rank: 1 } arrayTypeSymbol)
{
  elementType = arrayTypeSymbol.ElementType;
}
```

# debugging c# souwce genewatows

when devewoping souwce genewatows a-anothew stuwggwe i-i had is debugging t-the genewatows t-themsewves. rawr b-because those genewatows w-wewe wan d-duwing compiwation y-you can't debug it wike casuaw c# pwojects. OwO so we have to somehow attach ouw d-debuggew into compiwew pwocess. (U ﹏ U) but at this stage w-we'ww have to pay the pwice o-of wwiting good pewfowming code. >_< the pwobwem is the genewatow wiww w-wun so fast that you won't have e-enough time to a-attach debuggew to the compiwew. rawr x3 ow even if you get wucky a few times, mya it wiww b-be vewy annoying to do it consistentwy. nyaa~~ so when weseawching possibwe options i c-came acwoss a nyice wowkawound.

the twick is actuawwy pwetty simpwe. OwO y-you just wait u-untiw the debuggew i-is attached.

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

to make suwe i can toggwe debugging i-i added an `#if DEBUG_GENERATOR`  macwo. OwO when i need to attach debuggew i-i just add a-a wine on top o-of the fiwe:

```csharp
#define DEBUG_GENERATOR
```

aftew adding this piece of code, j-just compiwe youw p-pwoject as usuaw a-and you'ww see t-that compiwew w-wiww hang at some p-point, rawr x3 it's becaue o-of ouw sweep w-woop. rawr at that point you can attach debuggew to the active `cscript` pwocess.

souwce: [https://nicksnettwavews.buiwttowoam.com/debug-code-gen/](https://nicksnettravels.builttoroam.com/debug-code-gen/)

# diagnostics

sometimes we might want to pwovide s-some diagnostics f-feedback to the d-devewopew to w-wet them know when t-things awen't g-going as expected. a-as mentioned e-eawwiew the context pwovided on `Execute` method does pwovides nyeeded utiwity f-fow wogging d-diagnostic messages u-using `context.ReportDiagnostic(Diagnostic.Create(descriptor, location, ...args))` method. (U ﹏ U) the diagnostic entity wequiwes d-diagnostic d-descwiptow which c-contains stuff w-wike message, -.- m-message type, (ˆ ﻌ ˆ)♡ titwe, d-diagnostic c-code, (⑅˘꒳˘) hewp wink a-and othew stuff, (U ᵕ U❁) optionaw wocation to pinpoint exact wocation of the issue on the s-souwce code, -.- and optionaw awguments fow descwiptow (wowks s-same way as `string.Format` awgs).

to keep things cwean i wouwd suggest s-stowing diagnostic d-descwiptows o-on a sepawate s-static cwass wike t-this:

```csharp
internal static class DiagnosticDescriptors
{
    public static readonly DiagnosticDescriptor FailedToParseMessage = new("SAMPLE001",
        "Message parser failed",
        "Failed to parse message type '{0}'.", "Parser", DiagnosticSeverity.Error, true);
}
```

to wepowt a diagnostic message just c-caww `ReportDiagnostic` with aww the nyeeded pawametews:

```csharp
context.ReportDiagnostic(Diagnostic.Create(
  Descriptors.FailedToParseMessage,
  typeNode.GetLocation(), // You can use GetLocation method on syntax nodes to pinpoint certain elements
  messageType.ToDisplayString())); // Argument will be used to format descriptor message
```

# bonus: genewating souwce code

fiwst of aww do use `StringBuilder` if you awe going to buiwd souwce c-code pwoceduwawwy. 🥺 b-because concatenating s-stwings u-using `+` opewatow wiww cause unnecessawy m-memowy awwocations a-and wiww put s-some pwessuwe on t-the gawbage cowwectow. t-this might n-nyot seem wike a-a big deaw, σωσ and i-indeed it's nyot. >_< it's just waste of wesouwces and possibwy time depending on g-genewatow and pwoject scawe.

one think i awways wanted when wwiting s-souwce genewatows w-was to using t-tempwating e-engine to genewate s-souwce code. rawr i-i thought something w-wike wazow pages w-wouwd be so coow to use with souwce genewatows. σωσ so instead of wwiting:

```csharp
var sb = new StringBuilder();
sb.AppendFormat("public {0}partial class {1} {\n", isSealed ? "sealed " : "", className);
sb.AppendLine("  public const int Version = 5;");
sb.AppendLine("}");
```

.. i couwd wwite much mowe weadibwe a-and maintainabwe t-tempwates wike:

```razor
public @(Model.IsSealed ? "sealed" : "")partial class @Model.ClassName {
	public const int Version = 5;
}
```

i didn't wanted to use wazow pages b-because wuntime c-compiwing wazow p-pages is kind o-of ovewwhewming, mya s-so i wanted something w-wightweight. f-fow a moment i-i even thought about wwiting anothew souwce genewatow fow a custom tempwating wanguage t-to wwite tempwates and genewate tempwate b-buiwdew pwoceduwawwy. nyaa~~ then i decided t-to do some weseawch to see if thewe's any pweexisting sowution f-fow that pwobwem, (⑅˘꒳˘) and indeed t-thewe was - t4 t-text tempwates. rawr x3 and it's kind of buiwt-in featuwe of .net. (✿oωo) nyani a shame i haven't h-heawd of it in a wong time. (ˆ ﻌ ˆ)♡ bettew wate than nyevew i guess... (˘ω˘) anyway, i ended u-up using t4 tempwates to genewate s-souwce code w-which made maintiaining t-tempwates m-much mowe efficent and wess painfuw.

you can wead mowe about t4 tempwates h-hewe: [https://docs.micwosoft.com/en-us/visuawstudio/modewing/code-genewation-and-t4-text-tempwates](https://docs.microsoft.com/en-us/visualstudio/modeling/code-generation-and-t4-text-templates)

to get stawted with t4 tempwates a-add the fowwowing p-package wefewence i-if the ide won't a-add it automaticawwy o-othewwise t-the pwoject w-won't compiwe:

```csharp
<PackageReference Include="System.CodeDom" Version="6.0.0" />
```

then cweate a fiwe with `.tt` extension (ow choose wuntime t4 t-tempwate option f-fwom nyew item diawog). (U ᵕ U❁) t-the above t-tempwate can be w-wwitten wike this i-in that tempwate f-fiwe:

```csharp
<#@ template language="C#" #>

public <#= Model.IsSealed ? "sealed " : "" #>partial class <#= Model.ClassName #> {
  public const int Version = 5;
}
```

to inject pawametews into the tempwate c-cweate a pawtiaw c-cwass with t-the same nyame a-as the tempwate f-fiwe. o.O fow exampwe i-if you cweated `Example.tt` the pawtiaw cwass shouwd be cawwed `Example`. OwO in that cwass you can define pwopewties t-that wiww b-be visibwe fwom t-the tempwate:

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

to exekawaii~ the fowwowing tempwate y-you nyeed to i-instantiate tempwate c-cwass and c-caww `TransformText` method on the instance wike:

```csharp
var example = new Example(classModel);

string source = example.TransformText();
```

# concwusion

that's it! 😳😳😳 i hope this awticwe wiww c-covew some edge c-cases ow poowwy d-documented pawts o-of wwiting souwce g-genewatows. 🥺 t-this awticwe definitewy i-isn't b-beginnew fwiendwy, mya if you'we wooking fow a step by step guide i wouwd suggest checking o-out othew awticwes ow officiaw documentation. 🥺 h-howevew this awticwe might h-hewp you when you want to do something kind of extwaowdinawy. >_< when i-i wwote my fiwst souwce genewatow f-finding a decent w-wesouwce to get answews fow my questions was weawwy stwuggwing. >_< officiaw documentation d-didn't covewed most of the edge cases and advanced use cases. (⑅˘꒳˘) existing i-impwementations wewe eithew t-too simpwe ow too c-compwex (with m-muwtipwe wayews m-making it hawd to nyavigate) to find usefuw pawts. /(^•ω•^) s-so i decided to covew up aww my findings thwough t-the jouwney into an awticwe to hewp "futuwe me" and othwews as weww.

awso i wiww twy to update this awticwe a-as i gain m-mowe expewience w-with the souwce a-anawyzews / genewatows. i-i'm cuwwentwy a-at the fiwst s-stage of dunning-kwugew s-scawe fow c# souwce anawyzews, σωσ i don't know much about it to say how w-weww i know about it.
