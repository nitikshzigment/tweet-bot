# 🚀 Cloud Deployment Guide

## Option 1: Railway (Recommended - Easiest)

### Step 1: Prepare Your Code
1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Deploy to Railway
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub** account
3. **Create a new project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Add environment variables** in Railway dashboard:
   ```
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_SECRET=your_access_secret
   TWITTER_BEARER_TOKEN=your_bearer_token
   ```

### Step 3: Configure the Bot
1. **Enable AI** (optional):
   ```bash
   # You can do this locally before deploying
   node bot.js ai-enable
   ```

2. **Set custom prompt** (optional):
   ```bash
   node bot.js ai-prompt "Your custom prompt here"
   ```

## Option 2: Render

### Step 1: Prepare for Render
1. **Create a `render.yaml`** file:
   ```yaml
   services:
     - type: worker
       name: twitter-bot
       env: node
       buildCommand: npm install
       startCommand: node bot.js start
       envVars:
         - key: TWITTER_API_KEY
           value: your_api_key
         - key: TWITTER_API_SECRET
           value: your_api_secret
         - key: TWITTER_ACCESS_TOKEN
           value: your_access_token
         - key: TWITTER_ACCESS_SECRET
           value: your_access_secret
         - key: TWITTER_BEARER_TOKEN
           value: your_bearer_token
   ```

### Step 2: Deploy to Render
1. **Sign up** at [render.com](https://render.com)
2. **Connect GitHub** and select your repo
3. **Create a new Web Service**
4. **Add environment variables** in the dashboard

## Option 3: Vercel (Alternative)

### Step 1: Prepare for Vercel
1. **Create a `vercel.json`** file:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "bot.js",
         "use": "@vercel/node"
       }
     ],
     "functions": {
       "bot.js": {
         "maxDuration": 30
       }
     }
   }
   ```

### Step 2: Deploy to Vercel
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard

## 🔧 Environment Variables Setup

### Required Variables:
```
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

### Optional Variables:
```
# For OpenAI integration (future feature)
OPENAI_API_KEY=your_openai_key_here
```

## 📊 Monitoring Your Bot

### Check Bot Status:
- **Railway**: Dashboard shows logs and status
- **Render**: Dashboard with real-time logs
- **Vercel**: Function logs in dashboard

### View Bot Statistics:
```bash
# If you have CLI access
node bot.js stats
```

## 🔄 Updating Your Bot

### Method 1: Git Push (Automatic)
```bash
git add .
git commit -m "Update bot"
git push origin main
```

### Method 2: Manual Update
1. **Edit files** in your cloud platform's dashboard
2. **Redeploy** the service

## 🛠️ Troubleshooting

### Common Issues:

1. **Bot not posting**:
   - Check environment variables are set correctly
   - Verify Twitter API credentials
   - Check logs for errors

2. **Scheduler not working**:
   - Ensure timezone is set correctly
   - Check if the service is running

3. **AI not generating tweets**:
   - Run `node bot.js ai-enable` locally first
   - Check AI configuration in logs

### Debug Commands:
```bash
# Test locally first
node bot.js test

# Check AI configuration
node bot.js ai-config

# View statistics
node bot.js stats
```

## 💡 Tips for Cloud Deployment

1. **Always test locally** before deploying
2. **Keep your `.env` file secure** (never commit it)
3. **Monitor your bot** regularly
4. **Set up alerts** for failures
5. **Use the free tier wisely** - some platforms have usage limits

## 🎯 Recommended Setup

**For beginners**: Use **Railway** - it's the easiest to set up and has good free tier limits.

**For advanced users**: Use **Render** - more control and better monitoring.

**For web apps**: Use **Vercel** - if you plan to add a web interface later. 