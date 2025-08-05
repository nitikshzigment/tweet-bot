// package.json dependencies needed:
// npm install twitter-api-v2 node-cron dotenv fs-extra openai

const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

class TwitterBot {
  constructor() {
    // Validate required environment variables
    this.validateEnvironment();
    
    // Initialize Twitter client
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    this.rwClient = this.client.readWrite;
    this.contentFile = path.join(__dirname, 'content.json');
    this.logFile = path.join(__dirname, 'bot.log');
    this.postedFile = path.join(__dirname, 'posted_tweets.json');
    this.aiConfigFile = path.join(__dirname, 'ai-config.json');
    
    // Track recursion depth to prevent infinite loops
    this.recursionDepth = 0;
    this.maxRecursionDepth = 3;
  }

  // Validate required environment variables
  validateEnvironment() {
    const requiredVars = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET', 
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
    }
  }

  // Initialize required files
  async initializeFiles() {
    try {
      // Create content file if it doesn't exist
      if (!await fs.pathExists(this.contentFile)) {
        const defaultContent = {
          tweets: [
            "The real trolley problem is deciding whether to correct someone's grammar online or preserve the social fabric 🚋",
            "Schrödinger's email: simultaneously urgent and spam until you open it 📧",
            "My sleep schedule is more like a sleep suggestion at this point 😴",
            "Netflix asking 'Are you still watching?' is the digital equivalent of your mom asking if you're okay 📺",
            "According to the second law of thermodynamics, my room will always tend toward maximum entropy. I'm just helping physics along 🔬",
            "The observer effect: my productivity increases dramatically when my boss walks by 👀",
            "Late capitalism is having 47 streaming services and still nothing to watch 📱",
            "My biggest flex is remembering to bring my reusable bags to the grocery store exactly once 🛍️"
          ],
          schedules: [
            { time: "09:00", timezone: "America/New_York" },
            { time: "14:30", timezone: "America/New_York" },
            { time: "19:00", timezone: "America/New_York" }
          ]
        };
        await fs.writeJson(this.contentFile, defaultContent, { spaces: 2 });
      }

      // Create posted tweets tracking file
      if (!await fs.pathExists(this.postedFile)) {
        await fs.writeJson(this.postedFile, { posted: [] }, { spaces: 2 });
      }

      // Create log file
      if (!await fs.pathExists(this.logFile)) {
        await fs.writeFile(this.logFile, '');
      }

      // Create AI configuration file
      if (!await fs.pathExists(this.aiConfigFile)) {
        const defaultAIConfig = {
          enabled: false,
          service: "openai", // or "local", "custom"
          prompt: "Generate a witty, engaging tweet about technology, life, or current trends. Keep it under 280 characters and make it relatable and shareable. Include relevant emojis.",
          maxLength: 280,
          temperature: 0.7,
          includeHashtags: true,
          hashtagCount: 2,
          topics: ["technology", "life", "humor", "current events"],
          style: "witty and engaging"
        };
        await fs.writeJson(this.aiConfigFile, defaultAIConfig, { spaces: 2 });
      }

    } catch (error) {
      this.log(`Error initializing files: ${error.message}`);
      throw error; // Re-throw to handle initialization failures
    }
  }

  // Logging function
  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    
    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  // Generate AI tweet using OpenAI (if configured)
  async generateAITweet() {
    try {
      const aiConfig = await fs.readJson(this.aiConfigFile);
      
      if (!aiConfig.enabled) {
        this.log('AI tweet generation is disabled');
        return null;
      }

      // For now, we'll use a simple template-based approach
      // You can integrate with OpenAI API or other AI services here
      const templates = [
        "Just discovered that {topic} is actually {funny_observation}. Mind = blown 🤯",
        "The real {topic} problem is {relatable_situation}. Can anyone else relate? 😅",
        "Today's {topic} lesson: {witty_insight}. Life is full of surprises! ✨",
        "Plot twist: {topic} is not what we thought. {funny_realization} 😂",
        "The {topic} struggle is real when {relatable_problem}. Anyone else? 🙋‍♂️"
      ];

      const topics = aiConfig.topics || ["technology", "life", "humor"];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const observations = {
        "technology": "more addictive than coffee",
        "life": "just a series of unexpected plot twists",
        "humor": "the best medicine, but also the best procrastination tool",
        "current events": "moving faster than my attention span"
      };

      const situations = {
        "technology": "your phone dies right when you need it most",
        "life": "you plan everything and nothing goes according to plan",
        "humor": "you think of the perfect comeback 3 hours later",
        "current events": "you blink and miss 5 major news stories"
      };

      const insights = {
        "technology": "sometimes the best feature is the off button",
        "life": "the best plans are the ones you never make",
        "humor": "laughter is universal, but dad jokes are eternal",
        "current events": "the only constant is change, and memes"
      };

      const realizations = {
        "technology": "we're all just trying to find the right emoji",
        "life": "adulting is just pretending you know what you're doing",
        "humor": "sarcasm is my love language",
        "current events": "every day is a new adventure in confusion"
      };

      const problems = {
        "technology": "your WiFi works everywhere except where you need it",
        "life": "you're either too early or too late, never just right",
        "humor": "your jokes are funnier in your head",
        "current events": "you can't keep up with the news cycle"
      };

      const template = templates[Math.floor(Math.random() * templates.length)];
      let tweet = template
        .replace('{topic}', topic)
        .replace('{funny_observation}', observations[topic] || "surprisingly complex")
        .replace('{relatable_situation}', situations[topic] || "reality hits hard")
        .replace('{witty_insight}', insights[topic] || "life is what happens while you're making other plans")
        .replace('{funny_realization}', realizations[topic] || "we're all just winging it")
        .replace('{relatable_problem}', problems[topic] || "things don't go as planned");

      // Add hashtags if enabled
      if (aiConfig.includeHashtags) {
        const hashtags = [`#${topic}`, `#Life`, `#Humor`];
        tweet += ` ${hashtags.slice(0, aiConfig.hashtagCount || 2).join(' ')}`;
      }

      // Ensure tweet is within character limit
      if (tweet.length > aiConfig.maxLength) {
        tweet = tweet.substring(0, aiConfig.maxLength - 3) + '...';
      }

      this.log(`Generated AI tweet: "${tweet}"`);
      return tweet;

    } catch (error) {
      this.log(`Error generating AI tweet: ${error.message}`);
      return null;
    }
  }

  // Get random tweet that hasn't been posted recently
  async getRandomTweet() {
    try {
      const content = await fs.readJson(this.contentFile);
      const posted = await fs.readJson(this.postedFile);
      
      // Filter out recently posted tweets (last 50 posts)
      const recentPosts = posted.posted.slice(-50).map(p => p.text);
      const availableTweets = content.tweets.filter(tweet => 
        !recentPosts.includes(tweet)
      );

      // If all tweets have been used recently, use all tweets
      const tweetsToUse = availableTweets.length > 0 ? availableTweets : content.tweets;
      
      // Get random tweet
      const randomIndex = Math.floor(Math.random() * tweetsToUse.length);
      return tweetsToUse[randomIndex];

    } catch (error) {
      this.log(`Error getting random tweet: ${error.message}`);
      return "Something went wrong, but I'm still here! 🤖";
    }
  }

  // Post a tweet
  async postTweet(tweetText = null) {
    try {
      let text = tweetText;
      
      // If no text provided, try AI generation first, then fallback to random tweet
      if (!text) {
        text = await this.generateAITweet();
        if (!text) {
          text = await this.getRandomTweet();
        }
      }
      
      // Post the tweet
      const tweet = await this.rwClient.v2.tweet(text);
      
      // Log the successful post
      await this.trackPostedTweet(text, tweet.data.id);
      this.log(`Successfully posted tweet: "${text}" (ID: ${tweet.data.id})`);
      
      // Reset recursion depth on successful post
      this.recursionDepth = 0;
      
      return tweet;

    } catch (error) {
      this.log(`Error posting tweet: ${error.message}`);
      
      // Handle specific Twitter API errors
      if (error.code === 403) {
        this.log('Authentication error - check your API keys');
      } else if (error.code === 429) {
        this.log('Rate limit exceeded - will retry later');
      } else if (error.data?.detail?.includes('duplicate')) {
        this.log('Duplicate tweet detected - trying another one');
        
        // Prevent infinite recursion
        if (this.recursionDepth < this.maxRecursionDepth) {
          this.recursionDepth++;
          // Try posting a different tweet
          return this.postTweet();
        } else {
          this.log('Max recursion depth reached, skipping duplicate tweet');
          this.recursionDepth = 0;
          return null;
        }
      }
      
      throw error;
    }
  }

  // Track posted tweets
  async trackPostedTweet(text, tweetId) {
    try {
      const posted = await fs.readJson(this.postedFile);
      posted.posted.push({
        text,
        id: tweetId,
        timestamp: new Date().toISOString()
      });

      // Keep only last 100 posted tweets to prevent file from growing too large
      if (posted.posted.length > 100) {
        posted.posted = posted.posted.slice(-100);
      }

      await fs.writeJson(this.postedFile, posted, { spaces: 2 });
    } catch (error) {
      this.log(`Error tracking posted tweet: ${error.message}`);
    }
  }

  // Add new tweet to content
  async addTweet(tweetText) {
    try {
      const content = await fs.readJson(this.contentFile);
      content.tweets.push(tweetText);
      await fs.writeJson(this.contentFile, content, { spaces: 2 });
      this.log(`Added new tweet to content: "${tweetText}"`);
    } catch (error) {
      this.log(`Error adding tweet: ${error.message}`);
    }
  }

  // Configure AI settings
  async configureAI(settings) {
    try {
      const aiConfig = await fs.readJson(this.aiConfigFile);
      const updatedConfig = { ...aiConfig, ...settings };
      await fs.writeJson(this.aiConfigFile, updatedConfig, { spaces: 2 });
      this.log(`AI configuration updated: ${JSON.stringify(settings)}`);
    } catch (error) {
      this.log(`Error configuring AI: ${error.message}`);
    }
  }

  // Get AI configuration
  async getAIConfig() {
    try {
      return await fs.readJson(this.aiConfigFile);
    } catch (error) {
      this.log(`Error getting AI config: ${error.message}`);
      return null;
    }
  }

  // Get bot statistics
  async getStats() {
    try {
      const content = await fs.readJson(this.contentFile);
      const posted = await fs.readJson(this.postedFile);
      const aiConfig = await this.getAIConfig();
      
      return {
        totalTweets: content.tweets.length,
        postedTweets: posted.posted.length,
        lastPosted: posted.posted.length > 0 ? 
          posted.posted[posted.posted.length - 1] : null,
        scheduledTimes: content.schedules,
        aiEnabled: aiConfig?.enabled || false
      };
    } catch (error) {
      this.log(`Error getting stats: ${error.message}`);
      return null;
    }
  }

  // Start the scheduled posting
  startScheduler() {
    this.log('Starting Twitter bot scheduler...');

    // Post at scheduled times (adjust timezone as needed)
    // 9:00 AM EST
    cron.schedule('0 9 * * *', async () => {
      this.log('Scheduled post at 9:00 AM');
      try {
        await this.postTweet();
      } catch (error) {
        this.log(`Scheduled post failed: ${error.message}`);
      }
    }, {
      timezone: 'America/New_York'
    });

    // 2:30 PM EST
    cron.schedule('30 14 * * *', async () => {
      this.log('Scheduled post at 2:30 PM');
      try {
        await this.postTweet();
      } catch (error) {
        this.log(`Scheduled post failed: ${error.message}`);
      }
    }, {
      timezone: 'America/New_York'
    });

    // 7:00 PM EST
    cron.schedule('0 19 * * *', async () => {
      this.log('Scheduled post at 7:00 PM');
      try {
        await this.postTweet();
      } catch (error) {
        this.log(`Scheduled post failed: ${error.message}`);
      }
    }, {
      timezone: 'America/New_York'
    });

    // Optional: Random posts throughout the day (uncomment to enable)
    // cron.schedule('0 */4 * * *', async () => {
    //   // 25% chance to post every 4 hours
    //   if (Math.random() < 0.25) {
    //     this.log('Random scheduled post');
    //     try {
    //       await this.postTweet();
    //     } catch (error) {
    //     this.log(`Random post failed: ${error.message}`);
    //     }
    //   }
    // }, {
    //   timezone: 'America/New_York'
    // });

    this.log('Scheduler started successfully');
  }

  // Test the bot (posts immediately)
  async test() {
    this.log('Testing bot...');
    try {
      await this.postTweet("🤖 Bot test successful! Time to automate some wisdom.");
      const stats = await this.getStats();
      this.log(`Bot stats: ${JSON.stringify(stats, null, 2)}`);
    } catch (error) {
      this.log(`Test failed: ${error.message}`);
    }
  }
}

