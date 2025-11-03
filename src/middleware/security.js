// 安全中间件 - 添加各种安全头部
const securityMiddleware = (req, res, next) => {
  // 设置HSTS头，强制使用HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // 设置X-Frame-Options头，防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY')
  
  // 设置X-XSS-Protection头，启用XSS过滤
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // 设置X-Content-Type-Options头，防止MIME类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // 设置Referrer-Policy头，控制Referrer信息
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // 设置Content-Security-Policy头，防止XSS和其他注入攻击
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' api.example.com")
  
  // 设置Permissions-Policy头，控制浏览器特性
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  
  // 设置Cache-Control头，防止敏感信息缓存
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  
  // 添加X-Request-Id头，用于请求跟踪
  res.setHeader('X-Request-Id', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  
  next()
}

export default securityMiddleware