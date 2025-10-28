# 🔒 Security Guidelines - Electricity Tracker

## ⚠️ Critical Security Checklist

### Before Deploying to Production

- [ ] **Environment Variables**: All sensitive data moved to environment variables
- [ ] **JWT Secret**: Strong JWT key (min 32 characters) configured
- [ ] **Database Credentials**: Secure database password set
- [ ] **API Keys**: Gemini API key secured
- [ ] **CORS**: Restricted to specific domains only
- [ ] **HTTPS**: SSL/TLS enabled
- [ ] **Debug Logging**: Disabled in production

---

## 🔐 Environment Variables Setup

### Backend (TrackerAPI)

Create `appsettings.Production.json` (DO NOT commit to git):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_HOST;Database=YOUR_DB;Username=YOUR_USER;Password=YOUR_SECURE_PASSWORD"
  },
  "Jwt": {
    "Key": "YOUR_SUPER_SECRET_JWT_KEY_MIN_32_CHARS",
    "Issuer": "ElectricityTrackerAPI",
    "Audience": "ElectricityTrackerAPI",
    "ExpirationHours": 24
  },
  "GeminiAPI": {
    "ApiKey": "YOUR_GEMINI_API_KEY"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ]
  }
}
```

### Frontend (tracker-web)

Create `.env.local` (DO NOT commit to git):

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ENV=production
```

---

## 🛡️ Security Best Practices

### 1. JWT Token Management

✅ **Do:**
- Use strong, random keys (32+ characters)
- Set appropriate expiration times
- Store tokens securely (httpOnly cookies in production)
- Implement refresh token mechanism

❌ **Don't:**
- Use weak or default keys
- Store sensitive data in JWT payload
- Share tokens across different environments

### 2. Database Security

✅ **Do:**
- Use strong, unique passwords
- Enable SSL/TLS connections
- Implement connection pooling
- Regular backups
- Use parameterized queries (EF Core handles this)

❌ **Don't:**
- Use default credentials
- Store passwords in plain text
- Enable sensitive data logging in production

### 3. API Security

✅ **Do:**
- Implement rate limiting
- Use HTTPS only
- Validate all inputs
- Implement proper error handling
- Use CORS restrictions

❌ **Don't:**
- Expose internal error details
- Allow unlimited API requests
- Accept untrusted origins

### 4. Authentication & Authorization

✅ **Do:**
- Implement strong password policies
- Use bcrypt for password hashing
- Implement role-based access control
- Log authentication attempts
- Implement account lockout

❌ **Don't:**
- Store passwords in plain text
- Use weak hashing algorithms
- Skip authorization checks

---

## 📋 Security Checklist by Environment

### Development
- ✅ Debug logging enabled
- ✅ Detailed error messages
- ✅ Relaxed CORS (localhost)
- ⚠️ Use development secrets only

### Production
- ✅ HTTPS enforced
- ✅ CORS restricted to specific domains
- ✅ Debug logging disabled
- ✅ Strong JWT secrets
- ✅ Secure database credentials
- ✅ Rate limiting enabled
- ✅ Error details hidden
- ✅ Regular security audits

---

## 🚨 What to Do If Secrets Are Exposed

If you accidentally commit sensitive data to git:

1. **Rotate all secrets immediately**
   - Change database passwords
   - Regenerate JWT keys
   - Rotate API keys

2. **Remove from git history**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH_TO_FILE" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push (with caution)**
   ```bash
   git push origin --force --all
   ```

4. **Inform team members**
   - Notify all developers
   - Update deployment pipelines

---

## 📞 Security Contact

For security issues or vulnerabilities, please contact:
- Email: security@yourdomain.com
- Create a private security advisory on GitHub

---

## 🔄 Regular Security Maintenance

### Weekly
- [ ] Review access logs
- [ ] Check for suspicious activities
- [ ] Monitor rate limit violations

### Monthly
- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Audit user permissions

### Quarterly
- [ ] Security audit
- [ ] Penetration testing
- [ ] Update security documentation

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ASP.NET Core Security](https://docs.microsoft.com/en-us/aspnet/core/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

---

**Last Updated:** 2024
**Version:** 1.0

