using DUMCJAA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DUMCJAA.Infrastructure.Persistence.Configurations;

public class OTPVerificationConfiguration : IEntityTypeConfiguration<OTPVerification>
{
    public void Configure(EntityTypeBuilder<OTPVerification> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.CodeHash)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasOne(o => o.User)
            .WithMany(u => u.OTPVerifications)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Index for faster lookups by User and Expiry
        builder.HasIndex(o => new { o.UserId, o.IsUsed, o.ExpiryTime });
    }
}
