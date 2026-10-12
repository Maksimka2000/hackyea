[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string] $ResourceGroup,
    [Parameter(Mandatory)] [string] $PostgresServerName,
    [Parameter(Mandatory)] [string] $ApiWebAppName,
    [switch] $IncludePossibleOutboundIps
)

$ErrorActionPreference = 'Stop'
$addressProperty = if ($IncludePossibleOutboundIps) { 'possibleOutboundIpAddresses' } else { 'outboundIpAddresses' }

$rawAddresses = az webapp show `
    --resource-group $ResourceGroup `
    --name $ApiWebAppName `
    --query $addressProperty `
    --output tsv

if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($rawAddresses)) {
    throw "Cannot determine outbound addresses for $ApiWebAppName."
}

$addresses = @($rawAddresses.Split(',', [StringSplitOptions]::RemoveEmptyEntries).Trim() | Sort-Object -Unique)
Write-Host "Found $($addresses.Count) $addressProperty for $ApiWebAppName."
$existingRules = @(az postgres flexible-server firewall-rule list `
    --resource-group $ResourceGroup `
    --name $PostgresServerName `
    --query '[].name' `
    --output tsv)

if ($LASTEXITCODE -ne 0) {
    throw "Could not list existing firewall rules on $PostgresServerName."
}

for ($index = 0; $index -lt $addresses.Count; $index++) {
    $address = $addresses[$index]
    $ruleName = 'hubmi-api-' + $address.Replace('.', '-')
    if ($existingRules -contains $ruleName) {
        Write-Host "[$($index + 1)/$($addresses.Count)] Already allowed: $address"
        continue
    }

    Write-Host "[$($index + 1)/$($addresses.Count)] Allowing: $address"
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

Write-Host "Allowed all $($addresses.Count) selected API outbound addresses on $PostgresServerName."
