// 测试filter(Boolean)的行为
console.log('测试 filter(Boolean):')
console.log("['', '  ', '\\n'].filter(Boolean):", ['', '  ', '\n'].filter(Boolean))
console.log("['hello', '', 'world'].filter(Boolean):", ['hello', '', 'world'].filter(Boolean))

// 测试trim()
console.log('\n测试trim():')
console.log("'  '.trim():", '  '.trim())
console.log("'\\n'.trim():", '\n'.trim())
console.log("Boolean('  '.trim()):", Boolean('  '.trim()))
console.log("Boolean('\\n'.trim()):", Boolean('\n'.trim()))
