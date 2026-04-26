using DUMCJAA.Domain.Entities;
using DUMCJAA.Domain.Interfaces;
using DUMCJAA.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using DUMCJAA.Domain.Common;
using System.Security.Cryptography;

namespace DUMCJAA.Infrastructure.Services;

public class OTPService : IOTPService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private const int MaxAttempts = 5;
    private const int ExpiryMinutes = 5;

    public OTPService(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<string> GenerateOTPAsync(Guid userId, OTPType type)
    {
        // 1. Generate 6-digit code
        var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();

        // 2. Hash the code for storage
        var codeHash = _passwordHasher.HashPassword(code);

        // 3. Deactivate any existing unused OTPs for this user of the SAME type
        var existingOtps = await _context.OTPVerifications
            .Where(o => o.UserId == userId && o.Type == type && !o.IsUsed)
            .ToListAsync();
        
        foreach(var otp in existingOtps) otp.IsUsed = true;

        // 4. Save new OTP
        var otpVerification = new OTPVerification
        {
            UserId = userId,
            CodeHash = codeHash,
            Type = type,
            ExpiryTime = DateTime.UtcNow.AddMinutes(ExpiryMinutes),
            IsUsed = false,
            AttemptCount = 0
        };

        _context.OTPVerifications.Add(otpVerification);
        await _context.SaveChangesAsync();

        return code;
    }

    public async Task<bool> VerifyOTPAsync(Guid userId, string code, OTPType type)
    {
        var otp = await _context.OTPVerifications
            .Where(o => o.UserId == userId && o.Type == type && !o.IsUsed && o.ExpiryTime > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otp == null) return false;

        if (otp.AttemptCount >= MaxAttempts)
        {
            otp.IsUsed = true;
            await _context.SaveChangesAsync();
            return false;
        }

        bool isValid = _passwordHasher.VerifyPassword(code, otp.CodeHash);

        if (isValid)
        {
            otp.IsUsed = true;
        }
        else
        {
            otp.AttemptCount++;
        }

        await _context.SaveChangesAsync();
        return isValid;
    }
}
