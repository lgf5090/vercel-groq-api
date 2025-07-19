export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const API_HOST = "api.groq.com";
  
  try {
    // 获取原始 URL 并替换 host
    const url = new URL(request.url);
    url.hostname = API_HOST;
    url.protocol = 'https:';
    
    // 创建新的 headers，移除可能导致问题的 headers
    const headers = new Headers(request.headers);
    
    // 移除 Vercel 特定的 headers
    headers.delete('x-forwarded-for');
    headers.delete('x-forwarded-proto');
    headers.delete('x-forwarded-host');
    headers.delete('x-vercel-*');
    
    // 设置正确的 host header
    headers.set('host', API_HOST);
    
    // 创建代理请求
    const proxyRequest = new Request(url.toString(), {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? request.body 
        : undefined,
      redirect: "follow",
    });
    
    // 发送请求到目标 API
    const response = await fetch(proxyRequest);
    
    // 创建新的响应，保持所有响应头和状态
    const proxyResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    
    // 添加 CORS 头（如果需要）
    proxyResponse.headers.set('Access-Control-Allow-Origin', '*');
    proxyResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return proxyResponse;
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Proxy error', 
        message: error.message 
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}