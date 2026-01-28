# 🚀 Render Deployment Guide - Daily Wellness Delivered

This guide will help you deploy the Daily Wellness Delivered app to Render.

## 📋 Prerequisites

- ✅ GitHub repository: `https://github.com/ParambhavTechSolutions/Client_food_tracking_app`
- ✅ Render account with access to: `https://dashboard.render.com/project/prj-d5kbqem3jp1c73ekom90`
- ✅ All code changes committed and pushed to GitHub

## 🎯 Step-by-Step Deployment

### Step 1: Create New Static Site

1. **Go to your Render Dashboard**
   ```
   https://dashboard.render.com/project/prj-d5kbqem3jp1c73ekom90
   ```

2. **Click "New +" button** (top right)
   - Select **"Static Site"**

### Step 2: Connect GitHub Repository

1. **Connect your GitHub account** (if not already connected)
   - Click "Connect account" under GitHub
   - Authorize Render to access your repositories

2. **Select Repository**
   - Search for: `ParambhavTechSolutions/Client_food_tracking_app`
   - Click **"Connect"**

### Step 3: Configure Build Settings

Fill in the following configuration:

#### Basic Settings:
```
Name: daily-wellness-delivered
(or any name you prefer - this will be part of your URL)

Branch: main

Root Directory: 
(leave blank - the app is in the root)
```

#### Build Settings:
```
Build Command: npm run build

Publish Directory: dist
```

#### Advanced Settings (Optional):
```
Auto-Deploy: Yes
(Automatically deploy when you push to GitHub)

Pull Request Previews: Yes
(Optional - creates preview deployments for PRs)
```

### Step 4: Environment Variables

**No environment variables needed** for the current version (using mock data).

For future production with real APIs, you'll add:
```
VITE_API_BASE_URL=your_api_url
VITE_RAZORPAY_KEY=your_razorpay_key
```

### Step 5: Deploy

1. **Review your settings**
2. **Click "Create Static Site"**
3. **Wait for deployment** (usually 2-5 minutes)

Render will:
- Clone your repository
- Install dependencies (`npm install`)
- Build the app (`npm run build`)
- Deploy to their CDN

### Step 6: Access Your App

Once deployed, your app will be available at:
```
https://daily-wellness-delivered.onrender.com
(or whatever name you chose)
```

## 📱 Post-Deployment Verification

### Test These Features:

1. **Homepage**
   - ✅ Wallet balance displays
   - ✅ Today's meal shows
   - ✅ Quick actions work
   - ✅ Footer shows "Built with ❤️ by ParamBhaav Technologies"

2. **Wallet Page**
   - ✅ Click "Add Money"
   - ✅ Select amount
   - ✅ Click "Proceed to Pay"
   - ✅ Select payment method (GPay/PhonePe/Razorpay)
   - ✅ Complete mock payment
   - ✅ Verify balance updates

3. **Mobile Compatibility**
   - ✅ Open on mobile phone
   - ✅ Test navigation
   - ✅ Test payment flow
   - ✅ Verify responsive design

4. **All Pages**
   - ✅ Home (/)
   - ✅ Subscription (/subscription)
   - ✅ Wallet (/wallet)
   - ✅ Account (/account)
   - ✅ Pause (/pause)

## 🔧 Troubleshooting

### Build Fails

**Error**: "Command failed with exit code 1"
- Check build logs in Render dashboard
- Verify `package.json` has correct scripts
- Ensure all dependencies are in `package.json`

**Solution**:
```bash
# Test build locally first
npm run build

# If it works locally, push to GitHub
git push origin main
```

### 404 Errors on Routes

**Problem**: Direct URLs like `/wallet` show 404

**Solution**: Add `_redirects` file to `public/` folder:
```
/*    /index.html   200
```

Then commit and push:
```bash
echo "/*    /index.html   200" > public/_redirects
git add public/_redirects
git commit -m "Add redirects for SPA routing"
git push origin main
```

### Assets Not Loading

**Problem**: Images or fonts not loading

**Solution**: 
- Verify all assets are in `public/` or `src/assets/`
- Check browser console for 404 errors
- Ensure paths use relative URLs

## 🔄 Updating Your Deployment

### Automatic Updates (Recommended)

With Auto-Deploy enabled:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Render automatically rebuilds and deploys

### Manual Deploy

1. Go to Render Dashboard
2. Select your static site
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. **In Render Dashboard**
   - Go to your static site
   - Click **"Settings"**
   - Scroll to **"Custom Domains"**
   - Click **"Add Custom Domain"**

2. **Enter your domain**
   ```
   Example: wellness.yourdomain.com
   ```

3. **Update DNS Settings**
   - Add CNAME record in your domain registrar:
   ```
   Type: CNAME
   Name: wellness (or @)
   Value: [provided by Render]
   ```

4. **Wait for SSL**
   - Render automatically provisions SSL certificate
   - Usually takes 5-10 minutes

## 📊 Monitoring

### Check Deployment Status

**Render Dashboard** → **Your Static Site** → **Events**
- View build logs
- Check deployment history
- Monitor errors

### Performance Metrics

**Render Dashboard** → **Your Static Site** → **Metrics**
- Bandwidth usage
- Request count
- Response times

## 💰 Pricing

**Free Tier Includes:**
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ CDN distribution
- ✅ Unlimited static sites

**Paid Plans:**
- More bandwidth
- Priority support
- Advanced features

## 🎉 Success Checklist

Before sharing your app:

- [ ] App deploys successfully
- [ ] All pages load correctly
- [ ] Payment flow works (mock)
- [ ] Mobile responsive
- [ ] Footer branding visible
- [ ] No console errors
- [ ] SSL certificate active (https://)
- [ ] Custom domain configured (optional)

## 📞 Support

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**App Issues:**
- GitHub Issues: https://github.com/ParambhavTechSolutions/Client_food_tracking_app/issues

## 🚀 Next Steps After Deployment

1. **Share Your App**
   - Test on multiple devices
   - Share with team/clients
   - Gather feedback

2. **Monitor Usage**
   - Check Render analytics
   - Monitor error logs
   - Track user feedback

3. **Plan Backend Integration**
   - Set up API server
   - Integrate real payment gateways
   - Add authentication
   - Connect database

4. **SEO Optimization**
   - Submit to Google Search Console
   - Add sitemap.xml
   - Optimize meta tags
   - Add analytics (Google Analytics)

---

## 📝 Quick Reference

**Repository**: https://github.com/ParambhavTechSolutions/Client_food_tracking_app

**Render Project**: https://dashboard.render.com/project/prj-d5kbqem3jp1c73ekom90

**Build Command**: `npm run build`

**Publish Directory**: `dist`

**Node Version**: 18.x (auto-detected from package.json)

---

**Built with ❤️ by ParamBhaav Technologies**
