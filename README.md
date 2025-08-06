# Twitter Bot - Automated Tweet Scheduler

A Node.js Twitter bot that automatically posts tweets at scheduled times with AI-powered content generation.

## 🐛 Recent Bug Fixes

### Fixed Issues:
1. **Environment File Path**: Fixed bot to use `bot.env` instead of `.env`
2. **Railway Deployment**: Added support for Railway environment variables
3. **Error Handling**: Improved error handling for Twitter API errors
4. **Tweet Length Validation**: Added automatic truncation for tweets exceeding 280 characters
5. **Duplicate Tweet Handling**: Enhanced recursion prevention for duplicate tweets
6. **Initialization Errors**: Added try-catch blocks around critical initialization code
7. **Command Line Arguments**: Fixed handling of missing command line arguments

### Key Improvements:
- Better error messages for authentication and rate limit issues
- Automatic tweet truncation when content exceeds character limit
- Enhanced logging and debugging information
- Improved file initialization with proper error handling

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Make sure your `bot.env` file contains your Twitter API credentials:
```
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

### 3. Test the Bot
```bash
node test-twitter.js
```

### 4. Deploy to Railway (Recommended)
For 24/7 cloud deployment:
1. Push your code to GitHub
2. Deploy to Railway: [railway.app](https://railway.app)
3. Add environment variables in Railway dashboard
4. See `DEPLOYMENT.md` for detailed instructions

### 5. Run Commands

#### Test the bot (posts a real tweet):
```bash
node bot.js test
```

#### Post a custom tweet:
```bash
node bot.js post "Your custom tweet here"
```

#### Add a new tweet to content:
```bash
node bot.js add "Your new tweet content"
```

#### View bot statistics:
```bash
node bot.js stats
```

#### Start the scheduler:
```bash
node bot.js start
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `test` | Test the bot with a real tweet |
| `post "text"` | Post a custom tweet |
| `add "text"` | Add new tweet to content file |
| `stats` | Show bot statistics |
| `ai-config` | Show AI configuration |
| `ai-enable` | Enable AI tweet generation |
| `ai-disable` | Disable AI tweet generation |
| `ai-prompt "text"` | Update AI prompt |
| `start` | Start the scheduler |

## ⚙️ Configuration

### Schedule Times
The bot posts at these times (EST):
- 9:00 AM
- 2:30 PM  
- 7:00 PM

### AI Configuration
The bot includes AI-powered tweet generation with:
- Template-based content generation
- Hashtag inclusion
- Topic variety (technology, life, humor, current events)
- Character limit enforcement

### Files Created
- `content.json` - Tweet content and schedules
- `posted_tweets.json` - Track posted tweets
- `bot.log` - Bot activity log
- `ai-config.json` - AI configuration settings

## 🔧 Troubleshooting

### Common Issues:

1. **Authentication Error (403)**
   - Check your Twitter API credentials in `bot.env`
   - Ensure your app has "Read and Write" permissions
   - Verify all credentials are from the same Twitter app

2. **Rate Limit Error (429)**
   - Wait before trying again
   - Twitter has rate limits on posting

3. **Module Not Found**
   - Run `npm install` to install dependencies

4. **Environment Variables Missing**
   - Check that `bot.env` file exists and contains all required variables

### Testing:
```bash
# Test bot initialization
node test-twitter.js

# Test with real tweet
node bot.js test

# Check bot status
node bot.js stats
```

## 📊 Features

- ✅ Automated scheduled posting
- ✅ AI-powered content generation
- ✅ Duplicate tweet prevention
- ✅ Error handling and logging
- ✅ Custom tweet posting
- ✅ Statistics tracking
- ✅ Configurable AI settings
- ✅ Character limit enforcement

## 🤖 AI Features

The bot includes intelligent tweet generation with:
- Template-based content creation
- Topic variety and rotation
- Hashtag management
- Character limit compliance
- Relatable and engaging content

## 📝 License

MIT License - feel free to use and modify as needed.

## 🆘 Support

If you encounter issues:
1. Check the `bot.log` file for error details
2. Verify your Twitter API credentials
3. Ensure all dependencies are installed
4. Test with `node test-twitter.js` first 