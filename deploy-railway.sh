#!/bin/bash

echo "🚀 Twitter Bot Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Twitter bot with AI features"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ Environment file (.env) found"
    echo "⚠️  Remember to add your environment variables to Railway dashboard:"
    echo "   - TWITTER_API_KEY"
    echo "   - TWITTER_API_SECRET" 
    echo "   - TWITTER_ACCESS_TOKEN"
    echo "   - TWITTER_ACCESS_SECRET"
    echo "   - TWITTER_BEARER_TOKEN"
else
    echo "❌ No .env file found. Please create one with your Twitter credentials."
fi

echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up and connect GitHub"
echo "   - Create new project → Deploy from GitHub repo"
echo "   - Add environment variables in Railway dashboard"
echo ""
echo "3. Configure your bot:"
echo "   - Enable AI: node bot.js ai-enable"
echo "   - Set custom prompt: node bot.js ai-prompt 'Your prompt'"
echo ""
echo "🎉 Your bot will run 24/7 in the cloud!" 