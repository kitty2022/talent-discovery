@echo off
chcp 65001 >nul

echo ========================================
echo  天赋星鉴 - 启动服务
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 https://nodejs.org/
    pause
    exit /b 1
)

cd /d "%~dp0backend"
if not exist "node_modules" (
    echo [提示] 未检测到依赖，请先双击 install.bat 安装
    pause
    exit /b 1
)

echo [1/2] 启动后端服务 (端口 3001)...
start "天赋星鉴-后端" cmd /k "npx tsx src/index.ts"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端服务 (端口 3000)...
start "天赋星鉴-前端" cmd /k "npx next dev -p 3000"

echo.
echo ========================================
echo  两个服务已启动！
echo  本机访问：http://localhost:3000
echo  局域网访问：http://你的IP:3000
echo ========================================
echo  关闭服务请直接关闭两个命令行窗口
pause
