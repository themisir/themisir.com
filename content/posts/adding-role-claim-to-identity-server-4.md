---
title: Role based Authorization with Identity Server 4
date: 2021-05-09T21:47:55+04:00
tags:
  - engineering
  - security
thumbnail: https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDN8fHNlY3VyaXR5fGVufDB8fHx8MTYyMDU1MjQwNw&ixlib=rb-1.2.1&q=80&w=2000
---

If you ever wanted to add multi-client authentication to your ASP.NET Core based web application, you've probably used [Identity Server 4](https://github.com/IdentityServer/IdentityServer4/) because of its popularity. It helps to manage authentication clients, resource endpoints easily. The main feature is its OAuth 2.0 implementation. So you cheat time by not implementing your own token, user info, device, and other tons of endpoints.

## The Problem

But life doesn't goes well always and some weird things happen sometimes. Like IS4 documentation doesn't contains enough information about integrating ASP.NET Core Identity's Roles into access tokens. Why would you need that? Think about that scenario. You want to limit some endpoints to your own Staff users which does have **"Staff"** role. Like ASP.NET Core docs says [here](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/roles?view=aspnetcore-5.0#adding-role-checks) you simply add Roles property to `[Authorize]` attribute. But suddenly clients with the access tokens issued by IS4 couldn't access to those endpoints.

The same thing happened to me when I wanted to make sure only some portion of users can be able to use some endpoints by implementing Role based authorization. After digging a bit deeper I found out that access tokens doesn't contains "role" claims which is required in order to use RBAC. It took many days to finally find out ways to add that claim to access tokens.

## Adding claims to IS4

Before adding role claim to access tokens, first we have to let IS4 know how to resolve "role" claims.

Identity Server resolving claims from `IProfileService` service. Which is injected to DI container when you call `services.AddAspNetIdentity<T>()` in "Startup.cs". The profile service injected by IS4 - AspNet Identity integration itself uses another service called `IClaimsPrincipalFactory` to resolve claims.

So, we either have to re-implement one of those services to add our custom claims.

I choose to extend exists class named `UserClaimsPrincipalFactory<TUser>` from [IdentityServer4.AspNetIdentity](https://www.nuget.org/packages/IdentityServer4.AspNetIdentity/?utm_source=themisir.com) package because it already contains implementation for adding default claims like sub, email, etc....

```cs
namespace App.Services
{
    public class ClaimsFactory<T> : UserClaimsPrincipalFactory<T>
      where T : IdentityUser
    {
        private readonly UserManager<AppUser> _userManager;

        public ClaimsFactory(
            UserManager<AppUser> userManager,
            IOptions<IdentityOptions> optionsAccessor) : base(userManager, optionsAccessor)
        {
            _userManager = userManager;
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(AppUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            
            identity.AddClaims(roles.Select(role => new Claim(JwtClaimTypes.Role, role)));
            
            return identity;
        }
    }
}
```

And inject our implementation to DI container.

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddClaimsPrincipalFactory<ClaimsFactory>();
}
```

## Adding Role claim to Access Tokens

### Create identity resource

I created an `IdentityResource` with name `"roles"`.

```
new IdentityResource
{
    Name = "roles",
    DisplayName = "Roles",
    UserClaims = { JwtClaimTypes.Role }
}
```

### Allow requesting roles scope by the client

Add the resource (scope) name to Client's `AllowedScopes` list.

```cs
new Client
{
    ClientId = "native",
    ClientSecrets =
    {
        new Secret("secret".Sha256()),
    },
    AllowedScopes =
    {
        LocalApi.ScopeName,
        StandardScopes.OpenId,
        StandardScopes.Profile,
        StandardScopes.Email,
        StandardScopes.Phone,
        "roles",
    },
},
```

The steps above ensures that "role" claim is added to IS4 user info endpoint. You can confirm the result by sending `GET /connect/userinfo` request.

### Add "role"  claim to access tokens

You have to update your **ApiResource**s to add additional claims to generated access tokens.

```cs
new ApiResource(
    LocalApi.ScopeName,
    "Local Api",
    new [] { JwtClaimTypes.Role }
),
```

> Previously logged-in users have to re-login to ensure access tokens are renewed in order to include `role` claims.

I would also recommend setting `UpdateAccessTokenClaimsOnRefresh` value to `true` on your client configuration to ensure that new issued access tokens will include **"role"** claim.

## Conclusion

We have updated  IProfileService to add "role" claim to IS4. Then modified our client and resource configs to allow and include the claim in access token.

That's it. I hope this article helped you.