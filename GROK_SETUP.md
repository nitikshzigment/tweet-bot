# Grok API Integration Setup

## 🎨 AI Image Generation with Grok API

Your Twitter bot now includes AI image generation using the Grok API from xAI. Here's how to set it up:

## 📋 Setup Instructions

### 1. Get Grok API Key
1. Go to [console.x.ai](https://console.x.ai)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the API key (starts with `xai-`)

### 2. Add API Key to Environment

#### For Local Development:
Add to your `bot.env` file:
```
GROK_API_KEY=xai-your-actual-api-key-here
```

#### For Railway Deployment:
Add to Railway dashboard environment variables:
```
GROK_API_KEY=xai-your-actual-api-key-here
```

### 3. Add Credits (Required)
The Grok API requires credits to generate images:
1. Go to [console.x.ai/team](https://console.x.ai/team)
2. Purchase credits for your team
3. Minimum credits needed for image generation

## 🚀 Features

### Technical Image Generation
- **AI/ML Visualizations**: Neural networks, algorithms, data science concepts
- **Quant Finance**: Trading charts, risk models, portfolio analytics
- **Professional Style**: Clean, modern, technical diagrams
- **Automatic Integration**: Images attached to tweets automatically

### Image Prompts
The bot generates technical prompts like:
- "Create a technical visualization of neural network concept, digital art style, professional, clean, modern, technical diagram, futuristic, blue and white color scheme"
- "Create a technical visualization of machine learning concept, digital art style, professional, clean, modern, technical diagram, futuristic, blue and white color scheme"

### High-Frequency Posting
- **Every 5 minutes**: Maximum engagement
- **Peak times**: 9 AM, 12 PM, 5 PM, 8 PM EST
- **Technical content**: AI/ML/Quant finance focus
- **Visual tweets**: Images + technical text

## 🔧 Troubleshooting

### Common Issues:

1. **"Your newly created teams doesn't have any credits yet"**
   - Solution: Purchase credits at [console.x.ai/team](https://console.x.ai/team)

2. **"API key not found"**
   - Solution: Add `GROK_API_KEY` to environment variables

3. **Image generation fails**
   - Bot will post text-only tweets as fallback
   - Check logs for specific error messages

4. **Rate limiting**
   - Grok API has rate limits
   - Bot handles gracefully with text-only posts

## 📊 Expected Results

With Grok API properly configured, your bot will:
- ✅ Generate technical AI/ML visualizations
- ✅ Post high-frequency technical content
- ✅ Attract AI/ML/Quant professionals
- ✅ Build technical Twitter personality
- ✅ Increase engagement with visual content

## 🎯 Next Steps

1. **Add your Grok API key** to environment variables
2. **Purchase credits** on console.x.ai
3. **Deploy to Railway** for 24/7 operation
4. **Monitor engagement** and adjust content strategy

Your bot is now ready to become a technical AI/ML/Quant finance influencer! 🚀 