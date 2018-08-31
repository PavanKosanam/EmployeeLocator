namespace EmployeeLocator.Models
{
    public class Response
    {
        public ResponseStatus Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
    public enum ResponseStatus
    {
        SUCCESS,
        ERROR
    }
}