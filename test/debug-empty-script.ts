import translateLoader from '../src'

async function debugEmptyInput() {
  console.log('🐛 调试空输入处理...\n')
  
  const translate = translateLoader()
  
  try {
    console.log('测试1: 空字符串')
    const result1 = await translate('')
    console.log('✅ 结果:', result1, '长度:', result1.length)
    
    console.log('\n测试2: 空数组')
    const result2 = await translate([])
    console.log('✅ 结果:', result2, '长度:', result2.length)
    
    console.log('\n测试3: 空白字符串数组')
    const result3 = await translate(['', '  ', '\n'])
    console.log('✅ 结果:', result3, '长度:', result3.length)
    
    console.log('\n测试4: 混合空白字符串')
    const result4 = await translate(['hello', '', '  ', '\n', 'world'])
    console.log('✅ 结果:', result4, '长度:', result4.length)
    
    console.log('\n🎉 所有空输入测试通过!')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    console.error('错误类型:', typeof error)
    console.error('错误消息:', error instanceof Error ? error.message : String(error))
    console.error('错误堆栈:', error instanceof Error ? error.stack : 'No stack')
  }
}

debugEmptyInput().catch(console.error)
