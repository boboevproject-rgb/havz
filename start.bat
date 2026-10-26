@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Хавз: http://localhost:8792
echo Остановить: Ctrl+C
start "" "http://localhost:8792"
python -m http.server 8792
