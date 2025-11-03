// 安全配置文件
// 注意：在生产环境中，这些密钥应该存储在环境变量中，而不是硬编码在代码中

module.exports = {
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // 访问令牌有效期
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // 刷新令牌有效期
    algorithm: 'HS256' // 加密算法
  },
  
  // 密码哈希配置
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS || 12 // 哈希盐值的轮数
  },
  
  // 加密配置
  encryption: {
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    key: process.env.ENCRYPTION_KEY || 'your-encryption-key-change-me-in-production', // 32字节
    iv: process.env.ENCRYPTION_IV || 'your-encryption-iv-change-me-in-production' // 16字节
  },
  
  // CSRF配置
  csrf: {
    secret: process.env.CSRF_SECRET || 'your-csrf-secret-key-change-me-in-production'
  },
  
  // 安全头部配置
  securityHeaders: {
    hsts: true,
    xFrameOptions: 'DENY',
    xXssProtection: '1; mode=block',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' api.example.com",
    permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=()'
  },
  
  // 速率限制配置
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 每个IP在15分钟内最多允许100个请求
  },
  
  // 密码策略配置
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true,
    specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }
}