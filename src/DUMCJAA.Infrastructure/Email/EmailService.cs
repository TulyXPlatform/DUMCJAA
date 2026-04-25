using DUMCJAA.Domain.Common;
using DUMCJAA.Domain.Interfaces;
using Microsoft.Extensions.Options;

namespace DUMCJAA.Infrastructure.Email;

public class EmailService : IEmailService
{
    private readonly IEnumerable<IEmailProvider> _providers;
    private readonly EmailSettings _settings;

    public EmailService(IEnumerable<IEmailProvider> providers, IOptions<EmailSettings> settings)
    {
        _providers = providers;
        _settings = settings.Value;
    }

    public async Task SendAsync(EmailMessage message)
    {
        var provider = _providers.FirstOrDefault(p => p.ProviderName == _settings.Provider);

        if (provider == null)
        {
            // Fallback to GmailSmtp if configured provider is not found
            provider = _providers.FirstOrDefault(p => p.ProviderName == "GmailSmtp");
        }

        if (provider == null)
        {
            throw new InvalidOperationException("No email provider configured or found.");
        }

        await provider.SendAsync(message);
    }
}
