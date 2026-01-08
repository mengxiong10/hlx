


#!/bin/bash
set -e

# ===== 配置区 =====
SERVER_USER="root"
SERVER_HOST="47.99.206.14"
DEPLOY_PATH="/www/wwwroot/front"  # ← 可修改为你需要的路径
LOCAL_BUILD_DIR="dist"             # 本地构建输出目录
ARCHIVE_NAME="deploy.tar.gz"
REMOTE_ARCHIVE_PATH="/tmp/$ARCHIVE_NAME"

# ===== 检查 dist 是否存在 =====
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "❌ 错误: 本地 $LOCAL_BUILD_DIR 目录不存在，请先运行 npm run build"
  exit 1
fi

# ===== 打包 =====
echo "📦 打包 $LOCAL_BUILD_DIR 到 $ARCHIVE_NAME..."
tar -czf "$ARCHIVE_NAME" -C "$LOCAL_BUILD_DIR" .

# ===== 上传压缩包 =====
echo "📤 上传 $ARCHIVE_NAME 到服务器 /tmp/ ..."
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  "$ARCHIVE_NAME" "${SERVER_USER}@${SERVER_HOST}:${REMOTE_ARCHIVE_PATH}"

# ===== 远程执行部署脚本 =====
echo "⚙️  在服务器上执行部署..."
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  "${SERVER_USER}@${SERVER_HOST}" \
  "DEPLOY_PATH='$DEPLOY_PATH' REMOTE_ARCHIVE_PATH='$REMOTE_ARCHIVE_PATH' bash -s" < ./build/deploy.sh

# ===== 清理本地临时文件（可选）=====
rm -f "$ARCHIVE_NAME"
echo "✅ 本地临时文件已清理"

echo "🎉 部署完成！"

# =8&Sp0I2Sk*J
