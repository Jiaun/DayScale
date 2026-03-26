# Local-First Sync Architecture

## 目标

本项目当前采用本地优先模式：

- 日常使用默认离线
- 商品数据先写入本地 `IndexedDB`
- 用户在有网络时手动触发同步
- 服务端负责跨设备备份与恢复

这份文档是后续“本地数据同步到服务端，再同步到另一台设备”的开发基线。

## 当前技术落点

前端本地存储：

- `Dexie`
- `dexie-react-hooks`
- 当前本地库文件：[src/lib/local-db.ts](/Users/jiaunun/Desktop/DayScale/src/lib/local-db.ts)

前端动态数据层：

- [src/lib/app-data.ts](/Users/jiaunun/Desktop/DayScale/src/lib/app-data.ts)

计算逻辑：

- [src/lib/expense-metrics.ts](/Users/jiaunun/Desktop/DayScale/src/lib/expense-metrics.ts)

服务端数据库：

- 当前保留 MySQL / Prisma 接线：[src/db.ts](/Users/jiaunun/Desktop/DayScale/src/db.ts)
- 现阶段不直接参与商品读取写入
- 后续只作为云端备份与同步目标

## 当前实现结论

当前版本已经支持：

- 商品本地 CRUD
- 本地图像 Data URL 保存
- 本地统计、排行、通知、详情扩展实时计算
- 空库安全

当前版本还不支持：

- 跨设备同步
- 服务端增量同步
- 冲突合并
- 图片云端存储

原因很简单：

- `IndexedDB` 只属于当前设备、当前浏览器
- 登录同一个账号不会自动共享浏览器本地库

因此，后续必须引入“手动同步到服务端”的能力。

## 总体架构

推荐采用三层结构：

1. 本地缓存层
   使用 `Dexie`，保证离线可用与低延迟交互。

2. 云端主数据层
   使用当前 MySQL / Prisma 作为用户云端商品备份源。

3. 图片资源层
   使用对象存储，例如 S3 / OSS / COS，不直接把图片正文长期存进 MySQL。

数据流原则：

- 页面只读写本地 `Dexie`
- 同步按钮触发时，才调用服务端
- 服务端同步成功后，再把结果回写本地

## 当前本地模型

当前本地商品记录字段：

- `id`
- `categoryId`
- `name`
- `amount`
- `purchasedAt`
- `note`
- `image`
- `createdAt`
- `updatedAt`

当前 `image` 保存的是本地 `Data URL`。

这适合当前离线方案，但不适合直接做跨设备同步。

## 后续必须补充的同步字段

在本地商品表中补充以下字段：

- `userId: string`
- `serverId?: string`
- `syncStatus: 'local' | 'modified' | 'synced' | 'deleted'`
- `deletedAt?: string | null`
- `lastSyncedAt?: string | null`
- `version: number`
- `imageLocal?: string`
- `imageRemoteKey?: string | null`
- `imageRemoteUrl?: string | null`
- `imageSyncStatus: 'local' | 'uploaded' | 'synced'`

说明：

- `id`
  本地全局唯一 ID，建议直接继续用 UUID。

- `serverId`
  如果服务端主键与本地主键不同，再单独保留；如果直接复用 UUID，可不额外保留。

- `syncStatus`
  用于标识这条记录是否需要上传。

- `deletedAt`
  删除不要直接只做物理删除；同步期要先软删除，待服务端确认后再清理。

- `version`
  用于冲突控制。

- `imageLocal`
  当前本地离线预览图。

- `imageRemoteKey / imageRemoteUrl`
  同步后服务端可恢复的图片标识。

## 本地删除策略

当前商品删除是本地直接删除。

在进入同步开发后，删除策略需要改成两阶段：

1. 本地标记删除

- `syncStatus = 'deleted'`
- `deletedAt = now`

2. 服务端同步成功后，再决定是否本地物理清理

原因：

- 如果直接物理删除，本地就失去“待同步删除事件”
- 另一台设备将无法得知这条记录已删除

结论：

- 当前阶段允许直接删
- 一旦开始做同步，必须切换为软删除

## 同步时机

同步应采用手动触发，不做常驻实时同步。

推荐触发方式：

- 用户点击“立即同步”
- 用户进入设置页手动执行
- 可选：有网时提示“发现未同步数据”

不建议：

- 每次修改立即联网
- 后台长连接同步

这不符合本项目“多数时间离线”的产品前提。

## 同步流程

一次完整同步包含两步：

### 第一步：上传本地变更

上传顺序：

1. 先上传待同步图片
2. 再上传商品新增/修改/删除

规则：

- `syncStatus = 'local'`
  视为本地新增，上传创建

- `syncStatus = 'modified'`
  视为本地修改，上传更新

- `syncStatus = 'deleted'`
  视为本地删除，上传删除

图片处理：

1. 如果存在 `imageLocal` 且 `imageSyncStatus !== 'synced'`
2. 将 `Data URL` 转成 `Blob`
3. 上传到对象存储
4. 获取 `imageRemoteKey` / `imageRemoteUrl`
5. 回写本地记录
6. 再提交商品记录同步

