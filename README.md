# @simon_he/translate

🚀 A fast, robust, and lightweight translation library supporting **6 translation services** with automatic fallback, batch processing, intelligent caching, and full TypeScript support.

## ✨ Features

- 🌐 **Multiple Translation Providers**: Google, Bing, DeepL, MyMemory, Lingva
- 🔄 **Automatic Fallback**: If one service fails, automatically tries others
- ⚡ **Batch Processing**: Translate multiple texts concurrently
- 🧠 **Smart Caching**: LRU cache to avoid repeated API calls
- 🎯 **Promise.any Racing**: Uses the fastest available service
- 📦 **Zero Dependencies**: Lightweight and fast
- 🔒 **TypeScript Support**: Full type safety
- 🆓 **Free Options**: Includes free translation services

## 🌍 Supported Translation Services

| Service | Type | Status | Free Tier | API Key Required |
|---------|------|--------|-----------|------------------|
| **MyMemory** | Free | ✅ Working | 1000 requests/day | No |
| **Bing Translator** | Commercial | ✅ Working | 2M chars/month | No* |
| **Google Translate** | Commercial | ⚠️ Limited | 500K chars/month | No* |
| **DeepL** | Commercial | ⚠️ Rate Limited | 500K chars/month | No* |
| **Lingva** | Free Proxy | ⚠️ Blocked | Unlimited | No |

*\* These services use unofficial APIs and may have limitations or availability issues*

**✅ Recommended for Production**: MyMemory, Bing
**⚠️ Use with Caution**: Google (timeouts), DeepL (rate limits), Lingva (blocked)

## 📦 Installation

```bash
npm install @simon_he/translate
# or
pnpm add @simon_he/translate
# or
yarn add @simon_he/translate
```

## 🚀 Quick Start

```typescript
import translateLoader from '@simon_he/translate'

const translate = translateLoader()

// Translate single text
const result = await translate('Hello world', 'zh')
console.log(result) // ['世界您好']

// Translate multiple texts (batch processing)
const results = await translate(['Hello', 'Good morning'], 'zh')
console.log(results) // ['你好', '早上好']

// English to Chinese (default)
const zhResult = await translate('Hello')
console.log(zhResult) // ['你好']

// Chinese to English
const enResult = await translate('你好', 'en')
console.log(enResult) // ['Hello']
```

## 🔧 Advanced Usage

### Individual Service Usage

```typescript
import {
  bingTranslate,
  googleTranslate,
  lingvaTranslate,
  mymemoryTranslate
} from '@simon_he/translate'

// Use specific service
const google = googleTranslate()
const result = await google('Hello', 'zh')
console.log(result.text) // '你好'
```

### Custom Cache Configuration

```typescript
import translateLoader from '@simon_he/translate'

// Create translator with custom cache size
const translate = translateLoader(createLimitedCache(500))
```

## 🎯 API Reference

### `translateLoader(cacheMap?)`

Creates a translation function with automatic service fallback.

**Parameters:**
- `cacheMap` (optional): Custom cache implementation

**Returns:** `(texts: string | string[], to?: 'en' | 'zh') => Promise<string[]>`

### Individual Services

Each service exports a `fanyi()` function:

```typescript
type TranslateFunction = (text: string, to?: string, from?: string) => Promise<{ text: string }>
```

## 🧪 Testing

```bash
# Run main tests
npm test

# Run performance tests
npm run test:performance

# Run stress tests
npm run test:stress

# Run benchmark tests
npm run test:benchmark

# Run all tests
npm run test:all
```

## License
[MIT](./LICENSE) License © 2022 [Simon He](https://github.com/Simon-He95)

<a href="https://github.com/Simon-He95/sponsor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

<span><div align="center">![sponsors](https://www.hejian.club/images/sponsors.jpg)</div></span>
