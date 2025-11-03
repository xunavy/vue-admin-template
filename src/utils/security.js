// 安全工具函数
// 包含加密、解密、哈希等功能

import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import securityConfig from '@/config/security'

// 加密函数
export const encrypt = (data) => {
  if (!data) return ''
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), securityConfig.encryption.key, {
    iv: CryptoJS.enc.Utf8.parse(securityConfig.encryption.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return cipher.toString()
}

// 解密函数
export const decrypt = (encryptedData) => {
  if (!encryptedData) return ''
  const decipher = CryptoJS.AES.decrypt(encryptedData, securityConfig.encryption.key, {
    iv: CryptoJS.enc.Utf8.parse(securityConfig.encryption.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return JSON.parse(decipher.toString(CryptoJS.enc.Utf8))
}

// 哈希函数
export const hash = (data) => {
  if (!data) return ''
  return CryptoJS.SHA256(data + securityConfig.encryption.key).toString()
}

// 生成JWT令牌
export const generateToken = (payload) => {
  return jwt.sign(payload, securityConfig.jwt.secret, {
    expiresIn: securityConfig.jwt.expiresIn
  })
}

// 验证JWT令牌
export const validateToken = (token) => {
  if (!token) return false
  try {
    jwt.verify(token, securityConfig.jwt.secret)
    return true
  } catch (error) {
    return false
  }
}

// 解析JWT令牌
export const parseToken = (token) => {
  if (!token) return null
  try {
    return jwt.verify(token, securityConfig.jwt.secret)
  } catch (error) {
    return null
  }
}

// 生成刷新令牌
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, securityConfig.jwt.secret, {
    expiresIn: securityConfig.jwt.refreshTokenExpiresIn
  })
}

// 验证刷新令牌
export const validateRefreshToken = (token) => {
  if (!token) return false
  try {
    jwt.verify(token, securityConfig.jwt.secret)
    return true
  } catch (error) {
    return false
  }
}

// 刷新访问令牌
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken || !validateRefreshToken(refreshToken)) {
    return null
  }
  
  try {
    const decoded = jwt.verify(refreshToken, securityConfig.jwt.secret)
    const newToken = generateToken({
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    })
    return newToken
  } catch (error) {
    return null
  }
}

// 生成CSRF令牌
export const generateCSRFToken = () => {
  return CryptoJS.SHA256(Math.random().toString(36) + Date.now() + securityConfig.csrf.secret).toString()
}

// 验证CSRF令牌
export const validateCSRFToken = (token1, token2) => {
  if (!token1 || !token2) return false
  return token1 === token2
}

// 防止SQL注入
export const preventSQLInjection = (value) => {
  if (typeof value === 'string') {
    // 移除危险的SQL关键词
    return value.replace(/('|"|;|--|\/\*|\*\/|xp_cmdshell|exec|select|insert|update|delete|drop|alter|create|union|join|where|and|or|not|like|in|between|order|by|group|having|limit|offset|fetch|into|outfile|load_file|dumpfile|concat|char|hex|unhex|cast|convert|declare|set|exec|execute|xp_)/gi, '')
  }
  return value
}

// 防止XSS攻击
export const preventXSS = (value) => {
  if (typeof value === 'string') {
    // 转义HTML特殊字符
    value = value.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/=/g, '&#x3D;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/\$/g, '&#x24;')
      
    // 移除危险的JavaScript协议
    value = value.replace(/javascript:/gi, '')
    value = value.replace(/vbscript:/gi, '')
    value = value.replace(/data:/gi, '')
    
    // 移除危险的HTML事件处理程序
    value = value.replace(/onload=/gi, '')
    value = value.replace(/onerror=/gi, '')
    value = value.replace(/onclick=/gi, '')
    value = value.replace(/onmouseover=/gi, '')
    value = value.replace(/onkeydown=/gi, '')
    value = value.replace(/onkeyup=/gi, '')
    value = value.replace(/onsubmit=/gi, '')
    value = value.replace(/onreset=/gi, '')
    value = value.replace(/onfocus=/gi, '')
    value = value.replace(/onblur=/gi, '')
  }
  return value
}