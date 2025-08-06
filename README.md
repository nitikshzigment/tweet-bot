<<<<<<< HEAD
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
=======
# Twitter Bot

An automated Twitter posting bot that schedules and posts tweets at specified times.

## Features

- **Scheduled Posting**: Automatically posts tweets at 9:00 AM, 2:30 PM, and 7:00 PM EST
- **Random Tweet Selection**: Chooses from a pool of tweets, avoiding recent duplicates
- **Duplicate Prevention**: Tracks posted tweets to avoid repetition
- **CLI Interface**: Easy-to-use command line interface
- **Logging**: Comprehensive logging of all activities
- **Statistics**: Track bot performance and posted tweets

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   copy bot.env .env
   ```
4. Edit `.env` file with your Twitter API credentials

## Twitter API Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app and get your API credentials
3. Update the `.env` file with your credentials:
   ```
   TWITTER_API_KEY=your_api_key_here
   TWITTER_API_SECRET=your_api_secret_here
   TWITTER_ACCESS_TOKEN=your_access_token_here
   TWITTER_ACCESS_SECRET=your_access_token_secret_here
   ```

## Usage

### Start the scheduler (posts at scheduled times)
```bash
npm start
# or
node bot.js start
```

### Test the bot (posts immediately)
```bash
npm test
# or
node bot.js test
```

### Post a custom tweet
>>>>>>> a1622bf7430c2dbe57895253cc7bf8ee8c39f7c5
```bash
node bot.js post "Your custom tweet here"
```

<<<<<<< HEAD
#### Add a new tweet to content:
```bash
node bot.js add "Your new tweet content"
```

#### View bot statistics:
=======
### Add a new tweet to the pool
```bash
node bot.js add "Your new tweet here"
```

### View bot statistics
>>>>>>> a1622bf7430c2dbe57895253cc7bf8ee8c39f7c5
```bash
node bot.js stats
```

<<<<<<< HEAD
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
=======
## Bugs Fixed

The following bugs were identified and fixed in this codebase:

### 1. **Missing Environment Validation**
- **Issue**: No validation for required environment variables
- **Fix**: Added `validateEnvironment()` method that checks for all required Twitter API credentials
- **Impact**: Prevents cryptic errors when API keys are missing

### 2. **Infinite Recursion in Duplicate Handling**
- **Issue**: When handling duplicate tweets, the `postTweet()` method called itself recursively without limits
- **Fix**: Added recursion depth tracking with `maxRecursionDepth` to prevent infinite loops
- **Impact**: Prevents bot from getting stuck in infinite loops

### 3. **Async Initialization Issues**
- **Issue**: `initializeFiles()` was called in constructor but not awaited, causing race conditions
- **Fix**: Made initialization properly async and added proper error handling in main function
- **Impact**: Ensures files are created before any operations begin

### 4. **Missing .env File**
- **Issue**: Code expected `.env` file but only had `bot.env`
- **Fix**: Created proper `.env` file from `bot.env` template
- **Impact**: Allows dotenv to properly load environment variables

### 5. **Syntax Error in Commented Code**
- **Issue**: Invalid cron syntax in commented-out code was causing parsing errors
- **Fix**: Properly commented out the problematic cron schedule
- **Impact**: Prevents syntax errors when loading the module

### 6. **Improved Error Handling**
- **Issue**: Limited error handling and recovery mechanisms
- **Fix**: Added comprehensive error handling with proper logging and graceful failures
- **Impact**: Better debugging and more robust operation

## File Structure

```
twitter-bot/
├── bot.js              # Main bot implementation
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create from bot.env)
├── bot.env            # Environment template
├── content.json       # Tweet pool (auto-generated)
├── posted_tweets.json # Posted tweets tracking (auto-generated)
└── bot.log           # Bot activity log (auto-generated)
```

## Configuration

### Tweet Pool
Edit `content.json` to add or modify tweets:
```json
{
  "tweets": [
    "Your tweet here",
    "Another tweet here"
  ],
  "schedules": [
    { "time": "09:00", "timezone": "America/New_York" },
    { "time": "14:30", "timezone": "America/New_York" },
    { "time": "19:00", "timezone": "America/New_York" }
  ]
}
```

### Scheduling
The bot posts at:
- 9:00 AM EST
- 2:30 PM EST  
- 7:00 PM EST

You can modify the schedule in the `startScheduler()` method.

## Dependencies

- `twitter-api-v2`: Twitter API client
- `node-cron`: Cron job scheduling
- `dotenv`: Environment variable management
- `fs-extra`: Enhanced file system operations

## License

MIT License 
>>>>>>> a1622bf7430c2dbe57895253cc7bf8ee8c39f7c5
