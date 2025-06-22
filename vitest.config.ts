import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 只包含标准的测试文件
    include: [
      'test/*.test.ts',
    ],
    // 排除非vitest测试文件
    exclude: [
      'test/*-script.ts',
      'test/*.js',
      'node_modules/**',
      'dist/**',
    ],
    // 设置全局超时时间
    testTimeout: 30000,
  },
})
