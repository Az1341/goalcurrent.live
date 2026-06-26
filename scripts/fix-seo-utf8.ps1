$utf8 = New-Object System.Text.UTF8Encoding $false
$root = Split-Path -Parent $PSScriptRoot
function W([string]$path,[string]$content){ [System.IO.File]::WriteAllText($path,$content,$utf8) }
