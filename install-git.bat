@echo off
REM ============================================================
REM  Git for Windows 설치 도우미 (더블클릭 실행)
REM  데스크톱 Claude Code의 "Local 세션"은 git 이 필수입니다.
REM  bash 가 아니라 .bat 인 이유: 맨 Windows 에는 bash 가 없습니다(bash 는 git 에 들어있음).
REM  실제 로직은 scripts\install-git.ps1 에 있습니다.
REM ============================================================
title Git installer - Claude Code Local

echo.
echo  Starting Git for Windows installation...
echo  (If a UAC admin prompt appears, click "Yes".)
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\install-git.ps1"

REM PowerShell 자체가 막힌 환경 대비: 종료코드 확인
if errorlevel 1 (
  echo.
  echo  [!] The script did not finish successfully.
  echo      Manual install: https://git-scm.com/downloads/win
  echo.
  pause
)
