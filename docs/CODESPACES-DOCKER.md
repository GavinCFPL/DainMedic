# Codespaces 一键 Docker 启动

本项目已配置 Dev Container 与 Docker Compose，可在 GitHub Codespaces 中一键拉起前后端。

## 一键启动（推荐）

1. 打开仓库 → Code → Create codespace on main（或选择带有本改动的分支）
2. 等待 Dev Container 构建完成。postCreateCommand 会自动执行：
   ```bash
   docker compose up -d --build
   ```
3. 打开 Ports 面板：
   - 8000 → FastAPI 后端
   - 4173 → 前端（Vite 预览）
4. 点击 4173 端口的 “Open in Browser” 即可访问前端；前端通过容器内服务名 `backend` 访问后端：
   ```
   VITE_API_BASE_URL=http://backend:8000
   ```

## 手动控制（如需重建或调试）

```bash
# 在仓库根目录
docker compose up -d --build        # 构建并后台启动
docker compose logs -f backend      # 查看后端日志
docker compose logs -f frontend     # 查看前端日志
docker compose down                 # 停止并移除容器
```

## 数据与环境

- 产物持久化目录（bind mount）：`backend/app/data/artifacts`
- 环境变量：
  ```bash
  cp backend/.env.example backend/.env
  # 如需启用外部服务再填入对应密钥，默认使用内置兜底方案
  ```

## 端口与 CORS

Codespaces 端口均为 HTTPS 预览域名。后端默认允许跨域，若你收紧 CORS，请将 Codespaces 预览域加入白名单。

## 常见问题

- 首次构建较慢：前端依赖与 RDKit 安装会拉取较多内容；后续构建会缓存。
- 前端无法访问后端：确认 `VITE_API_BASE_URL=http://backend:8000` 已注入（compose 中已设置）。
