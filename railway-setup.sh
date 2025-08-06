#!/bin/bash

echo "🚀 Railway Deployment Setup"
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Twitter bot with Railway deployment fixes"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Railway Deployment Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up and connect GitHub"
echo "   - Create new project → Deploy from GitHub repo"
echo ""
echo "3. Add Environment Variables in Railway Dashboard:"
echo "   Go to your project → Variables tab and add:"
echo ""
echo "   TWITTER_API_KEY=l1ChDDyL64OoCbFuEkSEmilzS"
echo "   TWITTER_API_SECRET=z3ZQxJl64ZnhNsuF40lxZbUYJHrHRT9aHZ3iTWTM6Z68h3J29D"
echo "   TWITTER_ACCESS_TOKEN=1067437236600360960-EHp1xIhACeLKNazFD88DhDm6kbgvKF"
echo "   TWITTER_ACCESS_SECRET=6Q7ERbTHKrqATdwfVJ5fstd17HVAjoAcmhuVBQeeRuv3u"
echo "   TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAOSw3QEAAAAAOMfwFtjDwcAga15p8YzfbInkHgw%3DPJ6Fu0EYDtJitsbb9gLsc0ZvCKYkgDtk9rspwiVm2a7oRt6OkS"
echo ""
echo "4. After deployment, your bot will:"
echo "   - Run 24/7 in the cloud"
echo "   - Post tweets at 9 AM, 2:30 PM, and 7 PM EST"
echo "   - Generate AI-powered content"
echo "   - Avoid duplicate tweets"
echo ""
echo "🎉 Your bot will be live and automated!" 