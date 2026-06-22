@echo off
chcp 65001 >nul
echo ========================================
echo  天赋星鉴 - 安装依赖和初始化数据库
echo ========================================
echo.

echo [1/3] 安装后端依赖...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo 后端依赖安装失败，请检查网络后重试
    pause
    exit /b 1
)
echo 后端依赖安装完成
echo.

echo [2/3] 初始化数据库...
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo 数据库初始化失败
    pause
    exit /b 1
)
echo 数据库初始化完成
echo.

echo [3/3] 安装前端依赖...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo 前端依赖安装失败，请检查网络后重试
    pause
    exit /b 1
)
echo 前端依赖安装完成
echo.

echo ========================================
echo  安装完成！请双击 start.bat 启动服务
echo ========================================
pause