### 第二步：拉取服务端最新数据

拉取策略二选一：

- 初期直接全量拉取
- 稳定后升级为按 `updatedAt` 增量拉取

拉取后：

- 以服务端返回结果回写本地 Dexie
- 清理已同步状态
- 对已确认删除的数据执行本地清理

## 冲突处理策略

第一版建议采用简单规则：

- 同一条记录，如果本地与服务端都改过
- 以 `updatedAt` 更晚的一方为准
- 如时间相同，以服务端为准

这叫“最后修改覆盖”。

优点：

- 实现简单
- 足够适合个人消费记录场景

如果后面有多人共享或复杂协作，再升级成更细的冲突策略。

## 服务端接口建议

推荐至少提供以下接口：

### 1. 获取同步状态

`GET /api/sync/status`

返回：

- 最近一次服务端同步时间
- 当前用户是否有云端数据

### 2. 上传图片

`POST /api/sync/assets`

请求：

- 图片二进制文件
- `clientId`

返回：

- `assetKey`
- `assetUrl`

### 3. 推送本地变更

`POST /api/sync/push`

请求体建议：

```json
{
  "clientId": "device-browser-id",
  "lastSyncedAt": "2026-03-26T10:00:00.000Z",
  "records": [
    {
      "id": "uuid",
      "syncStatus": "local",
      "version": 3,
      "updatedAt": "2026-03-26T10:15:00.000Z",
      "deletedAt": null,
      "name": "MacBook Air M3",
      "amount": 8999,
      "purchasedAt": "2026-03-26",
      "categoryId": "digital",
      "note": "test",
      "imageRemoteKey": "asset/xxx.jpg"
    }
  ]
}
```

### 4. 拉取云端最新数据

`POST /api/sync/pull`

请求体建议：

```json
{
  "clientId": "device-browser-id",
  "since": "2026-03-26T10:00:00.000Z"
}
```

返回：

- 服务端最新商品记录
- 已删除记录 ID 列表
- `serverTime`

## 图片同步方案

当前本地图片方案：

- 浏览器通过系统相册/拍照得到文件
- 转为 `Data URL`
- 与商品一起存进 Dexie

这个方案适合离线预览，但不能作为最终跨设备传输格式长期依赖。

后续同步方案：

1. 本地继续保留 `imageLocal`
   用于离线预览。

2. 同步时把 `imageLocal` 转为 `Blob`
   上传到对象存储。

3. 服务端只保存：

- `imageRemoteKey`
- `imageRemoteUrl`

4. 新设备拉取后：

- 优先显示 `imageRemoteUrl`
- 如需要，也可首次拉图后再缓存回本地

结论：

- 当前本地保存图片是可行的
- 后续同步时不直接同步 Data URL 本身
- 应改为“上传图片文件 + 同步图片引用”

## 推荐开发顺序

按下面顺序推进，不要跳步：

1. 扩展本地商品表字段

- 增加同步字段
- 增加软删除支持
- 增加图片同步状态字段

2. 新增同步服务模块

建议新增：

- `src/lib/sync/**`

至少包含：

- `sync-types.ts`
- `sync-assets.ts`
- `sync-push.ts`
- `sync-pull.ts`
- `sync-runner.ts`

3. 新增手动同步入口

建议先放在“我的”页面。

至少展示：

- 上次同步时间
- 待同步数量
- 同步中状态
- 同步失败提示

4. 对接服务端 API

- 图片上传
- 商品 push
- 商品 pull

5. 完成冲突处理与本地状态回写

6. 最后再做“同步完成后的本地清理优化”

## 页面读写规范

后续开发必须遵循：

- 页面层只操作 `app-data.ts` / `local-db.ts` 暴露的接口
- 不允许在页面中再次直接 new 一个 Dexie 实例
- 不允许页面直接写同步逻辑
- 同步逻辑集中在 `src/lib/sync/**`

这样才能保证：

- 本地读写统一
- 服务端同步统一
- 以后切换同步策略时不需要改页面

## 当前落地约束

当前主数据源是：

- [src/lib/local-db.ts](/Users/jiaunun/Desktop/DayScale/src/lib/local-db.ts)

当前服务端数据库只保留，不直接参与前端商品读写：

- [src/db.ts](/Users/jiaunun/Desktop/DayScale/src/db.ts)

因此后续开发必须明确区分：

- `local-db.ts`
  前端离线主数据源

- `db.ts`
  后端 MySQL / Prisma 云端备份与同步目标

## 一句话结论

后续迁移能力按这套方案开发：

- 前端继续本地优先
- 用户手动同步时才联网
- 本地 Dexie 作为离线主库
- MySQL / Prisma 作为云端备份层
- 图片通过对象存储同步，不直接把本地 Data URL 当成跨设备传输格式

这套方案和当前项目技术栈兼容，且不需要推翻现有本地实现。
