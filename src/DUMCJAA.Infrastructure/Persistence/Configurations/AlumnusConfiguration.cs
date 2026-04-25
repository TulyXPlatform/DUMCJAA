using DUMCJAA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DUMCJAA.Infrastructure.Persistence.Configurations;

public class AlumnusConfiguration : IEntityTypeConfiguration<Alumnus>
{
    public void Configure(EntityTypeBuilder<Alumnus> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.Phone).HasMaxLength(20);
        builder.Property(x => x.Batch).HasMaxLength(50);
        builder.Property(x => x.Department).HasMaxLength(150);
        builder.Property(x => x.CurrentCompany).HasMaxLength(200);
        builder.Property(x => x.CurrentDesignation).HasMaxLength(200);
        builder.Property(x => x.ProfileImageUrl).HasMaxLength(1000);
        builder.Property(x => x.LinkedInUrl).HasMaxLength(1000);
        builder.Property(x => x.Biography).HasMaxLength(2000);

        builder.HasIndex(x => x.Email).IsUnique();
        builder.HasIndex(x => x.Batch);
        builder.HasIndex(x => x.Department);
        builder.HasIndex(x => x.IsApproved);
    }
}
