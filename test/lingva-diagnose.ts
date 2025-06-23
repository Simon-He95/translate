#!/usr/bin/env tsx

/**
 * Lingva 服务诊断脚本
 * 测试不同的 Lingva 实例可用性
 */

import { fanyi as lingvaFanyi } from '../src/lingva.js'

const LINGVA_INSTANCES = [
  'https://lingva.garudalinux.org',
  'https://translate.plausibility.cloud', 
  'https://lingva.lunar.icu',
  'https://lingva.ml',
  'https://lingva.thedaviddelta.com'
]

async function testInstance(instance: string) {
  console.log(`\n🔍 测试实例: ${instance}`)
  
  try {
    const lingva = lingvaFanyi(instance)
    const start = Date.now()
    
    const result = await lingva('Hello', 'zh')
    const duration = Date.now() - start
    
    console.log(`✅ 成功: "${result.text}" (${duration}ms)`)
    return { instance, success: true, result: result.text, duration }
  } catch (error) {
    const err = error as Error
    console.log(`❌ 失败: ${err.message}`)
    return { instance, success: false, error: err.message }
  }
}

async function diagnoseAllInstances() {
  console.log('🌍 Lingva 翻译服务诊断\n')
  console.log('测试文本: "Hello" -> 中文')
  
  const results = []
  
  for (const instance of LINGVA_INSTANCES) {
    const result = await testInstance(instance)
    results.push(result)
    
    // 延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n📊 诊断结果总结:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  const working = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  if (working.length > 0) {
    console.log(`\n✅ 可用实例 (${working.length}/${results.length}):`)
    working.forEach(r => {
      console.log(`   ${r.instance} - ${r.duration}ms`)
    })
    
    // 推荐最快的实例
    const fastest = working.sort((a, b) => (a.duration || 0) - (b.duration || 0))[0]
    console.log(`\n🚀 推荐使用 (最快): ${fastest.instance}`)
  } else {
    console.log('\n❌ 没有可用的 Lingva 实例')
  }
  
  if (failed.length > 0) {
    console.log(`\n⚠️ 不可用实例 (${failed.length}/${results.length}):`)
    failed.forEach(r => {
      console.log(`   ${r.instance} - ${r.error}`)
    })
  }
  
  console.log('\n💡 建议:')
  if (working.length === 0) {
    console.log('   - Lingva 服务当前不可用，建议使用其他翻译服务')
    console.log('   - 尝试使用 MyMemory 或 Bing 作为替代')
  } else {
    console.log('   - 在代码中使用可用的实例')
    console.log('   - 考虑实现实例轮询机制')
  }
  
  return {
    total: results.length,
    working: working.length,
    failed: failed.length,
    workingInstances: working.map(r => r.instance)
  }
}

// 运行诊断
diagnoseAllInstances().catch(console.error)
