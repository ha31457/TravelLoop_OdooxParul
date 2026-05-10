using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationController(LocationService locationService) : ControllerBase
{
    [HttpGet("cities/search")]
    public async Task<IActionResult> SearchCities([FromQuery] LocationDtos.CitySearchRequestDto dto)
    {
        var result = await locationService.SearchCitiesAsync(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("cities/{cityId:guid}")]
    public async Task<IActionResult> GetCityById(Guid cityId)
    {
        var result = await locationService.GetCityByIdAsync(cityId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetAllCountries()
    {
        var result = await locationService.GetAllCountriesAsync();
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
