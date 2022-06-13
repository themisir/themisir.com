---
title: "Design Patterns with Examples #1 - The Factory Pattern"
date: 2022-06-13T04:41:45+04:00
tags:
  - engineering
thumbnail: https://images.unsplash.com/photo-1589320011103-48e428abcbae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80

---

You've probably came across a term called "Design Patters" when you were preparing for an interview or reading something CS related. It's one of the things that's so simple yet so confusing to understand unless you already know it. So it's one of the great candidates for interviewers to ask questions related to design patterns and stuff. It's also one of the things that when taught you usually try to memorize them instead of understanding the underlying abstractions and reasoning behind them. So in this article I would like to introduce you some design patterns I've seen in the wild or used personally. But before jumping right into it I wanna let you know that they are called patterns for a purpose, well they're "patterns", so instead of remembering the examples or the definitions try to understand the underlying design decisions and structure. Because in real world examples you'll come across lots of variations of well known patterns, or you might already have written some of them on your own without noticing, so remembering examples or definitions will not help you to get most out of this knowledge. So if everything to this point is alright, let's start from simpler patterns.

## The Factory Pattern

Think it as a irl factory. It has multiple different sections to prepare different stuff and in the end it puts everything together to produce a product. The factory pattern usually works the same way. First an object or interface gets fed with the requirements, then when requested it outputs requested result.

```csharp
int Add(int a, int b) {
  return a + b;
}
```

You gotta be joking, that's just a simple function - you might be saying. Yeah that's right. However it's also kind of factory pattern as well. First you provide requirements - 2 integer values, then you build the result by calling the method and it produces the result you asked for.

```csharp
// parameters, arguments, requirements or whatever you name it
int a = 3;
int b = 5;

// builder doing its own business and handing the result to you
int result = Add(a, b);
```

 Well if this code doesn't looks enterprise ready to you, let's refactor it and make it more *classy*.

```csharp
class NumberAdditionFactory {
  private int a;
  private int b;
  
  public void SetFirstValue(int val) { this.a = val; }
  public void SetSecondValue(int val) { this.b = val; }
  
  public int Build() {
    return this.a + this.b;
  }
}

var factory = new NumberAdditionFactory();

// parameters
factory.SetFirstValue(3);
factory.SetSecondValue(5);

// the result
var result = factory.Build();
```

Ok, but wtf is that? Why would anyone write a simple addition operation like this? Well the guy who's clearly obsesed with *enterprise style* coding would do it, because who cares about performance? Alright, let me show another factory example:

```csharp
class Shape {
  double a, b;
  
  public Shape(double a, double b) {
    this.a = a;
    this.b = b;
  }
  
  double GetArea() {
    return this.a * this.b;
  }
}

new Shape(4, 5).GetArea(); // 20
```

This is a regular class. A class with a constructor that we can also call a factory of the class. As you can see the constructor simply requires 2 arguments and "returns" the value - instance of `Shape` class.

> Constructor only initializes instance fields in this example, but on underlying level when you call `new` on that constructor we get instance of that class, so we can kind of assume it as a function that implicilty returns current instance of the class. However this is just for the simplification. In reality this statements does not reflects what happens under the hood.

And the class has a method called `GetArea` that returns area of the shape. In this example it just returns `a * b` which is area of a rectangle. But what if requirements changes and now your shape interface needs to support both rectangular and circular areas.

On first iteration, you declare a enum to specify shape type and use it to calculate area from provided values.

```csharp
enum ShapeType { Rectangle, Circle }

class Shape {
  ShapeType shapeType;
  double a, b;
  
  public Shape(ShapeType shapeType, double a, double b = 0) {
    this.shapeType = shapeType;
    this.a = a;
    this.b = b;
  }
  
  double GetArea() {
    switch this.shapeType {
      case ShapeType.Rectangle:
        return this.a * this.b;
        
      case ShapeType.Circle:
        var radius = this.a;
        return Math.PI * Math.Pow(radius, 2);
        
      default:
        // It's kinda good practice to panic on default case when switching on enums that all the values are handled. Because when you add a new value you might forget to implement switch branch for that value here. Unless you're writing Rust ofc ;)
        throw new NotImplementedException("screw you");
    }
  }
}

new Shape(ShapeType.Rectangle, 3, 5).GetArea(); // 15
new Shape(ShapeType.Circle, 4).GetArea(); // idk, calculate it yourself..

```

