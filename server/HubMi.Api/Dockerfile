FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# Embedding model: pinned revisions with checksums (tools/fetch-model.sh). Debian base: ONNX Runtime needs glibc, so no Alpine.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS model
COPY tools/fetch-model.sh /tools/fetch-model.sh
RUN sh /tools/fetch-model.sh /models

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["HubMi.Api/HubMi.Api.csproj", "HubMi.Api/"]
COPY ["HubMi.Features/HubMi.Features.csproj", "HubMi.Features/"]
COPY ["HubMi.Infrastructure/HubMi.Infrastructure.csproj", "HubMi.Infrastructure/"]
COPY ["HubMi.Domain/HubMi.Domain.csproj", "HubMi.Domain/"]
RUN dotnet restore "HubMi.Api/HubMi.Api.csproj"
COPY HubMi.Api/ HubMi.Api/
COPY HubMi.Features/ HubMi.Features/
COPY HubMi.Infrastructure/ HubMi.Infrastructure/
COPY HubMi.Domain/ HubMi.Domain/
RUN dotnet publish "HubMi.Api/HubMi.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=model /models ./models
ENTRYPOINT ["dotnet", "HubMi.Api.dll"]
