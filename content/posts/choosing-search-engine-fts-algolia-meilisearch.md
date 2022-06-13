---
title: Improving Search with Fuzziness
date: 2021-05-10T17:22:00
tags:
  - engineering
images:
  - https://images.unsplash.com/photo-1534278854415-5c9afbb021a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDExfHxzZWFyY2h8ZW58MHx8fHwxNjIwNjM3NjQw&ixlib=rb-1.2.1&q=80&w=2000
---

As a software engineer at marketplace startup, one day I had to add search functionality to the app. Actually I have already planned how could I set-up search from the beginning. I was using PostgreSQL for storing most of the product related data. And I was aware of [full text search](https://www.postgresql.org/docs/current/textsearch.html) (FTS) feature of PostgreSQL. So I thought I'll just setup Postgres FTS and it'll just work.

## PostgreSQL Full Text Search

But things usually doesn't goes as planned. I did a few days of research about Postgres FTS, learned some basics, read some articles and thought that I was ready to implement it. Then I created GIN/GiST indexes for searchable columns. And only then I found out that Postgres FTS will not solve my problem. It was just a bit advanced form of doing `SELECT * FROM users WHERE name ILIKE '%search%'`. The feature I need was called: **fuzzy matching** or **fuzzy search** or **[approximate string search](https://en.wikipedia.org/wiki/Approximate_string_matching)**. After surfing some time on google I found out some articles about doing fuzzy search on PostgreSQL.

## PostgreSQL Fuzzy Search

Surprisingly PostgreSQL has some extensions for doing fuzzy text matching too. And I tried some of them. Firstly I tried doing fuzzy matching using `pg_trgm` extension. It adds some functions to PostgreSQL for doing fuzzy matching using trigrams. The queries using trigrams was like that:

```sql
SELECT *
FROM products
WHERE SIMILARITY(name, 'Sauce') > 0.3;
```

But picking a sweet spot sensitivity for the algorithm did not go well for me, it either returned a lot of false positive results or didn't returned expected ones. So I tried other extensions like `fuzzystrmatch` and [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm. But things go worse as I spent more time on. The queries started to take longer and longer as the data increases. We are building marketplace for grocery stores. Each store had a catalog of somewhat _20 to 30k_ products and updated regularly. So doing all the heavy computation on real time - during querying the data, had time complexity issues. Because all the computation has to run for all of the rows. Even if I limit query result, it has to run on all rows in order to order relevant results on top of less relevant ones. So I give up on using PostgreSQL. _Anyways you can read more about Fuzzy Matching on PostgreSQL on [this freeCodeCamp article](https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql/)._

At the beginning I already know that there's some tools for doing text searching like: ElasticSearch, Lucene, etc. I just wanted to use PostgreSQL to do the search because the tools I listed had so much features which I did not wanted to spend my time on learning them. Also elastic search is resource heavy application - so it was another treat for continuous "Out of Memory" errors for our cluster. I already had OOM issues and did not wanted to make it worse. So I wanted to pick a tool that would not use too much resources.

## Algolia

After getting lots of complaints about increased false positive results from PostgreSQL fuzzy matching, I looked for alternatives that I can switch within short period of time. I already seen Algolia on some websites when surfing on WWW. So I wanted to give it a try. I really liked its documentation and it had libraries for most of the popular languages and frameworks. After migrating search from PostgreSQL fuzzy search to Algolia it become a bit faster and easier to manage. The implementation went to just 2 lines:

```csharp
public async Task<List<ProductIndexItem>> SearchAsync(string query)
{
    SearchResponse<ProductIndexItem> response = await Index.SearchAsync<ProductIndexItem>(new Query(query));
    return response.Hits;
}
```

An actual code from our legacy backend used for searching products

As you can see the method doesn't returns an actual Product list, instead of `ProductIndexItem` (I'm horrible at naming things) which is just a model contains product id and searchable details like `Name` and `Categories`.

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

