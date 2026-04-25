# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all projects and restore dependencies
COPY ["src/DUMCJAA.API/DUMCJAA.API.csproj", "src/DUMCJAA.API/"]
COPY ["src/DUMCJAA.Application/DUMCJAA.Application.csproj", "src/DUMCJAA.Application/"]
COPY ["src/DUMCJAA.Infrastructure/DUMCJAA.Infrastructure.csproj", "src/DUMCJAA.Infrastructure/"]
COPY ["src/DUMCJAA.Domain/DUMCJAA.Domain.csproj", "src/DUMCJAA.Domain/"]

RUN dotnet restore "src/DUMCJAA.API/DUMCJAA.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/DUMCJAA.API"
RUN dotnet build "DUMCJAA.API.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "DUMCJAA.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render uses the PORT environment variable
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "DUMCJAA.API.dll"]
