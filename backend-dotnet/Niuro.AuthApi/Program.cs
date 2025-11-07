using Niuro.AuthApi;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

// CORS con credenciales (localhost puertos de front)
var origins = new[] { "http://localhost:3000", "http://localhost:4200", "http://localhost:4300" };
builder.Services.AddCors(o => o.AddPolicy("dev", p => p
    .WithOrigins(origins).AllowAnyMethod().AllowAnyHeader().AllowCredentials()));

var app = builder.Build();
app.UseCors("dev");

const string CookieName = "niuro_session";

// Sesiones en memoria
var sessions = new Dictionary<string, object>(); // sessionId -> user payload
string NewSessionId() => Convert.ToHexString(RandomNumberGenerator.GetBytes(16));

app.MapPost("/auth/login/next", (LoginNext req, HttpContext ctx) =>
{
    if (string.IsNullOrWhiteSpace(req.phone) || req.otp != "123456") return Results.Unauthorized();

    var sid = NewSessionId();
    sessions[sid] = new { role = "user", phone = req.phone, name = "User Demo" };

    ctx.Response.Cookies.Append(CookieName, sid, new CookieOptions {
        HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax, Path="/"
    });
    return Results.Ok(new { ok = true });
});

app.MapPost("/auth/login/admin", (LoginAdmin req, HttpContext ctx) =>
{
    if (req.email != "admin@demo.com" || req.password != "admin123") return Results.Unauthorized();

    var sid = NewSessionId();
    sessions[sid] = new { role = "admin", email = req.email, name = "Alice Admin" };

    ctx.Response.Cookies.Append(CookieName, sid, new CookieOptions {
        HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax, Path="/"
    });
    return Results.Ok(new { ok = true });
});

app.MapGet("/auth/me", (HttpContext ctx) =>
{
    if (!ctx.Request.Cookies.TryGetValue(CookieName, out var sid)) return Results.Unauthorized();
    if (!sessions.TryGetValue(sid!, out var user)) return Results.Unauthorized();
    return Results.Ok(user);
});

app.MapPost("/auth/logout", (HttpContext ctx) =>
{
    if (ctx.Request.Cookies.TryGetValue(CookieName, out var sid)) sessions.Remove(sid!);
    ctx.Response.Cookies.Delete(CookieName, new CookieOptions { Path="/" });
    return Results.Ok(new { ok = true });
});

app.Run();
