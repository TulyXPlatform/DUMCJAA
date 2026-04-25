using DUMCJAA.Domain.Common;

namespace DUMCJAA.Domain.Interfaces;

public interface IEmailService
{
    Task SendAsync(EmailMessage message);
}
