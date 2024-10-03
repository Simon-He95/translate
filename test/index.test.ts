import { describe, expect, it } from 'vitest'
import translateLoader from '../src'

describe('should', () => {
  const translate = translateLoader()
  it('exported', async () => {
    expect((await translate('你好'))[0]).toEqual('Hello')
  })
})
