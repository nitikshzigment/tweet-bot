/**
 * Twitter Bot - Automated Twitter posting bot
 * Dependencies: twitter-api-v2 node-cron dotenv fs-extra openai
 */

const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const http = require('http');
const FormData = require('form-data');
// Load environment variables - try multiple sources for Railway deployment
require('dotenv').config({ path: './bot.env' });
require('dotenv').config({ path: './.env' });
require('dotenv').config(); // Load from process.env (Railway sets these directly)

class TwitterBot {
  constructor() {
    try {
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
    } catch (error) {
      console.error('Failed to initialize TwitterBot:', error.message);
      throw error;
    }
  }

  // Validate required environment variables
  validateEnvironment() {
    const requiredVars = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET', 
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_SECRET'
    ];

    // Optional: AI APIs for image generation
    this.grokApiKey = process.env.GROK_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyC37vTeQzcp4xLQ5faqRtoQ4DDOETKUdNU';

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
          "Just implemented a custom loss function that's more complex than my dating life 📊 #MachineLearning #QuantFinance",
          "When your neural network converges faster than your career goals 🧠 #AI #DeepLearning",
          "The real alpha isn't in the market, it's in the data preprocessing pipeline 📈 #QuantTrading #DataScience",
          "My portfolio's Sharpe ratio is higher than my social skills 📊 #Finance #Quantitative",
          "Backtesting: where hindsight bias meets overfitting anxiety 📉 #Trading #MachineLearning",
          "Feature engineering is like cooking - the right ingredients make all the difference 🍳 #ML #DataScience",
          "When your model predicts market crashes better than it predicts my life decisions 📊 #QuantFinance #AI",
          "The only thing more volatile than crypto is my attention span during meetings 📈 #Trading #Tech",
          "Gradient descent: the algorithm that descends faster than my motivation on Mondays 📉 #DeepLearning #ML",
          "Cross-validation is like dating multiple people to avoid overfitting your heart 💔 #MachineLearning #Humor",
          "My risk management is better than my life management 📊 #QuantTrading #Finance",
          "When your ensemble model is more diverse than your friend group 🤖 #AI #MachineLearning",
          "The market is efficient, but my code is not 🐛 #QuantFinance #Programming",
          "Feature importance: where SHAP values reveal more than therapy sessions 📊 #ML #DataScience",
          "My backtest results are more impressive than my LinkedIn profile 📈 #Quantitative #Trading"
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
          enabled: true,
          service: "openai", // or "local", "custom"
          prompt: "Generate a witty, technical tweet about AI, machine learning, quantitative finance, or trading. Make it humorous but sophisticated, targeting AI/ML/Quant professionals. Include technical terms like 'neural networks', 'backtesting', 'Sharpe ratio', 'feature engineering', 'gradient descent', etc. Keep it under 280 characters and include relevant emojis and hashtags.",
          maxLength: 280,
          temperature: 0.8,
          includeHashtags: true,
          hashtagCount: 3,
          topics: ["AI", "MachineLearning", "QuantFinance", "Trading", "DataScience", "DeepLearning", "Quantitative", "Programming"],
          style: "technical, witty, and sophisticated"
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

  // Generate AI image using Grok API
  async generateAIImage(tweetText) {
    try {
      // Extract key technical terms for image generation
      const technicalTerms = [
        'neural network', 'machine learning', 'AI', 'algorithm', 'data science',
        'quantitative', 'trading', 'finance', 'backtesting', 'sharpe ratio',
        'gradient descent', 'feature engineering', 'deep learning', 'model',
        'prediction', 'analysis', 'code', 'programming', 'statistics'
      ];
      
      const foundTerms = technicalTerms.filter(term => 
        tweetText.toLowerCase().includes(term)
      );
      
      let imagePrompt = 'Create a technical visualization of ';
      if (foundTerms.length > 0) {
        imagePrompt += foundTerms[0] + ' concept';
      } else {
        imagePrompt += 'AI and machine learning';
      }
      
      imagePrompt += ', digital art style, professional, clean, modern, technical diagram, futuristic, blue and white color scheme';
      
      this.log(`Generating image with prompt: "${imagePrompt}"`);
      
      // Try Gemini API first, then Grok as fallback
      let imageData = null;
      
      // Try Gemini API
      if (this.geminiApiKey) {
        this.log('Trying Gemini API for image generation...');
        imageData = await this.callGeminiImageAPI(imagePrompt);
        if (imageData) {
          this.log('Gemini API image generation successful');
          return {
            prompt: imagePrompt,
            imageBuffer: imageData,
            source: 'gemini'
          };
        }
      }
      
      // Fallback to Grok API
      if (this.grokApiKey) {
        this.log('Trying Grok API as fallback...');
        const imageUrl = await this.callGrokImageAPI(imagePrompt);
        if (imageUrl) {
          return {
            prompt: imagePrompt,
            imageUrl: imageUrl,
            source: 'grok'
          };
        }
      }
      
      this.log('No image generation APIs available or working');
      return {
        prompt: imagePrompt,
        imageUrl: null,
        source: 'none'
      };
      
    } catch (error) {
      this.log(`Error generating AI image: ${error.message}`);
      return null;
    }
  }

