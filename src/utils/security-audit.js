// 安全审计日志功能
// 记录安全相关的事件，如登录失败、权限验证失败等

import axios from 'axios'
import store from '@/store'

// 安全事件类型
const SecurityEventType = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  PERMISSION_DENIED: 'permission_denied',
  TOKEN_EXPIRED: 'token_expired',
  TOKEN_REFRESHED: 'token_refreshed',
  CSRF_TOKEN_MISSING: 'csrf_token_missing',
  SQL_INJECTION_DETECTED: 'sql_injection_detected',
  XSS_ATTACK_DETECTED: 'xss_attack_detected',
  BRUTE_FORCE_ATTEMPT: 'brute_force_attempt'
}

// 记录安全事件
const logSecurityEvent = async (eventType, details = {}) => {
  try {
    const user = store.getters.userInfo || {};
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      userId: user.id || null,
      username: user.username || null,
      ipAddress: await getClientIP(),
      userAgent: navigator.userAgent,
      details: JSON.stringify(details)
    };

    // 发送安全事件到服务器
    await axios.post('/api/security-audit/log', event);
  } catch (error) {
    // 如果日志记录失败，不影响主业务流程
    console.error('Failed to log security event:', error);
  }
}

// 获取客户端IP地址
const getClientIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Failed to get client IP:', error);
    return 'unknown';
  }
}

// 检测暴力破解尝试
const detectBruteForce = (username) => {
  // 简单的暴力破解检测逻辑
  // 在实际应用中，应该使用更复杂的算法和持久化存储
  const bruteForceKey = `brute_force_${username}`;
  const attempts = JSON.parse(localStorage.getItem(bruteForceKey) || '[]');
  const now = Date.now();
  
  // 只保留最近15分钟的尝试记录
  const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);
  
  // 如果最近15分钟内尝试次数超过5次，认为是暴力破解
  if (recentAttempts.length > 5) {
    logSecurityEvent(SecurityEventType.BRUTE_FORCE_ATTEMPT, { username });
    return true;
  }
  
  return false;
}

// 记录登录失败尝试
const logLoginFailedAttempt = (username, reason) => {
  const bruteForceKey = `brute_force_${username}`;
  const attempts = JSON.parse(localStorage.getItem(bruteForceKey) || '[]');
  attempts.push(Date.now());
  localStorage.setItem(bruteForceKey, JSON.stringify(attempts));
  
  logSecurityEvent(SecurityEventType.LOGIN_FAILED, { username, reason });
}

// 清除登录失败尝试记录
const clearLoginFailedAttempts = (username) => {
  const bruteForceKey = `brute_force_${username}`;
  localStorage.removeItem(bruteForceKey);
}

// 记录SQL注入检测
const logSQLInjectionDetected = (data, path) => {
  logSecurityEvent(SecurityEventType.SQL_INJECTION_DETECTED, { data, path });
}

// 记录XSS攻击检测
const logXSSAttackDetected = (data, path) => {
  logSecurityEvent(SecurityEventType.XSS_ATTACK_DETECTED, { data, path });
}

export {
  SecurityEventType,
  logSecurityEvent,
  detectBruteForce,
  logLoginFailedAttempt,
  clearLoginFailedAttempts,
  logSQLInjectionDetected,
  logXSSAttackDetected
}