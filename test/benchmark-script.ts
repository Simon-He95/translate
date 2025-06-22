import translateLoader from '../src'

// 不同场景的基准测试
const BENCHMARK_SCENARIOS = {
  single: ['hello'],
  small_batch: ['hello', 'world', 'test'],
  medium_batch: Array.from({ length: 10 }, (_, i) => `test ${i + 1}`),
  large_batch: Array.from({ length: 50 }, (_, i) => `benchmark ${i + 1}`),
  mixed_languages: ['hello', '你好', 'world', '世界', 'test', '测试'],
  repeated_text: Array(5).fill('repeated text'),
  long_text: ['This is a very long sentence that contains multiple words and should test the translation service with longer content that might take more time to process and translate accurately.'],
  special_chars: ['hello@world.com', 'test#123', '$100 USD', '50% off', 'C++ programming']
}

async function runBenchmark() {
  console.log('🏃‍♂️ 翻译基准测试开始...\n')
  
  const translate = translateLoader()
  const results: Record<string, { duration: number, avgPerText: number, throughput: number }> = {}
  
  // 预热
  console.log('🔥 预热中...')
  await translate('warmup')
  
  for (const [scenario, texts] of Object.entries(BENCHMARK_SCENARIOS)) {
    console.log(`📊 测试场景: ${scenario}`)
    console.log(`   文本数量: ${texts.length}`)
    
    try {
      const start = Date.now()
      const translationResults = await translate([...texts]) // 使用副本避免缓存
      const duration = Date.now() - start
      
      const avgPerText = duration / texts.length
      const throughput = texts.length / (duration / 1000)
      
      results[scenario] = { duration, avgPerText, throughput }
      
      console.log(`   耗时: ${duration}ms`)
      console.log(`   平均每文本: ${avgPerText.toFixed(1)}ms`)
      console.log(`   吞吐量: ${throughput.toFixed(1)} 文本/秒`)
      console.log(`   结果数量: ${translationResults.length}`)
      
      // 显示前3个翻译结果
      if (translationResults.length > 0) {
        const preview = translationResults.slice(0, 3)
        console.log(`   结果预览: ${preview.join(', ')}${translationResults.length > 3 ? '...' : ''}`)
      }
      
    } catch (error) {
      console.error(`   ❌ 错误: ${error instanceof Error ? error.message : String(error)}`)
      results[scenario] = { duration: 0, avgPerText: 0, throughput: 0 }
    }
    
    console.log()
  }
  
  // 分析结果
  console.log('📈 性能分析:')
  
  // 找出最快和最慢的场景
  const validResults = Object.entries(results).filter(([_, data]) => data.duration > 0)
  
  if (validResults.length > 0) {
    const fastestScenario = validResults.reduce((a, b) => a[1].avgPerText < b[1].avgPerText ? a : b)
    const slowestScenario = validResults.reduce((a, b) => a[1].avgPerText > b[1].avgPerText ? a : b)
    const bestThroughput = validResults.reduce((a, b) => a[1].throughput > b[1].throughput ? a : b)
    
    console.log(`⚡ 最快场景: ${fastestScenario[0]} (${fastestScenario[1].avgPerText.toFixed(1)}ms/文本)`)
    console.log(`🐌 最慢场景: ${slowestScenario[0]} (${slowestScenario[1].avgPerText.toFixed(1)}ms/文本)`)
    console.log(`🚀 最高吞吐: ${bestThroughput[0]} (${bestThroughput[1].throughput.toFixed(1)} 文本/秒)`)
    
    // 批量大小效率分析
    console.log('\n📦 批量大小效率分析:')
    const batchScenarios = ['single', 'small_batch', 'medium_batch', 'large_batch']
    batchScenarios.forEach(scenario => {
      if (results[scenario] && results[scenario].duration > 0) {
        const textCount = BENCHMARK_SCENARIOS[scenario as keyof typeof BENCHMARK_SCENARIOS].length
        console.log(`   ${scenario}: ${textCount} 文本, ${results[scenario].avgPerText.toFixed(1)}ms/文本`)
      }
    })
  }
  
  console.log('\n✅ 基准测试完成!')
  return results
}

// 缓存效率测试
async function cacheEfficiencyTest() {
  console.log('💾 缓存效率测试...\n')
  
  const translate = translateLoader()
  const testText = 'cache efficiency test'
  const iterations = 10
  
  // 首次翻译
  console.log('首次翻译 (建立缓存):')
  const firstStart = Date.now()
  await translate(testText)
  const firstDuration = Date.now() - firstStart
  console.log(`  耗时: ${firstDuration}ms`)
  
  // 缓存命中测试
  console.log(`\n缓存命中测试 (${iterations} 次):`)
  const times: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now()
    await translate(testText)
    const duration = Date.now() - start
    times.push(duration)
  }
  
  const avgCacheTime = times.reduce((a, b) => a + b, 0) / times.length
  const minCacheTime = Math.min(...times)
  const maxCacheTime = Math.max(...times)
  
  console.log(`  平均耗时: ${avgCacheTime.toFixed(1)}ms`)
  console.log(`  最短耗时: ${minCacheTime}ms`)
  console.log(`  最长耗时: ${maxCacheTime}ms`)
  console.log(`  缓存加速比: ${(firstDuration / avgCacheTime).toFixed(1)}x`)
  console.log(`  效率提升: ${((firstDuration - avgCacheTime) / firstDuration * 100).toFixed(1)}%`)
}

// 主函数
async function main() {
  try {
    await runBenchmark()
    console.log('\n' + '='.repeat(50))
    await cacheEfficiencyTest()
  } catch (error) {
    console.error('基准测试失败:', error instanceof Error ? error.message : String(error))
  }
}

main().catch(console.error)
