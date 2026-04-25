using DUMCJAA.Domain.Common;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace DUMCJAA.Infrastructure.Email;

public class GmailSmtpProvider : IEmailProvider
{
    private readonly EmailSettings _settings;

    public GmailSmtpProvider(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public string ProviderName => "GmailSmtp";

    public async Task SendAsync(EmailMessage message)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_settings.Gmail.SenderName, _settings.Gmail.Email));
        email.To.Add(MailboxAddress.Parse(message.To));
        email.Subject = message.Subject;

        var builder = new BodyBuilder
        {
            HtmlBody = message.HtmlBody,
            TextBody = message.TextBody
        };
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(_settings.Gmail.Host, _settings.Gmail.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.Gmail.Email, _settings.Gmail.AppPassword);
            await smtp.SendAsync(email);
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}
