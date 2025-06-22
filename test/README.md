# 翻译服务测试指南

这个项目包含了全面的测试套件来验证翻译服务的功能和性能。

## 测试类型

### 1. 单元测试 (`npm test`)
运行基础的功能测试，包括：
- 基础翻译功能
- 批量翻译
- 缓存机制
- 错误处理
- 边界测试

```bash
npm test
# 或
pnpm test
```

### 2. 性能测试 (`npm run test:performance`)
详细的性能分析，包括：
- 单个文本翻译性能
- 批量翻译效率
- 混合语言处理
- 缓存加速效果
- 并发vs串行对比
- 大批量翻译测试

```bash
npm run test:performance
# 或
pnpm test:performance
```

### 3. 基准测试 (`npm run test:benchmark`)
不同场景下的性能基准测试：
- 不同批量大小的效率对比
- 特殊字符处理
- 长文本处理
- 重复文本优化
- 缓存效率分析

```bash
npm run test:benchmark
# 或
pnpm test:benchmark
```

### 4. 压力测试 (`npm run test:stress`)
高并发场景下的稳定性测试：
- 多并发请求处理
- 内存使用监控
- 错误率统计
- 系统稳定性验证

```bash
npm run test:stress
# 或
pnpm test:stress
```

### 5. 完整测试套件 (`npm run test:all`)
运行所有测试（除了压力测试）：

```bash
npm run test:all
# 或
pnpm test:all
```

## 文件结构

```
test/
├── index.test.ts          # 主要的vitest单元测试
├── simple.test.ts         # 简化的vitest测试
├── final.test.ts          # 最终验证的vitest测试
├── performance-script.ts  # 性能分析脚本（非vitest）
├── benchmark-script.ts    # 基准测试脚本（非vitest）
├── stress-script.ts       # 压力测试脚本（非vitest）
├── diagnose-script.ts     # 诊断脚本（非vitest）
├── debug-empty-script.ts  # 空输入调试脚本（非vitest）
├── filter-test.js         # 过滤逻辑测试脚本
└── README.md              # 本文档
```

## 配置文件

- `vitest.config.ts`: vitest配置，只运行 `.test.ts` 文件，忽略 `-script.ts` 文件
- `package.json`: 包含所有测试脚本的命令

## 测试结果说明

### 性能指标
- **响应时间**: 单次翻译请求的耗时
- **吞吐量**: 每秒能处理的翻译请求数
- **缓存命中率**: 缓存加速的效果
- **并发效率**: 并行处理相比串行的性能提升

### 成功标准
- ✅ 翻译准确性: 基本翻译结果正确
- ✅ 批量处理: 能正确处理多个文本
- ✅ 缓存功能: 重复翻译显著加快
- ✅ 错误处理: 优雅处理异常情况
- ✅ 性能表现: 满足预期的响应时间

## 注意事项

1. **网络依赖**: 测试需要访问翻译服务API，确保网络连通性
2. **API限制**: 某些翻译服务可能有频率限制
3. **结果变化**: 翻译结果可能因服务更新而略有不同
4. **性能波动**: 网络状况会影响性能测试结果
5. **文件分类**: 只有 `.test.ts` 文件会被vitest运行，`-script.ts` 文件是独立脚本

## 故障排除

### 测试失败常见原因
1. **网络问题**: 无法访问翻译服务
2. **API限制**: 超出服务使用限制
3. **服务不可用**: 翻译服务临时故障
4. **配置问题**: vitest配置文件问题

### 解决方案
1. 检查网络连接
2. 等待一段时间后重试
3. 检查翻译服务状态
4. 调整测试并发数和频率
5. 检查 `vitest.config.ts` 配置