// CLI Interface
async function main() {
  try {
    const bot = new TwitterBot();
    
    // Initialize files before proceeding
    await bot.initializeFiles();
    
    const command = process.argv[2];

    switch (command) {
      case 'test':
        await bot.test();
        break;
      
      case 'post':
        const customText = process.argv[3];
        await bot.postTweet(customText);
        break;
      
      case 'add':
        const newTweet = process.argv.slice(3).join(' ');
        if (newTweet) {
          await bot.addTweet(newTweet);
        } else {
          console.log('Please provide tweet text: node bot.js add "Your tweet here"');
        }
        break;
      
      case 'ai-config':
        const aiConfig = await bot.getAIConfig();
        console.log('AI Configuration:', JSON.stringify(aiConfig, null, 2));
        break;
      
      case 'ai-enable':
        await bot.configureAI({ enabled: true });
        console.log('AI tweet generation enabled!');
        break;
      
      case 'ai-disable':
        await bot.configureAI({ enabled: false });
        console.log('AI tweet generation disabled!');
        break;
      
      case 'ai-prompt':
        const newPrompt = process.argv.slice(3).join(' ');
        if (newPrompt) {
          await bot.configureAI({ prompt: newPrompt });
          console.log(`AI prompt updated: "${newPrompt}"`);
        } else {
          console.log('Please provide a prompt: node bot.js ai-prompt "Your custom prompt here"');
        }
        break;
      
      case 'stats':
        const stats = await bot.getStats();
        console.log('Bot Statistics:', JSON.stringify(stats, null, 2));
        break;
      
      case 'start':
      default:
        bot.startScheduler();
        console.log('Bot is running... Press Ctrl+C to stop');
        
        // Keep the process alive
        process.on('SIGINT', () => {
          console.log('\nStopping bot...');
          process.exit(0);
        });
        break;
    }
  } catch (error) {
    console.error('Bot initialization failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = TwitterBot;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}