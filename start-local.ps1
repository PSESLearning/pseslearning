param(
    [int]$Port = 5500,
    [string]$BindAddress = "http://127.0.0.1:5500/"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

try {
    $python = Get-Command python -ErrorAction Stop
} catch {
    Write-Error "Python is required to serve this site locally. Install Python and run this script again."
    exit 1
}

$url = "http://$BindAddress`:$Port/"
Write-Host "Serving PSES Learning at $url"
Write-Host "Press Ctrl+C to stop the server."

try {
    Start-Process $url | Out-Null
} catch {
    Write-Warning "Couldn't open the browser automatically. Open $url manually."
}

& $python.Source -m http.server $Port --bind $BindAddress
