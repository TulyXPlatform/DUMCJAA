namespace DUMCJAA.Domain.Common;

public static class Permissions
{
    public const string AlumniRead = "alumni.read";
    public const string AlumniCreate = "alumni.create";
    public const string AlumniUpdate = "alumni.update";
    public const string AlumniDelete = "alumni.delete";
    
    public const string EventsCreate = "events.create";
    public const string EventsRegister = "events.register";
    
    public const string PostsPublish = "posts.publish";
    
    public const string SettingsUpdate = "settings.update";
    
    public const string UsersManage = "users.manage";

    public static List<string> All => new()
    {
        AlumniRead, AlumniCreate, AlumniUpdate, AlumniDelete,
        EventsCreate, EventsRegister,
        PostsPublish,
        SettingsUpdate,
        UsersManage
    };
}
