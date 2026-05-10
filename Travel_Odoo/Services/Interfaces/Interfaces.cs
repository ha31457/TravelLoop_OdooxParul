using Travel_Odoo.Models.DTOs;

namespace Travel_Odoo.Services.Interfaces;

public interface IAuthService
    {
        Task<ApiResponseDto<AuthResponseDto>> RegisterAsync(RegisterRequestDto dto);
        Task<ApiResponseDto<AuthResponseDto>> LoginAsync(LoginRequestDto dto);
        Task<ApiResponseDto<string>> ForgotPasswordAsync(ForgotPasswordRequestDto dto);
        Task<ApiResponseDto<string>> ResetPasswordAsync(ResetPasswordRequestDto dto);
        Task<ApiResponseDto<string>> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto dto);
    }

    public interface IUserService
    {
        Task<ApiResponseDto<UserProfileDto>> GetProfileAsync(Guid userId);
        Task<ApiResponseDto<UserProfileDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto dto);
        Task<ApiResponseDto<string>> DeleteAccountAsync(Guid userId);
        Task<ApiResponseDto<SavedDestinationDto>> SaveDestinationAsync(Guid userId, Guid cityId);
        Task<ApiResponseDto<string>> RemoveSavedDestinationAsync(Guid userId, Guid cityId);
        Task<ApiResponseDto<ICollection<SavedDestinationDto>>> GetSavedDestinationsAsync(Guid userId);
    }

    public interface ILocationService
    {
        Task<ApiResponseDto<PagedResultDto<LocationDtos.CityDto>>> SearchCitiesAsync(LocationDtos.CitySearchRequestDto dto);
        Task<ApiResponseDto<LocationDtos.CityDto>> GetCityByIdAsync(Guid cityId);
        Task<ApiResponseDto<ICollection<LocationDtos.CountryDto>>> GetAllCountriesAsync();
    }

    public interface IActivityService
    {
        Task<ApiResponseDto<PagedResultDto<CityActivityDto>>> SearchActivitiesAsync(ActivitySearchRequestDto dto);
        Task<ApiResponseDto<CityActivityDto>> GetActivityByIdAsync(Guid activityId);
    }

    public interface ITripService
    {
        Task<ApiResponseDto<TripDetailDto>> CreateTripAsync(Guid userId, CreateTripRequestDto dto);
        Task<ApiResponseDto<TripDetailDto>> GetTripByIdAsync(Guid userId, Guid tripId);
        Task<ApiResponseDto<PagedResultDto<TripSummaryDto>>> GetUserTripsAsync(Guid userId, int page, int pageSize);
        Task<ApiResponseDto<TripDetailDto>> UpdateTripAsync(Guid userId, Guid tripId, UpdateTripRequestDto dto);
        Task<ApiResponseDto<string>> DeleteTripAsync(Guid userId, Guid tripId);
        Task<ApiResponseDto<string>> PublishTripAsync(Guid userId, Guid tripId);
        Task<ApiResponseDto<PublicTripDto>> GetPublicTripAsync(string slug);
        Task<ApiResponseDto<TripDetailDto>> CopyTripAsync(Guid userId, string slug);
    }

    public interface ITripStopService
    {
        Task<ApiResponseDto<TripStopDto>> AddStopAsync(Guid userId, Guid tripId, CreateTripStopRequestDto dto);
        Task<ApiResponseDto<TripStopDto>> UpdateStopAsync(Guid userId, Guid tripId, Guid stopId, UpdateTripStopRequestDto dto);
        Task<ApiResponseDto<string>> DeleteStopAsync(Guid userId, Guid tripId, Guid stopId);
        Task<ApiResponseDto<string>> ReorderStopsAsync(Guid userId, Guid tripId, ReorderStopsRequestDto dto);
        Task<ApiResponseDto<StopActivityDto>> AddActivityToStopAsync(Guid userId, Guid tripId, Guid stopId, AddStopActivityRequestDto dto);
        Task<ApiResponseDto<StopActivityDto>> UpdateStopActivityAsync(Guid userId, Guid tripId, Guid stopId, Guid stopActivityId, UpdateStopActivityRequestDto dto);
        Task<ApiResponseDto<string>> RemoveActivityFromStopAsync(Guid userId, Guid tripId, Guid stopId, Guid stopActivityId);
    }

    public interface IBudgetService
    {
        Task<ApiResponseDto<BudgetSummaryDto>> GetBudgetSummaryAsync(Guid userId, Guid tripId);
        Task<ApiResponseDto<BudgetExpenseDto>> AddExpenseAsync(Guid userId, Guid tripId, CreateExpenseRequestDto dto);
        Task<ApiResponseDto<BudgetExpenseDto>> UpdateExpenseAsync(Guid userId, Guid tripId, Guid expenseId, UpdateExpenseRequestDto dto);
        Task<ApiResponseDto<string>> DeleteExpenseAsync(Guid userId, Guid tripId, Guid expenseId);
        Task<ApiResponseDto<ICollection<BudgetExpenseDto>>> GetExpensesAsync(Guid userId, Guid tripId);
    }

    public interface IPackingService
    {
        Task<ApiResponseDto<PackingChecklistDto>> GetChecklistAsync(Guid userId, Guid tripId);
        Task<ApiResponseDto<PackingItemDto>> AddItemAsync(Guid userId, Guid tripId, CreatePackingItemRequestDto dto);
        Task<ApiResponseDto<PackingItemDto>> UpdateItemAsync(Guid userId, Guid tripId, Guid itemId, UpdatePackingItemRequestDto dto);
        Task<ApiResponseDto<string>> DeleteItemAsync(Guid userId, Guid tripId, Guid itemId);
        Task<ApiResponseDto<string>> ResetChecklistAsync(Guid userId, Guid tripId);
    }

    public interface INoteService
    {
        Task<ApiResponseDto<ICollection<TripNoteDto>>> GetNotesAsync(Guid userId, Guid tripId, Guid? stopId);
        Task<ApiResponseDto<TripNoteDto>> AddNoteAsync(Guid userId, Guid tripId, CreateNoteRequestDto dto);
        Task<ApiResponseDto<TripNoteDto>> UpdateNoteAsync(Guid userId, Guid tripId, Guid noteId, UpdateNoteRequestDto dto);
        Task<ApiResponseDto<string>> DeleteNoteAsync(Guid userId, Guid tripId, Guid noteId);
    }

    public interface ISharingService
    {
        Task<ApiResponseDto<TripShareDto>> ShareTripAsync(Guid userId, Guid tripId, CreateTripShareRequestDto dto);
        Task<ApiResponseDto<string>> RevokeShareAsync(Guid userId, Guid tripId, Guid shareId);
        Task<ApiResponseDto<ICollection<TripShareDto>>> GetSharesAsync(Guid userId, Guid tripId);
    }
