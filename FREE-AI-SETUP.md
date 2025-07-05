# Free AI Setup Guide

This guide will help you set up free AI alternatives to OpenAI for your smart portfolio project.

## 🎯 Overview

We've replaced OpenAI with free alternatives:
- **Ollama** (local, free) - Primary AI model
- **Hugging Face** (free tier) - Embeddings and fallback
- **Mock responses** - Fallback when services are unavailable

## 🚀 Quick Setup

### Option 1: Ollama (Recommended - Local & Free)

1. **Install Ollama**
   ```bash
   # macOS
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. **Pull a free model**
   ```bash
   # Llama 3.1 (8B parameters - good balance of speed/quality)
   ollama pull llama3.1:8b
   
   # Or try other free models:
   ollama pull gemma:2b        # Smaller, faster
   ollama pull mistral:7b      # Good quality
   ollama pull codellama:7b    # Code-focused
   ```

3. **Start Ollama**
   ```bash
   ollama serve
   ```

4. **Test the model**
   ```bash
   ollama run llama3.1:8b "Hello, how are you?"
   ```

### Option 2: Hugging Face (Cloud-based, Free Tier)

1. **Get a free API key**
   - Go to [Hugging Face](https://huggingface.co/)
   - Create an account
   - Go to Settings → Access Tokens
   - Create a new token

2. **Set environment variable**
   ```bash
   HUGGINGFACE_API_KEY=your_token_here
   ```

## ⚙️ Environment Configuration

Create or update your `.env.local` file:

```bash
# Ollama Configuration (Local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Hugging Face Configuration (Optional)
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Configuration (Required for some features)
GITHUB_TOKEN=your_github_token
```

## 🔧 Model Configuration

### Available Models

#### Ollama Models (Free)
- `llama3.1:8b` - Good balance of speed and quality
- `gemma:2b` - Fast, good for simple tasks
- `mistral:7b` - High quality, slower
- `codellama:7b` - Specialized for code
- `llama3.1:70b` - Highest quality, requires more RAM

#### Hugging Face Models (Free)
- `microsoft/DialoGPT-medium` - Conversational AI
- `gpt2` - Text generation
- `sentence-transformers/all-MiniLM-L6-v2` - Embeddings

### Changing Models

1. **For Ollama:**
   ```bash
   # Pull a different model
   ollama pull gemma:2b
   
   # Update environment variable
   OLLAMA_MODEL=gemma:2b
   ```

2. **For Hugging Face:**
   Update the model name in `src/lib/freeAIService.ts`

## 🧪 Testing Your Setup

### Test Ollama
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test a model
ollama run llama3.1:8b "What is 2+2?"
```

### Test the Chat API
```bash
# Start your development server
npm run dev

# Test the chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello, tell me about your skills"}]}'
```

### Test Stack Validation
```bash
curl -X POST http://localhost:3000/api/validate-stack \
  -H "Content-Type: application/json" \
  -d '{"nodes":[{"id":"1","data":{"label":"React"}},{"id":"2","data":{"label":"Node.js"}}],"edges":[]}'
```

## 🔍 Troubleshooting

### Ollama Issues

1. **Model not found**
   ```bash
   # List available models
   ollama list
   
   # Pull the model again
   ollama pull llama3.1:8b
   ```

2. **Out of memory**
   ```bash
   # Use a smaller model
   ollama pull gemma:2b
   OLLAMA_MODEL=gemma:2b
   ```

3. **Slow responses**
   - Try a smaller model
   - Close other applications
   - Check system resources

### Hugging Face Issues

1. **Rate limiting**
   - Free tier has limits
   - Consider upgrading or using Ollama

2. **Model loading errors**
   - Check internet connection
   - Verify API key

### General Issues

1. **Fallback responses**
   - Check if Ollama is running
   - Verify environment variables
   - Check browser console for errors

2. **Embeddings not working**
   - Ensure Supabase is configured
   - Check Hugging Face model availability

## 📊 Performance Comparison

| Service | Speed | Quality | Cost | Setup |
|---------|-------|---------|------|-------|
| Ollama (Local) | Fast | Good | Free | Medium |
| Hugging Face | Medium | Good | Free | Easy |
| OpenAI | Fast | Excellent | Paid | Easy |

## 🔄 Migration from OpenAI

If you were previously using OpenAI:

1. **Remove OpenAI dependencies**
   ```bash
   npm uninstall @langchain/openai openai
   ```

2. **Update environment variables**
   - Remove `OPENAI_API_KEY`
   - Add Ollama/Hugging Face configs

3. **Test all features**
   - Chat functionality
   - Stack validation
   - Project descriptions
   - Resume analysis

## 🎉 Benefits of Free AI

✅ **No API costs** - Completely free to use
✅ **Privacy** - Data stays local with Ollama
✅ **No rate limits** - Use as much as you want
✅ **Customizable** - Choose your preferred models
✅ **Offline capable** - Ollama works without internet

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [Hugging Face Models](https://huggingface.co/models)
- [LangChain Community](https://js.langchain.com/docs/integrations/community/)
- [Model Comparison Guide](https://ollama.ai/library)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Test with a simple model first
4. Check the browser console for errors
5. Review the application logs

---

**Note:** Free AI models may have different capabilities than OpenAI's models. The responses might be less polished but are still functional for portfolio purposes. 