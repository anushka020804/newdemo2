# 🚀 OpportunityX - Render Deployment Guide

## Quick Start (5 Minutes)

### Step 1: Prepare Your Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Ready for Render deployment"
```

### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub
# Then connect it:

git remote add origin https://github.com/YOUR_USERNAME/opportunityx.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

1. **Go to Render**: https://dashboard.render.com/
   
2. **Sign Up/Login**: 
   - Use GitHub to sign in (easiest)
   - Or create account with email

3. **Create New Static Site**:
   - Click **"New +"** button (top right)
   - Select **"Static Site"**

4. **Connect Repository**:
   - Click **"Connect a repository"**
   - Authorize Render to access your GitHub
   - Select your **opportunityx** repository
   - Click **"Connect"**

5. **Configure (Auto-detected from render.yaml)**:
   ```
   Name: opportunityx (or your custom name)
   Branch: main
   Build Command: pnpm install && pnpm run build
   Publish Directory: dist
   ```

6. **Click "Create Static Site"** 🎉

7. **Wait 2-3 Minutes**: Render will:
   - ✅ Install dependencies
   - ✅ Build your app
   - ✅ Deploy to production
   - ✅ Give you a live URL!

### Step 4: Access Your App

Your app will be live at:
```
https://opportunityx.onrender.com
```
(or your custom name)

---

## 🔧 Manual Configuration (If render.yaml doesn't work)

If automatic detection fails, configure manually:

### Build Settings:
- **Build Command**: `pnpm install && pnpm run build`
- **Publish Directory**: `dist`

### Environment:
- **Node Version**: 18+ (usually auto-detected)

### Redirects:
- Already configured in `public/_redirects`
- Handles React Router SPA routing

---

## 🎯 Custom Domain (Optional)

1. Go to your site on Render
2. Click **"Settings"** tab
3. Scroll to **"Custom Domain"**
4. Add your domain (e.g., `opportunityx.com`)
5. Update DNS records as instructed
6. SSL certificate auto-generated! 🔒

---

## 🚨 Common Issues & Solutions

### ❌ "Build failed"
**Solution**: 
- Check `pnpm-lock.yaml` is committed
- Ensure Node 18+ is used
- Check build logs for missing dependencies

### ❌ "Page not found" on refresh
**Solution**: 
- Verify `public/_redirects` file exists
- Content should be: `/*    /index.html   200`

### ❌ "Blank page after deployment"
**Solution**:
- Check browser console for errors
- Verify all imports in `main.tsx` are correct
- Ensure all CSS files are imported

### ❌ "Styles not loading"
**Solution**:
- Verify `index.html` includes the script tag
- Check Tailwind CSS is properly configured
- Clear browser cache and hard refresh

---

## 📊 Monitoring Your Deployment

### View Build Logs:
1. Go to your site dashboard on Render
2. Click **"Events"** tab
3. See real-time build progress

### View Live Logs:
1. Click **"Logs"** tab
2. Monitor runtime logs
3. Debug issues in real-time

---

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub!

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main

# Render automatically:
# ✅ Detects the push
# ✅ Rebuilds your app
# ✅ Deploys new version
# ⏱️ Takes 2-3 minutes
```

---

## 💰 Pricing

- **Free Tier**: Perfect for demos and testing
  - ✅ Free forever
  - ✅ Custom domain support
  - ✅ Auto SSL
  - ⚠️ May spin down after inactivity (restarts in ~30 seconds)

- **Paid Tier**: For production ($7/month)
  - ✅ Always online
  - ✅ Faster builds
  - ✅ More bandwidth
  - ✅ Priority support

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs/static-sites
- **Render Status**: https://status.render.com/
- **Community**: https://community.render.com/

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed to Git
- [ ] `pnpm-lock.yaml` or `package-lock.json` is committed
- [ ] Code is pushed to GitHub
- [ ] `render.yaml` exists in root
- [ ] `public/_redirects` exists
- [ ] No hardcoded localhost URLs in code
- [ ] All environment variables are configured (if needed)

---

## 🎉 Success!

Your OpportunityX platform is now live on Render!

Share the link with your team and investors:
```
🌐 https://opportunityx.onrender.com
```

**Built with ❤️ by Qistonpe**
