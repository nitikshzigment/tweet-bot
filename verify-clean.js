const fs = require('fs');

console.log('🔍 Verifying bot.js file is clean...');

try {
  const botContent = fs.readFileSync('bot.js', 'utf8');
  
  // Check for merge conflict markers
  if (botContent.includes('<<<<<<< HEAD')) {
    console.error('❌ Found merge conflict markers in bot.js');
    process.exit(1);
  }
  
  if (botContent.includes('=======')) {
    console.error('❌ Found merge conflict markers in bot.js');
    process.exit(1);
  }
  
  if (botContent.includes('>>>>>>>')) {
    console.error('❌ Found merge conflict markers in bot.js');
    process.exit(1);
  }
  
  // Check for basic syntax
  if (!botContent.includes('class TwitterBot')) {
    console.error('❌ TwitterBot class not found in bot.js');
    process.exit(1);
  }
  
  if (!botContent.includes('require(\'twitter-api-v2\')')) {
    console.error('❌ Twitter API import not found in bot.js');
    process.exit(1);
  }
  
  console.log('✅ bot.js file is clean and ready for deployment!');
  console.log('✅ No merge conflict markers found');
  console.log('✅ Basic structure verified');
  console.log('✅ Ready for Railway deployment');
  
} catch (error) {
  console.error('❌ Error reading bot.js:', error.message);
  process.exit(1);
} 