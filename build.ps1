If (Test-Path docs) { Remove-Item -Path docs -Recurse }
npm run build
Move-Item -Path build -Destination docs
Get-ChildItem -Path docs -Recurse | Where-Object {
    -Not $_.PSIsContainer
} | ForEach-Object {
    $path = $_.FullName
    (Get-Content -Path $path -Encoding UTF8 -Raw) `
        -Replace '="/','="/bookmark/' `
        -Replace ': "/',': "/bookmark/' | Out-File -FilePath $path -Encoding UTF8 -NoNewline
}