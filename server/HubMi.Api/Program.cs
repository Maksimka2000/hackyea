using HubMi.Api.DependencyInjection;
using HubMi.Api.Extensions;
using HubMi.Features.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices();
builder.Services.AddFeatureServices();

var app = builder.Build();

app.UseApiPipeline();

app.Run();
