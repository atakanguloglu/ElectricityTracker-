# AI Integration Test Script
# This script tests the AI endpoints

$baseUrl = "http://localhost:5143"
$token = "your-jwt-token-here" # Replace with actual JWT token

Write-Host "Testing AI Integration..." -ForegroundColor Green

# Test 1: Test AI Connection
Write-Host "`n1. Testing AI Connection..." -ForegroundColor Yellow
$testConnectionUrl = "$baseUrl/api/admin/ai/test-connection"
$testConnectionResponse = Invoke-RestMethod -Uri $testConnectionUrl -Method POST -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -ErrorAction SilentlyContinue

if ($testConnectionResponse) {
    Write-Host "✓ AI Connection Test: $($testConnectionResponse.success)" -ForegroundColor Green
    if ($testConnectionResponse.content) {
        Write-Host "  Response: $($testConnectionResponse.content.Substring(0, [Math]::Min(100, $testConnectionResponse.content.Length)))..." -ForegroundColor Gray
    }
} else {
    Write-Host "✗ AI Connection Test Failed" -ForegroundColor Red
}

# Test 2: Chat with AI
Write-Host "`n2. Testing AI Chat..." -ForegroundColor Yellow
$chatUrl = "$baseUrl/api/ai/chat"
$chatBody = @{
    question = "Elektrik tasarrufu için en iyi 5 öneri nedir?"
} | ConvertTo-Json

$chatResponse = Invoke-RestMethod -Uri $chatUrl -Method POST -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -Body $chatBody -ErrorAction SilentlyContinue

if ($chatResponse) {
    Write-Host "✓ AI Chat Test: $($chatResponse.success)" -ForegroundColor Green
    if ($chatResponse.content) {
        Write-Host "  Response: $($chatResponse.content.Substring(0, [Math]::Min(150, $chatResponse.content.Length)))..." -ForegroundColor Gray
    }
} else {
    Write-Host "✗ AI Chat Test Failed" -ForegroundColor Red
}

# Test 3: Energy Optimization
Write-Host "`n3. Testing Energy Optimization..." -ForegroundColor Yellow
$optimizationUrl = "$baseUrl/api/ai/energy-optimization"
$optimizationBody = @{
    facilityData = "Aylık tüketim: 5000 kWh, Ekipman: Klima, Aydınlatma, Bilgisayarlar"
    facilityName = "Test Tesis"
    currentConsumption = 5000.0
} | ConvertTo-Json

$optimizationResponse = Invoke-RestMethod -Uri $optimizationUrl -Method POST -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -Body $optimizationBody -ErrorAction SilentlyContinue

if ($optimizationResponse) {
    Write-Host "✓ Energy Optimization Test: $($optimizationResponse.success)" -ForegroundColor Green
    if ($optimizationResponse.content) {
        Write-Host "  Response: $($optimizationResponse.content.Substring(0, [Math]::Min(150, $optimizationResponse.content.Length)))..." -ForegroundColor Gray
    }
} else {
    Write-Host "✗ Energy Optimization Test Failed" -ForegroundColor Red
}

Write-Host "`nAI Integration Test Completed!" -ForegroundColor Green 