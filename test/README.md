# Test Documentation

This directory contains comprehensive tests for the translation library, including unit tests for individual services, integration tests, and performance testing scripts.

## 🧪 Test Structure

### Vitest Tests (*.test.ts)
These are the main unit and integration tests run by vitest:

- **`index.test.ts`** - Main translation loader functionality tests ✅
- **`simple.test.ts`** - Simple usage tests ✅
- **`final.test.ts`** - Final comprehensive tests ✅
- **`mymemory.test.ts`** - MyMemory translation service tests ✅ **WORKING**
- **`bing.test.ts`** - Bing Translator service tests ✅ **WORKING**
- **`google.test.ts`** - Google Translate service tests ⚠️ *Timeout issues*
- **`deeplx.test.ts`** - DeepL translation service tests ⚠️ *Rate limited*
- **`lingva.test.ts`** - Lingva translation service tests ⚠️ *API blocked*
- **`all-services.test.ts`** - Integration tests for all services ⚠️ *Some services failing*

### Node Scripts (*-script.ts)
These are standalone Node.js scripts for performance and diagnostic testing:

- **`performance-script.ts`** - Performance benchmarking
- **`benchmark-script.ts`** - Translation speed comparison
- **`stress-script.ts`** - Stress testing with high load
- **`diagnose-script.ts`** - Service diagnostics and health checks
- **`debug-empty-script.ts`** - Debug empty input handling

## 🚀 Running Tests

### Run All Tests
```bash
npm test                    # Run vitest tests only
npm run test:all           # Run all tests (vitest + scripts)
```

### Run Individual Service Tests
```bash
npm run test:google        # Test Google Translate
npm run test:bing          # Test Bing Translator
npm run test:deeplx        # Test DeepL
npm run test:mymemory      # Test MyMemory (free)
npm run test:lingva        # Test Lingva (free proxy)
```

### Run Test Categories
```bash
npm run test:services      # Test all individual services
npm run test:integration   # Test service integration
```

### Run Performance Tests
```bash
npm run test:performance   # Performance benchmarking
npm run test:benchmark     # Speed comparison
npm run test:stress        # Stress testing
```

## 📊 Test Coverage

### Translation Services Tested
- ✅ **Google Translate** - Unofficial API
- ✅ **Bing Translator** - Unofficial API  
- ✅ **DeepL** - Via deeplx
- ✅ **MyMemory** - Free API (1000 requests/day)
- ✅ **Lingva** - Free Google proxy

### Test Scenarios
- Basic translation (EN ↔ ZH)
- Batch translation
- Error handling
- Empty input handling
- Special characters
- Long text handling
- Language auto-detection
- Service fallback
- Caching functionality
- Performance benchmarking

## 🔧 Test Configuration

The vitest configuration in `vitest.config.ts` is set to:
- Include only `*.test.ts` files
- Exclude `*-script.ts` files
- Set appropriate timeouts for network requests
- Enable verbose output for service tests

## 📝 Notes

- Some services may fail intermittently due to rate limits or network issues
- The integration test expects at least 3 services to work successfully
- Free services (MyMemory, Lingva) are more reliable for testing
- Commercial service tests use unofficial APIs and may have limitations

## 🎯 Service Reliability

Based on testing, here's the expected reliability:

| Service | Reliability | Notes |
|---------|-------------|-------|
| MyMemory | ⭐⭐⭐⭐⭐ | Most reliable, 1000 free requests/day |
| Lingva | ⭐⭐⭐ | Moderate, depends on proxy availability |
| Google | ⭐⭐ | Unofficial API, may have rate limits |
| Bing | ⭐⭐ | Unofficial API, may have rate limits |
| DeepL | ⭐⭐ | Unofficial API, may have rate limits |

## 📊 Current Test Status

### ✅ Working Services (Production Ready)
- **MyMemory**: All tests pass, 1000 requests/day, no API key needed
- **Bing**: All tests pass, 2M chars/month, excellent quality
- **Core Functions**: Caching, batch processing, error handling all working

### ⚠️ Limited Services (API/Network Issues)  
- **Google**: Timeout issues, possible rate limiting or connectivity problems
- **DeepL**: 429 Too Many Requests (rate limited, needs official API key)
- **Lingva**: 403 Forbidden errors (API access blocked)

### 🎯 Recommendations
- **For Production**: Use MyMemory + Bing as primary services
- **For Development**: Test with working services first
- **For Reliability**: Enable fallback logic (already implemented)
- **For Performance**: Leverage caching system (already working)

## 🚨 Troubleshooting

If tests fail:
1. Check network connectivity
2. Some services may be temporarily unavailable
3. Rate limits may be hit (wait and retry)
4. For consistent failures, the service may have changed its API
5. Free services are generally more stable for testing