I stored name in 3 different properties because our backend supported storing products in multiple languages. And by storing them on different fields I will be able to filter searches by languages in future if I ever need, but I did not needed that feature anyways. Anyways the problem with this modeling is it actually did not contained required meta data for products like its price, which stores it was available, inventory details (stock availability) etc... I didn't wanted to store them on search index because this details are updated regularly, and Algolia costs money for each re-indexing request.

Other than that, I choose that way because I was planning to migrate to hosted search engine solution in future. And I wouldn't want to re-index data so often to increase performance. Also storing price data in search index is against "best practices" of microservices design. And I was also planning to re-architecture backend from monolith into microservices. So I ended up using algolia for about a year. It somewhat worked for us. Not really good or bad. But it reduced complaints about the search engine so I can spend my time on other parts of the software.

## Moving to hosted solution

Even if algolia worked enough for us, I wanted to use some hosted service for search indexing. I do not like being limited by services I use for core features and search is one of them. But to host search service I had an obvious issue: which service should I host? Maybe I should build my own search engine so I could customize it even more. I started researching about exists solutions. I really did not wanted to use ElasticSearch - the popular solution for search engines which is also suggested by my friends and colleagues.  Because it's resource heavy and requires special maintenance, learning, etc...

While doing my research I saw a project on my GitHub recommendations list: [@valeriansaliou/sonic](https://github.com/valeriansaliou/sonic). It was what I was looking for. It was slim, does not consumes lots of resources and it was written in rust - a modern and faster programming language. I was very hyped up and wanted to try it as soon as possible. The server setup process was very straightforward. I was already familiar with rust tooling. So I pulled the repository and run `cargo build --release`. And it just worked as expected. I exported some portion of the data from our database and fed it to sonic. It was doing exactly what I was looking for. During that time I was working on splitting our monolith into multiple microservices. Implemented sonic into our catalog service and suddenly things started to break. It was not directly related to sonic itself but its dotnet implementation. The dotnet implementation was not supporting latest protocol version of sonic which I was using. It was not a big issue actually, there was just a bit of changes, so I went to [fix it](https://github.com/spikensbror-dotnet/nsonic/pull/1). But later on some other issues also popped on. My hype on sonic was gone after those issues. I wanted to re-implementing sonic protocol myself but for some reasons (I don't remember the exact reason) I didn't.

I also tried to write my own "search engine" implementation for catalog search. It was very simple service which firstly optimized search query by splitting it into words, normalized it by removing any additional symbols and looped over the entires and tried fuzzy matching texts with the search query. Since I was writing it myself I had a chance to modify fuzzy matching logic to improve matching for previously most searched queries. I kinda nailed it. But I was not confident enough to put it into production or even test with a large dataset. Also all of the data was indexed into memory, so no disk caching. I built it to use in case of we could not found any alternative to current solution.

### MeiliSearch

And later on while watching endless stream of youtube recommendations I saw [a video](https://youtu.be/W2Z7fbCLSTw?t=439) about database paradigms, on the "search databases" section there was a bit of information about [MeiliSearch](https://www.meilisearch.com/) project. I checked Meili and found out that it was another lightweight search engine built with rust just like sonic. And also it has a REST api for querying and managing indexes unlike sonic which had its own protocol for communication. It was well documentation and had API implementations for most of the popular languages, including .NET. After learning more about MeiliSearch and completing my incomplete tasks I worked on implementing MeiliSearch to our catalog service. Not a surprise that, the .NET library was not up to date with the latest MeiliSearch version. So I went to GitHub and tried to fix it. After a bit digging I found out that there was some more features that also has to be implemented. I implemented them all twice (because first one was gone due to some github bot thought it would be good idea to force-push my fork to sync with base branch, and it ripped of all of my work, anyways that was a chance to improve my previously written code). After all I implemented MeiliSearch to our catalog service and migrated to production on March 2021. After that the complaints against search service was decreased so much. And more importantly it just works. I do not have to regularly maintain it, configure, fix errors, etc... I setup a cron job which updates indexes a few times a day to keep up to date with updated database.