namespace backend.Models
{
    public class CommentRequest
    {
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string Body { get; set; } = string.Empty;
    }
}
