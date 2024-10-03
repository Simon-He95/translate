import { describe, expect, it } from 'vitest'
import translateLoader from '../src'

describe('should', () => {
  const translate = translateLoader()
  it('zh->en', async () => {
    expect((await translate('你好'))[0]).toEqual('Hello')
  })
  it('en->zh', async () => {
    expect((await translate('hello'))[0]).toEqual('你好')
  })
})
