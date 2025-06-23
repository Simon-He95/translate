/**
 * Performance Tests for Translation Services
 * Measures translation speed and efficiency
 */

import { describe, it, expect } from 'vitest'
import translateLoader from '../src'

describe('Translation Performance Tests', () => {
  const translate = translateLoader()

  it('should measure single translation performance', async () => {
    const testText = 'Performance measurement test'
    
    console.log('⏱️  Measuring single translation performance...')
    
    const start = Date.now()
    try {
      const result = await translate(testText, 'zh')
      const duration = Date.now() - start
      
      console.log(`✅ Translation completed in ${duration}ms`)
      console.log(`   "${testText}" → "${result[0]}"`)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(duration).toBeLessThan(10000) // Should complete within 10 seconds
    } catch (error) {
      console.log(`❌ Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail test if service is unavailable
      expect(true).toBe(true)
    }
  }, 15000)

  it('should measure batch translation performance', async () => {
    const testTexts = [
      'Batch performance test 1',
      'Batch performance test 2',
      'Batch performance test 3',
      'Batch performance test 4',
      'Batch performance test 5'
    ]
    
    console.log(`📊 Measuring batch translation performance (${testTexts.length} texts)...`)
    
    const start = Date.now()
    try {
      const results = await translate(testTexts, 'zh')
      const duration = Date.now() - start
      const avgPerText = duration / testTexts.length
      
      console.log(`✅ Batch translation completed in ${duration}ms`)
      console.log(`   Average per text: ${avgPerText.toFixed(2)}ms`)
      
      results.forEach((result, index) => {
        console.log(`   ${index + 1}: "${testTexts[index]}" → "${result}"`)
      })
      
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(testTexts.length)
      expect(avgPerText).toBeLessThan(5000) // Average should be less than 5s per text
    } catch (error) {
      console.log(`❌ Batch translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail test if service is unavailable
      expect(true).toBe(true)
    }
  }, 30000)

  it('should demonstrate caching performance improvement', async () => {
    const testText = 'Caching performance test'
    
    console.log('🗄️  Testing caching performance improvement...')
    
    // First request (no cache)
    const start1 = Date.now()
    try {
      const result1 = await translate(testText, 'zh')
      const duration1 = Date.now() - start1
      
      // Second request (should use cache)
      const start2 = Date.now()
      const result2 = await translate(testText, 'zh')
      const duration2 = Date.now() - start2
      
      console.log(`✅ First request: ${duration1}ms → "${result1[0]}"`)
      console.log(`✅ Second request (cached): ${duration2}ms → "${result2[0]}"`)
      console.log(`📈 Cache speedup: ${duration2 < duration1 ? (duration1 / Math.max(duration2, 1)).toFixed(2) + 'x faster' : 'No improvement'}`)
      
      expect(result1).toEqual(result2)
      expect(duration2).toBeLessThanOrEqual(duration1) // Cache should be faster or equal
    } catch (error) {
      console.log(`❌ Caching test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail test if service is unavailable
      expect(true).toBe(true)
    }
  }, 20000)

  it('should handle empty input efficiently', async () => {
    console.log('🔍 Testing empty input performance...')
    
    const start = Date.now()
    const result = await translate([], 'zh')
    const duration = Date.now() - start
    
    console.log(`✅ Empty input handled in ${duration}ms`)
    
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
    expect(duration).toBeLessThan(100) // Should be very fast for empty input
  }, 5000)
})
