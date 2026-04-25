namespace DUMCJAA.Infrastructure.Email;

public class EmailSettings
{
    public string Provider { get; set; } = "GmailSmtp";
    public GmailSettings Gmail { get; set; } = new();
}

public class GmailSettings
{
    public string Host { get; set; } = "smtp.gmail.com";
    public int Port { get; set; } = 587;
    public string Email { get; set; } = string.Empty;
    public string AppPassword { get; set; } = string.Empty;
    public string SenderName { get; set; } = "DUMCJAA Alumni";
}