  // Download image from URL and upload to Twitter
  async uploadImageToTwitter(imageUrl) {
    try {
      this.log(`Downloading image from: ${imageUrl}`);
      
      // Download image
      const imageBuffer = await this.downloadImage(imageUrl);
      if (!imageBuffer) {
        this.log('Failed to download image');
        return null;
      }
      
      // Upload to Twitter
      const mediaId = await this.rwClient.v1.uploadMedia(imageBuffer, { mimeType: 'image/jpeg' });
      this.log(`Image uploaded to Twitter (Media ID: ${mediaId})`);
      
      return mediaId;
    } catch (error) {
      this.log(`Error uploading image to Twitter: ${error.message}`);
      return null;
    }
  }

  // Download image from URL
  async downloadImage(url) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (res) => {
        if (res.statusCode !== 200) {
          this.log(`Failed to download image: ${res.statusCode}`);
          resolve(null);
          return;
        }
        
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          this.log(`Image downloaded: ${buffer.length} bytes`);
          resolve(buffer);
        });
      }).on('error', (error) => {
        this.log(`Error downloading image: ${error.message}`);
        resolve(null);
      });
    });
  }

  // Call Gemini API for image generation (placeholder - can be replaced with actual implementation)
  async callGeminiImageAPI(prompt) {
    return new Promise((resolve, reject) => {
      this.log(`Gemini API called with prompt: "${prompt}"`);
      this.log(`Note: Gemini API doesn't generate images directly. You can integrate with:`);
      this.log(`- Hugging Face API (free)`);
      this.log(`- Stable Diffusion API`);
      this.log(`- DALL-E API`);
      this.log(`- Or use Grok API with credits`);
      
      // For now, return null to use text-only tweets
      resolve(null);
    });
  }

  // Call Grok API for image generation (fallback)
  async callGrokImageAPI(prompt) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        prompt: prompt,
        model: "dall-e-3",
        n: 1
      });

      const options = {
        hostname: 'api.x.ai',
        port: 443,
        path: '/v1/images/generations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${this.grokApiKey}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.data && response.data[0] && response.data[0].url) {
              this.log(`Image generated successfully: ${response.data[0].url}`);
              resolve(response.data[0].url);
            } else if (response.error && response.error.includes('credits')) {
              this.log(`Grok API credits required. Please add credits to your account.`);
              resolve(null);
            } else {
              this.log(`No image URL in response: ${JSON.stringify(response)}`);
              resolve(null);
            }
          } catch (error) {
            this.log(`Error parsing Grok API response: ${error.message}`);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        this.log(`Error calling Grok API: ${error.message}`);
        resolve(null);
      });

      req.write(postData);
      req.end();
    });
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
        "The {topic} struggle is real when {relatable_problem}. Anyone else? 🙋‍♂️",
        "When your {topic} model {technical_observation} 📊",
        "The {topic} algorithm that {funny_behavior} 🧠",
        "My {topic} implementation is {technical_comparison} 📈"
      ];

      const topics = aiConfig.topics || ["AI", "MachineLearning", "QuantFinance", "Trading"];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const observations = {
        "AI": "more complex than my dating algorithm",
        "MachineLearning": "converging faster than my career goals",
        "QuantFinance": "generating more alpha than my social skills",
        "Trading": "more volatile than my attention span",
        "DataScience": "preprocessing more data than my life decisions",
        "DeepLearning": "deeper than my understanding of taxes",
        "Quantitative": "more quantitative than my dating prospects",
        "Programming": "debugging more bugs than my life choices"
      };

      const situations = {
        "AI": "your neural network overfits more than your dating profile",
        "MachineLearning": "your model predicts market crashes better than your life",
        "QuantFinance": "your Sharpe ratio is higher than your social skills",
        "Trading": "your backtest results are more impressive than your LinkedIn",
        "DataScience": "your feature engineering is better than your cooking",
        "DeepLearning": "your gradient descent is smoother than your dating life",
        "Quantitative": "your risk management is better than your life management",
        "Programming": "your code is more efficient than your morning routine"
      };

      const insights = {
        "AI": "sometimes the best feature is the off button",
        "MachineLearning": "the best models are the ones you never deploy",
        "QuantFinance": "the real alpha is in the data preprocessing",
        "Trading": "the market is efficient, but your code is not",
        "DataScience": "feature importance reveals more than therapy",
        "DeepLearning": "neural networks are just fancy regression",
        "Quantitative": "cross-validation prevents overfitting your heart",
        "Programming": "the best code is the code you don't write"
      };

      const realizations = {
        "AI": "we're all just training on biased data",
        "MachineLearning": "your model is only as good as your data",
        "QuantFinance": "the market is more random than your code",
        "Trading": "your strategy works until it doesn't",
        "DataScience": "correlation doesn't imply causation, but it's fun to pretend",
        "DeepLearning": "deep learning is just statistics with better marketing",
        "Quantitative": "quantitative finance is just applied statistics",
        "Programming": "programming is just debugging with extra steps"
      };

      const problems = {
        "AI": "your model works in production but not in your life",
        "MachineLearning": "your predictions are better than your life choices",
        "QuantFinance": "your portfolio outperforms your dating life",
        "Trading": "your algorithm trades better than you date",
        "DataScience": "your data pipeline is cleaner than your room",
        "DeepLearning": "your neural network learns faster than you do",
        "Quantitative": "your models are more sophisticated than your conversations",
        "Programming": "your code is more organized than your thoughts"
      };

      const technicalObservations = {
        "AI": "converges faster than my dating algorithm",
        "MachineLearning": "overfits more than my dating profile",
        "QuantFinance": "generates more alpha than my social skills",
        "Trading": "backtests better than my life decisions",
        "DataScience": "preprocesses data better than my life",
        "DeepLearning": "learns patterns faster than I learn from mistakes",
        "Quantitative": "calculates risk better than I assess situations",
        "Programming": "debugs faster than I solve problems"
      };

      const funnyBehaviors = {
        "AI": "hallucinates more than my dating stories",
        "MachineLearning": "overfits more than my dating profile",
        "QuantFinance": "generates more alpha than my social skills",
        "Trading": "trades more than I date",
        "DataScience": "cleans data better than I clean my room",
        "DeepLearning": "learns deeper than my understanding of taxes",
        "Quantitative": "calculates more than I think",
        "Programming": "loops more than my dating conversations"
      };

      const technicalComparisons = {
        "AI": "more sophisticated than my dating algorithm",
        "MachineLearning": "more accurate than my life predictions",
        "QuantFinance": "more profitable than my dating life",
        "Trading": "more successful than my relationships",
        "DataScience": "more organized than my thoughts",
        "DeepLearning": "deeper than my understanding of relationships",
        "Quantitative": "more precise than my life calculations",
        "Programming": "more logical than my decision making"
      };

      const template = templates[Math.floor(Math.random() * templates.length)];
      let tweet = template
        .replace('{topic}', topic)
        .replace('{funny_observation}', observations[topic] || "surprisingly complex")
        .replace('{relatable_situation}', situations[topic] || "reality hits hard")
        .replace('{witty_insight}', insights[topic] || "life is what happens while you're making other plans")
        .replace('{funny_realization}', realizations[topic] || "we're all just winging it")
        .replace('{relatable_problem}', problems[topic] || "things don't go as planned")
        .replace('{technical_observation}', technicalObservations[topic] || "behaves unexpectedly")
        .replace('{funny_behavior}', funnyBehaviors[topic] || "does weird things")
        .replace('{technical_comparison}', technicalComparisons[topic] || "more advanced than expected");

      // Add hashtags if enabled
      if (aiConfig.includeHashtags) {
        const technicalHashtags = {
          "AI": ["#AI", "#MachineLearning", "#Tech"],
          "MachineLearning": ["#ML", "#DataScience", "#AI"],
          "QuantFinance": ["#QuantFinance", "#Trading", "#Finance"],
          "Trading": ["#Trading", "#Quantitative", "#Finance"],
          "DataScience": ["#DataScience", "#ML", "#Analytics"],
          "DeepLearning": ["#DeepLearning", "#AI", "#NeuralNetworks"],
          "Quantitative": ["#Quantitative", "#Finance", "#Trading"],
          "Programming": ["#Programming", "#Tech", "#Coding"]
        };
        const hashtags = technicalHashtags[topic] || [`#${topic}`, "#Tech", "#AI"];
        tweet += ` ${hashtags.slice(0, aiConfig.hashtagCount || 3).join(' ')}`;
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
      
      // Generate AI image for the tweet
      const imageData = await this.generateAIImage(text);
      
      // Post the tweet (with image if available)
      let tweet;
      if (imageData && (imageData.imageUrl || imageData.imageBuffer)) {
        try {
          let mediaId = null;
          
          if (imageData.imageBuffer) {
            // Direct upload from buffer (Gemini)
            mediaId = await this.rwClient.v1.uploadMedia(imageData.imageBuffer, { mimeType: 'image/jpeg' });
            this.log(`Image uploaded directly from buffer (Media ID: ${mediaId})`);
          } else if (imageData.imageUrl) {
            // Download and upload from URL (Grok)
            mediaId = await this.uploadImageToTwitter(imageData.imageUrl);
            this.log(`Image uploaded from URL (Media ID: ${mediaId})`);
          }
          
          if (mediaId) {
            tweet = await this.rwClient.v2.tweet(text, { media: { media_ids: [mediaId] } });
            this.log(`Tweet posted with image from ${imageData.source} (Media ID: ${mediaId})`);
          } else {
            tweet = await this.rwClient.v2.tweet(text);
            this.log(`Image generation failed, posted text only`);
          }
        } catch (error) {
          this.log(`Error posting tweet with image: ${error.message}`);
          tweet = await this.rwClient.v2.tweet(text);
        }
      } else {
        tweet = await this.rwClient.v2.tweet(text);
      }
      
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
        throw new Error('Twitter API authentication failed. Please check your credentials.');
      } else if (error.code === 429) {
        this.log('Rate limit exceeded - will retry later');
        throw new Error('Twitter API rate limit exceeded. Please wait before trying again.');
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
      } else if (error.data?.detail?.includes('length')) {
        this.log('Tweet too long - truncating');
        // Try with a shorter tweet
        if (text && text.length > 280) {
          const truncatedText = text.substring(0, 277) + '...';
          return this.postTweet(truncatedText);
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

    try {
      // Post every 5 minutes for high engagement
      cron.schedule('*/5 * * * *', async () => {
        this.log('Scheduled post every 5 minutes');
        try {
          await this.postTweet();
        } catch (error) {
          this.log(`Scheduled post failed: ${error.message}`);
        }
      }, {
        timezone: 'America/New_York'
      });

      // Also post at peak times for maximum visibility
      // 9:00 AM EST - Morning coffee time
      cron.schedule('0 9 * * *', async () => {
        this.log('Scheduled post at 9:00 AM (peak time)');
        try {
          await this.postTweet();
        } catch (error) {
          this.log(`Scheduled post failed: ${error.message}`);
        }
      }, {
        timezone: 'America/New_York'
      });

      // 12:00 PM EST - Lunch break
      cron.schedule('0 12 * * *', async () => {
        this.log('Scheduled post at 12:00 PM (lunch time)');
        try {
          await this.postTweet();
        } catch (error) {
          this.log(`Scheduled post failed: ${error.message}`);
        }
      }, {
        timezone: 'America/New_York'
      });

      // 5:00 PM EST - End of work day
      cron.schedule('0 17 * * *', async () => {
        this.log('Scheduled post at 5:00 PM (end of work day)');
        try {
          await this.postTweet();
        } catch (error) {
          this.log(`Scheduled post failed: ${error.message}`);
        }
      }, {
        timezone: 'America/New_York'
      });

      // 8:00 PM EST - Evening social time
      cron.schedule('0 20 * * *', async () => {
        this.log('Scheduled post at 8:00 PM (evening social)');
        try {
          await this.postTweet();
        } catch (error) {
          this.log(`Scheduled post failed: ${error.message}`);
        }
      }, {
        timezone: 'America/New_York'
      });

      this.log('Scheduler started successfully - posting every 5 minutes + peak times');
    } catch (error) {
      this.log(`Failed to start scheduler: ${error.message}`);
      throw error;
    }
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
        if (customText) {
          await bot.postTweet(customText);
        } else {
          console.log('Please provide tweet text: node bot.js post "Your tweet here"');
        }
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
    console.error('Please check your bot.env file and ensure all required environment variables are set.');
    process.exit(1);
  }
}

// Export for use as module
module.exports = TwitterBot;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}