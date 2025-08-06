<<<<<<< HEAD
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
=======
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

async function testTwitterAPI() {
  console.log('Testing Twitter API Authentication...');
  console.log('API Key:', process.env.TWITTER_API_KEY ? 'Present' : 'Missing');
  console.log('API Secret:', process.env.TWITTER_API_SECRET ? 'Present' : 'Missing');
  console.log('Access Token:', process.env.TWITTER_ACCESS_TOKEN ? 'Present' : 'Missing');
  console.log('Access Secret:', process.env.TWITTER_ACCESS_SECRET ? 'Present' : 'Missing');

  try {
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const rwClient = client.readWrite;

    console.log('\nTesting API connection...');
    
    // Test 1: Try to get user info (read operation)
    console.log('1. Testing read access...');
    const me = await rwClient.v2.me();
    console.log('✅ Read access successful:', me.data.username);
    
    // Test 2: Try to post a tweet
    console.log('\n2. Testing write access...');
    const tweet = await rwClient.v2.tweet('🤖 Test tweet from bot - ' + new Date().toISOString());
    console.log('✅ Write access successful! Tweet ID:', tweet.data.id);
    console.log('Tweet URL: https://twitter.com/user/status/' + tweet.data.id);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 403) {
      console.log('\n🔍 403 Error Analysis:');
      console.log('- Check if your app has "Read and Write" permissions');
      console.log('- Verify your Access Token has the correct permissions');
      console.log('- Make sure all credentials are from the same Twitter app');
      console.log('- Try regenerating your Access Token and Secret');
    } else if (error.code === 401) {
      console.log('\n🔍 401 Error Analysis:');
      console.log('- Check if your API Key and Secret are correct');
      console.log('- Verify your Access Token and Secret are correct');
    }
    
    console.log('\n📋 Troubleshooting Steps:');
    console.log('1. Go to https://developer.twitter.com/en/portal/dashboard');
    console.log('2. Select your app');
    console.log('3. Go to "Keys and tokens" tab');
    console.log('4. Regenerate "Access Token and Secret"');
    console.log('5. Make sure app permissions include "Read and Write"');
  }
}

testTwitterAPI().catch(console.error); 
>>>>>>> a1622bf7430c2dbe57895253cc7bf8ee8c39f7c5
