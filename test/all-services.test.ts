import { describe, it, expect } from 'vitest'
import { 
  bingTranslate,
  mymemoryTranslate
} from '../src/index'

describe('All Translation Services Integration', () => {
  it('should test reliable services only', async () => {
    console.log('🧪 Testing reliable translation services...')

    const reliableServices = [
      { name: 'MyMemory', service: mymemoryTranslate() },
      { name: 'Bing', service: bingTranslate() }
    ]

    const results = []
    
    for (const { name, service } of reliableServices) {
      try {
        const result = await service('Hello', 'zh')
        const text = typeof result === 'string' ? result : (result as any).text
        console.log(`✅ ${name}: ${text}`)
        results.push({ service: name, success: true })
      } catch (error) {
        console.log(`❌ ${name}: Failed`)
        results.push({ service: name, success: false })
      }
    }

    // At least one reliable service should work
    const working = results.filter(r => r.success)
    expect(working.length).toBeGreaterThanOrEqual(1)
  }, 30000)
})
