# 🚀 Deployment Guide - Electricity Tracker

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure you've completed all items:

### Security
- [ ] All secrets moved to environment variables
- [ ] Strong JWT key configured (32+ characters)
- [ ] Database credentials secured
- [ ] CORS restricted to production domains
- [ ] HTTPS/SSL enabled
- [ ] Debug logging disabled in production

### Configuration
- [ ] `appsettings.Production.json` created and configured
- [ ] `.env.production` created for frontend
- [ ] Connection strings updated for production database
- [ ] API endpoints configured

### Testing
- [ ] All tests passing
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Cross-browser testing done

---

## 🔧 Environment Setup

### Backend Configuration

1. **Create Production Settings**
   
   Copy `TrackerAPI/appsettings.example.json` to `TrackerAPI/appsettings.Production.json`:
   
   ```bash
   cd TrackerAPI
   cp appsettings.example.json appsettings.Production.json
   ```

2. **Update Production Settings**
   
   Edit `appsettings.Production.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=YOUR_PRODUCTION_HOST;Database=YOUR_DB;Username=YOUR_USER;Password=YOUR_SECURE_PASSWORD"
     },
     "Jwt": {
       "Key": "YOUR_PRODUCTION_JWT_KEY_MIN_32_CHARACTERS",
       "Issuer": "ElectricityTrackerAPI",
       "Audience": "ElectricityTrackerAPI",
       "ExpirationHours": 24
     },
     "GeminiAPI": {
       "ApiKey": "YOUR_PRODUCTION_GEMINI_KEY"
     },
     "Cors": {
       "AllowedOrigins": [
         "https://yourdomain.com",
         "https://www.yourdomain.com"
       ]
     },
     "Logging": {
       "LogLevel": {
         "Default": "Warning",
         "Microsoft.AspNetCore": "Warning"
       }
     }
   }
   ```

### Frontend Configuration

1. **Create Production Environment File**
   
   Copy `tracker-web/env.example` to `tracker-web/.env.production`:
   
   ```bash
   cd tracker-web
   cp env.example .env.production
   ```

2. **Update Production Environment**
   
   Edit `.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_DEBUG=false
   NEXT_PUBLIC_ENV=production
   ```

---

## 🏗️ Building for Production

### Backend

```bash
cd TrackerAPI

# Restore dependencies
dotnet restore

# Build in Release mode
dotnet build -c Release

# Publish
dotnet publish -c Release -o ./publish

# The published files will be in ./publish directory
```

### Frontend

```bash
cd tracker-web

# Install dependencies
npm install

# Build for production
npm run build

# The built files will be in .next directory
```

---

## 🗄️ Database Setup

### Apply Migrations

```bash
cd TrackerAPI

# Update database with migrations
dotnet ef database update --configuration Release

# Or manually with SQL script
dotnet ef migrations script -o migration.sql
```

### Seed Data

By default, seeding is disabled in production. To enable:

```json
// appsettings.Production.json
{
  "DisableSeed": false
}
```

⚠️ **Warning:** Only enable seeding on first deployment, then disable it!

---

## 🚀 Deployment Options

### Option 1: Docker Deployment

#### Backend Dockerfile

Create `TrackerAPI/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["TrackerAPI.csproj", "./"]
RUN dotnet restore "TrackerAPI.csproj"
COPY . .
RUN dotnet build "TrackerAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TrackerAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrackerAPI.dll"]
```

#### Frontend Dockerfile

Create `tracker-web/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ElectricityTrackerDB
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build:
      context: ./TrackerAPI
      dockerfile: Dockerfile
    ports:
      - "5143:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=db;Database=ElectricityTrackerDB;Username=postgres;Password=${DB_PASSWORD}
    depends_on:
      - db
    networks:
      - app-network

  frontend:
    build:
      context: ./tracker-web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:80
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Option 2: Traditional Server Deployment

#### Backend (IIS on Windows Server)

1. Publish the application
2. Install ASP.NET Core Runtime 9.0 on server
3. Configure IIS with the published files
4. Set up application pool
5. Configure SSL certificate

#### Frontend (Node.js Server)

```bash
# On production server
cd tracker-web
npm install
npm run build
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "electricity-tracker-web" -- start
pm2 save
pm2 startup
```

### Option 3: Cloud Deployment

#### Azure App Service

**Backend:**
```bash
# Create App Service
az webapp create --name electricity-tracker-api --resource-group myResourceGroup --plan myAppServicePlan --runtime "DOTNETCORE:9.0"

# Deploy
az webapp deployment source config-zip --resource-group myResourceGroup --name electricity-tracker-api --src ./publish.zip
```

**Frontend:**
```bash
# Deploy to Azure Static Web Apps or App Service
az webapp create --name electricity-tracker-web --resource-group myResourceGroup --plan myAppServicePlan --runtime "NODE:18-lts"
```

#### AWS Elastic Beanstalk

Follow AWS EB documentation for .NET and Node.js applications.

---

## 🔍 Post-Deployment Verification

### Health Checks

1. **Backend Health**
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. **Frontend Health**
   ```bash
   curl https://yourdomain.com
   ```

3. **Database Connection**
   - Check application logs
   - Verify migrations applied
   - Test authentication

### Monitoring Setup

1. **Application Insights** (Azure)
2. **CloudWatch** (AWS)
3. **Custom logging with Serilog**
4. **Error tracking** (Sentry, Rollbar)

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: 9.0.x
      
      - name: Build and Publish
        run: |
          cd TrackerAPI
          dotnet publish -c Release -o ./publish
      
      - name: Deploy to Server
        # Add your deployment script here
        run: echo "Deploy to server"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Build
        run: |
          cd tracker-web
          npm install
          npm run build
      
      - name: Deploy to Server
        # Add your deployment script here
        run: echo "Deploy to server"
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check connection string
   - Verify firewall rules
   - Ensure database is running

2. **CORS Errors**
   - Verify allowed origins in configuration
   - Check frontend URL matches allowed origins

3. **JWT Validation Failed**
   - Ensure JWT key matches across environments
   - Check token expiration settings

4. **Static Files Not Loading**
   - Verify build completed successfully
   - Check file permissions
   - Ensure CDN/reverse proxy configured correctly

---

## 📞 Support

For deployment issues:
- Check logs in `TrackerAPI/logs/`
- Review security documentation in `SECURITY.md`
- Contact development team

---

**Last Updated:** 2024
**Version:** 1.0

