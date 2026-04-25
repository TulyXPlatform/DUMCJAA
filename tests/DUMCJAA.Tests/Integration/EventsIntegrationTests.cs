using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DUMCJAA.Tests.Integration;

public class EventsIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public EventsIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task GetAllEvents_ReturnsSuccessStatusCodeAndPagination()
    {
        // Act
        var response = await _client.GetAsync("/api/events?page=1&pageSize=10");

        // Assert
        response.EnsureSuccessStatusCode(); // Status Code 200-299
        
        var responseString = await response.Content.ReadAsStringAsync();
        
        // Assert JSON structure based on ApiResponse wrapper
        responseString.Should().Contain("\"success\":true");
        responseString.Should().Contain("\"page\":1");
        responseString.Should().Contain("\"pageSize\":10");
    }
    
    [Fact]
    public async Task CreateEvent_WithoutAuthToken_ReturnsUnauthorized()
    {
        // Arrange
        var content = new StringContent("{\"title\":\"Hacked Event\"}", System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/events", content);

        // Assert
        // The endpoint is protected by [Authorize(Roles = Admin)], so providing no token 
        // should immediately result in HTTP 401 Unauthorized from the ASP.NET Core framework.
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
