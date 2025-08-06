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