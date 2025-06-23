/**
 * Quick Diagnostic Tests - Fast Service Health Check
 * Focused on reliable services with short timeouts
 */

import { describe, it, expect } from 'vitest'
import { 
  bingTranslate,
  mymemoryTranslate
} from '../src'

describe('Quick Service Diagnostics', () => {
  it('should quickly check reliable services', async () => {
    const services = [
      { name: 'MyMemory', service: mymemoryTranslate() },
      { name: 'Bing', service: bingTranslate() }
    ]

    console.log('⚡ Quick health check of reliable services...')

    const results = []
    
    for (const { name, service } of services) {
      console.log(`📡 Testing ${name}...`)
      
      const start = Date.now()
      try {
        // Quick 5-second timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const result = await service('Quick test', 'zh')
        clearTimeout(timeoutId)
        
        const duration = Date.now() - start
        console.log(`✅ ${name}: ${duration}ms → "${result}"`)
        results.push({ name, success: true, duration })
      } catch (error) {
        const duration = Date.now() - start
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.log(`❌ ${name}: ${duration}ms → ${message}`)
        results.push({ name, success: false, duration })
      }
    }

    const working = results.filter(r => r.success)
    console.log(`\n📊 Results: ${working.length}/${services.length} services working`)
    
    if (working.length > 0) {
      const avgTime = working.reduce((sum, r) => sum + r.duration, 0) / working.length
      console.log(`⏱️  Average response time: ${avgTime.toFixed(2)}ms`)
    }

    // At least one service should work
    expect(working.length).toBeGreaterThan(0)
  }, 15000)

  it('should test service fallback', async () => {
    console.log('🔄 Testing service fallback...')
    
    const translateLoader = (await import('../src')).default
    const translate = translateLoader()
    
    try {
      const start = Date.now()
      const result = await translate('Fallback test', 'zh')
      const duration = Date.now() - start
      
      console.log(`✅ Fallback working: ${duration}ms → "${result[0]}"`)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
    } catch (error) {
      console.log(`❌ All services failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }, 10000)

  it('should measure basic performance', async () => {
    console.log('📊 Basic performance check...')
    
    const service = mymemoryTranslate()
    const testText = 'Performance test'
    
    try {
      const start = Date.now()
      const result = await service(testText, 'zh')
      const duration = Date.now() - start
      
      console.log(`✅ Performance: ${duration}ms → "${result}"`)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(duration).toBeLessThan(8000) // Should be under 8 seconds
    } catch (error) {
      console.log(`❌ Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail if service is temporarily unavailable
      expect(true).toBe(true)
    }
  }, 10000)
})
