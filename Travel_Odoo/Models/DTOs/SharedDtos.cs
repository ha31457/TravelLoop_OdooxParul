namespace Travel_Odoo.Models.DTOs;

public class PagedResultDto<T>
{
    public ICollection<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class ApiResponseDto<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public ICollection<string> Errors { get; set; } = new List<string>();

    public static ApiResponseDto<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponseDto<T> Fail(string error) =>
        new() { Success = false, Errors = new List<string> { error } };

    public static ApiResponseDto<T> Fail(ICollection<string> errors) =>
        new() { Success = false, Errors = errors };
}
