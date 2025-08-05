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
```bash
node bot.js post "Your custom tweet here"
```

### Add a new tweet to the pool
```bash
node bot.js add "Your new tweet here"
```

### View bot statistics
```bash
node bot.js stats
```

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