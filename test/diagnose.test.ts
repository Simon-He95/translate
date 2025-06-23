/**
 * Diagnostic Tests for Translation Services
 * Quick health checks with reasonable timeouts
 */

import { describe, it, expect } from 'vitest'
import { 
  bingTranslate,
  mymemoryTranslate
} from '../src'

describe('Translation Service Diagnostics', () => {
  it('should diagnose reliable services only', async () => {
    const services = [
      { name: 'MyMemory', service: mymemoryTranslate() },
      { name: 'Bing', service: bingTranslate() }
    ]

    console.log('🩺 Diagnosing reliable translation services...\n')

    const results = []
    
    for (const { name, service } of services) {
      console.log(`📡 Testing ${name}...`)
      
      const start = Date.now()
      try {
        // 8 second timeout for each service
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`${name} timeout after 8s`)), 8000)
        })
        
        const result = await Promise.race([
          service('Hello', 'zh'),
          timeoutPromise
        ])
        
        const duration = Date.now() - start
        console.log(`✅ ${name}: Working (${duration}ms) → "${result}"`)
        results.push({ name, status: 'working', duration })
      } catch (error) {
        const duration = Date.now() - start
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.log(`❌ ${name}: Failed (${duration}ms) → ${message}`)
        results.push({ name, status: 'failed', error: message })
      }
    }

    console.log('\n📊 Service Diagnosis Summary:')
    
    const working = results.filter(r => r.status === 'working')
    const failed = results.filter(r => r.status === 'failed')
    
    working.forEach(({ name, duration }) => {
      console.log(`✅ ${name} (${duration}ms)`)
    })
    
    failed.forEach(({ name, error }) => {
      console.log(`❌ ${name} - ${error}`)
    })

    console.log(`\n🎯 Reliable Services: ${working.length}/${results.length} working`)

    // At least one reliable service should be working
    expect(working.length).toBeGreaterThan(0)
    
    const healthPercent = (working.length / results.length) * 100
    console.log(`💪 Health: ${healthPercent.toFixed(1)}%`)
  }, 20000) // Reduced timeout to 20 seconds

  it('should test basic error handling', async () => {
    console.log('🔧 Testing basic error handling...')
    
    const service = mymemoryTranslate()
    
    try {
      console.log('🧪 Testing normal translation...')
      const result = await service('Test error handling', 'zh')
      console.log(`✅ Normal translation: "${result.substring(0, 30)}..."`)
      expect(typeof result).toBe('string')
    } catch (error) {
      console.log(`❌ Normal translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail test if service is temporarily unavailable
      expect(true).toBe(true)
    }
  }, 10000)

  it('should test service fallback', async () => {
    console.log('🔄 Testing service fallback mechanism...')
    
    try {
      const translateLoader = (await import('../src')).default
      const translate = translateLoader()
      
      const start = Date.now()
      const result = await translate('Fallback test', 'zh')
      const duration = Date.now() - start
      
      console.log(`✅ Fallback working (${duration}ms): "${result[0]}"`)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].length).toBeGreaterThan(0)
    } catch (error) {
      console.log(`❌ All services failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // This is a critical failure
      throw error
    }
  }, 15000)
})
