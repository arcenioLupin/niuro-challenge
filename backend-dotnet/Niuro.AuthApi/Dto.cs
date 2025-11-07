namespace Niuro.AuthApi;

public record LoginNext(string phone, string otp);
public record LoginAdmin(string email, string password);
