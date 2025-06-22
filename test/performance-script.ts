import translateLoader from '../src'

async function performanceTest() {
  console.log('🚀 翻译性能测试开始...\n')
  
  const translate = translateLoader()
  
  // 测试数据
  const singleTexts = ['hello', 'world', 'test', 'example', 'performance']
  const batchTexts = ['hello world', 'good morning', 'how are you', 'nice to meet you', 'see you later']
  const mixedTexts = ['hello', '你好', 'world', '世界', 'test', '测试']
  
  // 1. 单个文本翻译性能
  console.log('📝 单个文本翻译测试:')
  for (const text of singleTexts) {
    const start = Date.now()
    const result = await translate(text)
    const duration = Date.now() - start
    console.log(`  "${text}" -> "${result[0]}" (${duration}ms)`)
  }
  
  // 2. 批量翻译性能
  console.log('\n📦 批量翻译测试:')
  const batchStart = Date.now()
  const batchResults = await translate(batchTexts)
  const batchDuration = Date.now() - batchStart
  console.log(`  批量翻译 ${batchTexts.length} 个文本: ${batchDuration}ms`)
  console.log(`  平均每个文本: ${(batchDuration / batchTexts.length).toFixed(1)}ms`)
  batchResults.forEach((result, index) => {
    console.log(`    "${batchTexts[index]}" -> "${result}"`)
  })
  
  // 3. 混合语言翻译
  console.log('\n🌏 混合语言翻译测试:')
  const mixedStart = Date.now()
  const mixedResults = await translate(mixedTexts)
  const mixedDuration = Date.now() - mixedStart
  console.log(`  混合语言翻译 ${mixedTexts.length} 个文本: ${mixedDuration}ms`)
  mixedResults.forEach((result, index) => {
    console.log(`    "${mixedTexts[index]}" -> "${result}"`)
  })
  
  // 4. 缓存性能测试
  console.log('\n💾 缓存性能测试:')
  const cacheText = 'cache performance test'
  
  // 首次翻译
  const firstStart = Date.now()
  const firstResult = await translate(cacheText)
  const firstDuration = Date.now() - firstStart
  console.log(`  首次翻译: "${cacheText}" -> "${firstResult[0]}" (${firstDuration}ms)`)
  
  // 缓存翻译
  const cacheStart = Date.now()
  const cacheResult = await translate(cacheText)
  const cacheDuration = Date.now() - cacheStart
  console.log(`  缓存翻译: "${cacheText}" -> "${cacheResult[0]}" (${cacheDuration}ms)`)
  console.log(`  缓存加速: ${((firstDuration - cacheDuration) / firstDuration * 100).toFixed(1)}%`)
  
  // 5. 并发vs串行对比测试
  console.log('\n⚡ 并发效率测试:')
  const concurrentTexts = ['concurrent1', 'concurrent2', 'concurrent3', 'concurrent4', 'concurrent5']
  
  // 并发翻译（当前实现）
  const concurrentStart = Date.now()
  const concurrentResults = await translate(concurrentTexts)
  const concurrentDuration = Date.now() - concurrentStart
  console.log(`  并发翻译: ${concurrentDuration}ms`)
  
  // 模拟串行翻译进行对比
  const serialStart = Date.now()
  const serialResults = []
  for (const text of concurrentTexts) {
    const result = await translate(text)
    serialResults.push(result[0])
  }
  const serialDuration = Date.now() - serialStart
  console.log(`  串行翻译: ${serialDuration}ms`)
  console.log(`  并发优势: ${((serialDuration - concurrentDuration) / serialDuration * 100).toFixed(1)}%`)
  
  // 6. 大批量翻译测试
  console.log('\n🏋️ 大批量翻译测试:')
  const largeBatch = Array.from({ length: 20 }, (_, i) => `batch test ${i + 1}`)
  const largeStart = Date.now()
  const largeResults = await translate(largeBatch)
  const largeDuration = Date.now() - largeStart
  console.log(`  大批量翻译 ${largeBatch.length} 个文本: ${largeDuration}ms`)
  console.log(`  平均每个文本: ${(largeDuration / largeBatch.length).toFixed(1)}ms`)
  console.log(`  吞吐量: ${(largeBatch.length / (largeDuration / 1000)).toFixed(1)} 文本/秒`)
  
  // 7. 错误恢复测试
  console.log('\n🛡️ 错误恢复测试:')
  try {
    const errorTexts = ['normal text', '', 'another normal text']
    const errorStart = Date.now()
    const errorResults = await translate(errorTexts)
    const errorDuration = Date.now() - errorStart
    console.log(`  错误恢复测试: ${errorDuration}ms`)
    console.log(`  处理结果: ${errorResults.length} 个有效翻译`)
    errorResults.forEach((result, index) => {
      if (errorTexts[index]) {
        console.log(`    "${errorTexts[index]}" -> "${result}"`)
      }
    })
  } catch (error) {
    console.log(`  错误处理: ${error instanceof Error ? error.message : String(error)}`)
  }
  
  console.log('\n✅ 性能测试完成!')
}

// 执行性能测试
performanceTest().catch(console.error)
