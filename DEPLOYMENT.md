<<<<<<< HEAD
# Railway Deployment Guide

## 🚀 Deploying to Railway

### 1. Environment Variables Setup

Railway requires environment variables to be set in the dashboard. You need to add these variables:

**Required Variables:**
- `TWITTER_API_KEY` - Your Twitter API Key
- `TWITTER_API_SECRET` - Your Twitter API Secret  
- `TWITTER_ACCESS_TOKEN` - Your Twitter Access Token
- `TWITTER_ACCESS_SECRET` - Your Twitter Access Secret

**Optional Variables:**
- `TWITTER_BEARER_TOKEN` - Your Twitter Bearer Token

### 2. Railway Dashboard Setup

1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Create a new project
4. Choose "Deploy from GitHub repo"
5. Connect your repository
6. Go to the "Variables" tab
7. Add each environment variable listed above

### 3. Environment Variables Values

Copy these values from your `bot.env` file:

```
TWITTER_API_KEY=l1ChDDyL64OoCbFuEkSEmilzS
TWITTER_API_SECRET=z3ZQxJl64ZnhNsuF40lxZbUYJHrHRT9aHZ3iTWTM6Z68h3J29D
TWITTER_ACCESS_TOKEN=1067437236600360960-EHp1xIhACeLKNazFD88DhDm6kbgvKF
TWITTER_ACCESS_SECRET=6Q7ERbTHKrqATdwfVJ5fstd17HVAjoAcmhuVBQeeRuv3u
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAOSw3QEAAAAAOMfwFtjDwcAga15p8YzfbInkHgw%3DPJ6Fu0EYDtJitsbb9gLsc0ZvCKYkgDtk9rspwiVm2a7oRt6OkS
```

### 4. Deployment Commands

Railway will automatically run these commands:
- **Build**: `npm install`
- **Start**: `npm start` (which runs `node bot.js start`)

### 5. Troubleshooting

#### Environment Variables Not Found
If you get "Missing required environment variables" error:

1. **Check Railway Dashboard**: Go to your project → Variables tab
2. **Verify Variable Names**: Make sure they match exactly (case-sensitive)
3. **Redeploy**: After adding variables, redeploy your project

#### Common Issues:

1. **Variables not loading**: 
   - Make sure variables are added in Railway dashboard
   - Check that variable names match exactly
   - Redeploy after adding variables

2. **Authentication errors**:
   - Verify your Twitter API credentials are correct
   - Ensure your Twitter app has "Read and Write" permissions

3. **Build failures**:
   - Check that `package.json` exists and is valid
   - Ensure all dependencies are listed in `package.json`

### 6. Monitoring

- **Logs**: Check Railway dashboard → Deployments → View logs
- **Status**: Monitor deployment status in Railway dashboard
- **Restarts**: Railway will automatically restart on failures

### 7. Bot Commands (After Deployment)

Once deployed, you can run commands via Railway's shell:

```bash
# Test the bot
node bot.js test

# Check stats
node bot.js stats

# Enable AI
node bot.js ai-enable

# Set custom prompt
node bot.js ai-prompt "Your custom prompt here"
```

### 8. Automatic Scheduling

The bot will automatically:
- Start posting at scheduled times (9 AM, 2:30 PM, 7 PM EST)
- Generate AI-powered content
- Avoid duplicate tweets
- Log all activities

### 9. Security Notes

- Never commit `.env` files to Git
- Use Railway's environment variables for sensitive data
- Regularly rotate your Twitter API credentials
- Monitor your bot's activity and logs

## 🎉 Success!

Once deployed, your bot will run 24/7 in the cloud and automatically post tweets at scheduled times! 
=======
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
>>>>>>> a1622bf7430c2dbe57895253cc7bf8ee8c39f7c5
