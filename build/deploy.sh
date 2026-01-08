#!/bin/bash
set -e

# 接收从本地传入的变量（带默认值防错）
DEPLOY_PATH="${DEPLOY_PATH:-/www/wwwroot/front}"
REMOTE_ARCHIVE_PATH="${REMOTE_ARCHIVE_PATH:-/tmp/deploy.tar.gz}"

echo "🎯 部署路径: $DEPLOY_PATH"
echo "📦 压缩包位置: $REMOTE_ARCHIVE_PATH"

# 确保目标目录存在
mkdir -p "$DEPLOY_PATH"

# 安全清理旧文件（不删除目录本身）
shopt -s dotglob nullglob
cd "$DEPLOY_PATH"
rm -rf ./* ./.* 2>/dev/null || true
cd - > /dev/null

# 解压新文件
echo "📦 正在解压..."
tar -xzf "$REMOTE_ARCHIVE_PATH" -C "$DEPLOY_PATH"

# 清理服务器临时文件
rm -f "$REMOTE_ARCHIVE_PATH"
echo "🧹 已清理服务器临时文件"

echo "✅ 服务器部署成功"
