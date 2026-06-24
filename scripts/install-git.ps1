# install-git.ps1
# 데스크톱 Claude Code의 "Local 세션"은 git worktree를 쓰므로 Git for Windows가 필수입니다.
# git 없는 맨 Windows에서도 도는 PowerShell 스크립트 (bash 미사용 — bash 자체가 git에 들어있음).
# 사용: install-git.bat 더블클릭 (또는 PowerShell에서 직접 실행).

$ErrorActionPreference = 'Stop'

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[OK] $msg"   -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[!]  $msg"   -ForegroundColor Yellow }

Write-Host "================================================"
Write-Host " Git for Windows installer (Claude Code Local)" -ForegroundColor White
Write-Host "================================================"

# 1) 이미 설치돼 있는지 확인
Write-Step "Checking for an existing git installation"
$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) {
    $ver = (& git --version) 2>$null
    Write-Ok "git is already installed: $ver"
    Write-Ok "Path: $($git.Source)"
    Write-Host "`nNothing else to do. Open the Claude desktop app and start a Local session." -ForegroundColor Green
    Read-Host "`nPress Enter to close"
    exit 0
}
Write-Warn "git is not installed. Proceeding with installation."

# 2) winget 으로 설치 시도
$installed = $false
$winget = Get-Command winget -ErrorAction SilentlyContinue
if ($winget) {
    Write-Step "Installing Git.Git via winget (a UAC prompt may appear)"
    try {
        & winget install -e --id Git.Git --silent `
            --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -eq 0) { $installed = $true; Write-Ok "winget installation complete" }
        else { Write-Warn "winget exit code $LASTEXITCODE - falling back to direct download." }
    } catch {
        Write-Warn "winget install failed: $($_.Exception.Message) - falling back to direct download."
    }
} else {
    Write-Warn "winget is not available (older Windows). Falling back to direct download."
}

# 3) 폴백: git-scm.com 공식 인스톨러 직접 다운로드 후 무인 설치
if (-not $installed) {
    Write-Step "Downloading the official Git installer directly"
    # latest 릴리스로 리다이렉트되는 안정 링크
    $url = "https://github.com/git-for-windows/git/releases/latest/download/Git-64-bit.exe"
    $out = Join-Path $env:TEMP "GitForWindows-Setup.exe"
    try {
        Write-Host "Downloading... ($url)"
        # 일부 GitHub 자산 파일명이 버전을 포함해 위 링크가 404일 수 있어, API로 정확한 URL 조회
        try {
            Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
        } catch {
            Write-Warn "Default link failed - querying the latest installer URL via the GitHub API"
            $api = "https://api.github.com/repos/git-for-windows/git/releases/latest"
            $rel = Invoke-RestMethod -Uri $api -Headers @{ "User-Agent" = "claude-code-setup" }
            $asset = $rel.assets | Where-Object { $_.name -match '^Git-.*-64-bit\.exe$' } | Select-Object -First 1
            if (-not $asset) { throw "Could not find a 64-bit installer asset." }
            Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $out -UseBasicParsing
        }
        Write-Ok "Download complete: $out"

        Write-Step "Running the silent installer (a UAC prompt will appear)"
        # /VERYSILENT: 무인, /NORESTART: 재부팅 안 함
        $p = Start-Process -FilePath $out -ArgumentList "/VERYSILENT","/NORESTART","/SP-" -Wait -PassThru -Verb RunAs
        if ($p.ExitCode -eq 0) { $installed = $true; Write-Ok "Installation complete" }
        else { throw "installer exit code $($p.ExitCode)" }
    } catch {
        Write-Warn "Automatic installation failed: $($_.Exception.Message)"
        Write-Host "`nManual install: download and install from https://git-scm.com/downloads/win" -ForegroundColor Yellow
        Read-Host "`nPress Enter to close"
        exit 1
    }
}

# 4) 검증 (이 셸 PATH 에는 아직 반영 안 될 수 있으므로 표준 설치 경로도 확인)
Write-Step "Verifying the installation"
$found = Get-Command git -ErrorAction SilentlyContinue
$stdPath = Join-Path $env:ProgramFiles "Git\cmd\git.exe"
if ($found) {
    Write-Ok "git is available: $((& git --version) 2>$null)"
} elseif (Test-Path $stdPath) {
    Write-Ok "git installation confirmed: $stdPath"
    Write-Warn "It is not yet on this window's PATH (this is expected)."
} else {
    Write-Warn "Installed, but git's location could not be auto-detected. Check again after restarting."
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host " Next steps (important!)" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host " 1. Fully quit the Claude desktop app, then reopen it." -ForegroundColor White
Write-Host "    (PATH is only read at app startup; without a restart the error persists.)" -ForegroundColor Gray
Write-Host " 2. If 'git is required' still appears, reboot Windows and try again." -ForegroundColor White
Write-Host "================================================`n" -ForegroundColor Green

Read-Host "Press Enter to close"
