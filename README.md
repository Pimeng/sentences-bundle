# 腾讯云 EdgeOne Pages Functions 部署说明

本项目基于 [hitokoto-osc/sentences-bundle](https://github.com/hitokoto-osc/sentences-bundle) 构建，已适配为 [腾讯云 EdgeOne Pages Functions](https://cloud.tencent.com/document/product/1552/127416) 项目，提供随机一言、分类列表和批量获取等 API 接口。

## 项目结构

```
edge-functions/
├── api/
│   ├── random.js          # GET /api/random       随机获取一言
│   ├── sentences.js       # GET /api/sentences    按分类和数量获取一言
│   └── categories.js      # GET /api/categories   获取一言分类列表
├── lib/
│   ├── data.js            # 数据加载模块
│   ├── utils.js           # 工具函数
│   └── data/              # 一言数据（由 JSON 转换而来）
```

## API 接口

### 1. 随机获取一言

```
GET /api/random
GET /api/random?category=a
```

- `category`（可选）：分类 key，如 `a`（动画）、`b`（漫画）等。不填则从所有分类中随机。

**响应示例：**
```json
{
  "id": 1,
  "uuid": "9818ecda-9cbf-4f2a-9af8-8136ef39cfcd",
  "hitokoto": "与众不同的生活方式很累人呢，因为找不到借口。",
  "type": "a",
  "from": "幸运星",
  "from_who": null,
  "length": 22
}
```

### 2. 获取一言分类列表

```
GET /api/categories
```

**响应示例：**
```json
{
  "categories": [
    { "id": 1, "name": "动画", "desc": "Anime - 动画", "key": "a", "count": 1446 },
    ...
  ]
}
```

### 3. 按分类和数量获取一言

```
GET /api/sentences?category=a&num=10
```

- `category`（可选）：分类 key。不填则从所有分类中抽取。
- `num`（可选）：获取数量，默认 `10`，最大 `100`。

**响应示例：**
```json
{
  "count": 10,
  "sentences": [
    { "id": 1, "uuid": "...", "hitokoto": "...", "type": "a", "from": "...", "from_who": null, "length": 22 },
    ...
  ]
}
```

## 部署步骤

1. 登录 [腾讯云 EdgeOne Pages](https://console.cloud.tencent.com/edgeone/pages) 控制台。
2. 创建新项目，导入本 Git 仓库。
3. 构建配置保持默认即可（EdgeOne Pages Functions 会自动识别 `edge-functions` 目录）。
4. 部署完成后，即可通过分配的域名访问上述 API。

## 本地数据更新

如果更新了 `sentences/` 或 `categories.json` 中的原始数据，请运行以下命令重新生成 Edge Functions 可用的 JS 模块：

```bash
node build-edge-functions.js
```

## 分类 Key 对照表

| Key | 名称 |
|-----|------|
| a | 动画 |
| b | 漫画 |
| c | 游戏 |
| d | 文学 |
| e | 原创 |
| f | 网络 |
| g | 其他 |
| h | 影视 |
| i | 诗词 |
| j | 网易云 |
| k | 哲学 |
| l | 抖机灵 |
