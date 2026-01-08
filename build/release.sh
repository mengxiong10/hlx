#!/bin/bash

# abort on errors
set -e

# === 部署配置 ===
USER="root"                   # 登录用户名
HOST="47.99.206.14"                # 服务器 IP
REMOTE_DIR="/www/wwwroot/front" # 上传目标目录
BUILD_CMD="pnpm run build"

# === 开始构建 ===
echo "🧱 构建项目..."
$BUILD_CMD

# === 检查构建结果 ===
if [ ! -d "dist" ]; then
  echo "❌ dist 文件夹不存在，构建失败"
  exit 1
fi

# === 上传文件 ===
echo "🚀 上传到服务器: $USER@$HOST:$REMOTE_DIR"
# -o StrictHostKeyChecking=no 防止交互确认
scp -o StrictHostKeyChecking=no -r dist/* "$USER@$HOST:$REMOTE_DIR/"

# === 完成提示 ===
if [ $? -eq 0 ]; then
  echo "✅ 部署完成"
else
  echo "❌ 上传失败"
  exit 1
fi

# =8&Sp0I2Sk*J
