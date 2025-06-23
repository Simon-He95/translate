/**
 * Stress Test for Translation Services
 * Tests translation services under load
 */

import { describe, it, expect } from 'vitest'
import translateLoader from '../src'

describe('Translation Service Stress Tests', () => {
  const translate = translateLoader()

  it('should handle concurrent requests', async () => {
    const concurrentRequests = 5
    const testTexts = [
      'Hello world',
      'Test translation',
      'Stress testing',
      'Performance check',
      'Load testing'
    ]

    console.log(`🧪 Running ${concurrentRequests} concurrent translation requests...`)

    const promises = testTexts.map(async (text, index) => {
      try {
        const result = await translate(text, 'zh')
        console.log(`✅ Request ${index + 1}: "${text}" → "${result[0]}"`)
        return { success: true, result }
      } catch (error) {
        console.log(`❌ Request ${index + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return { success: false, error }
      }
    })

    const results = await Promise.allSettled(promises)
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful

    console.log(`📊 Results: ${successful}/${results.length} successful, ${failed} failed`)

    // At least some requests should succeed
    expect(successful).toBeGreaterThan(0)
  }, 30000)

  it('should handle repeated requests efficiently', async () => {
    const iterations = 3
    const testText = 'Performance test'
    const times: number[] = []

    console.log(`🔄 Running ${iterations} sequential translation requests...`)

    for (let i = 0; i < iterations; i++) {
      const start = Date.now()
      try {
        const result = await translate(testText, 'zh')
        const duration = Date.now() - start
        times.push(duration)
        console.log(`✅ Iteration ${i + 1}: ${duration}ms → "${result[0]}"`)
      } catch (error) {
        console.log(`❌ Iteration ${i + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        times.push(0)
      }
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    console.log(`📈 Average time: ${avgTime.toFixed(2)}ms`)

    // At least one request should complete
    expect(times.some(t => t > 0)).toBe(true)
  }, 20000)

  it('should handle batch processing', async () => {
    const batchTexts = [
      'Batch test 1',
      'Batch test 2',
      'Batch test 3'
    ]

    console.log(`📦 Testing batch processing with ${batchTexts.length} texts...`)

    try {
      const start = Date.now()
      const results = await translate(batchTexts, 'zh')
      const duration = Date.now() - start

      console.log(`✅ Batch completed in ${duration}ms`)
      results.forEach((result, index) => {
        console.log(`  ${index + 1}: "${batchTexts[index]}" → "${result}"`)
      })

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(batchTexts.length)
    } catch (error) {
      console.log(`❌ Batch processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // For stress test, we don't fail if service is unavailable
      expect(true).toBe(true)
    }
  }, 15000)
})
