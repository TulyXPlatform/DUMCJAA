namespace DUMCJAA.Domain.Common;

public static class Permissions
{
    public const string AlumniRead = "alumni.read";
    public const string AlumniCreate = "alumni.create";
    public const string AlumniUpdate = "alumni.update";
    public const string AlumniDelete = "alumni.delete";
    
    public const string EventsCreate = "events.create";
    public const string EventsRegister = "events.register";
    public const string EventsManage = "events.manage";
    
    public const string PublicationsRead = "publications.read";
    public const string PublicationsManage = "publications.manage";
    
    public const string CareerRead = "career.read";
    public const string CareerManage = "career.manage";
    
    public const string BlogRead = "blog.read";
    public const string BlogManage = "blog.manage";
    
    public const string InquiriesRead = "inquiries.read";
    public const string InquiriesManage = "inquiries.manage";
    
    public const string UsersManage = "users.manage";
    public const string SettingsUpdate = "settings.update";

    public static List<string> All => new()
    {
        AlumniRead, AlumniCreate, AlumniUpdate, AlumniDelete,
        EventsCreate, EventsRegister, EventsManage,
        PublicationsRead, PublicationsManage,
        CareerRead, CareerManage,
        BlogRead, BlogManage,
        InquiriesRead, InquiriesManage,
        UsersManage, SettingsUpdate
    };
}
