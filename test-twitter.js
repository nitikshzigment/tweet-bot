const TwitterBot = require('./bot.js');

async function testBot() {
  try {
    console.log('Testing Twitter Bot...');
    
    // Test bot initialization
    const bot = new TwitterBot();
    console.log('✅ Bot initialized successfully');
    
    // Test file initialization
    await bot.initializeFiles();
    console.log('✅ Files initialized successfully');
    
    // Test getting stats
    const stats = await bot.getStats();
    console.log('✅ Stats retrieved:', stats);
    
    // Test AI config
    const aiConfig = await bot.getAIConfig();
    console.log('✅ AI config retrieved:', aiConfig);
    
    // Test getting a random tweet (without posting)
    const tweet = await bot.getRandomTweet();
    console.log('✅ Random tweet generated:', tweet);
    
    console.log('\n🎉 All tests passed! Bot is ready to use.');
    console.log('\nAvailable commands:');
    console.log('  node bot.js test     - Test the bot with a real tweet');
    console.log('  node bot.js post     - Post a custom tweet');
    console.log('  node bot.js add      - Add a new tweet to content');
    console.log('  node bot.js stats    - Show bot statistics');
    console.log('  node bot.js start    - Start the scheduler');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testBot(); 