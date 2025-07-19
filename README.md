
# Groq API Proxy
vercel-groq-api

A simple proxy service for Groq API using Vercel Edge Functions.

## Features

- ✅ Edge runtime for better performance
- ✅ Automatic request forwarding
- ✅ CORS support
- ✅ Error handling

## Usage

After deployment, replace `api.groq.com` with your Vercel domain:

```bash
# Original
curl https://api.groq.com/v1/models

# Through proxy
curl https://your-proxy.vercel.app/v1/models

