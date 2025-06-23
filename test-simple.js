#!/usr/bin/env node
import process from 'node:process'

// 简单的翻译测试
const { mymemoryTranslate } = require('../dist/index.js')

async function testTranslation() {
  try {
    console.log('🧪 测试 MyMemory 翻译服务...')

    const mymemory = mymemoryTranslate()
    const result = await mymemory('Hello', 'zh')
    const text = typeof result === 'string' ? result : result.text

    console.log('✅ 翻译成功:', text)
    console.log('🎉 测试通过!')
    process.exit(0)
  }
  catch (error) {
    console.error('❌ 翻译失败:', error.message)
    process.exit(1)
  }
}

testTranslation()
