[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string] $ResourceGroup,
    [Parameter(Mandatory)] [string] $PostgresServerName,
    [Parameter(Mandatory)] [string] $ApiWebAppName
)

$ErrorActionPreference = 'Stop'

$rawAddresses = az webapp show `
    --resource-group $ResourceGroup `
    --name $ApiWebAppName `
    --query possibleOutboundIpAddresses `
    --output tsv

if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($rawAddresses)) {
    throw "Cannot determine outbound addresses for $ApiWebAppName."
}

$addresses = $rawAddresses.Split(',', [StringSplitOptions]::RemoveEmptyEntries).Trim() | Sort-Object -Unique
$existingRules = @(az postgres flexible-server firewall-rule list `
    --resource-group $ResourceGroup `
    --name $PostgresServerName `
    --query '[].name' `
    --output tsv)

if ($LASTEXITCODE -ne 0) {
    throw "Could not list existing firewall rules on $PostgresServerName."
}

foreach ($address in $addresses) {
    $ruleName = 'hubmi-api-' + $address.Replace('.', '-')
    if ($existingRules -contains $ruleName) {
        continue
    }

    az postgres flexible-server firewall-rule create `
        --resource-group $ResourceGroup `
        --name $PostgresServerName `
        --rule-name $ruleName `
        --start-ip-address $address `
        --end-ip-address $address `
        --output none

    if ($LASTEXITCODE -ne 0) {
        throw "Could not allow outbound address $address on PostgreSQL."
    }
}

Write-Host "Allowed $($addresses.Count) possible API outbound addresses on $PostgresServerName."
