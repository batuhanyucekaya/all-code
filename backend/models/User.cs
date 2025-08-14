namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Şifre hash olarak saklanacak
        public string FullName { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
    }
}
