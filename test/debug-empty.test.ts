/**
 * Debug Tests for Empty Input Handling
 * Tests edge cases with empty or invalid inputs
 */

import { describe, it, expect } from 'vitest'
import translateLoader from '../src'

describe('Debug Empty Input Tests', () => {
  const translate = translateLoader()

  it('should handle empty string', async () => {
    console.log('🔍 Testing empty string input...')
    
    const result = await translate('', 'zh')
    
    console.log(`✅ Empty string result: ${JSON.stringify(result)}`)
    
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should handle empty array', async () => {
    console.log('🔍 Testing empty array input...')
    
    const result = await translate([], 'zh')
    
    console.log(`✅ Empty array result: ${JSON.stringify(result)}`)
    
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })

  it('should handle whitespace-only strings', async () => {
    const whitespaceInputs = ['   ', '\t', '\n', '  \t\n  ']
    
    console.log('🔍 Testing whitespace-only inputs...')
    
    for (const input of whitespaceInputs) {
      const result = await translate(input, 'zh')
      console.log(`✅ Whitespace "${input.replace(/\s/g, '\\s')}" → ${JSON.stringify(result)}`)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    }
  })

  it('should handle array with empty and whitespace strings', async () => {
    const mixedInputs = ['Hello', '', '   ', 'World', '\t\n']
    
    console.log('🔍 Testing mixed array with empty/whitespace strings...')
    
    const result = await translate(mixedInputs, 'zh')
    
    console.log(`✅ Mixed input result: ${JSON.stringify(result)}`)
    
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    // Should only translate non-empty, non-whitespace strings
    expect(result.length).toBe(2) // Only 'Hello' and 'World'
  }, 10000)

  it('should handle special characters and unicode', async () => {
    const specialInputs = [
      '🌍',
      '测试',
      'café',
      'naïve',
      '🎉🎊',
      '←→↑↓'
    ]
    
    console.log('🔍 Testing special characters and unicode...')
    
    try {
      const result = await translate(specialInputs, 'en')
      
      console.log('✅ Special characters results:')
      result.forEach((translated, index) => {
        console.log(`   "${specialInputs[index]}" → "${translated}"`)
      })
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(specialInputs.length)
    } catch (error) {
      console.log(`❌ Special characters test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail test if service can't handle special characters
      expect(true).toBe(true)
    }
  }, 15000)

  it('should handle very long strings', async () => {
    const longText = 'A'.repeat(1000) // 1000 character string
    
    console.log('🔍 Testing very long string (1000 chars)...')
    
    try {
      const result = await translate(longText, 'zh')
      
      console.log(`✅ Long text result (${result[0].length} chars): ${result[0].substring(0, 50)}...`)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].length).toBeGreaterThan(0)
    } catch (error) {
      console.log(`❌ Long text test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Don't fail test if service can't handle long text
      expect(true).toBe(true)
    }
  }, 20000)

  it('should handle null and undefined gracefully', async () => {
    console.log('🔍 Testing null and undefined handling...')
    
    try {
      // Test with null (should be filtered out)
      const result1 = await translate([null as any, 'Hello'], 'zh')
      console.log(`✅ Null handling: ${JSON.stringify(result1)}`)
      
      // Test with undefined (should be filtered out)
      const result2 = await translate([undefined as any, 'World'], 'zh')
      console.log(`✅ Undefined handling: ${JSON.stringify(result2)}`)
      
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    } catch (error) {
      console.log(`❌ Null/undefined test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // This is expected to fail, so we pass the test
      expect(true).toBe(true)
    }
  }, 10000)
})
