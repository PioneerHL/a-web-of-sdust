#!/bin/bash

# 波中教育集团网站启动脚本

# 检查是否已在运行相同的服务器
if pgrep -f 'python3 -m http.server 8000' > /dev/null; then
    echo "服务器已在运行中..."
    open http://localhost:8000
else
    echo "启动服务器..."
    cd "$(dirname "$0")"
    python3 -m http.server 8000 &
    sleep 2  # 等待服务器启动
    open http://localhost:8000
fi

echo "打开浏览器访问 http://localhost:8000"