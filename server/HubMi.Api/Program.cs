using HubMi.Api.Configuration;
using HubMi.Api.DependencyInjection;
using HubMi.Api.Extensions;
using HubMi.Features.DependencyInjection;
using HubMi.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddSearchConfiguration();

builder.Services.AddApiServices();
builder.Services.AddSwaggerDocs();
builder.Services.AddMatchingOptions(builder.Configuration);
builder.Services.AddMatchRateLimiting(builder.Configuration);
builder.Services.AddFeatureServices();
builder.Services.AddPersistence(builder.Configuration);

var app = builder.Build();

app.UseApiPipeline();

app.Run();
