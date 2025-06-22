import { describe, expect, it } from 'vitest'
import translateLoader from '../src'

describe('translate function tests', () => {
  const translate = translateLoader()

  // 基础翻译测试
  describe('basic translation', () => {
    it('should translate text and return string array', async () => {
      const result = await translate('hello')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(typeof result[0]).toBe('string')
      expect(result[0].length).toBeGreaterThan(0)
      console.log('翻译结果:', result[0])
    }, 10000)

    it('should handle array input', async () => {
      const result = await translate(['hello', 'world'])
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      result.forEach((item, index) => {
        expect(typeof item).toBe('string')
        expect(item.length).toBeGreaterThan(0)
        console.log(`翻译结果[${index}]:`, item)
      })
    }, 15000)
  })

  // 错误处理测试
  describe('error handling', () => {
    it('should handle empty input correctly', async () => {
      const result1 = await translate('')
      const result2 = await translate([])
      const result3 = await translate(['', '  ', '\n'])
      
      expect(Array.isArray(result1)).toBe(true)
      expect(Array.isArray(result2)).toBe(true)
      expect(Array.isArray(result3)).toBe(true)
      expect(result1.length).toBe(0)
      expect(result2.length).toBe(0)
      expect(result3.length).toBe(0)
      console.log('空输入处理: 通过')
    }, 5000)

    it('should filter empty strings from array', async () => {
      const texts = ['hello', '', 'world']
      const results = await translate(texts)
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(2) // 过滤掉空字符串
      results.forEach((result, index) => {
        expect(typeof result).toBe('string')
        expect(result.trim().length).toBeGreaterThan(0)
        console.log(`过滤测试结果[${index}]:`, result)
      })
    }, 15000)
  })

  // 缓存测试
  describe('caching functionality', () => {
    it('should demonstrate caching behavior', async () => {
      const translateWithCache = translateLoader()
      const testText = 'cache test'
      
      // 第一次翻译
      const start1 = Date.now()
      const result1 = await translateWithCache(testText)
      const time1 = Date.now() - start1
      
      // 第二次翻译（应该使用缓存）
      const start2 = Date.now()
      const result2 = await translateWithCache(testText)
      const time2 = Date.now() - start2
      
      expect(result1).toEqual(result2)
      console.log(`缓存测试: 首次 ${time1}ms, 缓存 ${time2}ms`)
      console.log('缓存结果:', result1[0])
      
      // 缓存应该显著更快
      if (time1 > 100) { // 只有当首次翻译足够慢时才测试缓存效果
        expect(time2).toBeLessThan(time1)
      }
    }, 15000)
  })

  // 批量处理测试
  describe('batch processing', () => {
    it('should handle multiple texts concurrently', async () => {
      const testTexts = ['test1', 'test2', 'test3']
      
      const start = Date.now()
      const results = await translate(testTexts)
      const duration = Date.now() - start
      
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(testTexts.length)
      
      results.forEach((result, index) => {
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
        console.log(`批量结果[${index}]:`, result)
      })
      
      console.log(`批量处理: ${testTexts.length} 个文本耗时 ${duration}ms`)
      expect(duration).toBeLessThan(30000) // 30秒超时
    }, 35000)
  })
})
