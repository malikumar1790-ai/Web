# 🚀 Nexariza AI - Deployment Guide

## Quick Deployment to Vercel

### Step 1: Prepare for GitHub
```bash
# Remove sensitive data (already in .gitignore)
# Ensure .env.local is not committed
git status
```

### Step 2: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "🚀 Initial deployment - Nexariza AI platform"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/nexariza-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Automatic (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel will automatically detect it's a Vite project

#### Option B: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy "~/nexariza-ai"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? nexariza-ai
# ? In which directory is your code located? ./
```

### Step 4: Configure Environment Variables in Vercel

Go to your Vercel dashboard → Project → Settings → Environment Variables

Add these variables:
```
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587
SMTP_USER=contact@nexariza.com
SMTP_PASS=Nexariza@Ahmad1122
CONTACT_EMAIL=contact@nexariza.com
VITE_SITE_URL=https://your-vercel-domain.vercel.app
```

### Step 5: Update Domain (Optional)
1. In Vercel dashboard → Project → Settings → Domains
2. Add your custom domain (e.g., nexariza.com)
3. Configure DNS settings as instructed

## Alternative Deployment Options

### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Add same environment variables in Netlify dashboard
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

### Traditional Hosting
```bash
# Build the project
npm run build

# Upload the 'dist' folder contents to your web server
# Ensure your server can serve single-page applications (SPA)
```

## Environment Variables Reference

### Required for Production
- `SMTP_HOST` - Your SMTP server (e.g., smtpout.secureserver.net)
- `SMTP_PORT` - SMTP port (usually 587 for TLS)
- `SMTP_USER` - Your email address for sending
- `SMTP_PASS` - Email password or app-specific password
- `CONTACT_EMAIL` - Where contact form submissions go
- `VITE_SITE_URL` - Your live domain URL

### Development Only
- Use `.env.local` for local development
- Never commit `.env.local` to GitHub

## Post-Deployment Checklist

### ✅ Verify Core Features
- [ ] Website loads correctly
- [ ] All pages accessible (Home, About, Services, etc.)
- [ ] Language switching works (8 languages)
- [ ] Contact form submits successfully
- [ ] Emails are sent and received
- [ ] Mobile responsiveness
- [ ] Loading performance

### ✅ Test Contact Form
1. Fill out the contact form
2. Submit and verify success message
3. Check admin email for notification
4. Check user email for auto-reply confirmation
5. Verify email formatting and branding

### ✅ SEO and Performance
- [ ] Meta tags loading correctly
- [ ] Page titles in correct language
- [ ] Images optimized and loading
- [ ] No console errors
- [ ] Fast loading times

## Domain and SSL Setup

### Custom Domain Setup
1. **Purchase domain** (e.g., nexariza.com)
2. **Configure DNS** in your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: your-project.vercel.app
   
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   ```
3. **Add domain in Vercel** dashboard
4. **Wait for SSL** certificate (automatic)

### Email Configuration
- Ensure your SMTP settings match your domain
- Update `SMTP_USER` and `CONTACT_EMAIL` to use your domain
- Test email delivery after domain change

## Maintenance and Updates

### Regular Updates
```bash
# Pull latest changes
git pull origin main

# Test locally
npm run dev

# Test build
npm run build
npm run preview

# Deploy
git push origin main  # Auto-deploys via Vercel
```

### Monitor Performance
- Check Vercel Analytics
- Monitor email delivery
- Test contact form regularly
- Review error logs

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Test build locally
npm run build
```

### Email Issues
- Verify SMTP credentials
- Check spam folders
- Test with different email providers
- Verify environment variables in Vercel

### Domain Issues
- Check DNS propagation (up to 48 hours)
- Verify SSL certificate status
- Test both www and non-www versions

## Support

### Need Help?
- **Email**: contact@nexariza.com
- **Documentation**: Check README.md
- **Issues**: Create GitHub issue

### Professional Support
For custom deployment, enterprise setup, or technical consultation, contact Nexariza AI team.

---

**🎉 Congratulations! Your Nexariza AI platform is now live!**

Visit your deployed site and start transforming ideas into custom AI solutions.