You patch it, push to prod and voila! 2 weeks passes.. For some reason some of rectanglar area calculations are returning 0. You check all the usages of Shape class and confirm that all the values are > 0. So there's no way that our `GetArea` method returns 0. Wait.. you read the constructor again and saw `double b = 0` . You did this to make sure circular areas can be constructed by providing only radius value. But a few days ago when working on a new module you forget that and wrote `new Shape(ShapeType.Rectangle, 4)` and went away to take a coffee, then wen you got back to your computer you saw that IDE doesn't shows any syntax or analysis errors, so it should be fine. You commit and push it for testing. All tests passes because who does testing with 100% coverage? ;)

Now that you see it you wish there's a way to make sure your IDE do those checks for you before the code gets into production. So you came up with more clever solution. You convert your Shape class into an interface that has a single method called, you guessed it right:  `GetArea`. And write separate implementations of that interface for different shapes:

```csharp
interface IShape {
  double GetArea();
}

// i'll use record instead of class because i felt lazy to write all the boilerplate property initialization stuff. so deal with it ;)
public record Rectangle(double Height, double Width) : IShape {
  public double GetArea() => Height * Width;
}

public record Circle(double Radius) : IShape {
  public double GetArea() => Math.PI * Math.Pow(Radius, 2);
}

new Rectangle(3, 5).GetArea(); // 15
new Rectangle(4).GetArea(); // analysis error
```

Works like a charm! Now you modify old usages and forget about this shape stuff all together. Until the day for some reason one of the clients asked for her cirlces to be red. Why? Don't ask me, ask her. But for some reason our sales team accepts that feature request and now you're supposed to have colored shapes. Alright let's modify our interface a bit:

```csharp
interface IShape {
  double GetArea();
  Color GetColor();
}

public record Rectangle(double Height, double Width, Color Color = Color.Black) : IShape {
  public double GetArea() => Height * Width;
  public Color GetColor() => Color;
}

public record Circle(double Radius, Color Color = Color.Black) : IShape {
  public double GetArea() => Math.PI * Math.Pow(Radius, 2);
  public Color GetColor() => Color;
}
```

Suddenly you realize that the `Color` struct you're using for storing color values does only support 24 bit color values. But what if another client wants those shapes to be transparent? You don't want to replace Color with some other struct because some modules depends on Color values, so instead you decide to store opacity value separately.

> In computer graphics colors are usually stored as a mix of multiple channels. On formats like PNG, BMP, JPEG each color channel is 1 byte (values ranging from 0 to 255). So a typical 32bit PNG pixel has 4 separate values: red intensity, green intensity, blue intensity and alpha - opacity.
>
> > Usually formats like PNG and JPEG doesn't directly store per pixel data. Because storing colors in that way will consume a lot of storage for high resolution images. So instead each format do use some sort of compression algorithms to reduce data needed to create finalized image and instead of soring per pixel data they might store color values on somewhere else and use pointers to refer to them.

Ok enough nerd talk. Let's get back to our shape interface and add opacity value to there:

```csharp
interface IShape {
  double GetArea();
  Color GetColor();
  byte GetOpacity();
}

public record Rectangle(double Height, double Width, Color Color = Color.Black, byte Opacity = 255) : IShape {
  public double GetArea() => Height * Width;
  public Color GetColor() => Color;
  public byte GetOpacity() => Opacity;
}

public record Circle(double Radius, Color Color = Color.Black, byte Opacity = 255) : IShape {
  public double GetArea() => Math.PI * Math.Pow(Radius, 2);
  public Color GetColor() => Color;
  public byte GetOpacity() => Opacity;
}
```

This seems fine, but there's a minor problem here. It seems like those obscure requirements going to be a lot more. And for each new requirement you're going to write a lot of duplicate stuff. So let's work on reducing duplicate code. We have `Color GetColor()` and `byte GetOpacity()` method repeated with same implementation on all `IShape` implementations. Let's use inheritance to reduce code repetition.

