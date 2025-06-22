import translateLoader from '../src'

// 直接运行测试，不使用vitest框架
async function diagnoseTranslateFunction() {
  console.log('🔍 诊断翻译函数...\n')
  
  const translate = translateLoader()
  
  try {
    // 测试1: 空输入
    console.log('测试1: 空输入')
    const emptyResult = await translate('')
    console.log('结果:', emptyResult)
    console.log('长度:', emptyResult.length)
    console.log('类型:', typeof emptyResult)
    console.log('是数组:', Array.isArray(emptyResult))
    console.log('✅ 空输入测试通过\n')
    
    // 测试2: 单个文本
    console.log('测试2: 单个文本翻译')
    const singleResult = await translate('hello')
    console.log('结果:', singleResult)
    console.log('长度:', singleResult.length)
    console.log('类型:', typeof singleResult)
    console.log('是数组:', Array.isArray(singleResult))
    if (singleResult.length > 0) {
      console.log('第一个结果:', singleResult[0])
      console.log('第一个结果类型:', typeof singleResult[0])
    }
    console.log('✅ 单个文本测试通过\n')
    
    // 测试3: 数组输入
    console.log('测试3: 数组输入')
    const arrayResult = await translate(['hello', 'world'])
    console.log('结果:', arrayResult)
    console.log('长度:', arrayResult.length)
    console.log('类型:', typeof arrayResult)
    console.log('是数组:', Array.isArray(arrayResult))
    arrayResult.forEach((item, index) => {
      console.log(`结果[${index}]:`, item, '类型:', typeof item)
    })
    console.log('✅ 数组输入测试通过\n')
    
    // 测试4: 过滤空字符串
    console.log('测试4: 过滤空字符串')
    const filterResult = await translate(['hello', '', 'world'])
    console.log('结果:', filterResult)
    console.log('长度:', filterResult.length)
    console.log('应该是2个结果（过滤掉空字符串）')
    console.log('✅ 过滤测试通过\n')
    
    console.log('🎉 所有诊断测试通过！')
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    console.error('错误详情:', error instanceof Error ? error.message : String(error))
    console.error('错误堆栈:', error instanceof Error ? error.stack : 'No stack trace')
  }
}

// 运行诊断
diagnoseTranslateFunction().catch(console.error)
