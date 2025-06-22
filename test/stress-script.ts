import translateLoader from '../src'

// 压力测试配置
const STRESS_TEST_CONFIG = {
  concurrent: 50,      // 并发数量
  iterations: 100,     // 每个并发的迭代次数
  timeout: 30000       // 超时时间 (30秒)
}

async function stressTest() {
  console.log('💪 翻译服务压力测试开始...')
  console.log(`配置: ${STRESS_TEST_CONFIG.concurrent} 并发 × ${STRESS_TEST_CONFIG.iterations} 迭代\n`)
  
  const translate = translateLoader()
  
  // 测试数据
  const testTexts = [
    'stress test 1',
    'stress test 2', 
    'stress test 3',
    'pressure testing',
    'load testing',
    '压力测试',
    '负载测试',
    'performance evaluation'
  ]
  
  let totalRequests = 0
  let successCount = 0
  let errorCount = 0
  const startTime = Date.now()
  
  // 创建并发任务
  const tasks = Array.from({ length: STRESS_TEST_CONFIG.concurrent }, async (_, workerIndex) => {
    for (let i = 0; i < STRESS_TEST_CONFIG.iterations; i++) {
      try {
        totalRequests++
        const text = testTexts[Math.floor(Math.random() * testTexts.length)]
        const result = await translate(text)
        
        if (result && result.length > 0) {
          successCount++
        } else {
          errorCount++
        }
        
        // 每10次输出一次进度
        if ((i + 1) % 10 === 0) {
          console.log(`Worker ${workerIndex + 1}: ${i + 1}/${STRESS_TEST_CONFIG.iterations} completed`)
        }
        
      } catch (error) {
        errorCount++
        console.error(`Worker ${workerIndex + 1} Error:`, error instanceof Error ? error.message : String(error))
      }
    }
  })
  
  try {
    // 执行所有任务，设置超时
    await Promise.race([
      Promise.all(tasks),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Stress test timeout')), STRESS_TEST_CONFIG.timeout)
      )
    ])
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    // 输出结果
    console.log('\n📊 压力测试结果:')
    console.log(`总耗时: ${duration}ms (${(duration / 1000).toFixed(2)}s)`)
    console.log(`总请求数: ${totalRequests}`)
    console.log(`成功请求: ${successCount}`)
    console.log(`失败请求: ${errorCount}`)
    console.log(`成功率: ${((successCount / totalRequests) * 100).toFixed(2)}%`)
    console.log(`平均响应时间: ${(duration / totalRequests).toFixed(2)}ms`)
    console.log(`吞吐量: ${(totalRequests / (duration / 1000)).toFixed(2)} 请求/秒`)
    
    if (errorCount > 0) {
      console.log(`⚠️  检测到 ${errorCount} 个错误，请检查服务稳定性`)
    } else {
      console.log('✅ 所有请求均成功完成！')
    }
    
  } catch (error) {
    console.error('❌ 压力测试失败:', error instanceof Error ? error.message : String(error))
    console.log(`在 ${Date.now() - startTime}ms 内处理了 ${successCount} 个成功请求`)
  }
}

// 内存使用监控
function monitorMemory() {
  const used = process.memoryUsage()
  console.log('\n💾 内存使用情况:')
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key as keyof typeof used] / 1024 / 1024 * 100) / 100} MB`)
  }
}

// 执行压力测试
async function main() {
  console.log('开始内存监控...')
  monitorMemory()
  
  await stressTest()
  
  console.log('\n测试完成后内存使用:')
  monitorMemory()
}

main().catch(console.error)