```csharp
interface IShape {
  double GetArea();
  Color GetColor();
  byte GetOpacity();
}

public abstract record Shape(Color Color = Color.Black, byte Opacity = 255) : IShape {
  public abstract double GetArea();
  
  public Color GetColor() => Color;
  public byte GetOpacity() => Opacity;
}

public record Rectangle(double Height, double Width, Color Color = Color.Black, byte Opacity = 255) : Shape(Color, Opacity) {
  public override double GetArea() => Height * Width;
}

public record Circle(double Radius, Color Color = Color.Black, byte Opacity = 255) : Shape(Color, Opacity) {
  public override double GetArea() => Math.PI * Math.Pow(Radius, 2);
}

new Circle(4, Opacity: 0).GetOpacity(); // 0
```

Yeah, now it looks a bit more cleaner. But now you think that those consturctors doesn't seems too well. They're a bit too long, well 4 arguments aren't that much, but in future  there might be other ton of requirements that'll require us to add additional arguments. Do you remember we were talking about factories in the beginning of this article? And I referred constructors as a "kind of" factory in one of the paragraphs. Well, let's somehow hide all the dirty stuff under a factory.

```csharp
enum ShapeType { Rectangle, Circle }

class ShapeFactory {
  private ShapeType shapeType;
  
  private Color color;
  private byte opacity;
  
  private double arg1, arg2;
  
  public ShapeFactory SetColor(Color color) {
    this.color = color;
    return this; // for ease of use we're returning current instance so we can write like factory.SetStuff().SetSomethingElse()
  }
  
  public ShapeFactory SetOpacity(byte opacity) {
    this.opacity = opacity;
    return this;
  }
  
  public ShapeFactory SetCircle(double radius) {
    this.shapeType = ShapeType.Circle;
    this.arg1 = radius;
    return this;
  }
  
  public ShapeFactory SetRectangle(double width, double height) {
    this.shapeType = ShapeType.Rectangle;
    this.arg1 = width;
    this.arg2 = height;
    return this;
  }
  
  public IShape Build() {
    switch shapeType {
      case ShapeType.Circle:
        return new Circle(arg1, color, opacity);
      
      case ShapeType.Rectangle:
        return new Rectangle(arg1, arg2, color, opacity);
        
      default:
        throw new NotImplementedException();
    }
  }
}
```

Well, just like a factory example above, this factory also exposes methods that simply initializes fields and a build method that returns some sort of result. This factory could be used like the following:

```csharp
var factory = new ShapeFactory().SetColor(Colors.Black).SetOpacity(50);

if (userRequestedForARectangle) {
  factory.SetRectangle(width, height);
} else {
  factory.SetCircle(radius);
}

var shape = factory.Build();

shape.GetArea();
```

As you can see unlike conventional constructors, factories let us to have lots of flexibility when creating objects. You can pass factory to another method that sets specific arguments and another method sets another set of arguments. Or you can clone factory and use base parameters to create 2 different results. Or you can create multiple objects from same parameter set just by calling `Build()` method multiple times.

It also doesn't falls into some issues we had earlier. For example both cirlce and rectangle has different parameter sets checked by analyzer that ensures us to not have something like  `new Shape(ShapeType.Rectangle, 4)` pushed into production. You can add new methods to interface or extend constructor with ease without having to change too much public APIs. Now you can only expose `IShape` interface publicly, make `Shape`, `Circle` and `Rectangle` classes private and encapsulate underlying logic from outside world.

> I referred. `Shape`, `Circle` and `Rectangle` as classes but declared them as records. Because records are actually a syntactic sugar over plain classes. So what you write as a record on your IDE ends up as a class when gets compiled into IL (unless you declare struct records). 

That's all I'm going to say about factory patterns. Simply they are like constructors but more flexible and extensible. They let you to expose less detail while providing more control over the implementation. But please don't create a builder for every object or entity. Use it when required and use regular functions or constructors for other cases. Android API are well known for its overuse of builder patterns, actually I think most java libraries does this for some reason.

---

This article did become longer than I expected, so I'm going to leave it here and I'll write about other patterns on upcoming articles. Thanks [@javinpaul](https://twitter.com/javinpaul/status/1536002894394056705) for the inspration to create this article (and hopefully upcoming articles as well). And thanks YOU for reading this far :)