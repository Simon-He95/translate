import { describe, expect, it } from 'vitest'
import translateLoader from '../src'

describe('translate function', () => {
  const translate = translateLoader()

  it('should translate single text', async () => {
    const result = await translate('hello')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(typeof result[0]).toBe('string')
    expect(result[0].length).toBeGreaterThan(0)
    console.log('单个文本翻译:', result[0])
  }, 10000)

  it('should translate multiple texts', async () => {
    const result = await translate(['hello', 'world'])
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(typeof result[0]).toBe('string')
    expect(typeof result[1]).toBe('string')
    console.log('批量翻译:', result)
  }, 15000)

  it('should handle empty input', async () => {
    const result = await translate('')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
    console.log('空输入处理: 通过')
  })

  it('should filter empty strings', async () => {
    const result = await translate(['hello', '', 'world'])
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2) // 过滤掉空字符串
    console.log('过滤空字符串:', result)
  }, 15000)

  it('should use cache', async () => {
    const translateWithCache = translateLoader()
    const text = 'cache test'
    
    const start1 = Date.now()
    const result1 = await translateWithCache(text)
    const time1 = Date.now() - start1
    
    const start2 = Date.now()
    const result2 = await translateWithCache(text)
    const time2 = Date.now() - start2
    
    expect(result1).toEqual(result2)
    console.log(`缓存测试: 首次${time1}ms, 缓存${time2}ms`)
  }, 10000)
})
