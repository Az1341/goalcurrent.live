$utf8 = New-Object System.Text.UTF8Encoding $false
$root = "C:\Users\zafar\OneDrive\Desktop\goalcurrent-live-nextjs"
function W([string]$path,[string]$content){ [System.IO.File]::WriteAllText($path,$content,$utf8) }
