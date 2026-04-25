using DUMCJAA.Domain.Common;

namespace DUMCJAA.Infrastructure.Email;

public interface IEmailProvider
{
    string ProviderName { get; }
    Task SendAsync(EmailMessage message);
}
